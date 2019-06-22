const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/config').get(process.env.NODE_ENV);

const SALT_I = 10;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        maxlength: 60
    },
    lastname: {
        type: String,
        maxlength: 60
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
})

// This will be invoked before save method from server.js
userSchema.pre('save', function (next) {
    var user = this;

    // Will be accessed if the user's password is modified
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);

                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

// Creating the method for user to compare the password with hash
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

// Creating the method for user to generate web token for security purposes
userSchema.methods.generateToken = function (cb) {
    var user = this;
    user.token = jwt.sign(user._id.toHexString(), config.SECRET);
    user.save((err, user) => {
        if (err) return cb(err);
        cb(null, user);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }