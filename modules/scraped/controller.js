const dbInstance = require('../../model/sqliteController');

const create = async (params) => {
  const newScraped = dbInstance.prepareInsert('product_scraped', params);
  const info = newScraped.run(...Object.values(params));
  return { success: info.changes >= 1 ? true : false };
}

const getEnables = async (params) => {
  const query = `SELECT * FROM product_scraped WHERE enable=1`;
  const row = dbInstance.execute(query);
  return row.all();
}

const remove = async ({ id }) => {
  const query = `DELETE FROM product_scraped WHERE id=${id}`;
  const removeScraper = dbInstance.execute(query);
  const info = removeScraper.run();
  return { success: info.changes >= 1 ? true : false };
}

const update = async (id, params) => {
  const updateScraper = dbInstance.prepareUpdate('product_scraped', params, `id=${id}`);
  const info = updateScraper.run();
  return { success: info.changes >= 1 ? true : false };
}

const scraped = {
  create,
  getEnables,
  remove,
  update,
};

module.exports = scraped;