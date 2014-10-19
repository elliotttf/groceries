var express = require('express');
var router = express.Router();
var lists = require('../helpers/lists');

router.param('id', function (req, res, next, id) {
  lists.load(id, function (err, list) {
    if (err) {
      return next(err);
    }

    req.list = list;
    next();
  });
});

router.route('/app')
  .get(function (req, res) {
    lists.load(false, function (err, list) {
      if (err) {
        return res.status(404).json({ status: 'Unknown list.' });
      }

      res.json({ status: 'ok', list: list });
    });
  })
  .post(function (req, res) {
    lists.save(req.body, function (err, list) {
      if (err) {
        return res.status(500).json({ status: 'Error saving.' });
      }

      res.json({ status: 'ok', list: list });
    });
  });

router.route('/app/:id')
  .get(function (req, res) {
    res.json({ status: 'ok', list: req.list });
  })
  .put(function (req, res) {
    lists.save(req.body, function (err, list) {
      if (err) {
        return res.status(500).json({ status: 'Error saving.' });
      }

      res.json({ status: 'ok', list: list });
    });
  });

module.exports = router;

