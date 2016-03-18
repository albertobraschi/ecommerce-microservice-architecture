var superagent = require('superagent');
var expect = require('expect.js');

const HOST = 'http://checkout.hamaca.io:8080';
const CHECKOUT_ROUTE = '/checkout/';

describe('hamaca checkout microservice', function () {

    var orderId;
    var order = [
        {
            id: 1,
            quantity: 10
        },
        {
            id: 1,
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
            .send(order)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.statusCode).to.eql(201);
                orderId = res.body.id;
                expect(orderId).to.be.a('number');
                done();
            });
    })
});
