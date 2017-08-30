// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    auth : {
        googleId: {
        	type: String,
        	required: 'You must supply a Google Id'
        },
        googleAccessToken: {
        	type: String,
        	required: 'you must supply a google Access Token'
        }
    },
    addresses : [{
        address: {
            type: String,
            required: 'address string required'
        },
        balance: {
            type: Number,
            required: 'balance required'
        },
        unconfirmed_balance: {
            type: Number,
            required: 'unconfirmed_balance required'
        },
        random: {
            type: Boolean,
            required: 'true if address is from a random unconfirmed txn, false if user hand-pasted it'
        },
        note: {
            type: String // optional: either "Random" or user-typed memo, which can default to time-stamp
        }
    }] 
});



// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
 