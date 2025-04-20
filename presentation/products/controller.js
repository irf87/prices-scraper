const product = require('../../application/product');

const create = async (params) =>  {
  return await product.createProduct(params);
}

const get = async (id) => {
  return await product.getProduct(id);
}

const getScraped = async () => {
  return await product.getProductScraped();
}

const getScrapedById = async (productId) => {
  return await product.getProductScrapedById(productId);
}

const update = async (id, params) => {
  return await product.updateProduct(id, params);
}

const products = {
  create,
  get,
  getScraped,
  getScrapedById,
  update,
};

module.exports = products;