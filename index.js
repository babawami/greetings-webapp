'use strict';
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
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

app.post('/greeted', async function (req, res, next) {
    try {
        let enteredName = req.body.enterName;
        let selectedLanguage = req.body.languageTypeRadio;
        let displayGreeting = await useFactory.selectGreeting(enteredName, selectedLanguage);
        let counter = await useFactory.countNames();
        console.log(counter);
        res.render('greetings', {displayGreeting: displayGreeting, counter: counter});
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

// app.get('/greetings/:enterName/:selectedLanguage', function (req, res) {
//     let enteredName = req.params.enterName;
//     let selectedLanguage = req.params.languageTypeRadio;
//     let displayGreeting = useFactory.selectGreeting(selectedLanguage, enteredName);
//     let counter = useFactory.countNames();
//     console.log(enteredName);
//     console.log(selectedLanguage);
//     res.render('home', {
//         displayGreeting: displayGreeting,
//         counter: counter,
//         enteredName
//     });
// });

// port set-up
let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
