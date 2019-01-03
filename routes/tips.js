'use strict';

const express = require('express');
const mongoose = require('mongoose');
const momentJs = require('moment');

//Mongo Collections
const Tips = require('../models/tips');
const Withdraws = require('../models/withdraws');
const Deposits = require('../models/deposits');
const router = express.Router();

function createSeries(results) {
  let sumSeries = [];
  let countSeries = [];
  for (let i = 1; i <= 6; i++) {
    sumSeries.push(results[i].sumValue);
    countSeries.push(results[i].countValue);
  }
  return { sumSeries, countSeries };
}

function totalPromise(firstDay, lastDay) {
  return Tips.aggregate([
    {
      $match: {
        moment: {
          $lte: new Date(lastDay),
          $gte: new Date(firstDay)
        }
      }
    },
    {
      $group: {
        _id: null,
        xrp: { $sum: '$xrp' },
        tips: { $sum: 1 },
        avgValue: { $avg: '$xrp' }
      }
    },
    { $project: { _id: 0 } }
  ]).then(result => {
    if (!result) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return result;
    }
  });
}

function tipsPromise(period) {
  let momentFormat;
  if (period === 'week') {
    momentFormat = '%Y-%U';
  } else if (period === 'all') {
    momentFormat = '%Y-%m';
  }
  return Tips.aggregate([
    {
      $project: {
        moment: { $dateToString: { format: momentFormat, date: '$moment' } },
        xrp: '$xrp'
      }
    },
    {
      $group: {
        _id: '$moment',
        countValue: { $sum: 1 },
        sumValue: { $sum: '$xrp' }
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ]).then(result => {
    if (!result) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return result;
    }
  });
}

function totalUsersPromise(userType, firstDay, lastDay) {
  return Tips.distinct(userType, {
    moment: {
      $lte: lastDay,
      $gte: firstDay
    }
  }).then(results => {
    if (!results) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return results.length;
    }
  });
}

function newUsersPromise(userType, firstDay, lastDay) {
  return Tips.aggregate([
    {
      $sort: {
        moment: 1
      }
    },
    {
      $group: {
        _id: {
          user: '$user'
        },
        firstTip: {
          $first: '$moment'
        }
      }
    },
    {
      $project: {
        _id: false,
        username: '$_id.user',
        firstTip: true,
        count: {
          $cond: [
            {
              $and: [
                { $lte: ['$firstTip', new Date(lastDay)] },
                { $gte: ['$firstTip', new Date(firstDay)] }
              ]
            },
            1,
            0
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: '$count' }
      }
    }
  ]).then(result => {
    if (!result) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return result[0].count;
    }
  });
}

function newRecipientsPromise(userType, firstDay, lastDay) {
  return Tips.aggregate([
    {
      $sort: {
        moment: 1
      }
    },
    {
      $group: {
        _id: {
          user: '$to'
        },
        firstTip: {
          $first: '$moment'
        }
      }
    },
    {
      $project: {
        _id: false,
        username: '$_id.user',
        firstTip: true,
        count: {
          $cond: [
            {
              $and: [
                { $lte: ['$firstTip', new Date(lastDay)] },
                { $gte: ['$firstTip', new Date(firstDay)] }
              ]
            },
            1,
            0
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: '$count' }
      }
    }
  ]).then(result => {
    if (!result) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return result[0].count;
    }
  });
}

router.get('/', (req, res, next) => {
  const { period } = req.query;
  const userType = !req.query.userType ? 'user' : req.query.userType;
  const today = momentJs();
  let firstDay, lastDay;
  if (period === 'week') {
    firstDay = today.startOf('week').toDate();
    console.log('1st Today => ' + firstDay);
    lastDay = today.endOf('week').toDate();
    console.log('1st Today => ' + lastDay);
  } else if (period === 'all') {
    firstDay = new Date(2017, 0, 1, 0, 0).toISOString();
    lastDay = new Date();
  }

  Promise.all([
    totalPromise(firstDay, lastDay),
    tipsPromise(period),
    totalUsersPromise('user', firstDay, lastDay),
    totalUsersPromise('to', firstDay, lastDay),
    newUsersPromise('user', firstDay, lastDay),
    newRecipientsPromise('to', firstDay, lastDay)
  ])
    .then(
      ([
        totalResults,
        tipsResults,
        tipperResults,
        recipientsResults,
        newTippersResults,
        newRecipientsResults
      ]) => {
        let tipXRPResults = createSeries(tipsResults);
        let results = {
          totalResults,
          tipXRPResults,
          tipperResults,
          recipientsResults,
          newTippersResults,
          newRecipientsResults
        };
        if (results) {
          res.json(results);
        } else {
          next();
        }
      }
    )
    .catch(err => {
      next(err);
    });
});

module.exports = router;
