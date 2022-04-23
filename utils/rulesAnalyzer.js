class RulesAnalyzer {
  constructor (price, stock, availability, rules = {}) {
    this.price = price;
    this.stock = stock;
    this.availability = availability;
    this.rules = rules;
    this.date = new Date().toISOString();
  }

  analyzePrice() {
    if (this.rules.notify_price_changes === 1) {
      // analyze change
    }
    if (this.rules.notify_price_more_equal_than >== this.price) {
      // notify
    }
    if (this.rules.notify_price_smaller_equal_than <== this.price) {
      // notify
    }
  }

  analyzeStock () {

  }

  analyzeAvailability () {
    
  }
}

module.exports = RulesAnalyzer;