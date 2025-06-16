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
  for (let i = cont; i < arrayLength; i++) {
    try {
      const [product] = await productCtrl.get(toScraping[i].product_id);
      const rules = await scraperNotifications.getProductScraped(toScraping[i].id);
      if (!rules || typeof rules !== 'object') {
        if (isDebug) {
          console.log(`fail:${toScraping[i].url_to_scrape} with id ${toScraping[i].id}`);
          console.log('A rule have not found');
        }
        continue;
      }

      const { data, error } = await getHtml(toScraping[i].url_to_scrape, toScraping[i].getting_mode);
      if (error) {
        if (isDebug) {
          console.log(`fail:${toScraping[i].url_to_scrape}`);
          console.log(`error:${error}`);
        }
        continue;
      }

      const $ = cheerio.load(data);
      const dom = new DomAnalyzer($, data);

      const promisePrice = new Promise((resolve) => {
        if (!toScraping[i].price_dom_selector) return resolve(null);
        dom.getPrice(toScraping[i].price_dom_selector, resolve);
      });
      const promiseStock = new Promise((resolve) => {
        if (!toScraping[i].stock_dom_selector) return resolve(null);
        dom.getStock(toScraping[i].stock_dom_selector, resolve);
      });

      const promiseAvailability = new Promise((resolve) => {
        if (!toScraping[i].availability_dom_selector) return resolve(null);
        dom.getAvailability(toScraping[i].availability_dom_selector, resolve);
      });

      const price = await promisePrice;
      const stock = await promiseStock;
      const availability = await promiseAvailability;

      if (dom.isDisabled) {
        scraperCtrl.update(toScraping[i].id, { enable: 0});
        const disabledMsg = t('DISABLE_SCRAPER_PRODUCT', {id: toScraping[i].id, name: product.name });
        if (isDebug) {
          console.log('========= disabledMsg =========');
          console.log(disabledMsg);
          console.log('========= disabledMsg =========\n');
        }
        if(process.env.ENABLE_NOTIFICATIONS === 'true') {
          telegram.send(disabledMsg);
        }
        continue;
      }

      const ruleAnalyze = new RulesAnalyzer(
        price,
        stock,
        availability,
        toScraping[i].id,
        toScraping[i].url_to_scrape,
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
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  executeScraping
};