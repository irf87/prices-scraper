const dbInstance = require('../../infrastructure/storage/sqliteController');

const MIGRATION_MESSAGE = 'Migration successful: `referred_code` column added to `product_scraped` table.';
const ERROR_MESSAGE = 'An error occurred during migration:';

const run = async () => {
  try {
    const query = 'ALTER TABLE product_scraped ADD COLUMN referred_code TEXT';
    const statement = dbInstance.execute(query);
    statement.run();
    console.log(MIGRATION_MESSAGE);
  } catch (error) {
    console.error(ERROR_MESSAGE, error.message);
  } finally {
    dbInstance.close();
  }
};

run();
