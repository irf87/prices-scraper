const dbInstance = require('../../model/sqliteController');

const { notificationTransformer } = require('../../utils/notificationsTransformer');

const create = async (params) =>  {
  const transformParams = notificationTransformer(params);
  const newProduct = dbInstance.prepareInsert('scraper_notifications', transformParams);
  const info = newProduct.run(...Object.values(transformParams));

  return { success: info.changes >= 1 ? true : false };
}

const get = async () => {
  const query = `SELECT * FROM scraper_notifications`;
  const row = dbInstance.execute(query);
  return row.all();
}

const notifications = {
  create,
  get,
};

module.exports = notifications;