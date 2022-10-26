const dayjs = require('dayjs');

const scrapedSnapCtrl = require('../modules/scraped-snap/controller');

const { messages } = require('./messages');
const { rules, prop, canSendNotification } = require('./notifications/rules');

class RulesAnalyzer {
  constructor (price, stock, availability, scraperId, urlScraped, oProduct = {}, rules = {}, t) {
    this.price = price;
    this.stock = stock;
    this.availability = availability;
    this.scraperId = scraperId;
    this.urlScraped = urlScraped;
    this.product = oProduct;
    this.rules = rules;
    this.date = new Date().toISOString();
    this.notificationsToSend = [];
    this.t = t;
    this.lastSnap = null;
  }

  getRuleVal(rule) {
    return this.rules[prop[rule]];
  }

  isValidRule(rule) {
    const val = this.getRuleVal(rule);
    return typeof val === 'number' && val >= 0;
  }

  isMatch(str) {
    const ruleToMatch = this.getRuleVal(rules.TO_MATCH);
    const obj = {
      isMatch: false,
      wordMatch: ruleToMatch,
    }
    if (!ruleToMatch
      || !canSendNotification(prop[rules.TO_MATCH], this.rules, this.date)
      || !str) {
        return obj;
      }

    const pattern = new RegExp(ruleToMatch.toLowerCase(), 'g');

    if (str.toLowerCase().match(pattern)) {
      obj.isMatch = true;
      obj.wordMatch = ruleToMatch;
    }
    return obj;
  }

  makeMessage(rule, properties = {}) {
    const name = this.product.name;
    const site = this.urlScraped;
    const oMsg = {
      name,
      site,
      ...properties,
    };
    return this.t(rule, oMsg);
  }

  analyzePrice() {
    if (this.lastSnap && this.getRuleVal(rules.PRICE_CHANGE) === 1      
      && canSendNotification(prop[rules.PRICE_CHANGE], this.rules, this.date)
      && this.lastSnap?.price !== this.price) {
        this.notificationsToSend.push({
          type: rules.PRICE_CHANGE,
          message: this.makeMessage(rules.PRICE_CHANGE, { price: this.lastSnap.price, newPrice: this.price }),
          date: this.date,
        });
    }
    if (this.isValidRule(rules.PRICE_HIGHER) === 'number'
      && this.price >= this.getRuleVal(rules.PRICE_HIGHER)
      && canSendNotification(prop[rules.PRICE_HIGHER], this.rules, this.date)) {
        this.notificationsToSend.push({
          type: rules.PRICE_HIGHER,
          message: this.makeMessage(rules.PRICE_HIGHER, {
            price: this.price,
            priceRule: this.getRuleVal(rules.PRICE_HIGHER),
          }),
          date: this.date,
        });
    }
    if (this.isValidRule(rules.PRICE_LOWER) === 'number'
      && this.price <= this.getRuleVal(rules.PRICE_LOWER)
      && canSendNotification(prop[rules.PRICE_LOWER], this.rules, this.date)) {
        this.notificationsToSend.push({
          type: rules.PRICE_LOWER,
          message: this.makeMessage(rules.PRICE_LOWER, {
            price: this.price,
            priceRule: this.getRuleVal(rules.PRICE_LOWER)
          }),
          date: this.date,
        });
    }

    const oMatch = this.isMatch(String(this.price));
    if (oMatch.isMatch) {
      this.notificationsToSend.push({
        type: rules.TO_MATCH,
        message: this.makeMessage(rules.TO_MATCH, {
          word: this.price,
          ruleMatch: rules.TO_MATCH,
        }),
        date: this.date,
      });
    }

  }

  analyzeStock() {
    const oMatch = this.isMatch(String(this.stock));
    if (oMatch.isMatch) {
      this.notificationsToSend.push({
        type: rules.TO_MATCH,
        message: this.makeMessage(rules.TO_MATCH, {
          word: this.stock,
          ruleMatch: rules.TO_MATCH,
        }),
        date: this.date,
      });
    }
    if (this.getRuleVal(rules.STOCK_CHANGES)
      && canSendNotification(prop[rules.STOCK_CHANGES], this.rules, this.date)
      && this.lastSnap?.stock && this.stock !== this.lastSnap?.stock) {
        this.notificationsToSend.push({
          type: rules.STOCK_CHANGES,
          message: this.makeMessage(rules.STOCK_CHANGES, {
            stock: this.stock,
            lastStock: this.lastSnap?.stock,
          }),
          date: this.date,
        });
    }
  }

  analyzeAvailability() {
    
  }

  getNotificationsToSend() {
    return this.notificationsToSend;
  }

  async setSnap() {
    const [lastSnap] = await scrapedSnapCtrl.getLastRow(this.scraperId);
    this.lastSnap = lastSnap;
  }

  async createSnap() {
    const oSnap = {
      product_scraped_id: this.scraperId,
      date: this.date,
      product_id: this.product.id,
    };

    if (typeof this.price === 'number') oSnap.price = this.price; 
    if (typeof this.stock === 'number') oSnap.stock = this.stock; 
    if (typeof this.availability === 'number') oSnap.availability = this.availability;
    await scrapedSnapCtrl.create(oSnap);
  }
}

module.exports = RulesAnalyzer;