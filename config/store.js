const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


// mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URI, { useNewUrlParser: true })
    .then(() => {
            console.log('Database ready to use');
        },
        err => {
            console.log('database error - ' + err)
        });

// Delete collection        
// let db = mongoose.connection;
// db.dropCollection('sessions');
// db.dropCollection('users');

module.exports = new MongoStore({ mongooseConnection: mongoose.connection })