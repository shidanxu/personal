// Lead author: Shidan Xu

var Mongoose = require('mongoose');
var MFA = Mongoose.model('MFA');
var Artwork = Mongoose.model('Artwork');
var Gallery = Mongoose.model('Gallery');
var Road = Mongoose.model('Road');
var Way = Mongoose.model('Way');
var async = require('async');
var path = require('path');
var MyUtil = require(path.join(config.controllers_path, 'util'));
// -------------------------
function wayCheckRef(req, res, wayObj) {
  MyUtil.dbExistNames(Gallery, wayObj.galleries, function(err) {
    // TODO: need to verify that there is a road between each adjacent pair of galleries
    if (err && (err.code === 11000 || err.code === 11001)) {
      MyUtil.sendErrResponse(res, 403, err.message);
    } else if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("successfully found galleries to be added.");
      // MyUtil.sendSuccessResponse(res, {Gallery: result});
    }
  });
}

function wayCreateObj(req, res, cb) {
  var wayObj = {};
  if (req.body.name) {
    wayObj["name"] = req.body.name;
  }

  if (req.body.description) {
    wayObj["description"] = req.body.description;
  }

  wayObj["galleries"] = [];
  if (req.body.galleries != undefined && req.body.galleries.length > 0) {
    wayObj["galleries"] = req.body.galleries.split(",");
  }
  cb(wayObj);
}

// POST methods
/*
POST:
  /mfa/way/new
Request body:
  name: the name of the way
  description: Some explanation of the way
  galleries: a list of galleries, in order, of the way
Response:
  success: true if new way created
  content: null
  err: error message
*/
// Creates a new way with given fields
exports.wayNew = function(req, res) {
  wayCreateObj(req, res, function(wayObj) {
    wayCheckRef(req, res, wayObj);
    var newWay = new Way(wayObj)
      .save(function(err, result) {
        if (err && (err.code === 11000 || err.code === 11001)) {
          MyUtil.sendErrResponse(res, 403, err.message);
        } else if (err) {
          MyUtil.sendErrResponse(res, 500, err.message);
        } else {
          // console.log(result + " success.");
          MyUtil.sendSuccessResponse(res, {
            way: result
          });
        }
      });
  });
}


/*
POST:
  /mfa/way/delete/id
Request body:
  id: the _id of the way to be deleted
Response:
  success: true if successfully deleted way with given id in database
  content: null
  err: error message
*/
// Delete one artwork
exports.wayDel = function(req, res) {
  var identity = req.body.id;

  Way.remove({
    _id: identity
  }, function(err, result) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      MyUtil.sendErrResponse(res, 403, err.message);
    } else if (err) {
      console.log(err);
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      // console.log(" success.");
      MyUtil.sendSuccessResponse(res, {
        Way_affected: result
      });
    }
  });
}

/*
Post:
  /mfa/way/update/
Request body:
  content: content of the fields to be changed (other fields can be null, id is required)
    - name: the name of the way
    - description: Some explanation of the way
    - galleries: a list of galleries, in order, of the way
Response:
  success: true if successfully updated the artwork
  content: json file of the modified artwork
  err: error message
*/
// Update one artwork
exports.wayUpdate = function(req, res) {
  var identity = req.body.id;

  wayCreateObj(req, res, function(wayObj) {
    wayCheckRef(req, res, wayObj);
    Way.update({
      _id: identity
    }, {
      $set: wayObj
    }, function(err, result) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        console.log("Succesfully updated one way!");
        MyUtil.sendSuccessResponse(res, {
          ways_affected: result
        });
      }
    });
  });
}

// exports.WayShowByDescription = function(req, res) {
//   // convert into way names
//   console.log("desc:"+req.body.desc);
//   Way.find({
//       description: req.body.desc
//     },function(err,ways){
//         if (err) {
//           MyUtil.sendErrResponse(res, 500, err.message);
//         }
//         MyUtil.sendSuccessResponse(res, {
//           ways: ways
//         });
//     });
//   }


// GET methods

/*
GET:
  /mfa/way/
Request parameters:
  null
Response: 
  success: true if ways in the database
  content: json file of artworks
  err: error message
*/
// Show all ways
exports.waysShow = function(req, res) {
  Way.find({}).exec(function(err, result) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Successfully found all artworks!");
      MyUtil.sendSuccessResponse(res, {
        ways: result
      });
    }
  });
};

/*
GET:
  /mfa/way/id=...
Request parameters:
  id: a string representation of the desired way's _id
Response: 
  success: true if this way is in database
  content: json file of the requested artwork
  err: error message
*/
// Show one way
exports.wayShow = function(req, res) {
  var identity = req.url.substring(req.url.indexOf('/way/') + 8).trim();

  Way.find({
    _id: identity
  }).exec(function(err, result) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      MyUtil.sendErrResponse(res, 403, err.message);
    } else if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      // console.log(result + " success.");
      MyUtil.sendSuccessResponse(res, {
        way: result
      });
    }
  });
};

/*
GET:
  /mfa/way/delete
Request body:
  null
Response:
  success: true if successfully deleted all ways
  content: null
  err: error message
*/
// Delete all ways
exports.waysDel = function(req, res) {
  Way.remove({}, function(err) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Succesfully deleted all ways!");
      MyUtil.sendSuccessResponse(res);
    }
  });
}


exports.waysUpload = function(req, res) {
  MyUtil.upload(req, res, config.upload_path, function(res, server_fn) {
    // read each line 
    MyUtil.readCsvSync(server_fn,
      function(line, cb) {
        // save into db
        console.log("read: " + line);
        var line_seg = line.split(",");
        switch (line_seg[0]) {
          case "add":
            //  check the galleries a way
            var galleries_toadd = line_seg[3].split('_');
            // MyUtil.dbExistNames(Gallery, galleries_toadd,
            //   function(err) {
            //     if (err) {MyUtil.sendErrResponse(res, 500, err.message);
            //     }else{

            //  insert a way
            console.log({
              name: line_seg[1],
              description: line_seg[2],
              galleries: galleries_toadd
            });
            var newWay = new Way({
              name: line_seg[1],
              description: line_seg[2],
              galleries: galleries_toadd
            }).save(function(err) {
              if (err) {
               //MyUtil.sendErrResponse(res, 500, "error saving ways into db"); 
               console.log(err.message);
              }
              cb(null);
            });
            //}
            //});
            break;
          case "del":
            Way.remove({
              name: line_seg[1]
            }).exec(function(err) {
              if (err) MyUtil.sendErrResponse(res, 500, err.message);
              cb(null);
            });
            break;
          default:
            MyUtil.sendErrResponse(res, 500, "Unknown csv action by ways: " + line_seg[0]);
        }
      });
  });
  MyUtil.sendSuccessResponse(res);
}



// END OF CURRENT VERSION