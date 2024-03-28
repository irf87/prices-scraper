const dbInstance = require('../infrastructure/storage/sqliteController');

const updateProductScrapedById = async (id, params) => {
  const updateProduct = dbInstance.prepareUpdate('product_scraped', params, `id=${id}`);
  const info = updateProduct.run();
  return { success: info.changes >= 1 ? true : false };
}

const updateProductScraped = async (condition, params) => {
  const updateProduct = dbInstance.prepareUpdate('product_scraped', params, condition);
  const info = updateProduct.run();
  return { success: info.changes >= 1 ? true : false };
}

const productScraped = {
  updateProductScrapedById,
  updateProductScraped,
};

module.exports = productScraped;