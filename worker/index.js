const keys = require('./keys')
const redis = require('redis')


const redisClient = redis.createClient({
    url: 'redis://redis:6379',
    retry_strategy: () => 1000
})

const sub = redisClient.duplicate()

redisClient.connect().then(() => {
    console.log("redis is connected")
})

sub.connect().then(() => {
    console.log("sub redis is connected")
})




function fib(index) {
    if (index < 2) return 1
    return fib(index - 1) + fib(index - 2)
}

sub.subscribe('insert', async (message) => {
    console.log(message)
    console.log(fib(parseInt(message)))
    redisClient.hSet('valuesisis', message, fib(parseInt(message))).then(() => {
        console.log("worker inserted fib")
    })
})
