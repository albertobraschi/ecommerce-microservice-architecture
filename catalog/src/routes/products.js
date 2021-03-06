var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var DataStore = require('../models/dataStore');

/*
 * Add a new product
 */
router.post('/', function (req, res) {
    var productData = {
        title: req.body.title,
        price: req.body.price,
        sku: req.body.sku,
        description: req.body.description,
        enabled: true
    };
    var dataStore = new DataStore();
    var product = new Product(productData);

    if (product.validate()) {
        product.save(dataStore, function (productId) {
            res.status(201);
            res.json({id: productId});
        });
    }
    else {
        res.status(400);
        res.send('Error: Invalid product data');
    }
});

/*
 * Get a product
 */
router.get('/:id', function (req, res) {
    var dataStore = new DataStore();
    var productId = parseInt(req.params['id']);
    if (isNaN(productId)) {
        throw 'Invalid id';
    }
    var product = dataStore.loadProduct(productId, function (product) {
        if (product.data.enabled) {
            res.status(200);
            res.json(product.data);
        }
        else {
            res.sendStatus(404);
        }
    });
});

/*
 * Update a product
 */
router.patch('/:id', function (req, res) {
    var acceptedKeys = ['title', 'price', 'sku', 'description'];
    var id = parseInt(req.params['id']);

    var dataStore = new DataStore();
    dataStore.loadProduct(id, function (product) {
        for (var i = 0; i < acceptedKeys.length; i++) {
            updatedValue = req.body[acceptedKeys[i]];
            if (typeof updatedValue !== 'undefined') {
                product.data[acceptedKeys[i]] = updatedValue;
            }
        }
        product.save(dataStore, function (productId) {
            res.sendStatus(204);
        })
    })
});

/*
 * Get multiple products
 */
router.get('/', function (req, res) {
    var dataStore = new DataStore();
    if (typeof req.query.page !== 'undefined') {
        var page = parseInt(req.query.page);
        dataStore.loadPage(page, function (products) {
            res.status(200);
            var response = {
                page: page,
                pages: 1,
                products: products
            };
            res.json(response);
        }, true);
    } else if (typeof req.query.ids !== 'undefined') {
        var ids = req.query.ids.split(';');
        dataStore.loadProducts(ids, function (products) {
            res.status(200);
            res.json(products);
        }, true)
    }
    else {
        res.sendStatus(400);
    }
});

/*
 * Delete (soft) a product
 */
router.delete('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    var dataStore = new DataStore();
    dataStore.removeActiveProduct(id, function (productNotfound) {
        if (productNotfound) {
            res.sendStatus(404);
        } else {
            dataStore.loadProduct(id, function (product) {
                product.data.enabled = false;
                product.save(dataStore, function () {
                    res.sendStatus(204);
                });
            })
        }
    })
});

module.exports = router;
