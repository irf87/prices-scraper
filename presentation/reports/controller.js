const scrapedSnap = require('../../application/scraped-snap');

const getScrapedSnapReport = async (productScrapedId) => {
  const result = await scrapedSnap.getProductScrapedRecords(productScrapedId ? Number(productScrapedId) :  undefined);
  return result?.data ? result.data : [];
}

const reportsCtrl = {
  getScrapedSnapReport,
};

module.exports = reportsCtrl;