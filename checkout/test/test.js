var superagent = require('superagent');
var expect = require('expect.js');

const HOST = 'http://checkout.hamaca.io:8080';

describe('hamaca checkout microservice', function () {

    it('is online', function (done) {
        superagent
            .get(HOST)
            .end(function (e, res) {
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
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

});
