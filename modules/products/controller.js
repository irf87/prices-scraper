const dbInstance = require('../../model/sqliteController');

const create = async (params) =>  {
  const {
    name,
    description,
    url_info,
    url_img,
  } = params;

  const newProduct = dbInstance.prepareInsert('product', params);
  const info = newProduct.run(name, description, url_info, url_img);

  return { success: info.changes >= 1 ? true : false };
}

const get = async (params) => {
  const query = `SELECT * FROM product`;
  const row = dbInstance.execute(query);
  return row.all();
}

const update = async (id, params) => {
  const updateProduct = dbInstance.prepareUpdate('product', params, `id=${id}`);
  const info = updateProduct.run();
  return { success: info.changes >= 1 ? true : false };
}

const products = {
  create,
  get,
  update,
};

module.exports = products;