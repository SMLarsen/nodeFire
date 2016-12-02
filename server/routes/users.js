var express = require('express');
var router = express.Router();
// bring in our mongoose model
var User = require('../models/user');

router.post('/', function(req, res) {
  console.log('post: ', req.body);

  var newUser = new User(req.body);

  newUser.save(function(err, data) {
    console.log('save user:', data);
    if(err) {
      console.log('ERR: ', err);
      res.sendStatus(500);
    } else {
      res.send(data);
      // res.sendStatus(201);
    }
  });
});

router.get("/", function(req, res){
  var userEmail = req.decodedToken.email;
  var requestedClearance = req.decodedToken.requestedClearance;
  // Check the user's level of permision based on their email
  User.findOne({ email: userEmail }, function (err, user) {
    if (err) {
      console.log('Error COMPLETING clearanceLevel query task', err);
      res.sendStatus(500);
    } else {
      // user clearancelevel to determine if good to request new
      console.log(user);
        // Based on the clearance level of the individual, give them access to different information
      Secret.find({ secrecyLevel: { $lte: user.clearanceLevel } }, function (err, secrets){
        if (requestedClearance <= user.clearanceLevel) {
          res.sendStatus(200);
        } else {
          return false;
        }
      });
    }
  });
});

module.exports = router;
