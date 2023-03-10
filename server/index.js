const keys = require('./keys')

//express app setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Postgres Client Setup
const { Pool } = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort

})

 pgClient.on('error', () => console.log('Lost PG connection'))

 pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err))


// Redis Client setup
const redis = require('redis')

const redisClient = redis.createClient({
    url: 'redis://redis:6379',
    retry_strategy: () => 1000
})


const redisPublisher = redisClient.duplicate()


redisClient.connect().then(() => {
    console.log("redis is connected")
})

redisPublisher.connect().then(() => {
    console.log("redis publisher is connected")
})
// Express routing

app.get("/", (req, res) => {
    res.send('Hi')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values')

    res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
    redisClient.hGetAll('valuesisis', (err, result) => {
        if (err) {
          console.error(err);
          res.send(err)
        } 
        res.send(result);
        console.log("get all")
          
        
      }).then((result) => {

        res.send(result)
      })
    
    

})

app.post('/values', async (req, res) => {
    const index = req.body.index

    if(parseInt(index) > 40) {
        return res.status(422).send('Index to high')
    }
    redisClient.hSet('valuesisis', index, 'Nothing yet!').then(() => {
        console.log("hSet inserted in valuesis")
    })
    redisPublisher.publish('insert', index)

    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
    res.send({ working: true })

})

app.listen(5000, err => {
    console.log("Listening")
})