var superagent = require('superagent');
var expect = require('expect.js');
const HOST = 'http://catalog.hamaca.io:8080';

describe('hamaca catalog microservice', function () {

    var id;
    var newProductData = {
        title: 'Egg Chair',
        price: 666,
        sku: 'CHA-01',
        description: 'The Egg is a chair designed by Arne Jacobsen in 1958 for the Radisson SAS hotel in Copenhagen, ' +
        'Denmark. It is manufactured by Republic of Fritz Hansen.',
        foo: 'bar' // invalid key, should be ignored
    };

    var mandatoryFields  = ['title', 'price', 'sku', 'description'];

    it('is online', function (done) {
        superagent
            .get(HOST)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
                done();
            });
    });

    it('adds a new product', function (done) {
        superagent.post(HOST + '/products')
            .send(newProductData)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(201);
                id = res.body.id;
                expect(id).to.be.a('number');
                done();
            });
    });

    it('fetches a product', function (done) {
        superagent
            .get(HOST + '/products/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
                for (var i = 0; i < mandatoryFields.length; i++) {
                    expect(res.body[mandatoryFields[i]]).to.eql(newProductData[mandatoryFields[i]]);
                }
                done();
            });
    });

    it('doesn\'t save invalid fields', function (done) {
        superagent
            .get(HOST + '/products/' + id)
            .query({
                id: id
            })
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
                for (var key in newProductData) {
                    expect(res.body.foo).to.be(undefined);
                }
                done();
            });
    });

    it('updates a product', function (done) {
        superagent
            .patch(HOST + '/products/' + id)
            .send({
                title: 'Egg Chair!'
            })
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(204);
                done();
            });
    });

    it('fetches the updated product', function (done) {
        superagent
            .get(HOST + '/products/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
                expect(res.body.title).to.eql('Egg Chair!');
                done();
            });
    });

    it('doesn\'t save products with one of the mandatory fields missing', function (done) {
        var fieldToExclude = Math.floor((Math.random() * mandatoryFields.length));
        var brokenProduct = {};
        for (var i = 0; i < mandatoryFields.length; i++) {
            if (i !== fieldToExclude) {
                brokenProduct[mandatoryFields[i]] = newProductData[mandatoryFields[i]];
            }
        }
        superagent.post(HOST + '/products')
            .send(brokenProduct)
            .end(function (e, res) {
                expect(res.statusCode).to.eql(400);
                done();
            });
    });

    it('doesn\'t accept a price that is not a number', function (done) {
        var brokenProduct = {};
        for (var i = 0; i < mandatoryFields.length; i++) {
            brokenProduct[mandatoryFields[i]] = newProductData[mandatoryFields[i]];
        }
        brokenProduct.price = 'This is not a number';
        superagent.post(HOST + '/products')
            .send(brokenProduct)
            .end(function (e, res) {
                expect(res.statusCode).to.eql(400);
                done();
            });
    });

    it('lists the products', function (done) {
        superagent
            .get(HOST + '/products')
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
                expect(res.body.page).to.eql(1);
                expect(res.body.pages).to.be.greaterThan(0);
                expect(res.body.products).to.be.an('object');
                expect(res.body.products[0]).to.be.an('object');
                for (var i = 0; i < mandatoryFields.length; i++) {
                    expect(res.body.products[0][mandatoryFields[i]]).to.be.ok();
                }
                done();
            });
    });

    it('deletes a product', function (done) {
        superagent
            .delete(HOST + '/products/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(204);
                done();
            });
    });

    it('doesn\'t fetch deleted products', function (done) {
        superagent
            .get(HOST + '/products/' + id)
            .end(function (e, res) {
                expect(res.statusCode).to.eql(404);
                done();
            });
    });

    it('issues a 404 for invalid routes', function (done) {
        superagent
            .get(HOST + '/this_is_an_invalid_route')
            .end(function (e, res) {
                expect(res.statusCode).to.eql(404);
                done();
            });
    });

    it('issues a 404 when trying to delete a not existing product', function (done) {
        superagent
            .delete(HOST + '/products/' + '/this_is_an_invalid_route')
            .end(function (e, res) {
                expect(res.statusCode).to.eql(404);
                done();
            });
    });
});
