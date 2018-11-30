'use strict';

// TODO: Fix all functions to handle dates in match
// TODO: Outline ways to consolidate this route. Lots of extra code.

const express = require('express');
const mongoose = require('mongoose');

//Mongo Collections
const Tips = require('../models/tips');
const Withdraws = require('../models/withdraws');
const Deposits = require('../models/deposits');
const router = express.Router();


function tipsSentLeadersPromise(firstDay, lastDay) {
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
        _id: {
          user: '$user'
        },
        value: {
          $sum: 1
        },
        network: { $first: '$network' }
      }
    },
    {
      $sort: {
        value: -1
      }
    },
    {
      $limit: 10
    },
    {
      $project: {
        _id: 0,
        username: '$_id.user',
        network: 1,
        value: 1
      }
    }
  ]).then(results => {
    console.log('Tip Sent Leader Promise' + JSON.stringify(results));
    if (!results) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return results;
    }
  });
}

function xrpSentLeadersPromise(firstDay, lastDay) {
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
        _id: {
          user: '$user'
        },
        value: {
          $sum: '$xrp'
        },
        network: { $first: '$network' }
      }
    },
    {
      $sort: {
        value: -1
      }
    },
    {
      $limit: 10
    },
    {
      $project: {
        _id: 0,
        username: '$_id.user',
        network: 1,
        value: 1
      }
    }
  ]).then(results => {
    console.log('Tip Sent Leader Promise' + results);
    if (!results) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return results;
    }
  });
}

function tipsReceivedLeadersPromise(firstDay, lastDay) {
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
        _id: {
          user: '$to'
        },
        value: {
          $sum: 1
        },
        network: { $first: '$network' }
      }
    },
    {
      $sort: {
        value: -1
      }
    },
    {
      $limit: 10
    },
    {
      $project: {
        _id: 0,
        username: '$_id.user',
        network: 1,
        value: 1
      }
    }
  ]).then(results => {
    console.log('Tip Sent Leader Promise' + JSON.stringify(results));
    if (!results) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return results;
    }
  });
}

function xrpReceivedLeadersPromise(firstDay, lastDay) {
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
        _id: {
          user: '$to'
        },
        value: {
          $sum: '$xrp'
        },
        network: { $first: '$network' }
      }
    },
    {
      $sort: {
        value: -1
      }
    },
    {
      $limit: 10
    },
    {
      $project: {
        _id: 0,
        username: '$_id.user',
        network: 1,
        value: 1
      }
    }
  ]).then(results => {
    console.log('Tip Sent Leader Promise' + results);
    if (!results) {
      const err = new Error('Results Not Found');
      err.status = 400;
      return Promise.reject(err);
    } else {
      return results;
    }
  });
}

router.get('/', (req, res, next) => {
  const { period } = req.query;
  let curr = new Date();
  let first = curr.getDate() - curr.getDay() - 7;
  let last = first + 6;
  let firstDay, lastDay;
  if (period === 'week') {
    firstDay = new Date(curr.setDate(first)).toISOString();
    lastDay = new Date(curr.setDate(last)).toISOString();
  } else if (period === 'all') {
    firstDay = new Date(2017, 0, 1, 0, 0).toISOString();
    lastDay = new Date();
  }

  Promise.all([
    tipsSentLeadersPromise(firstDay, lastDay),
    xrpSentLeadersPromise(firstDay, lastDay),
    tipsReceivedLeadersPromise(firstDay, lastDay),
    xrpReceivedLeadersPromise(firstDay, lastDay)
  ])
    .then(
      ([
        TipsSentLeaders,
        XrpSentLeaders,
        TipsReceivedLeaders,
        XrpReceivedLeaders
      ]) => {
        let results = {
          TipsSentLeaders,
          XrpSentLeaders,
          TipsReceivedLeaders,
          XrpReceivedLeaders
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
