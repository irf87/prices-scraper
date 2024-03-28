const product = require('../../application/product');

const create = async (params) =>  {
  return await product.createProduct(params);
}

const get = async (id) => {
  return await product.getProduct(id);
}

const getScraped = async (isQueryCommand = false) => {
  return await product.getProductScraped(isQueryCommand);
}

const update = async (id, params) => {
  return await product.updateProduct(id, params);
}

const products = {
  create,
  get,
  getScraped,
  update,
};

module.exports = products;