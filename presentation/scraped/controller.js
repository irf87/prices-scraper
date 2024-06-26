const cheerio = require('cheerio');
const getHtml = require('../../application/get-html-by-url');

const DomAnalyzer = require('../../utils/domAnalyzer');
const scraped = require('../../application/scraped');

const create = async (params) => {
  return await scraped.create(params);
}

const getEnables = async (params) => {
  return await scraped.getEnables(params);
}

const get = async (id) => {
  return await scraped.get(id);
}

const remove = async ({ id }) => {
  return await scraped.remove(id);
}

const update = async (id, params) => {
  return await scraped.update(id, params);
}

const testScraper = async ({ query_selector, url, mode }) => {
  const querySelector = query_selector;
  if(!querySelector || !url) {
    return { error: 'missing params' };
  }
  const { data, error } = await getHtml(url, mode);
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

const suggestSelectors = async ({ url }) => {
  return null;
}

const scrapedCtrl = {
  create,
  getEnables,
  get,
  remove,
  update,
  testScraper,
  suggestSelectors,
};

module.exports = scrapedCtrl;