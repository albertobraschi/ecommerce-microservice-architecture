var superagent = require('superagent');
var expect = require('expect.js');

const HOST = 'http://checkout.hamaca.io:8080';
const CHECKOUT_ROUTE = '/checkout/';

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
        superagent.post(HOST + CHECKOUT_ROUTE)
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
        superagent.post(HOST + CHECKOUT_ROUTE)
            .send({
                cart: []
            })
            .end(function (err, res) {
                expect(res.statusCode).to.eql(400);
                done();
            });
    });

    it('doesn\'t start a checkout process if the cart is missing', function (done) {
        superagent.post(HOST + CHECKOUT_ROUTE)
            .send({})
            .end(function (err, res) {
                expect(res.statusCode).to.eql(400);
                done();
            });
    });

    it('fetches a checkout', function (done) {
        superagent
            .get(HOST + CHECKOUT_ROUTE + checkoutId)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
                expect(res.body.cart).to.be.an('object');
                done();
            });
    });
});
