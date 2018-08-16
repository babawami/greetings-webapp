'use strict';

module.exports = function (storedUsers) {
    // letiables
    let EnterName = '';
    let namesGreeted = {};
    // object takes in the latest input and stored.
    if (storedUsers) {
        namesGreeted = storedUsers;
    }

    function selectGreeting (typeOfLanguage, name) {
        if (typeOfLanguage !== undefined && name !== '') {
            let allowedChar = /^[a-zA-Z]+$/;
            // Run when the textField is filled
            if (name.match(allowedChar)) {
                EnterName = name.toLowerCase();
                // when the greet button is pressed check if this user was already greeted before
                // by looking if the userName exists in namesGreeted if not increment this counter and update the screen
                if (namesGreeted[EnterName] === undefined) {
                    // add an entry for the user that was greeted in the Object Map
                    namesGreeted[EnterName] = 0;
                }

                if (typeOfLanguage === 'english') {
                    return 'Hello, ' + name.charAt(0).toUpperCase() + name.slice(1);
                }

                if (typeOfLanguage === 'afrikaans') {
                    return 'Goeie Dag, ' + name.charAt(0).toUpperCase() + name.slice(1);
                }

                if (typeOfLanguage === 'sotho') {
                    return 'Dumela, ' + name.charAt(0).toUpperCase() + name.slice(1);
                }
            } else {
                return 'Please enter letters only';
            }
        } else {
            return 'Please enter name or select language';
        }
    }

    function countNames () {
        return Object.keys(namesGreeted).length;
    }

    function returnMap () {
        return namesGreeted;
    }

    function resetStorage () {
        namesGreeted = {};
        return namesGreeted;
    }

    return {
        resetStorage: resetStorage,
        returnMap: returnMap,
        selectGreeting: selectGreeting,
        countNames: countNames
    };
};
