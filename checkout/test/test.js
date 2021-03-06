var superagent = require('superagent');
var expect = require('expect.js');

const HOST = 'http://checkout.microcommerce.test:8080';
const CHECKOUT_ROUTE = '/checkout/';
const SHIPPING_ROUTE = '/shipping/';

describe('hamaca checkout microservice', function () {

    var checkoutId;
    var cart = [
        {
            id: 1,
            quantity: 10
        },
        {
            id: 2,
            quantity: 5
        }
    ];

    var shippingData = {
        'full-name': 'Francis Urquhart',
        'address': '10 Downing St',
        'city': 'London',
        'postcode': 'SW1A 2AA',
        'country': 'GBR' // ISO 3166-1 alpha-2
    };

    var mandatoryFields  = Object.keys(shippingData);

    it('is online', function (done) {
        superagent
            .get(HOST)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.statusCode).to.eql(200);
                done();
            });
    });

    it('issues a 404 for invalid routes', function (done) {
        superagent
            .get(HOST + '/this_is_an_invalid_route')
            .end(function (err, res) {
                expect(res.statusCode).to.eql(404);
                done();
            });
    });

    it('starts a checkout process', function (done) {
        superagent
            .post(HOST + CHECKOUT_ROUTE)
            .send({
                cart: cart
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.statusCode).to.eql(201);
                checkoutId = res.body.id;
                expect(checkoutId).to.be.a('number');
                done();
            });
    });

    it('doesn\'t start a checkout process if the cart is empty', function (done) {
        superagent
            .post(HOST + CHECKOUT_ROUTE)
            .send({
                cart: []
            })
            .end(function (err, res) {
                expect(res.statusCode).to.eql(400);
                done();
            });
    });

    it('doesn\'t start a checkout process if the cart is missing', function (done) {
        superagent
            .post(HOST + CHECKOUT_ROUTE)
            .send({})
            .end(function (err, res) {
                expect(res.statusCode).to.eql(400);
                done();
            });
    });

    it('fetches a checkout', function (done) {
        superagent
            .get(HOST + CHECKOUT_ROUTE + checkoutId)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.statusCode).to.eql(200);
                expect(res.body.cart).to.eql(cart);
                done();
            });
    });

    it('accepts shipping data', function (done) {
        superagent
            .post(HOST + SHIPPING_ROUTE)
            .send({
                'checkout-id': checkoutId,
                'shipping': shippingData
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.statusCode).to.eql(200);
                done();
            });
    });

    it('correctly saves and fetches shipping data', function (done) {
        superagent
            .get(HOST + CHECKOUT_ROUTE + checkoutId)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.statusCode).to.eql(200);
                expect(res.body.shipping).to.eql(shippingData);
                done();
            });
    });

    it('doesn\'t accept incomplete shipping data', function (done) {
        var fieldToExclude = Math.floor((Math.random() * mandatoryFields.length));
        var brokenShipping = {};
        for (var i = 0; i < mandatoryFields.length; i++) {
            if (i !== fieldToExclude) {
                brokenShipping[mandatoryFields[i]] = shippingData[mandatoryFields[i]];
            }
        }
        superagent.post(HOST + SHIPPING_ROUTE)
            .send({
                'checkout-id': checkoutId,
                'shipping': brokenShipping
            })
            .end(function (e, res) {
                expect(res.statusCode).to.eql(400);
                done();
            });
    });
});
