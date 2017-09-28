process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../index');
const User = require('../models/user');
// import chai and declare a variable for should
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe('Users', function() {
  
  let accessToken;
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    
    const testUserCredentials = {
      auth: {
        googleId: 'testGoogleId123',
        googleAccessToken: 'testGoogleAccessToken123'
      }, 
      addresses: []
    }

    return runServer()
      .then(() => {
      user = new User;
      user.auth.googleId = 'testGoogleId123';
      user.auth.googleAccessToken = 'testGoogleAccessToken123';
      user.address = [];
      return user.save()
        .then(newUser => {
          accessToken = newUser.auth.googleAccessToken;
          console.log('newUser', newUser);
        
        })
        .catch(err => {
          console.log('err', err);
        })
      })

  });//before

  // Close server after these tests run in case
  // we have other test modules that need to 
  // call `runServer`. If server is already running,
  // `runServer` will error out.
  after(function() {
    User.remove({}, function(err) { 
      console.log('collection removed') 
    });
    return closeServer();
  }); //after



  // `chai.request.get` is an asynchronous operation. When
  // using Mocha with async operations, we need to either
  // return an ES6 promise or else pass a `done` callback to the
  // test that we call at the end. We prefer the first approach, so
  // we just return the chained `chai.request.get` object.
  // it('should send an email on post', function() {
  //   return chai.request(app)
  //     .post('/api/webhook/1test/adkantor+reacttest@gmail.com')
  //     .then(function(res) {
  //       res.should.have.status(200);
  //       // res.should.be.json;
  //       // res.body.should.be.a('array');
  //       // res.body.length.should.be.above(0);
  //       // res.body.forEach(function(item) {
  //       //   item.should.be.a('object');
  //       //   item.should.have.all.keys(
  //       //     'id', 'firstName', 'lastName', 'birthYear');
  //       // });
  //     });
  // });




  it('should test saveaddress to db', function(){
    return chai.request(app)
      .get('/api/saveaddress/:address/:randomflag/:note')
      .set('Authorization', `Bearer ${accessToken}`)
      .then(function(res) {
        //console.log('saveaddress res.body should be addressObj', res.body);
        res.should.have.status(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.address).to.equal(':address');
        expect(res.body.recentTxn).to.equal('warning: addrRes has neither unconfirmed_txrefs nor txrefs');
        expect(res.body.random).to.equal(':randomflag');
        expect(res.body.note).to.equal(':note');
        expect(res.body.confirmations).to.equal(-1);
        expect(res.body.lastUpdated).to.be.a('Number');
      })//return
  })//saveaddress



  it('should test refreshaddress', function(){
  return chai.request(app)
    .get('/api/refreshaddress/:address/:recenttxn')
    .set('Authorization', `Bearer ${accessToken}`)
    .then(function(res) {
      //console.log('refreshaddress res.body should be an array of addressObjs', res.body);
      res.should.have.status(200);
      expect(res.body).to.be.a('Array');
      expect(res.body).length.to.be.at.least(1);
      expect(res.body[0]).to.be.a('Object');
      expect(res.body[0].address).to.equal(':address');
      expect(res.body[0].note).to.equal(':note');
      expect(res.body[0].random).to.equal(true);
      expect(res.body[0].recentTxn).to.equal('warning: addrRes has neither unconfirmed_txrefs nor txrefs');
      expect(res.body[0].confirmed).to.equal(false);
      expect(res.body[0].balance).to.equal(-21000000);
      expect(res.body[0].unconfirmed_balance).to.equal(-21000000);
      expect(res.body[0].savedOn).to.be.a('String');
      expect(res.body[0].lastUpdated).to.be.a('String');
    }) //return

  })//refreshaddress



  it('should test [refresh all] addresses', function(){
    return chai.request(app)
      .get('/api/addresses/')
      .set('Authorization', `Bearer ${accessToken}`)
      .then(function(res) {
      //console.log('addresses res.body.addressesInfo should be an array of addressObjs', res.body);
      res.should.have.status(200);
      expect(res.body).to.be.a('Object');
      expect(res.body.addressesInfo).to.be.a('Array');
      //expect(res.body.addressesInfo).length.to.be.at.least(1); /*fails when deleteaddress runs first - if the other promises are taking too */
      expect(res.body.addressesInfo[0]).to.be.a('Object');
      expect(res.body.addressesInfo[0].address).to.equal(':address');
      expect(res.body.addressesInfo[0].note).to.equal(':note');
      expect(res.body.addressesInfo[0].random).to.equal(true);
      expect(res.body.addressesInfo[0].recentTxn).to.equal('warning: addrRes has neither unconfirmed_txrefs nor txrefs');
      expect(res.body.addressesInfo[0].confirmed).to.equal(false);
      expect(res.body.addressesInfo[0].balance).to.equal(-21000000);
      expect(res.body.addressesInfo[0].unconfirmed_balance).to.equal(-21000000);
      expect(res.body.addressesInfo[0].savedOn).to.be.a('String');
      expect(res.body.addressesInfo[0].lastUpdated).to.be.a('String');
    })//return
  })//addresses

  it('should test deleteaddress ', function(){
    return chai.request(app)
      .get('/api/deleteaddress/:address/:optionalwebhookid')
      .set('Authorization', `Bearer ${accessToken}`)
      .then(function(res) {
        console.log('deleteaddress res.body should be the address', res.body);
        res.should.have.status(200);
        expect(res.body.address).to.equal(':address');
      })//return
  })//deleteaddress

});//describe