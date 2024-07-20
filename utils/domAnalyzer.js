require('dotenv').config();

const DEFAULT_TIMEOUT = process.env.TIMEOUT_ANALIZER || 1000;
const DEBUG	= process.env._IS_DEBUG;
const isDebug = DEBUG === 'true'
class DomAnalyzer {
  constructor ($, html) {
    this.$ = $;
    this.html = html;
    this.isDisabled = false;
  }

  getPrice(domSelector, resolve = () => {}) {
    const timer = setTimeout(() => {
      this.isDisabled = true;
      if (isDebug) {
        console.log(`fail:getPrice:timeout ${DEFAULT_TIMEOUT}`);
      }
      resolve(0);
    }, DEFAULT_TIMEOUT);
    this.readText(domSelector, (text) => {
      const price = text;
      const number = Number(price.replace(/[^0-9.-]+/g,""));
      clearTimeout(timer);
      resolve(number);
    });
  }

  getStock(domSelector, resolve = () => {}) {
    const timer = setTimeout(() => resolve(''), DEFAULT_TIMEOUT);
    this.readText(domSelector, (text) => {
      const stock = text ? text.replace(/\D/g,''): '';
      clearTimeout(timer);
      resolve(stock);
    });
  }

  getAvailability(domSelector, resolve = () => {}) {
    const context = this;
    const timer = setTimeout(() => resolve(0), DEFAULT_TIMEOUT);
    this.readText(domSelector, (text) => {
      const availability = text;
      clearTimeout(timer);
      resolve(availability);
    });
  }

  readText(domSelector = '', callBack = () => {}) {
    const context = this;
    const timer = setTimeout(() => {
      this.isDisabled = true;
      if (isDebug) {
        console.log(`fail:readText:timeout ${DEFAULT_TIMEOUT}`);
      }
      callBack('');
    }, DEFAULT_TIMEOUT);
    try{
      this.$(domSelector, this.html).each((i, element) => {
        clearTimeout(timer);
        callBack(context.$(element).text());
      });
    } catch(err) {
      clearTimeout(timer);
      if (isDebug) {
        console.log(`fail:readText: ${err}`);
        callBack('');
      }
    }
  }
}

module.exports = DomAnalyzer;