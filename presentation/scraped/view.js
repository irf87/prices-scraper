const express = require('express'),
	router = express.Router();

const parseParams = require('../../middleware/parseParams');
const ctrl = require('./controller');

router.use(parseParams);

router.post('/',(req, res) => {
  ctrl.create(req.body).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.post('/test',(req, res) => {
  ctrl.testScraper(req.body).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.post('/suggest-selectors',(req, res) => {
  ctrl.suggestSelectors(req.body).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.post('/product-details-by-selectors',(req, res) => {
  ctrl.getProductDetail(req.body).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.get('/enables',(req, res) => {
  ctrl.getEnables().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.get('/:id?',(req, res) => {
  ctrl.get(req.params?.id).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.delete('/:id',(req, res) => {
  ctrl.remove(req.params.id).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.put('/:id',(req, res) => {
  ctrl.update(req.params.id, req.body).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

module.exports = router;