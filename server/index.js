require('dotenv').config();
//require("babel-polyfill");
const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const BodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
const User = require('./models/user');
const { sendEmail } = require('./emailer')

const bcypher = require('blockcypher');

var bcapi = new bcypher('btc','main', process.env.BLOCKCYPHERTOKEN);

mongoose.Promise = global.Promise;
const { DATABASE_URL } = require('./config')

const { txRefreshFromAddrRes, getAddrValueFromTxRes, chooseRecentTx } = require('./helpers')

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

app.get('/api/refreshaddress/:address/:recenttxn',
    passport.authenticate('bearer', {session: false}),
    (req, res) => {
        const address = req.params.address; 
        request(`https://api.blockcypher.com/v1/btc/main/addrs/${address}?token=${process.env.BLOCKCYPHERTOKEN}`, (err, data) => {
            const addrRes = JSON.parse(data.body);

            const {balance, unconfirmed_balance} = addrRes;

            const toUpdate = {
                'addresses.$.balance': balance || -21000000,
                'addresses.$.unconfirmed_balance': unconfirmed_balance || -21000000,
                'addresses.$.lastUpdated': Date.now(),
                'addresses.$.confirmed': undefined,
                'addresses.$.confirmations': -1,
            }

            const txReport = txRefreshFromAddrRes(req.params.recenttxn, addrRes);

            if(txReport.confirmed == true){
                toUpdate['addresses.$.confirmed'] = true;
                toUpdate['addresses.$.confirmations'] = txReport.confirmations;
            }
            
            User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken, 'addresses.address': address},
                {$set: toUpdate}, {new: true},
                    (err, user) => {
                        if(err) throw err;
                        res.send(user.addresses);
                } 
            )

        })
 
})

app.get('/api/saveaddress/:address/:randomflag/:note',
     passport.authenticate('bearer', {session: false}),
      (req, res) => {
        request(`https://api.blockcypher.com/v1/btc/main/addrs/${req.params.address}?token=${process.env.BLOCKCYPHERTOKEN}`, (err, data) => {
            const addrRes = JSON.parse(data.body);
            const recentTxn = chooseRecentTx(addrRes);
            const txReport = txRefreshFromAddrRes(recentTxn, addrRes);
            // build object that is being pushed in
            const addressObj = {
                address: addrRes.address || `${req.params.address}`,
                balance: addrRes.balance,
                unconfirmed_balance: addrRes.unconfirmed_balance,
                recentTxn: recentTxn,               
                random: `${req.params.randomflag}`,
                note: `${req.params.note}`,
                preference: txReport.preference,
                confirmations: txReport.confirmations,
                confirmed: txReport.confirmed,
                lastUpdated: Date.now()
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
                            request(`https://api.blockcypher.com/v1/btc/main/addrs/${addressObj.address}?token=${process.env.BLOCKCYPHERTOKEN}`, (err, data) => {
                                const addrRes = JSON.parse(data.body);
                                if(addrRes.error) {
                                    resolve(addressObj);
                                }else{
                                    if(addressObj.recentTxn == -1){
                                        addressObj.recentTxn = chooseRecentTx(addrRes);
                                    }
                                    const txReport = txRefreshFromAddrRes(addressObj.recentTxn, addrRes);
                                    addressObj.preference = txReport.preference;
                                    addressObj.confirmations = txReport.confirmations;
                                    addressObj.confirmed = txReport.preference;
                                       
                                    addressObj.balance = addrRes.balance;
                                    addressObj.unconfirmed_balance = addrRes.unconfirmed_balance;
                                    addressObj.lastUpdated = Date.now();
                                    resolve(addressObj);
                                }//else
                            })//request
                        })//return
                    })//promises

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

app.get('/api/saveorupdateemail/:email', 
    passport.authenticate('bearer', {session: false}),
    (req, res) => {
        User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken}, 
        {$set: {'email': `${req.params.email}`}}, 
        {new: true},
        (err, user) => {
            if (err) {
                console.log(err);
                throw err;
            }
            res.send(`${req.params.email}`);
    })
})

