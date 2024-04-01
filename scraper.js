require('dotenv').config();

const SCRAPPER_INTERVAL = process.env.SCRAPPER_INTERVAL_TIME;
const SCRAPPER_INTERVAL_UNIT = process.env.SCRAPPER_INTERVAL_UNIT;

const axios = require('axios');
const cheerio = require('cheerio');
const scraperCtrl = require('./presentation/scraped/controller');
const productCtrl = require('./presentation/products/controller');
const scraperNotifications = require('./presentation/notifications/controller');

const DomAnalyzer = require('./utils/domAnalyzer');
const RulesAnalyzer = require('./utils/rulesAnalyzer');
const Locale = require('./utils/locale');
const CL_TelegramBot = require('./utils/notifications/telegramBot');

const { toUpdateNotificationDate } = require('./utils/notifications/transformer');
const { parseToMiliseconds } = require('./utils/time');

let toScraping = [];
let cont = 0;
let arrayLength = 0;

const locale = new Locale();
const t = locale.getLocale();

const telegram = new CL_TelegramBot();

const executeScraping = async (scraper, cont) => {
  if (cont >= arrayLength) {
    // telegram.stop();
    // process.exit();
    return;
  };
  try {
    cont ++;
    const [product] = await productCtrl.get(scraper.product_id);
    const [rules] = await scraperNotifications.get(scraper.id);
    if (typeof rules === 'object' && rules?.length > 0) {
      executeScraping(toScraping[cont], cont);
      return;
    }

    const { data, error } = await axios(scraper.url_to_scrape);

    if (error) {
      executeScraping(toScraping[cont], cont);
      return;
    }
    const $ = cheerio.load(data);
    const dom = new DomAnalyzer($, data);

    const promisePrice = new Promise((resolve) => {
      if (!scraper.price_dom_selector) return resolve(null);
      dom.getPrice(scraper.price_dom_selector, resolve);
    });
    const promiseStock = new Promise((resolve) => {
      if (!scraper.stock_dom_selector) return resolve(null);
      dom.getStock(scraper.stock_dom_selector, resolve);
    });

    const promiseAvailability = new Promise((resolve) => {
      if (!scraper.availability_dom_selector) return resolve(null);
      dom.getAvailability(scraper.availability_dom_selector, resolve);
    });

    const price = await promisePrice;
    const stock = await promiseStock;
    const availability = await promiseAvailability;
    if (dom.isDisabled) {
      scraperCtrl.update(scraper.id, { enable: 0});
      const disabledMsg = t('DISABLE_SCRAPER_PRODUCT', {id: scraper.id, name: product.name });
      telegram.send(disabledMsg);
      executeScraping(toScraping[cont], cont);
      return;
    }

    const ruleAnalyze = new RulesAnalyzer(
      price,
      stock,
      availability,
      scraper.id,
      scraper.url_to_scrape,
      product,
      rules,
      t
    );
    await ruleAnalyze.setSnap();
    ruleAnalyze.analyzePrice();
    ruleAnalyze.analyzeStock();
    ruleAnalyze.createSnap();

    const toSend = ruleAnalyze.getNotificationsToSend();
    if(toSend.length > 0 && process.env.ENABLE_NOTIFICATIONS === 'true') {
      const toUpdate = toUpdateNotificationDate(toSend);
      await scraperNotifications.update(rules.id, toUpdate);
      toSend.forEach((send) => {
        telegram.send(send.message);
      });
    }

    executeScraping(toScraping[cont], cont);
    
  } catch (error) {
    console.error(error);
  }
}

function execute() {
  scraperCtrl.getEnables().then((rows) => {
    if (rows.length > 0) {
      toScraping = rows;
      arrayLength = rows.length;
      executeScraping(toScraping[cont], cont);
    }
  });
}

execute();
setInterval(execute, parseToMiliseconds(SCRAPPER_INTERVAL, SCRAPPER_INTERVAL_UNIT));