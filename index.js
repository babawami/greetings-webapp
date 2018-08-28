'use strict';
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const facFunction = require('./facFunction');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/users';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

// connect database to the factory function
const useFactory = facFunction(pool);

let app = express();

app.use(session({
    secret: 'enter all name and select language',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

app.post('/greet', async function (req, res, next) {
    try {
        let enteredName = req.body.enterName;
        let selectedLanguage = req.body.languageTypeRadio;
        if (enteredName === '' || enteredName === undefined) {
            req.flash('error', 'Please enter name');
        } else if (selectedLanguage === undefined) {
            req.flash('error', 'Please select language');
        }
        let displayGreeting = await useFactory.selectGreeting(enteredName, selectedLanguage);
        let counter = await useFactory.countNames();
        res.render('greetings', {displayGreeting: displayGreeting, counter: counter});
    } catch (err) {
        next(err.stack);
    }
});

app.get('/greeted', async function (req, res, next) {
    try {
        let usersGreeted = await useFactory.usersList();
        if (usersGreeted.length === 0) {
            req.flash('error', 'There is no users greeted!');
        }
        res.render('greeted', {usersGreeted: usersGreeted});
    } catch (err) {
        next(err.stack);
    }
});

app.get('/counter/:names', async function (req, res, next) {
    try {
        let name = req.params.names;
        let user = await useFactory.singleUserCounter(name);
        res.render('counter', {user});
    } catch (err) {
        next(err.stack);
    }
});

app.post('/clearTableData', async function (req, res, next) {
    try {
        await useFactory.clearData();
        res.redirect('/');
    } catch (err) {
        next(err.stack);
    }
});

app.get('/', async function (req, res, next) {
    try {
        let counter = await useFactory.countNames();
        res.render('home', {counter: counter});
    } catch (err) {
        next(err.stack);
    }
});

// port set-up
let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
