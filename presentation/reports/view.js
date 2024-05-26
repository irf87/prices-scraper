const express = require('express'),
	router = express.Router();

const ctrl = require('./controller');

router.get('/product-scraped',(req, res) => {
  ctrl.getScrapedSnapReport(req?.query?.id).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

module.exports = router;