//RESPOND TO WEBHOOK PING FROM BLOCKCYPHER
app.post('/api/webhook/:address/:email', (req, res) => {
    //console.log('/api/webhook/:email req.body', req.body)
    //const txAddresses = req.body.addresses.join("<br>");
    const theAddress = req.params.address;
    const txRes = req.body;
    const addrReport = getAddrValueFromTxRes(theAddress, txRes);
    let inputOrOutput = undefined;
    let bitcoins = -1;
    if(addrReport.inInputs){
        inputOrOutput = "input";
        bitcoins = (addrReport.output_value) / 100000000;
    }
    if(addrReport.inOutputs){
        inputOrOutput = "output";
        bitcoins = (addrReport.value) / 100000000;
    }
    const emailData = {
     from: "avram.thinkful@gmail.com",
     to: req.params.email,
     subject: `Update on ${theAddress} Bitcoin address you are watching on watch-my-address.herokuapp.com`,
     text: `Req.body.hash: ${txRes.hash}`,
     html: 
`<p>You subscribed to updates about the following Bitcoin address: ${theAddress}</p>
<p>You can find out more about the address via https://live.blockcypher.com/btc/address/${theAddress}</p>
<p>The address is used as an ${inputOrOutput} of transaction ${txRes.hash}, and that ${inputOrOutput} has a value of ${bitcoins} bitcoin</p>
<p>${txRes.confirmations} confirmations so far for this transaction</p>
<p>You can find out more about this transaction via https://live.blockcypher.com/btc/tx/${txRes.hash}</p>
<p>You can <strong>unsubscribe</strong> by logging into https://watch-my-address.herokuapp.com/ and deleting the address from your Address Watch List</p>
<p>You will get an email like this every time a transaction that uses the address gets confirmed, for a total of 3 confirmations per transaction</p>
<p>Note you might get email alerts about more than one transaction since the address might get re-used in additional transactions, such as for receiving and then for sending</p>`
}
    // import our mailer function
    sendEmail(emailData);
    res.send(req.body.id);
})

// SETUP WEBHOOK
app.get('/api/webhook/:address/:email',
    passport.authenticate('bearer', {session: false}),
    (req, res) => {
    const {email, address} = req.params;
    const webhook = {
        //event: "confirmed-tx", /*seems to email only for 1st conf, still emails about multiple txns*/
        event: "tx-confirmation",
        //event: "unconfirmed-tx",
        address,
        url: `https://watch-my-address.herokuapp.com/api/webhook/${address}/${email}`,
        confirmations: 3
    };
    bcapi.createHook(webhook, 
    
        (err, data) => {
        const webhookId = data.id
        User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken, 'addresses.address': address},
            {$set: {'addresses.$.webhookId': webhookId}}, {new: true},
                (err, user) => {
                    if(err) throw err;
                    res.send(user.addresses);
            } 
        )
        
    });

})

app.get('/api/deleteaddress/:address/:optionalwebhookid',
    passport.authenticate('bearer', {session: false}),
        (req, res) => {
            const {address, optionalwebhookid} = req.params
            User.findOneAndUpdate({'auth.googleAccessToken': req.user.auth.googleAccessToken}, 
                {$pull: {'addresses': {address}}},
                (err, user) => {
                    if (err) throw err;
                    console.log('deleteaddress address', address)
                    res.send({address})
            })
            if(optionalwebhookid){
                const deleteString = `https://api.blockcypher.com/v1/btc/main/hooks/${optionalwebhookid}?token=${process.env.BLOCKCYPHERTOKEN}`;
                request.delete(deleteString, (req, res) => {
                })
                
            }
});


app.get('/api/isuserloggedin',
    passport.authenticate('bearer', {session: false}),
    (req, res) => res.json({
        googleId: req.user.auth.googleId,
        email: req.user.email
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
