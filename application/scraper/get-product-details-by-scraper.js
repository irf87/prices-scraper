const cheerio = require('cheerio');
const getHtml = require('../get-html-by-url');

const DomAnalyzer = require('../../utils/domAnalyzer');

const getProductDetailsByScraper = async ({ url, productNameDomSelector, productDescriptionDomSelector, mode, imageProductDomSelector }) => {
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
    
    const promiseName = new Promise((resolve) => {
      dom.readText(productNameDomSelector, (text) => {
        resolve(text);
      });
    });

    const promiseDescription = new Promise((resolve) => {
      if(!productDescriptionDomSelector) return resolve('');
      dom.readText(productDescriptionDomSelector, (text) => {
        resolve(text);
      });
    });

    const promiseImageUrl = new Promise((resolve) => {
      if(!imageProductDomSelector) return resolve('');
      dom.getImageUrl(imageProductDomSelector, (url) => {
        resolve(url);
      });
    });
    
    const name = await promiseName;
    const description = await promiseDescription;
    const urlImg = await promiseImageUrl;

    return {
      name: name.trim(),
      description: description.trim(),
      urlImg
    };
  } catch (err) {
    return { error: err.message || 'Unknown error occurred' };
  }
}

module.exports = getProductDetailsByScraper;