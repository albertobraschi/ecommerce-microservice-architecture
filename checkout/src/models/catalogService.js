var superagent = require('superagent');

// TODO move these to a configuration service
const CATALOG_SERVICE_HOST = 'http://catalog.hamaca.io:8080';
const PRODUCTS_ROUTE = '/products/';

var CatalogService = function (data) {
    this.data = data;
};

CatalogService.prototype.getProduct = function (id, done) {
    if (typeof id !== 'number') {
        throw 'id parameter should be a number';
    }
    superagent
        .get(CATALOG_SERVICE_HOST + PRODUCTS_ROUTE + id)
        .end(function (err, res) {
            if (res.statusCode == 200) {
                done(res.body);
            } else {
                throw 'Cannot fetch product';
            }
        });
};

CatalogService.prototype.getProducts = function (ids, done) {
    superagent
        .get(CATALOG_SERVICE_HOST + PRODUCTS_ROUTE)
        .query({
            ids: ids
        })
        .end(function (err, res) {
            if (res.statusCode == 200) {
                done(res.body);
            } else {
                throw 'Cannot fetch products';
            }
        });
};

module.exports = CatalogService;
