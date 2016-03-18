var Redis = require("redis");

const HOST = 'checkout-data.hamaca.io';

const KEY_SEPARATOR = ':';

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

module.exports = DataStore;
