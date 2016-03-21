var Product = require('../models/product');
var Redis = require("redis");

const HOST = 'catalog-data.hamaca.io';

const KEY_SEPARATOR = ':';
const PRODUCT_PREFIX = 'product';

const NEXT_PRODUCT_ID_KEY = 'next_product_id';
const ACTIVE_PRODUCTS_LIST_KEY = 'active_products';

const PAGE_SIZE = 10;

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

DataStore.prototype._updateExistingProduct = function (product, done) {
    var key = PRODUCT_PREFIX + KEY_SEPARATOR + product.data.id;
    this.redisClient.hmset(key,
        product.data, function (err, res) {
            checkErr(err);
            if (typeof done !== 'undefined') {
                done();
            }
        }.bind(this));
}

DataStore.prototype._addNewProduct = function (product, done) {
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

DataStore.prototype.addActiveProduct = function (productId) {
    this.redisClient.rpush(ACTIVE_PRODUCTS_LIST_KEY, productId, checkErr);
}

DataStore.prototype.removeActiveProduct = function (productId, done) {
    this.redisClient.lrem(ACTIVE_PRODUCTS_LIST_KEY, 1, productId, function (err, res) {
        var productNotfound = false;
        if (res === 0) {
            productNotfound = true;
        }
        checkErr(err);
        done(productNotfound);
    });
}

DataStore.prototype.saveProduct = function (product, done) {
    if (typeof product.data.id !== 'undefined') {
        this._updateExistingProduct(product, done);
    } else {
        this._addNewProduct(product, done);
    }
};

DataStore.prototype.loadProduct = function (id, done, dataOnly) {
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
        if (typeof dataOnly !== 'undefined' && dataOnly) {
            done(data);
        } else {
            done(new Product(data));
        }
    });
};

DataStore.prototype.loadMultipleProducts = function (ids, done, dataOnly) {
    if ([].constructor === Array) {
        throw "'ids' parameter must be an array";
    }
    var products = [];
    for (var i = 0; i < ids.length; i++) {
        this.loadProduct(parseInt(ids[i]), function (product) {
            products.push(product);
            if (products.length >= ids.length) {
                done(products);
            }
        }.bind(this), true)
    }
};

DataStore.prototype.loadPage = function (page, done, dataOnly) {
    startRange = (page - 1) * PAGE_SIZE;
    endRange = page * PAGE_SIZE - 1;
    this.redisClient.lrange(ACTIVE_PRODUCTS_LIST_KEY, startRange, endRange, function (err, res) {
        checkErr(err);
        this.loadMultipleProducts(res, done, dataOnly);
    }.bind(this));
};

DataStore.prototype.getNumberOfProducts = function (done) {
    this.redisClient.get(NEXT_PRODUCT_ID_KEY, function (err, res) {
        checkErr(err);
        done(res);
    });
}

module.exports = DataStore;
