'use strict';
let assert = require('assert');
let facFunction = require('../facFunction');
const pg = require('pg');
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/users';

const pool = new Pool({
    connectionString
});

describe('Greetings function, be able to count number of people greeted', function () {
    beforeEach(async function () {
        await pool.query('delete from users_greeted');
    });

    it('It should return hello when English radio button selected ', async function () {
        let greetingsFactory = facFunction(pool);
        assert.strictEqual(await greetingsFactory.selectGreeting('Andrew', 'english'), 'Hello, Andrew');
    });
    it('It should return Goeie dag when Afrikaans radio button selected ', async function () {
        let greetingsFactory = facFunction(pool);
        assert.strictEqual(await greetingsFactory.selectGreeting('Andrew', 'afrikaans'), 'Goeie Dag, Andrew');
    });
    it('It should return Dumela when Sesotho radio button selected ', async function () {
        let greetingsFactory = facFunction(pool);
        assert.strictEqual(await greetingsFactory.selectGreeting('Andrew', 'sotho'), 'Dumela, Andrew');
    });
    it('It should return not error message when enterd name has other characters besides letters ', async function () {
        let greetingsFactory = facFunction(pool);
        assert.strictEqual(await greetingsFactory.selectGreeting('4Andrew', 'sotho'), 'Please enter only letters');
    });
    it('It should return all the names that have been greeted ', async function () {
        let greetingsFactory = facFunction(pool);

        await greetingsFactory.selectGreeting('Andrew', 'sotho');
        await greetingsFactory.selectGreeting('Anele', 'sotho');
        await greetingsFactory.selectGreeting('Anele', 'sotho');

        let users = await greetingsFactory.usersList();
        assert.equal('Anele', users[1].names);
        assert.equal('Andrew', users[0].names);
    });

    it('It should return number of people greeted ', async function () {
        let greetingsFactory = facFunction(pool);

        await greetingsFactory.selectGreeting('Andrew', 'sotho');
        await greetingsFactory.selectGreeting('Anele', 'sotho');
        await greetingsFactory.selectGreeting('Anale', 'sotho');
        let greetCount = await greetingsFactory.countNames();

        assert.equal(3, greetCount);
    });

    it('It should return only one person that has been greeted and show how many times that person has been greeted', async function () {
        let greetingsFactory = facFunction(pool);

        await greetingsFactory.selectGreeting('Andrew', 'sotho');
        await greetingsFactory.selectGreeting('Andrew', 'sotho');
        await greetingsFactory.selectGreeting('Andrew', 'sotho');
        await greetingsFactory.selectGreeting('Tshepo', 'sotho');
        let updateNameCount = await greetingsFactory.singleUserCounter('Andrew');

        assert.deepEqual({ names: 'Andrew', names_counter: 3 }, updateNameCount);
    });

    after(function () {
        pool.end();
    });
});
