const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const FileStore = require('session-file-store')(session);

const routes = require('./routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', './src/views');

app.use(session({
    key: 'user_sid',
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path:  require('path').join(require('os').tmpdir(), '../sessions')
    }),
    cookie: {
        expires: 600000
    }
}))
app.use(cookieParser())

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../public')))

app.use(((req, res, next) => {
    if(req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }

    next();
}))
app.use(routes);

async function startServer() {
    const port = 3113;
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        keepAlive: true,
        connectTimeoutMS: 5000
    }

    mongoose.connect('mongodb://127.0.0.1:27017/ChallengeApp', dbOptions);
    mongoose.set('useCreateIndex', true);
    mongoose.connection.on('error', error => console.error('Connection error: ', error));
    mongoose.connection.on('open', () => {
        app.listen(port, (err) => {
            if (err) {
                console.log('Something went wrong: ', err);
            }
        
            console.log('Your app is running on port: ', port);
        })
    });
}

startServer();

process.on('SIGINT', function() {
    process.exit();
});
process.on('SIGTSTP',  function() {
    process.exit();
});
process.on('exit', async function () {
    // kill the process on this port
})
