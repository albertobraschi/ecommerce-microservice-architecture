var superagent = require('superagent')
var expect = require('expect.js')
const HOST = 'http://catalog.hamaca.io';

describe('hamaca catalog microservice', function(){
  var id

  it('adds a new product', function(done) {
    superagent.post(HOST + '/products')
      .send({
        title: 'Egg Chair',
        price: 666,
        sku: 'CHA-01',
        description: 'The Egg is a chair designed by Arne Jacobsen in 1958 for the Radisson SAS hotel in Copenhagen, Denmark. It is manufactured by Republic of Fritz Hansen.'
      })
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.statusCode).to.eql(201)
        //expect(res.body[0]._id.length).to.eql(24)
        //id = res.body[0]._id
        done()
      })
  })

})