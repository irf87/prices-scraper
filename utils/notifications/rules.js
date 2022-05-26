const dayjs = require('dayjs');

const NOTIFICATION_RANGE_HOURS = 24;

const PRICE_CHANGE = 'PRICE_CHANGE';
const PRICE_HIGHER = 'PRICE_HIGHER';
const PRICE_LOWER = 'PRICE_LOWER';
const TO_MATCH = 'MATCH';
const STOCK_CHANGES = 'STOCK_CHANGES';

const rules = {
  PRICE_CHANGE,
  PRICE_HIGHER,
  PRICE_LOWER,
  TO_MATCH,
  STOCK_CHANGES,
};

const prop = {
  [PRICE_CHANGE]: 'notify_price_changes',
  [PRICE_HIGHER]: 'notify_price_more_equal_than',
  [PRICE_LOWER]: 'notify_price_smaller_equal_than',
  [TO_MATCH]: 'match',
  [STOCK_CHANGES]: 'notify_stock_changes',
};

const canSendNotification = (rule, rulesObj = {}, currentDate) => {
  const key = `${rule}_date`;
  const lastSend = rulesObj[key];
  
  if(!lastSend) return true;

  const date = dayjs(currentDate);
  const diff = date.diff(lastSend, 'hour');
  return diff >= NOTIFICATION_RANGE_HOURS;
}

module.exports = {
  rules,
  prop,
  canSendNotification,
}