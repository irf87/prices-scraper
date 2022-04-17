const axios = require('axios');
const cheerio = require('cheerio');
const scraperCtrl = require('./modules/scraped/controller');
const DomAnalyzer = require('./utils/domAnalyzer');

let toScraping = [];
let cont = 0;
let arrayLength = 0;

scraperCtrl.getEnables().then((rows) => {
  if (rows.length > 0) {
    toScraping = rows;
    arrayLength = rows.length;
    executeScraping(toScraping[cont], cont);
  }
});

const executeScraping = async (rules, cont) => {
  if (cont >= arrayLength) return;
  try {
    console.log(rules.url_to_scrape);
    const { data, error } = await axios(rules.url_to_scrape);
    if (error) {
      cont ++;
      executeScraping(toScraping[cont], cont);
      return;
    }
    const $ = cheerio.load(data);
    const analyzer = new DomAnalyzer($, data);

    const promisePrice = new Promise((resolve) => {
      if (!rules.price_dom_selector) return resolve();
      analyzer.getPrice(rules.price_dom_selector, resolve);
    });
    const promiseStock = new Promise((resolve) => {
      if (!rules.stock_dom_selector) return resolve();
      analyzer.getStock(rules.stock_dom_selector, resolve);
    });

    const promiseAvailability = new Promise((resolve) => {
      if (!rules.availability_dom_selector) return resolve();
      analyzer.getAvailability(rules.stock_dom_selector, resolve);
    });

    await promisePrice;
    await promiseStock;
    await promiseAvailability;

    cont ++;
    executeScraping(toScraping[cont], cont);
    
  } catch (error) {
    console.error(error);
  }
}
