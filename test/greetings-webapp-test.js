'use strict';
let assert = require('assert');
let facFunction = require('../facFunction');

describe('Greetings function, be able to count number of people greeted', function () {
    it('It should return hello when English radio button selected ', function () {
        let greetingsFactory = facFunction();
        assert.strictEqual(greetingsFactory.selectGreeting('english', 'Andrew'), 'Hello, Andrew');
    });
    it('It should return Goeie dag when Afrikaans radio button selected ', function () {
        let greetingsFactory = facFunction();
        assert.strictEqual(greetingsFactory.selectGreeting('afrikaans', 'Andrew'), 'Goeie Dag, Andrew');
    });
    it('It should return Molo when Sesotho radio button selected ', function () {
        let greetingsFactory = facFunction();
        assert.strictEqual(greetingsFactory.selectGreeting('sotho', 'Andrew'), 'Dumela, Andrew');
    });
    it('should be able to add names to the object only once ', function () {
        let greetingsFactory = facFunction();
        greetingsFactory.selectGreeting('sotho', 'Andrew');
        greetingsFactory.selectGreeting('english', 'Tshepo');
        greetingsFactory.selectGreeting('english', 'Tshepo');
        assert.deepStrictEqual(greetingsFactory.returnMap(), {
            andrew: 0,
            tshepo: 0
        });
    });
    it('return number of the names in the map', function () {
        let greetingsFactory = facFunction();
        greetingsFactory.selectGreeting('sotho', 'Andrew');
        greetingsFactory.selectGreeting('english', 'Tshepo');
        greetingsFactory.selectGreeting('english', 'Tshepo');
        assert.strictEqual(greetingsFactory.countNames(), 2);
    });
    it('object should take in the input parameter from the factory function', function () {
        let map = {
            andrew: 0,
            tshepo: 0
        };
        let greetingsFactory = facFunction(map); // Instance
        assert.deepStrictEqual(greetingsFactory.returnMap(),
            {
                andrew: 0, tshepo: 0
            });
    });
});
