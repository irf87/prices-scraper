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

router.get('/',(req, res) => {
  ctrl.get().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.get('/scraped',(req, res) => {
  ctrl.getScraped().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.put('/:id', (req, res) => {
  ctrl.update(req.params.id, req.body).then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});


module.exports = router;