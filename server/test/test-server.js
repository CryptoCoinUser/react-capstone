process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../index');
const User = require('../models/user');
// import chai and declare a variable for should
const should = chai.should();
let accessToken;
chai.use(chaiHttp);

describe('Users', function() {
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

  });

  // Close server after these tests run in case
  // we have other test modules that need to 
  // call `runServer`. If server is already running,
  // `runServer` will error out.
  after(function() {
    User.remove({}, function(err) { 
      console.log('collection removed') 
    });
    return closeServer();
  });
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
    //app.get('/api/saveaddress/:address/:randomflag/:note',
    return chai.request(app)
      .get('/api/saveaddress/:address/:randomflag/:note')
      .set('Authorization', `Bearer ${accessToken}`)
      .then(function(res) {
        console.log('saveaddress res.body', res.body);
      })

  })
});