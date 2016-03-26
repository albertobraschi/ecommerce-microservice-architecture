var Redis = require("redis");
var Checkout = require('../models/checkout');

const HOST = 'checkout-data.hamaca.io';

const KEY_SEPARATOR = ':';
const CHECKOUT_PREFIX = 'checkout'

const NEXT_CHECKOUT_ID_KEY = 'next_checkout_id';

var DataStore = function () {
    this.redisClient = Redis.createClient({
        host: HOST
    });
    this.redisClient.on("error", function (err) {
        throw "Redis Error: " + err;
    });
};

function checkErr(err) {
    if (err !== null) {
        throw err;
    }
}

function objectToString(object) {
    return JSON.stringify(object);
}

function stringToObject(string) {
    return JSON.parse(string);
}

DataStore.prototype._updateExistingCheckout = function (checkout, done) {
    var checkoutId = checkout.id;
    // TODO move to a separate function
    var checkoutKey = CHECKOUT_PREFIX + KEY_SEPARATOR + checkoutId;
    var checkoutString = objectToString(checkout);
    this.redisClient.set(checkoutKey,
        checkoutString, function (err, res) {
            checkErr(err);
            done(checkoutId);
        }.bind(this));
};

DataStore.prototype._addNewCheckout = function (checkout, done) {
    this.redisClient.incr(NEXT_CHECKOUT_ID_KEY, function (err, res) {
        checkErr(err);
        var checkoutId = res;
        checkout.id = checkoutId;
        // TODO move to a separate function
        var checkoutKey = CHECKOUT_PREFIX + KEY_SEPARATOR + checkoutId;
        var checkoutString = objectToString(checkout);
        this.redisClient.set(checkoutKey,
            checkoutString, function (err, res) {
                checkErr(err);
                done(checkoutId);
            }.bind(this));
    }.bind(this));   
};

DataStore.prototype.loadCheckout = function (id, done, dataOnly) {
    if (typeof id !== 'number') {
        throw "Invalid id or id not set";
    }
    var checkoutKey = CHECKOUT_PREFIX + KEY_SEPARATOR + id;
    this.redisClient.get(checkoutKey, function (err, res) {
        checkErr(err);
        if (res === null) {
            done(null);
        }
        else {
            var checkout = stringToObject(res);
            if (typeof dataOnly !== 'undefined' && dataOnly) {
                done(checkout);
            } else {
                done(new Checkout(checkout.cart));
            }
        }
    });
};

DataStore.prototype.saveCheckout = function (checkout, done) {
    if (typeof checkout.id !== 'undefined') {
        this._updateExistingCheckout(checkout, done);
    } else {
        this._addNewCheckout(checkout, done);
    }
};

module.exports = DataStore;
