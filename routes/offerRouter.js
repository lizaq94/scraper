const express = require('express');
const router = express.Router();
const getOffersFromUrl = require('../scraper');
const Offer = require('../models/offer');

router.get('/', (req, res) => {
  res.render('../views/index.html');
});

router.post('/pull', async (req, res) => {
  try {
    const url = req.body.url;

    await getOffersFromUrl(url);
    res.end('Data is saved');
  } catch (err) {
    console.log(err);
  }
});

router.get('/offers', async (req, res) => {
  try {
    const sortParam = req.query;

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
  } catch (err) {
    console.log(err);
  }
});

router.get('/offers/:id', async (req, res) => {
  try {
    const params = req.params;
    const showOne = await Offer.findOne({ _id: params.id });

    if (!showOne) {
      res.status(404).send('404 oferta o tym id nie istnieje');
    } else {
      res.json(showOne);
    }
  } catch (err) {
    res
      .status(404)
      .send('Niepoprawny format id. Sprawdź czy dobrze podałeś id');
  }
});

router.delete('/offers/:id', async (req, res) => {
  try {
    const params = req.params;
    const deleteOne = await Offer.findOneAndDelete({ _id: params.id });

    if (!deleteOne) {
      res.send('Oferta nie istnieją lub już została usunięta');
    } else {
      res.send(`'Oferta o id: ${params.id} została usunięta'`);
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete('/deleteAll', async (req, res) => {
  try {
    const deleteAll = await Offer.deleteMany({});

    res.send('Wszystkie oferty zostały usunięte');
  } catch (err) {
    console.log(err);
  }
});

https: module.exports = router;
