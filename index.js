'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./utils/db');

const tipsRouter = require('./routes/tips');
const leaderBoardRouter = require('./routes/leaderboard');

// Create an Express application
app.use(express.static('public')); // Create a static webserver
app.use(express.json()); // Parse request body

// Log all requests. Skip logging during test
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);


app.use('/api/tips', tipsRouter);
app.use('/api/leaderboard', leaderBoardRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {},
    reason: err.reason,
    location: err.location
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };

module.exports = app;
