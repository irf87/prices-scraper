const dbInstance = require('../infrastructure/storage/sqliteController');
const ravenInstance = require('../infrastructure/storage/ravenDBController');

const GETTING_MODE_TYPES = require('../utils/gettingModeTypes');

const createProduct = async (params) =>  {
  const {
    name,
    description,
    url_info,
    url_img,
    getting_mode = GETTING_MODE_TYPES.FETCH,
  } = params;

  const newProduct = dbInstance.prepareInsert('product', params);
  const info = newProduct.run(name, description, url_info, url_img, getting_mode);

  return { success: info.changes >= 1 ? true : false };
}

const updateProduct = async (id, params) => {
  const updateProduct = dbInstance.prepareUpdate('product', params, `id=${id}`);
  const info = updateProduct.run();
  return { success: info.changes >= 1 ? true : false };
}

const getProduct = async (id) => {
  let query = `SELECT * FROM product`;
  if (id) {
    query += ` where id = ${id}`;
  }
  const row = dbInstance.execute(query);
  return row.all();
}

const getProductScraped = async (isQueryCommand = false) => {
  if (isQueryCommand) {
    let docResponse = [];
    try {
      const session = ravenInstance.getSession();
      docResponse = await session.query({ collection: 'productsScraped' }).whereEquals('enable', 1).all();
    } catch(err) {}
    ravenInstance.closeSession();
    return docResponse;
  } else {
    let query = `
    SELECT product.id, product.name, product.description, product.url_info, product.url_img, 
    product_scraped.id as product_scraped_id,
    product_scraped.url_to_scrape, last_snap.price, last_snap.date
    FROM product_scraped
    JOIN product ON product_scraped.product_id = product.id
    JOIN (
        SELECT product_scraped_id, price, MAX(date) AS last_timestamp
        FROM product_scraped_snap
        GROUP BY product_scraped_id
    ) AS latest_snap ON product_scraped.id = latest_snap.product_scraped_id
    JOIN product_scraped_snap AS last_snap ON latest_snap.product_scraped_id = last_snap.product_scraped_id AND latest_snap.last_timestamp = last_snap.date
    WHERE product_scraped.enable = 1`;
    const row = dbInstance.execute(query);
    return row.all();
  }
}

const product = {
  getProduct,
  getProductScraped,
  createProduct,
  updateProduct,
};

module.exports = product;