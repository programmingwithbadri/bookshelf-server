const { User } = require('../models/user');

let auth = (req, res, next) => {
    let token = req.cookies.auth;

    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(400).json({
            error: true
        });

        // Gets the token and user from callbacks in user.js
        req.token = token;
        req.user = user;

        next();
    })
}

module.exports = { auth }