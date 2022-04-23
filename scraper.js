const axios = require('axios');
const cheerio = require('cheerio');
const scraperCtrl = require('./modules/scraped/controller');
const scraperNotifications = require('./modules/notifications/controller');
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

const executeScraping = async (scraper, cont) => {
  if (cont >= arrayLength) return;
  try {
    console.log(scraper.url_to_scrape);
    const [rules] = await scraperNotifications.get(scraper.id);
    if (rules typeof === 'object' && rules?.length > 0) {
      cont ++;
      executeScraping(toScraping[cont], cont);
      return;
    }

    const { data, error } = await axios(scraper.url_to_scrape);
    if (error) {
      cont ++;
      executeScraping(toScraping[cont], cont);
      return;
    }
    const $ = cheerio.load(data);
    const analyzer = new DomAnalyzer($, data);

    const promisePrice = new Promise((resolve) => {
      if (!scraper.price_dom_selector) return resolve();
      analyzer.getPrice(scraper.price_dom_selector, resolve);
    });
    const promiseStock = new Promise((resolve) => {
      if (!scraper.stock_dom_selector) return resolve();
      analyzer.getStock(scraper.stock_dom_selector, resolve);
    });

    const promiseAvailability = new Promise((resolve) => {
      if (!scraper.availability_dom_selector) return resolve();
      analyzer.getAvailability(scraper.stock_dom_selector, resolve);
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
