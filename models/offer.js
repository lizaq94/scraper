const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  title: { type: String },
  url: { type: String },
  image: { type: String },
  description: { type: String },
  price: { type: Number },
  currency: { type: String },
  area: { type: Number },
  unitArea: { type: String },
});

module.exports = mongoose.model('Offer', offerSchema);
