# XRP Robin Hoods - Server Side

This repository contains the server side code needed to scrape the [XRP Tip Bot Feed](https://www.xrptipbot.com/json/feed) and store in MongoDB collections.

## Background

To get started, you will first need to clone this repository to your local machine, and install the necessary dependencies.

From there you can seed your db using:

```javascript
node utils/sync
```

### Models

Under ./models you will find three (3) different collections.

1. Tips
2. Deposits
3. Withdraws

### Routes

Under ./routes you will find the endpoints created. They are a little busy right now, and are high-up on my priority list for updating. So stay tuned there.

### Background

This repo is related to [XRP Robin Hoods Client.](https://github.com/theBoxed/xrp-robin-hoods-client)