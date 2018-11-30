
//DELETE and REPLACE WITH INDEX.JS

'user strict';



const Transactions = require('../models/transactions');


app.use(express.json());

//Queries include:
// network
// Type
// ?to=juancarlosCruz or From ?from=brady
// dates to and from

//Path Params
// :data (xrp or tips) used for sum
// :userType (user or to) 

//Queries:
// ?sort
// ?fromDate
// ?toDate
// ?limit
//



// 1. Total XRP Donated (Scorecard)
// 2. Total Tips (Scorecard)
// 3. Total Number of Tippers (Scorecard)
// 4. Total Nuber of Recipients (Scorecard)
// 5. Total XRP Donated by Network (TBD)
// 6. Total Tips by Network (TBD)
// 7. Total Number of Tippers by Network (Scorecard)
// 8. Total Number of Recipients by Network (Scorecard)
// 9. XRP and Tips By Week (line chart)
// 10. Avg. Weekly XRP Tipped (Scorecard)
// 11. Avg. Weekly Tips



// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;


// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(MONGODB_URI).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
