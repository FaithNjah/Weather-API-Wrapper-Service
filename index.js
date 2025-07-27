require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const route = require('./routes/router');
const redisClient = require('./redis');

app.use('/', route)


app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})