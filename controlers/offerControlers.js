const startScrape = require('../index');
const offer = require('../models/offer');
const Offer = require('../models/offer');

module.exports = {
  pullAll(req, res) {
    const url = req.body.url;
    console.log(url);
    startScrape(url);
    res.send('Pull');
  },

  async showAll(req, res) {
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

      // const offers = await Offer.find().sort({ price: -1 });
    } catch (err) {
      console.log(err);
    }
  },

  showOne(req, res) {
    res.send('Show one');
  },
};
