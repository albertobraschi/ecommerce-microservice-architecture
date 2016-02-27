var superagent = require('superagent');
var expect = require('expect.js');
const HOST = 'http://catalog.hamaca.io:8080';

describe('hamaca catalog microservice', function () {

    var id;

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
        var postData = {
            title: 'Egg Chair',
            price: 666,
            sku: 'CHA-01',
            description: 'The Egg is a chair designed by Arne Jacobsen in 1958 for the Radisson SAS hotel in Copenhagen, Denmark. It is manufactured by Republic of Fritz Hansen.'
        };
        superagent.post(HOST + '/products')
            .send(postData)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(201);
                id = res.body[0].id;
                expect(id).to.be.a('number');
                for (var key in postData) {
                    expect(res.body[0].key).to.eql(postData[key]);
                }
                done();
            });
    });
});
