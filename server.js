const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const config = require('./config/config').get(process.env.NODE_ENV);

const { User } = require('./models/user');
const { Book } = require('./models/book');

const app = express();

// Needed the promise to have async calls. Mongo doesnt provide by default
// We need to fetch it from node globals
mongoose.Promise = global.Promise;

//mongoose.connect(config.DATABASE) is depricated. thus passing additonal obj param
mongoose.connect(config.DATABASE, { useNewUrlParser: true, useCreateIndex: true });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log("server is running")
});