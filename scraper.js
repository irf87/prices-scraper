require('dotenv').config();


const SCRAPPER_INTERVAL = process.env.SCRAPPER_INTERVAL_TIME;
const SCRAPPER_INTERVAL_UNIT = process.env.SCRAPPER_INTERVAL_UNIT;

const GETTING_MODE_TYPES = require('./utils/gettingModeTypes');
const { parseToMiliseconds } = require('./utils/time');
const scraperCtrl = require('./presentation/scraped/controller');
const { executeScraping } = require('./application/scraper/execute');
const { printDate } = require('./utils/date/printDate');

let isExecuting = false;
let intervalId;

async function executeScrapingMode(mode) {
  try {
    const rows = await scraperCtrl.getEnables({ gettingMode: mode });
    console.log(`rows: ${rows.length} - gettingMode: ${mode}`);
    
    if (rows.length > 0) {
      let cont = 0;
      console.log(`\nSTART SCRAPING ${mode} AT`);
      printDate();
      console.log('\n');
      
      const toScraping = rows;
      const arrayLength = rows.length;
      await executeScraping(toScraping[cont], cont, arrayLength, toScraping);
      console.log(`\nFINISH SCRAPING ${mode} AT`);
      printDate();
      console.log('\n');
    }
    return 'done';
  } catch (error) {
    console.error(`Error in scraping for ${mode}:`, error);
    return 'error';
  }
}

async function execute() {
  if (isExecuting) {
    console.log('Previous execution still running, skipping...');
    return;
  }

  try {
    isExecuting = true;
    
    executeScrapingMode(GETTING_MODE_TYPES.FETCH);
    executeScrapingMode(GETTING_MODE_TYPES.RENDER);
    
  } catch (error) {
    console.error('Error in execute function:', error);
  } finally {
    isExecuting = false;
  }
}

// Cleanup function for graceful shutdown
async function cleanup() {
  console.log('Cleaning up...');
  
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  process.exit(0);
}

try {
  execute();
} catch (error) {
  console.error('Error in initial execution:', error);
}

// Wrap the interval in try-catch
try {
  intervalId = setInterval(() => {
    try {
      execute();
    } catch (error) {
      console.error('Error in interval execution:', error);
    }
  }, parseToMiliseconds(SCRAPPER_INTERVAL, SCRAPPER_INTERVAL_UNIT));
} catch (error) {
  console.error('Error setting up interval:', error);
}
