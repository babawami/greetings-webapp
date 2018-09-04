'use strict';
module.exports = function GreetingsRoutes (useFactory) {
    
    async function showGreetings (req, res, next) {
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
    }

    async function listNames (req, res, next) {
        try {
            let usersGreeted = await useFactory.usersList();
            if (usersGreeted.length === 0) {
                req.flash('error', 'There is no users greeted!');
            }
            res.render('greeted', {usersGreeted: usersGreeted});
        } catch (err) {
            next(err.stack);
        }
    }

    async function singleNamegreeted (req, res, next) {
        try {
            let name = req.params.names;
            let user = await useFactory.singleUserCounter(name);
            res.render('counter', {user});
        } catch (err) {
            next(err.stack);
        }
    }

    async function clearName (req, res, next) {
        try {
            await useFactory.clearData();
            res.redirect('/');
        } catch (err) {
            next(err.stack);
        }
    }

    async function landingRoute (req, res, next) {
        try {
            let counter = await useFactory.countNames();
            res.render('home', {counter: counter});
        } catch (err) {
            next(err.stack);
        }
    }

    return {
        showGreetings,
        listNames,
        singleNamegreeted,
        clearName,
        landingRoute
    };
};
