const sync = require('../../application/sync');

const syncScraped = async () => {
  return await sync.syncProductScraped();
}

const syncScrapedReset = async () => {
  return await sync.resetSyncProductScraped();
}

const syncScrapedSnap = async () => {
  return await sync.syncProductScrapedSnap();
}

const syncScrapedsSnapReset = async () => {
  return await sync.resetSyncProductScrapedSnap();
}

const syncCtrl = {
  syncScraped,
  syncScrapedReset,
  syncScrapedSnap,
  syncScrapedsSnapReset,
};

module.exports = syncCtrl;