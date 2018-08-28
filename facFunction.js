'use strict';

module.exports = function (pool) {
    async function selectGreeting (name, typeOfLanguage) {
        if (typeOfLanguage !== undefined && name !== '') {
            let allowedChar = /^[a-zA-Z]+$/;
            // Run when the textField is filled
            if (name.match(allowedChar)) {
                name = name.charAt(0).toUpperCase() + name.slice(1);
                let checkName = await pool.query('SELECT 1 FROM users_greeted WHERE names =$1', [name]);

                if (checkName.rows.length === 0) {
                    await pool.query('INSERT INTO users_greeted(names,names_counter) VALUES($1,$2)', [name, 0]);
                }

                await pool.query('UPDATE users_greeted SET names_counter = names_counter+1 WHERE names = $1', [name]);

                if (typeOfLanguage === 'english') {
                    return 'Hello, ' + name;
                }

                if (typeOfLanguage === 'afrikaans') {
                    return 'Goeie Dag, ' + name;
                }

                if (typeOfLanguage === 'sotho') {
                    return 'Dumela, ' + name;
                }
            } else {
                return 'Please enter only letters';
            }
        }
    }

    async function countNames () {
        let counter = await pool.query('SELECT COUNT (names_counter) FROM users_greeted');
        return Number(counter.rows[0].count);
    }

    async function usersList () {
        let list = await pool.query('SELECT names FROM users_greeted ORDER BY names');
        return list.rows;
    }

    async function singleUserCounter (name) {
        let user = await pool.query('SELECT names, names_counter FROM users_greeted where names=$1', [name]);
        return user.rows[0];
    }

    async function clearData () {
        await pool.query(' DELETE FROM users_greeted ');
    }

    return {
        selectGreeting: selectGreeting,
        countNames: countNames,
        usersList: usersList,
        singleUserCounter: singleUserCounter,
        clearData: clearData
    };
};
