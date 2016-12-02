var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');
var mongoConnection = require('./modules/mongo-connection');
var privateData = require('./routes/private-data');

var portDecision = process.env.PORT || 5000;
<<<<<<< HEAD
var connectionString = 'mongodb://localhost:27017/sigma';
var User = require('./models/user');
var Secret = require('./models/secret');
var user = require('./routes/users');
=======
>>>>>>> afa479c888994356286e001d0a54390b7f0b5d28

app.use(express.static('public'));
app.use(bodyParser.json());

<<<<<<< HEAD
app.use('/user', user);

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://auth-demo-9d15c.firebaseio.com" // replace this line with your URL
});

mongoose.connect(connectionString);
=======
mongoConnection.connect();
>>>>>>> afa479c888994356286e001d0a54390b7f0b5d28

// Decodes the token in the request header and attaches the decoded token to req.decodedToken on the request.
app.use(decoder.token);

/* Whatever you do below this is protected by your authentication. */

// This is the route for your secretData. The request gets here after it has been authenticated.
app.use("/privateData", privateData);

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});

app.post('/addUser', function(req, res) {

});
