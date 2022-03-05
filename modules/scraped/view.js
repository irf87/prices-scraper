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

router.get('/enables',(req, res) => {
  ctrl.getEnables().then((respond) => {
    res.status(200).send(respond);
  })
  .catch((e) => {
    res.status(400).send({error: e});
  });
});

router.delete('/:id',(req, res) => {
  ctrl.remove(req.params).then((respond) => {
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