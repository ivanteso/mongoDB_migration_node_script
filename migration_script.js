const mongodb= require('mongodb')
const async = require('async')

// Import the two database to merge
const customers = require('./customer-data.json')
const customerAddresses = require('./customer-address-data.json')

// Initialize url and database name (specific for mondodb v3.x)
const url = 'mongodb://localhost:27017/'
const dbName = 'bitcoin-customers'

// define tasks array
let tasks = []
// catch and define the CLI argument. For empty value, the default is 1000
const cliQuery = parseInt(process.argv[2], 10) || 1000;
// return error for negative numbers
if (cliQuery <= 0) {
  console.log('Error: the CLI argument value must be a positive number')
  return process.exit(1)
}

// connect with mongodb. Use the new parser method (v3.x) and uses 'client' instead
// of 'db', always for v3.x version.
mongodb.MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
  const db = client.db(dbName);
  db.collection('accounts');

  if (error) return process.exit(1)

  // loop over the customers array and assign the customerAddresses properties and
  // values
  customers.forEach((customer, index, list) => {
    customers[index] = Object.assign(customer, customerAddresses[index])

    // once the cliQuery value is reached, push a function in the tasks array,
    // using done as argument
    if (index % cliQuery == 0) {
      const start = index
      const end = (start + cliQuery > customers.length) ? customers.length-1 : start + cliQuery
      tasks.push((done) => {
        console.log(`Processing ${start}-${end} out of ${customers.length}`)
        db.collection('accounts').insertMany(customers.slice(start, end), (error, results) => {
          done(error, results)
        })
      })
    }
  })

  // launch al the tasks fragments in parallel with async. startTime and endTime
  // are useful to measure the performance of the script, shown as execution time.
  // To test the script in different condition and processing a different number
  // of tasks, just change the value of cliQuery (argument in CLI command)
  console.log(`Launching ${tasks.length} parallel task(s)`)
  const startTime = Date.now()
  async.parallel(tasks, (error, results) => {
    if (error) console.error(error)
    const endTime = Date.now()
    console.log(`Execution time: ${endTime-startTime}`)
    client.close()
  })
})
