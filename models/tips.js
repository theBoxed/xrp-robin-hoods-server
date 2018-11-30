'use strict';

const mongoose = require('mongoose');

const tipsSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  moment: { type: Date },
  type: { type: String },
  xrp: { type: Number },
  network: { type: String },
  user: { type: String },
  to: { type: String }
});

tipsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Tips', tipsSchema);
