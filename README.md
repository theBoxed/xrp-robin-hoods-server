# Documenation

## Introduction

### Currently Working On

1. ~~Create a transactions Schema to house xrptipbot info~~
2. ~~Make a request to the feed and insert into the collection~~
3. ~~Create a way to dynamically know who many total transactions there are rather than manual entry~~
4. ~~Only update the db with the missing transactions.~~
5. Check to see how many new transactions have occured since last pull.

#### Questions

1. How can we auto check for updates from the feed?
2. How to design/structure the application?
3. 

### Todo

1. Wireframe / Mock-up
2. How to synchronize info? Need to figure how to automatically update the database.
3. Write the queries for all of the different data that we want to display.
4. Design the charts and displays for each of the queries



### About

The following appilication allows the public to easily access the data associated with the XRP Tip Bot. Users can explore transactions at a high-level or get insights into their own usage.

### Charts & Data

**Total**

1. Total XRP Donated (Scorecard) HOME
2. Total Tips (Scorecard) HOME
3. Total Number of Tippers (Scorecard) HOME
4. Total Nuber of Recipients (Scorecard)
5. Total XRP Donated by Network (TBD)
6. Total Tips by Network (TBD)
7. Total Number of Tippers by Network (Scorecard)
8. Total Number of Recipients by Network (Scorecard)
9. XRP and Tips By Week (line chart)
10. Avg. Weekly XRP Tipped (Scorecard)
11. Avg. Weekly Tips

**Last 7 Days**

1. XRP Donated (Scorecard)
2. Total Tips (Scorecard)
3. Total Number of Tippers (Scorecard) [ db.getCollection('transactions').distinct("user") ]
4. Total Number of New Tippers (Scorecard)
5. Total Number of Recipients (Scorecard)
6. Total Number of New Recipients (Scorecard)

**Leaderboard**

1. Top 10 Tippers in Qty (Table)
2. Top 10 Tippers in XRP (Table)
3. Top 10 Recipients in Qty (Table)
4. Top 10 Recipients in XRP (Table)
5. Top 10 New Tippers (Table - Introduced to XRP Tip Bot)
6. Top 10 Tippers in Qty and in XRP By Channel (Table)

**Personal**

1. List of all your tips (table)
2. List of everyone you've tipped and amount you've tipped them (table)
3. List of everyone you've introduced to XRP Tip Bot (First Tip && Those That You Tipped and then they had first tip) (table)
4. List of All Received Tips (table)
5. List of everyone that has tipped you (table)
6. Your First Tip :)

**Misc Ideas**

1. List of New Tippers
2. List of New Recipients
3. Most Donations in a Week (Scorecard)
4. Most XRP Donated in a Week (Scorecard)
5. Ability to toggle currency translated into

## Domain Layer

### Resources to Explore


### User Types

1. **Default User** - an anoynomous user that visits the website. This user will have access to all front-end features other than the personal section.
2. **Logged-in User** - this is a user that can sign-up for the application using the same applications as XRPTipBot (Twitter, Discord, Reddit). This will provide them with access to the Personal Section, seeing stats on their particular activity.

## Application Layer

### Use Cases

## Infrastructure Layer

## Tech

* Node
* Express
* Request
* Morgan
* Mongoose
* Nodemon
* Mocha
* Chai
* Passport
* Heroku

----

## Misc. Information / Notes to Be Done

https://blog.codeminer42.com/nodejs-and-good-practices-354e7d763626

https://github.com/talyssonoc/node-api-boilerplate

http://thenodeway.io/introduction/

https://github.com/FredKSchott/the-node-way

https://blog.risingstack.com/fundamental-node-js-design-patterns/

https://discordapp.com/developers/docs/topics/oauth2

## Server.js

1. Require

2. create express router
3. Log all requests, skip log during tests
4. Create a static webserver
5. Parse request body
6. Mount routers(transactions and users)
7. Custom 404 route handler
8. Custom Error Handler
9. Listen for incoming connections



## Config

1. PORT

## Routers

### Transactions

1. Setup Document

- require express, mongoose, models (TBD)

2. Endpoints



### Users



### Charts

1. React Sparklines
2. Ant Design 
