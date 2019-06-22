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

// GET
app.get('/api/book', (req, res) => {
    let bookId = req.query.id;

    Book.findById(bookId, (err, doc) => {
        if (err) {
            res.status(400).send(err);
        }

        res.status(200).json(doc);
    });
})

app.get('/api/books', (req, res) => {
    // localhost:3000/api/books/?skip=1&limit=2&order=asc
    // skip, order and limit ar eoptional params
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;

    Book.find().skip(skip).sort({ _id: order }).limit(limit).exec((err, doc) => {
        if (err) {
            res.status(400).send(err);
        }

        res.status(200).json(doc);
    });
})

// POST
app.post('/api/book', (req, res) => {
    const book = new Book(req.body);

    book.save((err, doc) => {
        if (err) {
            res.status(400).send(err);
        }

        res.status(200).json({
            post: true,
            bookId: doc._id
        })
    })
})

// UPDATE

// DELETE

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is running at ${port}`)
});