class DomAnalyzer {
  constructor ($, html) {
    this.$ = $;
    this.html = html;
  }

  getPrice(domSelector, resolve = () => {}) {
    this.readText(domSelector, (text) => {
      const price = text;
      const number = Number(price.replace(/[^0-9.-]+/g,""));
      resolve(number);
    });
  }

  getStock(domSelector, resolve = () => {}) {
    this.readText(domSelector, (text) => {
      const stock = text ? text.replace(/\D/g,''): '';
      resolve(stock);
    });
  }

  getAvailability(domSelector, resolve = () => {}) {
    const context = this;
    this.readText(domSelector, (text) => {
      const availability = text;
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