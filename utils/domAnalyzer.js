require('dotenv').config();

const DEFAULT_TIMEOUT = process.env.TIMEOUT_ANALIZER || 1000;
class DomAnalyzer {
  constructor ($, html) {
    this.$ = $;
    this.html = html;
    this.isDisabled = false;
  }

  getPrice(domSelector, resolve = () => {}) {
    const timer = setTimeout(() => {
      this.isDisabled = true;
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
    this.$(domSelector, this.html).each(function() {
      callBack(context.$(this).text());
    });
  }
}

module.exports = DomAnalyzer;