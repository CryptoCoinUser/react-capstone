const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const BodyParser = require('body-parser');
const request = require('request');
//const secret = require('./secret');

const app = express();
app.use(BodyParser.json());


app.post('/api/multiply', (req, res) => {
    const num = req.body.num;
    const num2 = req.body.num2;
    const productNum = num * num2;
    res.json({product: `${num} times ${num2} is ${productNum}`})
   
})

app.post('/api/github', (req, res) => {

    var options = {
        url: `https:\//api.github.com/repos/${req.body.githubUser}/${req.body.githubRepo}`,
        headers: {
            'User-Agent': 'CryptoCoinUser'
        }
    };

    
    request(options, (err, githubResponse) => {
        const resObject = JSON.parse(githubResponse.body);
        console.log(resObject.description);
        res.json(resObject.description);
    })
    
})



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
        server = app.listen(port, () => {
            resolve();
        }).on('error', reject);
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
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
