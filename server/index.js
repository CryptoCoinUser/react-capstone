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
const DATABASE_URL = process.env.DBURL || 'mongodb://localhost/reactCapstone';

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
        clientSecret: process.env.SECRET,
        callbackURL: `/api/auth/google/callback`

    },
    (accessToken, refreshToken, profile, cb) => {
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

app.get('/api/saveaddress/:address/:randomflag/:note',
     passport.authenticate('bearer', {session: false}),
      (req, res) => {
        request(`https://api.blockcypher.com/v1/btc/main/addrs/${req.params.address}?token=${process.env.BLOCKCYPHERTOKEN}`, (err, data) => {
            const addrRes = JSON.parse(data.body);
            // build object that is being pushed in
            const addressObj = {
                address: addrRes.address,
                balance: addrRes.balance,
                unconfirmed_balance: addrRes.unconfirmed_balance,
                recentTxn: -1,               
                random: `${req.params.randomflag}`,
                note: `${req.params.note}`,
                lastUpdated: Date.now()
            }
            // assume "the" txn is the first one in unconfirmed_txrefs, or if there aren't any unconfirmed_txrefs, the first one in txrefs.
            if(addrRes.unconfirmed_txrefs){
                addressObj.recentTxn  = addrRes.unconfirmed_txrefs[0].tx_hash;
                addressObj.preference = addrRes.unconfirmed_txrefs[0].preference;
            } else if (addrRes.txrefs){
               addressObj.recentTxn = addrRes.txrefs[0].tx_hash;
               addressObj.confirmations = addrRes.txrefs[0].confirmations;
               addressObj.confirmed = true;
            }

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


app.get('/api/addresses',
    passport.authenticate('bearer', {session: false}),
    
    (req, res) => {
        User.findOne({'auth.googleId': req.user.auth.googleId},
                (err, user) => {
                    if (err) throw err;

                    const promises = user.addresses.map(addressObj => {
                        return new Promise(resolve => {
                            request(`https://api.blockcypher.com/v1/btc/main/addrs/${addressObj.address}/?token=${process.env.BLOCKCYPHERTOKEN}`, (err, data) => {
                                const addrRes = JSON.parse(data.body);
                                if(addrRes.error) {
                                    resolve(addressObj);
                                }else{
                                    /* find recentTxn in either unconfirmed_txrefs or txrefs; 
                                          if it's in unconfirmed_txrefs, get miner preference (high/low/medium)
                                          XOR if it's in txrefs, get the number of confirmations
                                    */
                                    if(addrRes.unconfirmed_n_tx){
                                        for (i = 0; i < addrRes.unconfirmed_n_tx; i++){
                                            if(addrRes.unconfirmed_txrefs[i].tx_hash == addressObj.recentTxn){
                                                addressObj.preference = addrRes.unconfirmed_txrefs[i].preference;
                                            }
                                        }
                                    }
                                    if(addrRes.n_tx){
                                        for (i = 0; i < addrRes.n_tx; i++){
                                            if(addrRes.txrefs[i].tx_hash == addressObj.recentTxn){
                                                addressObj.confirmations = addrRes.txrefs[i].confirmations;
                                                addressObj.confirmed = true;
                                            }
                                        }
                                    }

                                    addressObj.balance = addrRes.balance;
                                    addressObj.unconfirmed_balance = addrRes.unconfirmed_balance;
                                    addressObj.lastUpdated = Date.now();
                                    resolve(addressObj);
                                }
                            })
                        })
                    })

                    Promise.all(promises).then(allAddressesData => {
                        User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken},
                            {$set: {'addresses': allAddressesData}},
                            {new: true},
                            (err, user) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            res.json({addressesInfo: user.addresses})
                        })
 
                    })
                })       
});

app.post('/api/webhook/', (req, res) => {
    console.log("REQUEST", req);
})

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
