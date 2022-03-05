const Database = require('better-sqlite3');
const db = new Database('price_scraper.db', { verbose: console.log, fileMustExist: true });

const { transform } = require('../utils/paramsTransformer');

let dbInstance = null;

class sqliteDriver {

  close() {
    db.close();
  }

  prepareInsert(table, params) {
    const paramsMap = new Map(Object.entries(params));
    const columns = Array.from(paramsMap.keys());

    let attr = '';
    let values = '';
    const length =  paramsMap.size;

    columns.forEach((col, index) => {
      attr += col;
      values += '?';
      if (length > 1 && index < length -1 ) {
        attr += ','
        values += ',';
      }
    });

    return db.prepare(`INSERT INTO ${table} (${attr}) VALUES(${values})`);
  }

  prepareUpdate(table, params, condition) {
    const paramsMap = new Map(Object.entries(params));
    const columns = Array.from(paramsMap.keys());
    const length =  paramsMap.size;

    let setValues = '';

    columns.forEach((col, index) => {
      setValues += `${col} = ${transform(paramsMap.get(col))}`;
      if (length > 1 && index < length -1 ) setValues += ',';
    });
    const query = `UPDATE ${table} SET ${setValues} WHERE ${condition}`;
    console.log(`query = ${query}`);
    return db.prepare(`UPDATE ${table} SET ${setValues} WHERE ${condition}`);
  }

  execute(query) {
    return db.prepare(query);
  }
}

(function () {
  if (!dbInstance) dbInstance = new sqliteDriver();
})();

module.exports = dbInstance;