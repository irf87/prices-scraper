const scraped = require('../../application/scraped');
const htmlSelectors = require('../../utils/htmlSelectors');
const testingScraper = require('../../application/scraper/test-scraper');
const getProductDetailsByScraper = require('../../application/scraper/get-product-details-by-scraper');

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
  return await testingScraper({
    querySelector,
    url,
    mode,
  });
}

const suggestSelectors = async ({ url }) => {
  if (!url) {
    return { error: 'URL is required' };
  }

  const site = htmlSelectors.getSiteFromUrl(url);

  if (!site) return {error: 'This site is not supported'};
  
  const siteSelectors = htmlSelectors.SITE_SELECTORS[site];

  if(!siteSelectors) {
    return {error: 'Selectors not found for this site'};
  }

  return siteSelectors;  
}

const getProductDetail = async ({
  url,
  getting_mode,
  product_name_dom_selector,
  product_description_dom_selector,
  image_product_dom_selector
}) => {
  if(!url || !product_name_dom_selector) {
    return { error: 'missing params' };
  }
  return await getProductDetailsByScraper({
    url,
    productNameDomSelector: product_name_dom_selector,
    productDescriptionDomSelector: product_description_dom_selector,
    mode: getting_mode,
    imageProductDomSelector: image_product_dom_selector
  });
}

const scrapedCtrl = {
  create,
  getEnables,
  get,
  remove,
  update,
  testScraper,
  suggestSelectors,
  getProductDetail,
};

module.exports = scrapedCtrl;