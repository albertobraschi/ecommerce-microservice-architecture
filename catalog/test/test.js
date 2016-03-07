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
        'Denmark. It is manufactured by Republic of Fritz Hansen.'
    };

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
            .query({
                id: id
            })
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
                for (var key in newProductData) {
                    expect(res.body[key]).to.eql(newProductData[key]);
                }
                done();
            });
    })
});
