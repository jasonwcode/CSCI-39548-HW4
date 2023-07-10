const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())

const uri = "mongodb+srv://standardUser:uvn0M13nWwb56HBX@csci39548.ybyl2wo.mongodb.net/?retryWrites=true&w=majority";

const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbName = "CSCI39548"
const db = client.db(dbName);
const quoteCol = db.collection('quotes')

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect().then(client => {
      app.post('/quotes', (req, res) => {
        quoteCol
          .insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })
      app.get('/', (req, res) => {
        db.collection('quotes')
          .find()
          .toArray()
          .then(results => {
            res.render('index.ejs', { quotes: results })
          })
          .catch(error => console.error(error))
      })
      app.put('/quotes', (req, res) => {
        quoteCol.findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then(result => {
          res.json('Success')
        })
        .catch(error => console.error(error))
      })
      app.delete('/quotes', (req, res) => {
        quoteCol.deleteOne({ name: req.body.name })
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            return res.json(`Deleted Darth Vader's quote`)
          })
          .catch(error => console.error(error))
      })
    });
    // Send a ping to confirm a successful connection
    console.log("You successfully connected to MongoDB!");
  } finally {
  }
}

run().catch(console.dir);


// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, function () {
  console.log('listening on 3000')
})