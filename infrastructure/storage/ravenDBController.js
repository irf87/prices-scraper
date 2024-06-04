require('dotenv').config();

const { DocumentStore, GetStatisticsOperation, CreateDatabaseOperation } = require('ravendb');

const dbName	= process.env.RAVEN_DB_NAME;
const host 		= process.env.RAVEN_DB_HOST || "http://127.0.0.1";
const port	= process.env.RAVEN_DB_PORT || "8080";

const store = new DocumentStore(`${host}:${port}`, dbName);
store.initialize();

const executeCreation = async () => {
  try {
    const r = await store.maintenance.forDatabase(dbName).send(new GetStatisticsOperation());
  } catch (err) {
    store.maintenance.server.send(new CreateDatabaseOperation({ databaseName: dbName }));
    console.log(`RAVEN BD ${dbName} created`);
  }
}
executeCreation();

let ravenInstance = null;

class ravenDB {
  session;
  
  async create(data, documentName, categoryName) {
    this.openSession();
    await this.session.store({...data, category: categoryName}, documentName);
    await this.session.saveChanges();
    this.session.dispose();
  }

  async update(updatedData) {
    this.openSession();
    await this.session.store(updatedData);
    await this.session.saveChanges();
    this.session.dispose();
  }

  bulkInsert() {
    return store.bulkInsert();
  }

  async load(documentName, categoryName) {
    this.openSession();
    return await this.session
    .include(categoryName)
    .load(documentName);

  }
  
  async querySingle(collection, field, condition) {
    this.openSession();
    const result = await this.session.query(collection).whereEquals(field, condition).single();
    this.session.dispose();
    return result;
  }

  async query(collection) {
    this.openSession();
    const result = await this.session.query({ collection }).all();
    this.session.dispose();
    return result;
  }

  async deleteCollection(collectionName) {
    this.openSession();
    const collection = await this.session.query({ collection: collectionName }).all();
    for (const item of collection) {
      await this.session.delete(item['@metadata']['@id']);
    }
    await this.session.saveChanges();
    this.closeSession();
  }

  getSession() {
    this.openSession();
    return this.session;
  }

  openSession() {
    if (this.session) {
      this.session.dispose();
    }
    this.session = store.openSession();
  }

  closeSession() {
    this.session.dispose();
  }
}

(function () {
  if (!ravenInstance) ravenInstance = new ravenDB();
})();

module.exports = ravenInstance;