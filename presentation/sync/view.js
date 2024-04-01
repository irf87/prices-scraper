const express = require('express'),
  router = express.Router();

const parseParams = require('../../middleware/parseParams');
const ctrl = require('./controller');

router.use(parseParams);

router.get('/scraped-sync', (req, res) => {
  ctrl.syncScraped().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.get('/scraped-snaps-sync', (req, res) => {
  ctrl.syncScrapedSnap().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.get('/scraped-sync-reset', (req, res) => {
  ctrl.syncScrapedReset().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.get('/scraped-snap-sync-reset', (req, res) => {
  ctrl.syncScrapedsSnapReset().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

module.exports = router;