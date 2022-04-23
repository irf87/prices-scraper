const dbInstance = require('../../model/sqliteController');

const { notificationTransformer } = require('../../utils/notificationsTransformer');

const create = async (params) =>  {
  const transformParams = notificationTransformer(params);
  const newProduct = dbInstance.prepareInsert('scraper_notifications', transformParams);
  const info = newProduct.run(...Object.values(transformParams));

  return { success: info.changes >= 1 ? true : false };
}

const get = async (id) => {
  let query = `SELECT * FROM scraper_notifications`;
  if (id) {
    query += ` where product_scraped_id = ${id}`;
  }
  const row = dbInstance.execute(query);
  return row.all();
}

const notifications = {
  create,
  get,
};

module.exports = notifications;