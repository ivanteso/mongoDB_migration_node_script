# CSV to JSON converter

This project is part of the Microsoft's __Introduction to NodeJS__ course. This project's purpose is to build a migration script to move data from one MongoDB database to another.

## Table of Contents

* [Application Features](#application)
* [Installation](#installation)
* [Instructions](#instructions)
* [Dependencies](#dependencies)
* [Contributing](#contributing)

## Application Features

The app is developed in NodeJS and use `mongoDB` and `async`.
The script accepts as an argument a positive value in the CLI. This value
(parsed in decimal radix) tells the script how many objects to process in every asynchronous parallel process.

The databases to merge are `customer-data.json` (a database that misses all the customers' addresses) and `customer-address-data.json` (a database that contains only the customers' addresses).

The final results is a new database, called `bitcoin-customers`, made from the two merged databases, containing the `accounts` collection.

## Installation

You can clone this repository or download it as a .zip file.
Once downloaded, you need to navigate into the project folder with your terminal and run `npm install` in your console to install all the npm dependencies.

## Instructions

To use the application you must run your `mongoDB` using the command `mongod` or `sudo mongod` in your console. 
In another terminal window, navigate to the project folder and use the command `node migration_script.js` to run the script in the default mode. The default mode include 1000 objects for every process: this means that the script will run only one process (the database has 1000 entries) and there won't be any parallel process.

If you want to run 10 asynchronous parallel processes at the same time, you should type `node migration_script.js 100`. This will tell the script to include 100 objects for every process, resulting in 10 parallel processes.

You can print the results using `mongo shell`, typing
```
mongo // or sudo mongo
use bitcoin-customers
db.accounts.find() // or db.accounts.find().pretty()
```
  
## Dependencies

This app uses the following resources:

- [`mongodb`](https://docs.mongodb.com/). MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.
- [`async`](https://caolan.github.io/async/). Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.

## Contributing

All suggestions and tips will be more than appreciated but, as a general rule, no pull requests are normally accepted.