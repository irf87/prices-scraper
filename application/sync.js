const dbInstance = require('../infrastructure/storage/sqliteController');
const dbMongoInstance = require('../infrastructure/storage/mongoController');

const productScrapedCtrl = require('../application/product-scraped');
const scrapedSnapCtrl = require('../application/scraped-snap');

const syncProductScraped = async () => {
  const currentDate = new Date().toISOString();
  let query = `SELECT product.id, product_scraped.id as product_scraped_id,
  product.name, product.description, product.url_info, product.url_img,
  product_scraped.url_to_scrape, product_scraped.enable, product_scraped.update_at, product_scraped.last_date_sync
  FROM product_scraped
  JOIN product ON product_scraped.product_id = product.id
  WHERE last_date_sync IS NULL OR last_date_sync < date('now')`;
  const row = dbInstance.execute(query);
  const list = row.all();
  for (const productScraped of list) {
    let newDocument = {
      ...productScraped,
      date: currentDate,
    };
    const masterKey = productScraped.product_scraped_id;
    const docResponse = await dbMongoInstance.find('products_scraped', { product_scraped_id: masterKey });
    if (docResponse.status === 'ok' && docResponse?.data?.length > 0) {
      const [uniqueDoc] = docResponse.data;
      newDocument = {
        ...uniqueDoc,
        ...newDocument,
      }
      await dbMongoInstance.update('products_scraped', {_id: uniqueDoc._id }, newDocument);
    } else {
      await dbMongoInstance.add('products_scraped', newDocument);
    }
    await productScrapedCtrl.updateProductScrapedById(masterKey, { last_date_sync: currentDate });
  }
  return { success: true, sync: list.length };
}

const syncProductScrapedSnap = async () => {
  const currentDate = new Date().toISOString();
  let query = `SELECT product_scraped_snap.id, product_scraped_snap.product_scraped_id, product_scraped.product_id,product.name, 
  product_scraped.url_to_scrape, product_scraped_snap.price, product_scraped_snap.availability, product_scraped_snap.stock, product_scraped_snap.date
  FROM product_scraped_snap
  JOIN product_scraped ON product_scraped_snap.product_scraped_id = product_scraped.id
  JOIN product ON product_scraped.product_id = product.id
  WHERE product_scraped_snap.last_date_sync IS NULL OR product_scraped_snap.last_date_sync < date('now')
  ORDER BY datetime(product_scraped_snap.last_date_sync) ASC;`;

  const row = dbInstance.execute(query);
  const list = row.all();
  const masterKeysList = [];

  if (list.length === 0) {
    return { success: true, sync: 0 };
  }

  for (const productScrapedSnap of list) {
    const masterKey = productScrapedSnap.product_scraped_id;
    if (masterKeysList.indexOf(masterKey) < 0) masterKeysList.push(masterKey);
    const oSnap = {
      id: productScrapedSnap.id,
      price: productScrapedSnap.price,
      availability: productScrapedSnap.availability,
      stock: productScrapedSnap.stock,
      date: productScrapedSnap.date,
    };
    const docResponse = await dbMongoInstance.find('product_scraped_records', { productScrapedId: masterKey });
    
    if (docResponse.status === 'ok' && docResponse?.data?.length > 0) {
      const [uniqueDoc] = docResponse.data;
      uniqueDoc.productName = productScrapedSnap.name;
      uniqueDoc.marketplace = productScrapedSnap.url_to_scrape;
      uniqueDoc.lastDateSync = currentDate;
      uniqueDoc.records.push(oSnap);
      await dbMongoInstance.update('product_scraped_records', {_id: uniqueDoc._id }, uniqueDoc);
    } else {
      const oRecord = {
        productId: productScrapedSnap.product_id,
        productScrapedId: masterKey,
        productName: productScrapedSnap.name,
        marketplace: productScrapedSnap.url_to_scrape,
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        lastDateSync: currentDate,
        records: [
          oSnap,
        ],
      };
      await dbMongoInstance.add('product_scraped_records', oRecord);
    }
  }
  for (const masterKey of masterKeysList) {
    const docResponse = await dbMongoInstance.find('product_scraped_records', { productScrapedId: masterKey });
    const [avg] = await scrapedSnapCtrl.getAvg(masterKey);
    if (docResponse.status === 'ok' && docResponse?.data?.length > 0) {
      const [uniqueDoc] = docResponse.data;
      uniqueDoc.minPrice = avg.min_price;
      uniqueDoc.maxPrice = avg.max_price;
      uniqueDoc.avgPrice = avg.avg_price;
      await dbMongoInstance.update('product_scraped_records', {_id: uniqueDoc._id }, uniqueDoc);
      await scrapedSnapCtrl.updateSyncDate(masterKey, currentDate);
    }
  }
  return { success: true, sync: list.length };
}

const resetSyncProductScraped = async () => {
  await productScrapedCtrl.updateProductScraped('last_date_sync IS NOT NULL', { last_date_sync: null });
  return { success: true };
}

const resetSyncProductScrapedSnap = async () => {
  await scrapedSnapCtrl.updateScrapedSnap('last_date_sync IS NOT NULL', { last_date_sync: null });
  return { success: true };
}

const sync = {
  syncProductScraped,
  syncProductScrapedSnap,
  resetSyncProductScraped,
  resetSyncProductScrapedSnap,
};

module.exports = sync;