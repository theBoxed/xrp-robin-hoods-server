'use strict';


const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');


const app = require('../index');
const Tips = require('../models/tips');
const { tips } = require('../utils/data');
const { TEST_MONGODB_URI } = require('../config');


chai.use(chaiHttp);
const expect = chai.expect;

describe('XRP Robin Hoods Test', function () {
  before(function () {
    return mongoose
      .connect(
        TEST_MONGODB_URI,
        { useNewUrlParser: true, useCreateIndex: true }
      )
      .then(() =>
        Promise.all([
          Tips.deleteMany(),
        ])
      );
  });

  beforeEach(function () {
    return Promise.all([
      Tips.insertMany(tips)
    ])
  });

  afterEach(function () {
    return Promise.all([
      Tips.deleteMany()
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/tips', function () {
    it('should return 500 error with no query', function () {
      return Promise.all([
        Tips.find({ }),
        chai
          .request(app)
          .get('/api/tips')
      ]).then(([data, res]) => {
        expect(res).to.have.status(500);
        expect(res).to.be.json;
      });
    });

    it('should return 200 with query', function () {
      return chai
          .request(app)
          .get('/api/tips?period=week')
    .then((res) => {
        expect(res).to.be.json;
        expect(res.body).to.have.any.keys('totalResults', 'tipXRPResults');
      });
    });
  });
});
