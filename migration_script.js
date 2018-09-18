const mongodb= require('mongodb')
const url = 'mongodb://localhost:27017/'
const dbName = 'bitcoin-customers'
const customers = require('./customer-data.json')
const customerAddresses = require('./customer-address-data.json')
const async = require('async')

let tasks = []
const cliQuery = parseInt(process.argv[2], 10) || 1000;
if (cliQuery <= 0) {
  console.log('Error: the CLI argument value must be a positive number')
  return process.exit(1)
}
   
mongodb.MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
  const db = client.db(dbName);
  db.collection('accounts');

  if (error) return process.exit(1)
  customers.forEach((customer, index, list) => {
    customers[index] = Object.assign(customer, customerAddresses[index])

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

  console.log(`Launching ${tasks.length} parallel task(s)`)
  const startTime = Date.now()
  async.parallel(tasks, (error, results) => {
    if (error) console.error(error)
    const endTime = Date.now()
    console.log(`Execution time: ${endTime-startTime}`)
    client.close()
  })
})
