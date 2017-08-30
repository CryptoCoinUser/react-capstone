    require('dotenv').config();

const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const BodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.Promise = global.Promise;
const DATABASE_URL = 'mongodb://localhost/reactCapstone';

//const secret = require('./secret');

const app = express();
app.use(BodyParser.json());


app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


passport.use(
    new GoogleStrategy({
        clientID:  '956789487424-b1hntk8in8rj8j3tn36ji41m919i21oc.apps.googleusercontent.com',
        clientSecret: process.env.secret,
        callbackURL: `/api/auth/google/callback`
    },
    (accessToken, refreshToken, profile, cb) => {
        // Job 1: Set up Mongo/Mongoose, create a User model which store the
        // google id, and the access token
        // Job 2: Update this callback to either update or create the user
        // so it contains the correct access token
   
        // create user
        User.findOne({'auth.googleId': profile.id}, (err, user) => {
            if (err) return cb(err);

            if (user) {
                user.auth.googleAccessToken = accessToken;
                user.save(err => cb(null, user));
            } else {
                const newUser = new User();
                newUser.auth.googleId = profile.id;
                newUser.auth.googleAccessToken = accessToken;
                newUser.addresses = [];

                //console.log(newUser);
                //save newUser
                newUser.save(err => {
                    if(err){
                        throw err;
                    }
                    return cb(null, newUser);
                })

            }
        })
    }
));

passport.use(
    new BearerStrategy(
        (token, cb) => {
            // Job 3: Update this callback to try to find a user with a 
            // matching access token.  If they exist, let em in, if not,
            // don't.

            // console.log('Bearer token is ' + token)

            // look up token in user model
            User.findOne({'auth.googleAccessToken': token}, (err, user) => {

                // console.log('found USER ' + user)
                if(err) return cb(null, false);
                return cb(null, user);
            })
        }
    )
);

app.get('/api/auth/google',
    passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false
    }),
    (req, res) => {
        res.cookie('accessToken', req.user.auth.googleAccessToken, {expires: 0});
        res.redirect('/');
    }
);

app.get('/api/auth/logout',
    passport.authenticate('bearer', {session: false}),
    (req, res) => {
    // remove access token from db
    User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken}, 
                            {$set: {'auth.googleAccessToken': ""}},
                            (err, user) => {
                                if (err) throw err;
                                req.logout();
                                res.clearCookie('accessToken');
                                res.redirect('/');
                        })
});

app.get('/api/saveaddress/:address/:randomflag',
     passport.authenticate('bearer', {session: false}),
      (req, res) => {
        request(`https://api.blockcypher.com/v1/btc/main/addrs/${req.params.address}/balance`, (err, data) => {
            const addressData = JSON.parse(data.body);
            // build object that is being pushed in
            const addressObj = {
                address: addressData.address,
                balance: addressData.balance,
                unconfirmed_balance: addressData.unconfirmed_balance,
                random: `${req.params.randomflag}`
            }
            console.log('/api/saveaddress/ addressObj:', addressObj)

            User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken}, 
                {$push: {'addresses': addressObj}}, 
                {new: true},
                (err, user) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    res.send(addressObj)
            })
        })
});

app.get('/api/deleteaddress/:address',
    passport.authenticate('bearer', {session: false}),
        (req, res) => {
            console.log("/api/deleteaddress/:address, req.params.address:", req.params.address);
            User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken}, 
                {$pull: {'addresses': {address: req.params.address}}},
                (err, user) => {
                    if (err) throw err;
                    
                    res.send(req.params.address)
            })


});

app.get('/api/isuserloggedin',
    passport.authenticate('bearer', {session: false}),
    (req, res) => res.json({
        googleId: req.user.auth.googleId
    })
);

// app.post('/api/saveaddress/:address',
//     passport.authenticate('bearer', {session: false}),
//     (req, res) => {
//         console.log('it works!')
//     }
// );

app.get('/api/addresses',
    passport.authenticate('bearer', {session: false}),
    
    (req, res) => {
        
        // go to db and get all addresses
        // User.find();

        User.findOne({'auth.googleId': req.user.auth.googleId},
                (err, user) => {
                    if (err) throw err;

                    const promises = user.addresses.map(addressObj => {
                        return new Promise(resolve => {
                            request(`https://api.blockcypher.com/v1/btc/main/addrs/${addressObj.address}/balance`, (err, data) => {
                                resolve(JSON.parse(data.body));
                            })
                        })
                    })


                    Promise.all(promises).then(data => {
                        const addressesInfo = data.map(addressInfo => {
                            return {
                                address: addressInfo.address,
                                balance: addressInfo.balance,
                                unconfirmed_balance: addressInfo.unconfirmed_balance
                            }
                        })
                        res.json({addressesInfo})
                    })

                    



                    
                })
        
});


// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001) {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, error => {
            if(error) reject();
            server = app.listen(port, () => {
                resolve();
            }).on('error', () => {
                mongoose.disconnect();
                reject();
            });  
        })
        
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
            mongoose.disconnect();
            resolve();
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
