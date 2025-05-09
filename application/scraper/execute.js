
const cheerio = require('cheerio');
const scraperCtrl = require('../../presentation/scraped/controller');
const productCtrl = require('../../presentation/products/controller');
const scraperNotifications = require('../../presentation/notifications/controller');

const DomAnalyzer = require('../../utils/domAnalyzer');
const RulesAnalyzer = require('../../utils/rulesAnalyzer');

const Locale = require('../../utils/locale');
const CL_TelegramBot = require('../../utils/notifications/telegramBot');

const { toUpdateNotificationDate } = require('../../utils/notifications/transformer');

const getHtml = require('../../application/get-html-by-url');

const DEBUG	= process.env._IS_DEBUG;
const isDebug = DEBUG === 'true'


const locale = new Locale();
const t = locale.getLocale();

const telegram = new CL_TelegramBot();

const executeScraping = async (scraper, cont, arrayLength, toScraping) => {
  if (cont >= arrayLength) {
    return;
  };
  try {
    cont ++;
    const [product] = await productCtrl.get(scraper.product_id);
    const rules = await scraperNotifications.getProductScraped(scraper.id);
    if (!rules || typeof rules !== 'object') {
      if (isDebug) {
        console.log(`fail:${scraper.url_to_scrape} with id ${scraper.id}`);
        console.log('A rule have not found');
      }
      await executeScraping(toScraping[cont], cont, arrayLength, toScraping);
      return;
    }

    const { data, error } = await getHtml(scraper.url_to_scrape, scraper.getting_mode);
    if (error) {
      if (isDebug) {
        console.log(`fail:${scraper.url_to_scrape}`);
        console.log(`error:${error}`);
      }
      await executeScraping(toScraping[cont], cont, arrayLength, toScraping);
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
      if (isDebug) {
        console.log('========= disabledMsg =========');
        console.log(disabledMsg);
        console.log('========= disabledMsg =========\n');
      }
      if(process.env.ENABLE_NOTIFICATIONS === 'true') {
        telegram.send(disabledMsg);
      }
      await executeScraping(toScraping[cont], cont, arrayLength, toScraping);
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
    await executeScraping(toScraping[cont], cont, arrayLength, toScraping);
    
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  executeScraping
};