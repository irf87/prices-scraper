const dbInstance = require('../../model/sqliteController');

const getProductHistory = async (productId) => {
  const query = `SELECT * FROM product_scraped_snap WHERE product_id=${productId}`;
  const row = dbInstance.execute(query);
  return row.all();
}

const getLastRow = async (productId) => {
  const query = `SELECT * FROM product_scraped_snap WHERE product_id=${productId} ORDER BY date DESC LIMIT 1`;
  const row = dbInstance.execute(query);
  return row.all();
}

const create = async (params) => {
  const newSnap = dbInstance.prepareInsert('product_scraped_snap', params);
  const info = newSnap.run(...Object.values(params));
  return { success: info.changes >= 1 ? true : false };
}


const scrapedSnap = {
  getProductHistory,
  getLastRow,
  create,
};

module.exports = scrapedSnap;