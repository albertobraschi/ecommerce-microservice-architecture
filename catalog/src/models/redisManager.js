var Product = require('../models/product');
var Redis = require("redis");

const KEY_SEPARATOR = ':';
const PRODUCT_PREFIX = 'product';
const NEXT_PRODUCT_ID_KEY = 'next_product_id';

var RedisManager = function () {
    this.redisClient = Redis.createClient({
        host: 'catalog-data.hamaca.io'
    });
    this.redisClient.on("error", function (err) {
        console.log("Redis Error: " + err);
    });
};

function checkErr(err) {
    if (err !== null) {
        throw err;
    }
}

RedisManager.prototype._updateExistingProduct = function (product, done) {
    var key = PRODUCT_PREFIX + KEY_SEPARATOR + product.data.id;
    this.redisClient.hmset(key,
        product.data, function (err, res) {
            checkErr(err);
            done();
        }.bind(this));
}

RedisManager.prototype._addNewProduct = function (product, done) {
    this.redisClient.incr(NEXT_PRODUCT_ID_KEY, function (err, reply) {
        checkErr(err);
        var productId = reply;
        product.data.id = productId;
        var key = PRODUCT_PREFIX + KEY_SEPARATOR + productId;
        this.redisClient.hmset(key,
            product.data, function (err, res) {
                checkErr(err);
                done(productId);
            }.bind(this));
    }.bind(this));   
}

RedisManager.prototype.saveProduct = function (product, done) {
    if (typeof product.data.id !== 'undefined') {
        this._updateExistingProduct(product, done);
    } else {
        this._addNewProduct(product, done);
    }
};

RedisManager.prototype.loadProduct = function (id, done) {
    if (typeof id !== 'number') {
        throw "Invalid id or id not set";
    }
    var key = PRODUCT_PREFIX + KEY_SEPARATOR + id;
    this.redisClient.hgetall(key, function (err, res) {
        var data = {};
        for (var key in res) {
            data[key] = res[key];
        }
        done(new Product(data));
    });
};

RedisManager.prototype.loadRange = function (startRange, endRange, done, dataOnly) {
    if (typeof startRange !== 'number' ||
            typeof endRange !== 'number' ||
            startRange < 1 ||
            endRange < startRange) {
        throw 'Invalid entity range';
    }
    var i = startRange;
    var products = [];
    this.getNumberOfProducts(function (numberOfProducts) {
        if (numberOfProducts < endRange) {
            endRange = numberOfProducts;
        }
        do {
            var key = PRODUCT_PREFIX + KEY_SEPARATOR + i;
            this.redisClient.hgetall(key, function (err, res) {
                if (res !== null) {
                    var productData = {};
                    for (var dataKey in res) {
                        productData[dataKey] = res[dataKey];
                    }
                    var product;
                    if (dataOnly) {
                        product = productData;
                    } else {
                        product = new Product(productData);
                    }
                    products.push(product);
                }
                if (products.length >= endRange) {
                    done(products);
                }
            });
            i++;
        } while (i <= endRange);
    }.bind(this))
};

RedisManager.prototype.getNumberOfProducts = function (done) {
    this.redisClient.get(NEXT_PRODUCT_ID_KEY, function (err, res) {
        done(res);
    });
}

module.exports = RedisManager;
