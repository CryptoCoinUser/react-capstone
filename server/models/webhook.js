var mongoose = require('mongoose');

// webhooks that BlockChypher might ping for a different user than the one logged in
var webhookSchema = mongoose.Schema({

    address : {
        type : String,
        required : 'bitcoin address used to in url parameter for requesting webhook creation'
    },    
    email : {
        type : String,
        required : 'provided / pre-saved by user who requested an email notification about an address'
    },
    webhookId : {
        type: String // provided by BlockCypher as a response to a successfully created webhook
    },
    note : {
        type: String
    },
    payload : {
         type : Object
    },
    tally : {
        type : Number // number of times this webhook as pinged by BlockCypher
    },
    created : {
         type : Date,
         default : Date.now()
    },

 
});



// create the model for users and expose it to our app
module.exports = mongoose.model('User', webhookSchema);
 