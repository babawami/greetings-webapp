'use strict';
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const facFunction = require('./facFunction');
let useFactory = facFunction();
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

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/greetings', function (req, res) {
    let enteredName = req.body.enterName;
    let selectedLanguage = req.body.languageTypeRadio;
    let displayGreeting = useFactory.selectGreeting(selectedLanguage, enteredName);
    let counter = useFactory.countNames();
    // useFactory.selectGreeting(selectedLanguage, enteredName);
    console.log(enteredName);
    console.log(selectedLanguage);
    res.render('home', {displayGreeting: displayGreeting, counter: counter});
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
