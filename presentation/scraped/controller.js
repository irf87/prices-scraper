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

const remove = async (id) => {
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
  
  try {
    const { data, error } = await getHtml(url, mode);
    if (error) {
      return { error: error.message || 'Error fetching HTML' };
    }
    
    if (!data) {
      return { error: 'No data returned from URL' };
    }
    const $ = cheerio.load(data);
    const dom = new DomAnalyzer($, data);
    
    return new Promise((resolve) => {
      dom.readText(querySelector, (text) => {
        resolve({ respond: text });
      });
    });
  } catch (err) {
    return { error: err.message || 'Unknown error occurred' };
  }
}

const suggestSelectors = async ({ url }) => {
  if (!url) {
    return { error: 'URL is required' };
  }

  // Check for Cyberpuerta
  if (url.includes('cyberpuerta.mx')) {
    return {
      price_dom_selector: "#productinfo > form > div.detailsInfo.clear > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(4) > div.medium-7.cell.cp-pr > div > div > div.mainPrice > span",
      stock_dom_selector: "#productinfo > form > div.detailsInfo.clear > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(4) > div.medium-7.cell.cp-pr > div > div > div.stock > span > span"
    };
  }

  // Check for Amazon
  if (url.includes('amazon.com')) {
    return {
      price_dom_selector: "#corePrice_feature_div > div > div > span.a-price.aok-align-center > span:nth-child(2) > span.a-price-whole",
      stock_dom_selector: ""
    };
  }

  // Check for Mercado Libre
  if (url.includes('mercadolibre')) {
    return {
      price_dom_selector: "#price > div > div.ui-pdp-price__main-container > div.ui-pdp-price__second-line > span:nth-child(1) > span > span.andes-money-amount__fraction",
      stock_dom_selector: ""
    };
  }

  return { error: 'This site is not supported' };
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