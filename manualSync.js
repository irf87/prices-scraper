const { printDate } = require('./utils/date/printDate');
const syncCtrl = require('./application/sync');

const executeSyncs = async () => {
  console.log('\nSTART SYNC AT');
  printDate();
  console.log('\n');
  await syncCtrl.syncProductScraped();
  await syncCtrl.syncProductScrapedSnap();
  console.log('\nFINISH SYNC AT');
  printDate();
  console.log('\n');
}

executeSyncs();