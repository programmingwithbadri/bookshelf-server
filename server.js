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
    // skip, order and limit are optional params
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

app.get('/api/user', (req, res) => {
    const userId = req.query.id;
    User.findById(userId, (err, users) => {
        if (err) return res.status(400).json(err);

        res.json({
            name: doc.name,
            lastname: doc.lastname
        });
    })
})

app.get('/api/users', (req, res) => {
    // localhost:3000/api/users/?skip=1&limit=2&order=asc
    // skip, order and limit are optional params
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;

    User.find().skip(skip).sort({ _id: order }).limit(limit).exec((err, users) => {
        if (err) {
            res.status(400).send(err);
        }

        res.status(200).json(users);
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

app.post('/api/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        res.status(200).json({
            success: true,
            doc
        })
    })
})

app.post('/api/login', (req, res) => {
    User.findOne({
        'email': req.body.email
    }, (err, user) => {
        if (!user) return res.status(404).json({
            isAuth: false,
            message: "Email not found"
        })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.status(404).json({
                isAuth: false,
                message: "Incorrect password"
            })

            user.generateToken((err, user) => {
                if (err) return res.status(400).json(err);

                // setting the cookie in the user's browser and return data
                res.cookie('auth', user.token).json({
                    isAuth: true,
                    id: user._id,
                    email: user.email
                })
            })
        })
    })
})

// UPDATE
app.put('/api/updateBook', (req, res) => {
    // Params: searchBy, payloadChange, should return modified file, callback()
    Book.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, doc) => {
        if (err) {
            res.status(400).send(err);
        }

        res.status(200).json({
            success: true,
            doc
        })
    })
})

// DELETE
app.delete('/api/deleteBook', (req, res) => {
    let bookId = req.query.id;
    Book.findByIdAndRemove(bookId, (err, doc) => {
        if (err) {
            res.status(400).send(err);
        }

        res.status(200).json({
            success: true
        })
    })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is running at ${port}`)
});