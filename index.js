'use strict';
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const facFunction = require('./facFunction');
const Greet = require('./greetings-routes');
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
const greetUser = Greet(useFactory);

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

app.post('/greet', greetUser.showGreetings);

app.get('/greeted', greetUser.listNames);

app.get('/counter/:names', greetUser.singleNamegreeted);

app.post('/clearTableData', greetUser.clearName);

app.get('/', greetUser.landingRoute);

// port set-up
let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
