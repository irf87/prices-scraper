const PRICE_MSG = 'PRICE_MSG';
const STOCK_MSG = 'STOCK_MSG';
const AVAILABILITY_MSG = 'AVAILABILITY_MSG';

const messageTypes = {
  PRICE_MSG,
  STOCK_MSG,
  AVAILABILITY_MSG,
};

const PRICE_CHANGE = 'priceHasChanged';
const PRICE_INCREMENT = 'priceMoreEqual';
const PRICE_DECREASE = 'priceSmallerEqual';

const messages = {
  PRICE_CHANGE,
  PRICE_INCREMENT,
  PRICE_DECREASE,
};

module.exports = {
  messageTypes,
  messages,
};