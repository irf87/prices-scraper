const dbInstance = require('../infrastructure/storage/sqliteController');
const ravenInstance = require('../infrastructure/storage/ravenDBController');

const getProductHistory = async (productId) => {
  const query = `SELECT * FROM product_scraped_snap WHERE product_id=${productId}`;
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
  let result = [];
  const session = ravenInstance.getSession();
  if (productScrapedId) {
    try {
      result = await session.query({ collection: 'productScrapedRecordsSnap' }).whereEquals('productScrapedId', Number(productScrapedId)).all();
    } catch(err) {}
  } else {
    try {
      result = await session.query({ collection: 'productScrapedRecordsSnap' }).all();
    }
    catch(err) {}
  }
  return result;
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