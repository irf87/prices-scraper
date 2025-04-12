const { parentPort } = require('worker_threads');
const scraperCtrl = require('./presentation/scraped/controller');
const { GETTING_MODE_TYPES } = require('./utils/gettingModeTypes');
const { executeScraping } = require('./application/scraper/execute');
const { printDate } = require('./utils/date/printDate');

parentPort.on('message', async (gettingMode) => {
  try {
    const rows = await scraperCtrl.getEnables({ gettingMode });
    console.log(`rows: ${rows.length} - gettingMode: ${gettingMode}`);
    if (rows.length > 0) {
      let cont = 0;
      console.log(`\nSTART SCRAPING ${gettingMode} AT`);
      printDate();
      console.log('\n');
      
      const toScraping = rows;
      const arrayLength = rows.length;
      await executeScraping(toScraping[cont], cont, arrayLength, toScraping);
      console.log(`\nFINISH SCRAPING ${gettingMode} AT`);
      printDate();
      console.log('\n');
    }
    parentPort.postMessage('done');
  } catch (error) {
    console.error(`Error in worker for ${gettingMode}:`, error);
    parentPort.postMessage('error');
  }
}); 