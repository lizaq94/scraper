const express = require('express');
const router = express.Router();
const startScrape = require('../scraper');
const Offer = require('../models/offer');

router.post('/pull', (req, res) => {
  const url = req.body.url;
  startScrape(url);
  res.send('Dane zostały dodane do bazy danych');
});

router.get('/offers', async (req, res) => {
  try {
    const sortParam = req.query;

    Offer.countDocuments(async (err, count) => {
      if (!err && count === 0) {
        res.status(404).send('Baza jest pusta');
      } else {
        if (sortParam.hasOwnProperty('desc')) {
          const offers = await Offer.find().sort({ price: -1 });
          res.json(offers);
        } else if (sortParam.hasOwnProperty('asc')) {
          const offers = await Offer.find().sort({ price: 1 });
          res.json(offers);
        } else {
          const offers = await Offer.find();
          res.json(offers);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/offers/:id', (req, res) => {
  const params = req.params;

  Offer.countDocuments(async (err, count) => {
    if (!err && count === 0) {
      res.status(404).send('Baza jest pusta');
    } else {
      const showOne = Offer.findOne({ _id: params.id });
      showOne.exec((err, data) => {
        if (data) {
          res.json(data);
        } else {
          res.status(404).send('404 mój drogi kolego');
        }
      });
    }
  });
});

https: module.exports = router;
