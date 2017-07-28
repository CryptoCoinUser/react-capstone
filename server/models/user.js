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
    addresses : [String] 
});



// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
 