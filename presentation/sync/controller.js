const sync = require('../../application/sync');

const syncScraped = async () => {
  return await sync.syncProductScraped();
}

const syncScrapedReset = async (resetCollection = false) => {
  return await sync.resetSyncProductScraped(resetCollection);
}

const syncScrapedSnap = async () => {
  return await sync.syncProductScrapedSnap();
}

const syncScrapedsSnapReset = async (resetCollection = false) => {
  return await sync.resetSyncProductScrapedSnap(resetCollection);
}

const syncCtrl = {
  syncScraped,
  syncScrapedReset,
  syncScrapedSnap,
  syncScrapedsSnapReset,
};

module.exports = syncCtrl;