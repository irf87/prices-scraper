const dbInstance = require('../infrastructure/storage/sqliteController');
const ravenInstance = require('../infrastructure/storage/ravenDBController');

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


  const session = ravenInstance.getSession();
  const bulkInsert = ravenInstance.bulkInsert();

  for (const productScraped of list) {
    let newDocument = {
      ...productScraped,
      date: currentDate,
      "@metadata": {
        "@collection": 'productsScraped',
      }
    };
    const masterKey = productScraped.product_scraped_id;
    
    let docResponse;
    try {
      docResponse = await session.query({ collection: 'productsScraped' }).whereEquals('_id', masterKey).single();
    } catch(err) {}

    if (docResponse) {
      newDocument = {
        ...docResponse,
        ...newDocument,
      }
      await bulkInsert.store(newDocument);
    } else {
      newDocument._id = newDocument.id;
      await bulkInsert.store({...newDocument}, `productsScraped/${newDocument._id}`, {
        '@collection': 'productsScraped'
      });
    }
    await productScrapedCtrl.updateProductScrapedById(masterKey, { last_date_sync: currentDate });
  }
  await bulkInsert.finish();
  session.dispose();
  ravenInstance.closeSession();
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

  const toUpdate = {};
  const toCreate = {};

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

    let docResponse;
    try {
      docResponse = await ravenInstance.querySingle('productScrapedRecordsSnap', 'productScrapedId', masterKey);
    } catch(err) { }
    
    if (docResponse) {
      if (!toUpdate[masterKey]) {
        toUpdate[masterKey] = { ...docResponse };
        toUpdate[masterKey].productName = productScrapedSnap.name;
        toUpdate[masterKey].marketplace = productScrapedSnap.url_to_scrape;
        toUpdate[masterKey].lastDateSync = currentDate;
        toUpdate[masterKey].records.push(oSnap);
      } else {
        toUpdate[masterKey].records.push(oSnap);
      }
    } else {
      if (!toCreate[masterKey]) {
        toCreate[masterKey] = {
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
      } else {
        toCreate[masterKey].records.push(oSnap);
      }
    }
  }
  ravenInstance.closeSession();

    for (const masterKey of masterKeysList) {
    let isCreate = true;
    let docResponse;
    if (toUpdate[masterKey]) {
      isCreate = false;
    }
    
    const [avg] = await scrapedSnapCtrl.getAvg(masterKey);

    if (isCreate) {
      toCreate[masterKey].minPrice = avg.min_price;
      toCreate[masterKey].maxPrice = avg.max_price;
      toCreate[masterKey].avgPrice = avg.avg_price;
    } else {
      toUpdate[masterKey].minPrice = avg.min_price;
      toUpdate[masterKey].maxPrice = avg.max_price;
      toUpdate[masterKey].avgPrice = avg.avg_price;
    }

    await scrapedSnapCtrl.updateSyncDate(masterKey, currentDate);
  }
  const bulkInsert = ravenInstance.bulkInsert();
  const updateKeys = Object.keys(toUpdate);
  const createKeys = Object.keys(toCreate);

  for (const key of createKeys) {
    await bulkInsert.store(toCreate[key], `productScrapedRecordsSnap/${key}`, {
       '@collection': 'productScrapedRecordsSnap'
    });
  }

  await bulkInsert.finish();

  for (const key of updateKeys) {
    await ravenInstance.update(toUpdate[key]);
  }
  
  ravenInstance.closeSession();
  return { success: true, sync: list.length };
}

const resetSyncProductScraped = async (resetCollection) => {
  await productScrapedCtrl.updateProductScraped('last_date_sync IS NOT NULL', { last_date_sync: null });
  if (resetCollection) {
    console.log('intenta eliminar');
    await ravenInstance.deleteCollection('productsScraped');
  }
  return { success: true, resetCollection };
}

const resetSyncProductScrapedSnap = async (resetCollection) => {
  await scrapedSnapCtrl.updateScrapedSnap('last_date_sync IS NOT NULL', { last_date_sync: null });
  if (resetCollection) {
    await ravenInstance.deleteCollection('productScrapedRecordsSnap');
  }
  return { success: true, resetCollection };
}

const sync = {
  syncProductScraped,
  syncProductScrapedSnap,
  resetSyncProductScraped,
  resetSyncProductScrapedSnap,
};

module.exports = sync;