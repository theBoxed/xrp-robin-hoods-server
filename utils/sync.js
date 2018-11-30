'use strict';
const mongoose = require('mongoose');
const request = require('request');
const { MONGODB_URI } = require('../config');

//Mongo Collections
const Transaction = require('../archive/transactions');
const Tips = require('../models/tips');
const Withdraws = require('../models/withdraws');
const Deposits = require('../models/deposits');

// TODO: Create collections for Tips, withdraws and deposits;
// TODO: Figure out what the DB isn't populating

function serverConnectPromise() {
  return mongoose.connect(
    MONGODB_URI,
    { useNewUrlParser: true, useCreateIndex: true }
  );
}

function requestFeed(skip, limit) {
  request(
    `https://www.xrptipbot.com/json/feed?limit=${limit}&skip=${skip}`,
    function(error, response, body) {
      const allTransactions = JSON.parse(body);
      serverConnectPromise().then(() => {
      const cleanInfo = allTransactions.feed.map(transaction => {
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
      return cleanInfo;
      }).then(results => {
        for (let transaction of results) {
          if (transaction.type === 'tip') {
            Tips.create(transaction);
          } else if (transaction.type === 'deposit') {
            Deposits.create(transaction);
          } else if (transaction.type === 'withdraw') {
            Withdraws.create(transaction);
          }
        }
        }).then(() => {
          console.log('added item');
        })
        .catch(err => {
          console.log('there is an err' + '' + err);
        });

      // Transaction.insertMany(cleanInfo)
      //   .then(() => {
      //     console.log('added item');
      //   })
      //   .catch(err => {
      //     console.log('there is an err' + '' + err);
      //   });

      }
  );
}

function seedDB() {
  request('https://www.xrptipbot.com/json/feed', (err, res, body) => {
    let transactionFeed = JSON.parse(body);
    let tip = transactionFeed.feed.find(item => item.type === 'tip');

    let tips = tip.id.slice(2, tip.id.length);

    let withdraw = transactionFeed.feed.find(item => item.type === 'withdraw');
    let withdraws = withdraw.id.slice(2, withdraw.id.length);

    let deposit = transactionFeed.feed.find(item => item.type === 'deposit');

    let deposits = deposit.id.slice(2, deposit.id.length);

    let totalTrans = Number(deposits) + Number(tips) + Number(withdraws);
    console.log(totalTrans);
    const maxLimit = 10000; //The Max Number Limit Query will handle
    let limit = maxLimit; //A variable we will use to reset the during the final loop.
    let loops = Math.floor(totalTrans / maxLimit); //The number of loops we will need to make to run through all the transactions
    const rem = totalTrans - maxLimit * loops; //The remainder to help us calculate the final batch
    let skip = maxLimit * (loops - 1) + rem; //The skip variable we use for the query

    for (let i = loops; i >= 0; i--) {
      if (i > 0) {
        requestFeed(skip, limit);
        skip -= maxLimit;
      } else if (i === 0) {
        limit = rem;
        skip = 0;
        requestFeed(skip, limit);
      }
    }
  });
}

seedDB();



// console.log(`Connecting to mongodb at ${MONGODB_URI}`);

// mongoose
//   .connect(
//     MONGODB_URI,
//     { useNewUrlParser: true, useCreateIndex: true }
//   )
//   .then(() => {
//     console.info('Deleting Data...');
//     return Promise.all([
//       Transaction.deleteMany()
//       // TODO: All new collections to this list.
//     ]);
//   })
//   .then(() => {
//     console.info('Seeding Database...');
//     return Promise.all([requestFeed(0, 299)]);
//   })
//   .then(results => {
//     console.log('Inserted results');
//     console.info('Disconnecting...');
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(err);
//     return mongoose.disconnect();
//   });
