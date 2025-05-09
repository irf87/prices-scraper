const cheerio = require('cheerio');
const getHtml = require('../get-html-by-url');

const DomAnalyzer = require('../../utils/domAnalyzer');

const testingScraper = async ({ querySelector, url, mode }) => {
  try {
    const { data, error } = await getHtml(url, mode);
    if (error) {
      return { result: null, error: error.message || 'Error fetching HTML' };
    }
    
    if (!data) {
      return { result: null, error: 'No data returned from URL' };
    }
    const $ = cheerio.load(data);
    const dom = new DomAnalyzer($, data);

    return new Promise((resolve) => {
      dom.readText(querySelector, (text) => {
        resolve({ result: text, error: null });
      });
    });
  } catch (err) {
    return { result: null, error: err.message || 'Unknown error occurred' };
  }
}

module.exports = testingScraper;