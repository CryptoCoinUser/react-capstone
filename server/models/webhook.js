var mongoose = require('mongoose');

// webhooks that BlockChypher might ping for a different user than the one logged in
var webhookSchema = mongoose.Schema({

    webhookId : {
        type: String,
        required: 'provided by BlockCypher response'
    },
    email : {
        type : String,
        required : 'provided by user who requested an email notification about an address or its txn'
    },
    created : {
         type : Date,
         default : Date.now()
    },
    addressData : [
        {
            type : String
        }
    ],
    tally : {
        type : Number // number of times this webhook as pinged by BlockCypher
    }

 
});



// create the model for users and expose it to our app
module.exports = mongoose.model('User', webhookSchema);
 