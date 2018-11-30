'use strict';
const mongoose = require('mongoose');
const request = require('request-promise');
const { MONGODB_URI } = require('../config');

//Mongo Collections
const Tips = require('../models/tips');
const Withdraws = require('../models/withdraws');
const Deposits = require('../models/deposits');

const options = {
  uri: 'https://www.xrptipbot.com/json/feed',
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

// Stores each id in the transIdArr and returns an object of the last transIDs
function findLastTransaction(arr, transData) {
  let lastTransIds = {};
  let transTypes = ['tip', 'deposit', 'withdraw'];
  let id = '';
  transTypes.forEach(function(item) {
    id = arr.find(trans => trans.type === item);
    lastTransIds[item] = id.id;
  });
  return lastTransIds;
}

function createTransNum(obj) {
  let lastTransNum = {};
  for (let id in obj) {
    lastTransNum[id] = obj[id].slice(2, obj[id].length);
  }
  // console.log('Last Trans Num ->  ' + JSON.stringify(lastTransNum));
  return lastTransNum;
}

function findTotal(obj) {
  let sum = 0;
  for (let num in obj) {
    sum += Number(obj[num]);
  }
  return sum;
}

function loopThroughFeed(totalTrans) {
  const maxLimit = 10000; //The Max Number Limit Query will handle
  let limit = maxLimit; //A variable we will use to reset the during the final loop.
  let loops = Math.floor(totalTrans / maxLimit); //The number of loops we will need to make to run through all the transactions
  let rem = totalTrans - maxLimit * loops; //The remainder to help us calculate the final batch
  let skip = maxLimit * (loops - 1) + rem; //The skip variable we use for the query
  let seeds = [];
  for (let i = loops; i >= 0; i--) {
    if (i > 0) {
      seeds.push(seedDB(skip, limit));
      skip -= maxLimit;
    } else if (i === 0) {
      limit = rem;
      skip = 0;
      seeds.push(seedDB(skip, limit));
    }
  }

  return Promise.all(seeds);
}


function cleanData(transactions) {
  return transactions.feed.map(transaction => {
    return {
      id: transaction.id,
      moment: transaction.moment,
      month: transaction.moment,
      type: transaction.type,
      xrp: transaction.xrp,
      network: transaction.network,
      user: transaction.user,
      to: transaction.to
    };
  });
}

function seedDB(skip, limit) {
  let options = {
    uri: `https://www.xrptipbot.com/json/feed?limit=${limit}&skip=${skip}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return request(options)
    .then(results => {
      return cleanData(results);
    })
    .then(results => {
      for (let transaction of results) {
        if (transaction.type === 'tip') {
          Tips.create(transaction);
        } else if (transaction.type === 'deposit') {
          Deposits.create(transaction);
        } else if (transaction.type === 'withdraw') {
          Withdraws.create(transaction);
        }
      }
    })
    .then(() => {
          console.info('Inserted results');
        return;
    })
    .catch(err => {
      return Promise.reject(err);
    });
}



mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    console.info('Deleting Data...');
    return Promise.all([
      Tips.deleteMany(),
      Withdraws.deleteMany(),
      Deposits.deleteMany()
    ]);
  })
  .then(() => {
    return request(options);
  })
  .then(results => {
    let lastTransIds = findLastTransaction(results.feed);
    let lastTransNum = createTransNum(lastTransIds);
    return findTotal(lastTransNum);
  })
  .then(results => {
    console.info('Seeding Database...');
    return loopThroughFeed(results);
  }).then(results => {
    console.info('Inserted All results');
      console.info('Disconnecting...');
      return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
