const scrapedSnap = require('../../application/scraped-snap');

const getScrapedSnapReport = async (productScrapedId) => {
  return await scrapedSnap.getProductScrapedRecords(productScrapedId);
}

const reportsCtrl = {
  getScrapedSnapReport,
};

module.exports = reportsCtrl;