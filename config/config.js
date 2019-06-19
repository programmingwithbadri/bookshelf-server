const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        SECRET: 'SUPERSECRETPWD12345',
        DATABASE: 'mongodb://localhost:27017/bookShelf'
    }
}

exports.get = function (env) {
    return config[env] || config.default
}