const dbInstance = require('../infrastructure/storage/sqliteController');

const getProductHistory = async (productId) => {
  const query = `SELECT * FROM product_scraped_snap WHERE product_id=${productId}`;
  const row = dbInstance.execute(query);
  return row.all();
}

const getProductDetailOfScrapred = async (productScrapedId) => {
  let query = `SELECT product.id AS product_id, product.name,
  product_scraped.url_to_scrape, product_scraped.id AS scraped_id
  FROM product_scraped
  JOIN product ON product_scraped.product_id = product.id
  WHERE product_scraped.id = ${productScrapedId}`;
  const row = dbInstance.execute(query);
  return row.all();
}

const getLastRow = async (productScrapedId) => {
  const query = `SELECT * FROM product_scraped_snap WHERE product_scraped_id=${productScrapedId} ORDER BY date DESC LIMIT 1`;
  const row = dbInstance.execute(query);
  return row.all();
}

const create = async (params) => {
  const newSnap = dbInstance.prepareInsert('product_scraped_snap', params);
  const info = newSnap.run(...Object.values(params));
  return { success: info.changes >= 1 ? true : false };
}

const getAvg = async (productScrapedId) => {
  const query = `SELECT MAX(price) AS max_price, MIN(price) AS min_price, AVG(price) AS avg_price
  FROM product_scraped_snap
  WHERE product_scraped_snap.product_scraped_id = ${productScrapedId}`;
  const row = dbInstance.execute(query);
  return row.all();
}

const updateSyncDate = async (productScrapedId, syncDate) => {
  const updateSync = dbInstance.prepareUpdate('product_scraped_snap', { last_date_sync: syncDate }, `product_scraped_id=${productScrapedId}`);
  const info = updateSync.run();
  return { success: info.changes >= 1 ? true : false };
}

const updateScrapedSnap = async (condition, params) => {
  const updateSync = dbInstance.prepareUpdate('product_scraped_snap', params, condition);
  const info = updateSync.run();
  return { success: info.changes >= 1 ? true : false };
}

const getProductScrapedRecords = async (productScrapedId) => {
  let query = `SELECT product_scraped_snap.id, product_scraped_snap.price, product_scraped_snap.availability,
  product_scraped_snap.stock, product_scraped_snap.date
  FROM product_scraped_snap
  JOIN product_scraped ON product_scraped_snap.product_scraped_id = product_scraped.id
  JOIN product ON product_scraped.product_id = product.id
  WHERE product_scraped_snap.product_scraped_id = ${productScrapedId}
  ORDER BY datetime(product_scraped_snap.date) ASC;`;
  const row = dbInstance.execute(query);
  const list = row.all();

  const [avg] = await getAvg(productScrapedId);
  const [product] = await getProductDetailOfScrapred(productScrapedId);

  return {
    ...product,
    ...avg,
    records: list,
  };
}

const scrapedSnap = {
  getProductHistory,
  getLastRow,
  create,
  getAvg,
  updateSyncDate,
  updateScrapedSnap,
  getProductScrapedRecords,
};

module.exports = scrapedSnap;