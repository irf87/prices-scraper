const express = require('express'),
  router = express.Router();

  const ctrl = require('./controller');

  router.post('/',(req, res) => {
    ctrl.create(req.body).then((respond) => {
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

  module.exports = router;