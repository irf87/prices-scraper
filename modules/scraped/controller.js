const axios = require('axios');
const cheerio = require('cheerio');

const dbInstance = require('../../model/sqliteController');
const DomAnalyzer = require('../../utils/domAnalyzer');

const create = async (params) => {
  const today = new Date();
  params.create_at = today.toISOString();
  params.update_at = '';
  const newScraped = dbInstance.prepareInsert('product_scraped', params);
  const info = newScraped.run(...Object.values(params));
  return { success: info.changes >= 1 ? true : false };
}

const getEnables = async (params) => {
  const query = `SELECT * FROM product_scraped WHERE enable=1`;
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

const remove = async ({ id }) => {
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

const testScraper = async ({ query_selector, url }) => {
  const querySelector = query_selector;
  if(!querySelector || !url) {
    return { error: 'missing params' };
  }
  const { data, error } = await axios(url);
  if (error) {
    return error;
  }
  const $ = cheerio.load(data);
  const dom = new DomAnalyzer($, data);
  const resp = new Promise((resolve) => {
    dom.readText(querySelector, (text) => {
      resolve({ respond: text});
    });
  });
  return await resp;
}

const scraped = {
  create,
  getEnables,
  get,
  remove,
  update,
  testScraper,
};

module.exports = scraped;