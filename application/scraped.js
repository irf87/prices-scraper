const dbInstance = require('../infrastructure/storage/sqliteController');
const GETTING_MODE_TYPES = require('../utils/gettingModeTypes');

const create = async (params) => {
  const today = new Date();
  params.create_at = today.toISOString();
  params.update_at = '';
  if(!params.getting_mode) {
    params.getting_mode = GETTING_MODE_TYPES.FETCH;
  }
  const newScraped = dbInstance.prepareInsert('product_scraped', params);
  const info = newScraped.run(...Object.values(params));
  return { success: info.changes >= 1 ? true : false, id: info.lastInsertRowid };
}

const getEnables = async (params = {}) => {
  let query = `SELECT * FROM product_scraped WHERE enable=1`;
  if(params.gettingMode) {
    query += ` AND getting_mode = '${params.gettingMode}'`;
  }
  const row = dbInstance.execute(query);
  return row.all();
}

const get = async (id) => {
  let query = `SELECT * FROM product_scraped`;
  if (id) {
    query += ` where id = ${id}`;
  }
  const row = dbInstance.execute(query);
  return row.all();
}

const remove = async (id) => {
  const query = `DELETE FROM product_scraped WHERE id=${id}`;
  const removeScraper = dbInstance.execute(query);
  const info = removeScraper.run();
  return { success: info.changes >= 1 ? true : false };
}

const update = async (id, params) => {
  const today = new Date();
  params.update_at = today.toISOString();
  const updateScraper = dbInstance.prepareUpdate('product_scraped', params, `id=${id}`);
  const info = updateScraper.run();
  return { success: info.changes >= 1 ? true : false };
}

const scraped = {
  create,
  remove,
  update,
  getEnables,
  get,
};

module.exports = scraped;