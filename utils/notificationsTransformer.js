const { cleanString, booleanToNumber }  = require('./paramsTransformer');

const notificationTransformer = (param = {}) => {
  return {
    product_scraped_id: param.product_scraped_id,
    match: cleanString(param.match),
    notify_when_is_available: booleanToNumber(param.notify_when_is_available),
    notify_price_more_equal_than: param.notify_price_more_equal_than,
    notify_price_smaller_equal_than: param.notify_price_smaller_equal_than,
    notify_stock_changes: booleanToNumber(param.notify_stock_changes),
    notify_price_changes: booleanToNumber(param.notify_price_changes),
    notify_availability_changes: booleanToNumber(param.notify_availability_changes),
  }
}

module.exports = {
  notificationTransformer,
}