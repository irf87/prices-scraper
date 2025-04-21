const dbInstance = require('../../infrastructure/storage/sqliteController');

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
    query += ` where id = ${id}`;
  }
  const row = dbInstance.execute(query);
  return row.all();
}

const getProductScraped = async (id) => {
  const row = dbInstance.execute(`SELECT * FROM scraper_notifications WHERE product_scraped_id = ${id}`);
  const results = row.all();
  return results.length > 0 ? results[0] : null;
}

const update = async (id, params = {}) => {
  const transformParams = notificationTransformer(params);
  try {
    const updateProduct = dbInstance.prepareUpdate('scraper_notifications', transformParams, `id=${id}`);
    const info = updateProduct.run();
    return { success: info.changes >= 1 ? true : false };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const notifications = {
  create,
  get,
  update,
  getProductScraped,
};

module.exports = notifications;