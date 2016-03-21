var superagent = require('superagent');

// TODO move these to a configuration service
const CATALOG_SERVICE_HOST = 'http://catalog.hamaca.io:8080';
const PRODUCTS_ROUTE = '/products/';

var CatalogService = function (data) {
    this.data = data;
};

CatalogService.prototype.getProduct = function (productId, done) {
    superagent
        .get(CATALOG_SERVICE_HOST + PRODUCTS_ROUTE + 1)
        .end(function (err, res) {
            if (res.statusCode == 200) {
                done(res.body);
            } else {
                throw 'Cannot fetch product';
            }
        });
};

module.exports = CatalogService;
