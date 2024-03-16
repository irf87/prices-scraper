require('dotenv').config();
const DB_USER = process.env.COUCH_DB_USER;
const DB_PASSWORD = process.env.COUCH_DB_PASSWORD;
const DB_HOST = process.env.COUCH_DB_HOST;
const DB_PORT = process.env.COUCH_DB_PORT;

const nano = require('nano')(`http://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`);

const dbName = 'price-scraper-docs';

let dbCouchInstance = null;

const init = async () => {
  const dbCheck = new Promise((resolve) => {
    nano.db.get(dbName, function(err, body) {
      if (err) {
        if (err.statusCode === 404) {
          const creationResult = createDb();
          return resolve(creationResult);
        } else {
          console.log('Error al verificar la existencia de la base de datos:', err);          
          return resolve(false);
        }
      } else {
        console.log('La base de datos existe.');
        return resolve(true);
      }
    });
  });
  return await dbCheck;
}

const createDb = async (onSuccess, onError) => {
  try {
    const response = await nano.db.create(dbName)
    console.log(`La base de datos ${dbName} fue creada`);
    return true;
  } catch (e) {
    console.log(`No se pudo crear la base de datos ${dbName}`);
    console.error(e);
    return false;
  }
}

class couchDriver {
  constructor() {
    this.initDriver();
  }

  async initDriver() {
    const isDone = await init();
    if (isDone) {
      this.dbInstance = nano.use(dbName);
    }
  }

  async get (docKey, params) {
    if (!this.dbInstance) return 'Sin instancia';
    const result = await this.dbInstance.get(docKey, params);
    return result;
  }

  async insert (docKey, params) {
    if (!this.dbInstance) return 'Sin instancia';
    const result = await this.dbInstance.insert(params, docKey);
    return result;
  }
}

(function () {
  if (!dbCouchInstance) dbCouchInstance = new couchDriver();
})();

module.exports = dbCouchInstance;