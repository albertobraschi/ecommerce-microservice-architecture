var Product = require('../models/product');
var Redis = require("redis");

const KEY_SEPARATOR = ':';
const PRODUCT_PREFIX = 'product';

const NEXT_PRODUCT_ID_KEY = 'next_product_id';
const ACTIVE_PRODUCTS_LIST_KEY = 'active_products';

const PAGE_SIZE = 10;

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
            if (typeof done !== 'undefined') {
                done();
            }
        }.bind(this));
}

RedisManager.prototype._addNewProduct = function (product, done) {
    this.redisClient.incr(NEXT_PRODUCT_ID_KEY, function (err, res) {
        checkErr(err);
        var productId = res;
        product.data.id = productId;
        var key = PRODUCT_PREFIX + KEY_SEPARATOR + productId;
        this.redisClient.hmset(key,
            product.data, function (err, res) {
                checkErr(err);
                this.addActiveProduct(productId);
                done(productId);
            }.bind(this));
    }.bind(this));   
}

RedisManager.prototype.addActiveProduct = function (productId) {
    this.redisClient.rpush(ACTIVE_PRODUCTS_LIST_KEY, productId, checkErr);
}

RedisManager.prototype.removeActiveProduct = function (productId, done) {
    this.redisClient.lrem(ACTIVE_PRODUCTS_LIST_KEY, 1, productId, function (err, res) {
        var productNotfound = false;
        if (res === 0) {
            productNotfound = true;
        }
        checkErr(err);
        done(productNotfound);
    });
}

RedisManager.prototype.saveProduct = function (product, done) {
    if (typeof product.data.id !== 'undefined') {
        this._updateExistingProduct(product, done);
    } else {
        this._addNewProduct(product, done);
    }
};

RedisManager.prototype.loadProduct = function (id, done, onlyData) {
    if (typeof id !== 'number') {
        throw "Invalid id or id not set";
    }
    var key = PRODUCT_PREFIX + KEY_SEPARATOR + id;
    this.redisClient.hgetall(key, function (err, res) {
        var data = {};
        for (var key in res) {
            data[key] = res[key];
        }
        data.enabled = data.enabled === 'true' // TODO add product data sanitizer
        if (typeof onlyData !== 'undefined' && onlyData) {
            done(data);
        } else {
            done(new Product(data));
        }
    });
};

RedisManager.prototype.loadPage = function (page, done, dataOnly) {
    startRange = (page - 1) * PAGE_SIZE;
    endRange = page * PAGE_SIZE - 1;
    this.redisClient.lrange(ACTIVE_PRODUCTS_LIST_KEY, startRange, endRange, function (err, res) {
        checkErr(err);
        var products = [];
        for (var i = 0; i < res.length; i++) {
            this.loadProduct(parseInt(res[i]), function (product) {
                products.push(product);
                if (products.length >= res.length) {
                    done(products);
                }
            }.bind(this), true)
        }
    }.bind(this));
};

RedisManager.prototype.getNumberOfProducts = function (done) {
    this.redisClient.get(NEXT_PRODUCT_ID_KEY, function (err, res) {
        checkErr(err);
        done(res);
    });
}

module.exports = RedisManager;
