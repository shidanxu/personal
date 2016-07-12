// Lead author: Neil Gurram
var Mongoose = require('mongoose');
var MFA = Mongoose.model('MFA');
var Artwork = Mongoose.model('Artwork');
var path = require('path');
var MyUtil = require(path.join(config.controllers_path, 'util'));


function mfaCreateObj(req, res, cb) {
  var mfaObj = {}
  console.log(req.body);
  if (req.body.username) {
    mfaObj["username"] = req.body.username;
  }
  if (req.body.password) {
    mfaObj["password"] = req.body.password;
  }
  cb(mfaObj);
}



//POST METHODS
/*
POST:
  /mfa/new
Request body:
  username: the username of the user
  password: the password of the user
Response:
  success: true if username doesn't already exist
  content: returns a JSON obj
  err: error message
*/
exports.mfaNew = function(req, res) {
  mfaCreateObj(req, res,
    function(mfaObj) {
      var newMFA = new MFA(mfaObj)
        .save(function(err, result) {
          if (err && (err.code === 11000 || err.code === 11001)) {
            MyUtil.sendErrResponse(res, 403, err.message);
          } else if (err) {
            MyUtil.sendErrResponse(res, 500, err.message);
          } else {
            // console.log(result + " success.");
            MyUtil.sendSuccessResponse(res, {
              mfa: result
            });
          }
        });
    });
}

//GET METHODS
/*
GET:
  /mfa
Request body:
  name: the username of the user
  access_number: the password of the user
Response:
  success: true if username and password match
  content: null
  err: error message
*/
exports.mfaLogin = function(req, res) {
  //if is invalid, return 401
  mfaCreateObj(req, res,
    function(mfaObj) {
      MFA.findOne(mfaObj,
        function(err, result) {
          console.log("login: "+result);
          if (result === null) {
            MyUtil.sendErrResponse(res, 401, 'Wrong user or password');
          } else {
            //res.sendfile(config.client_path+"html/mfaDB.html");
             MyUtil.sendSuccessResponse(res, {
               url: '/html/mfaDB.html'
               //url: '/adminDB/'
             });
            // no authentation for now
            // send the cookie
            // var profile = {
            //   name: result.name
            // };
            // We are sending the profile inside the token
            // var token = jwt.sign(profile, secret, {
            //   expiresInMinutes: 60 * 5
            // });
            // res.json({
            //   token: token
            // });
          }
        });
    });
}