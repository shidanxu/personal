// Lead author: Shidan Xu

var Mongoose = require('mongoose');
var MFA = Mongoose.model('MFA');
var Artwork = Mongoose.model('Artwork');
var Gallery = Mongoose.model('Gallery');
var Road = Mongoose.model('Road');
var path = require('path');
var MyUtil = require(path.join(config.controllers_path, 'util'));
// -------------------------
function roadCheckRef(req, res, roadObj) {
  if (roadObj.gallery1 && roadObj.gallery2) {
    if (roadObj.gallery1 === roadObj.gallery2) {
      MyUtil.sendErrResponse(res, 403, "Self loop is not permitted");
    } else {
      MyUtil.dbExistIds(Gallery, [roadObj.gallery1, roadObj.gallery2], function(err) {
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
  }
}

function roadCreateObj(req, res, cb) {
  var roadObj = {}
  if (req.body.name) {
    roadObj["name"] = req.body.name;
  }
  if (req.body.gallery1) {
    roadObj["gallery1"] = req.body.gallery1;
  }
  if (req.body.gallery2) {
    roadObj["gallery2"] = req.body.gallery2;
  }
  cb(roadObj);
}
// POST methods

/*
POST:
  /mfa/road/new
Request body:
  gallery1: the id of the first gallery chamber
  gallery2: the id of the second gallery chamber
Response:
  success: true if new road created
  content: a JSON file for the road created
  err: error message
*/
// Creates a new gallery with given fields
exports.roadNew = function(req, res) {
  roadCreateObj(req, res, function(roadObj) {
    roadCheckRef(req, res, roadObj);
    var newGallery = new Road(roadObj)
      .save(function(err, result) {
        if (err && (err.code === 11000 || err.code === 11001)) {
          MyUtil.sendErrResponse(res, 403, err.message);
        } else if (err) {
          MyUtil.sendErrResponse(res, 500, err.message);
        } else {
          // console.log(result + " success.");
          MyUtil.sendSuccessResponse(res, {
            Road: result
          });
        }
      });
  });
}



/*
POST:
  /mfa/road/delete/id
Request body:
  id: the _id of the road to be deleted
Response:
  success: true if successfully deleted road with given id in database
  content: null
  err: error message
*/
// Delete one artwork
exports.roadDel = function(req, res) {
  var identity = req.body.id;

  Road.remove({
    _id: identity
  }, function(err) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Succesfully deleted one artwork!");
      MyUtil.sendSuccessResponse(res);
    }
  });
}



// GET methods

/*
GET:
  /mfa/road/delete
Request body:
  null
Response:
  success: true if successfully deleted all roads
  content: null
  err: error message
*/
// Delete all galleries
exports.roadsDel = function(req, res) {
  Road.remove({}, function(err) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Succesfully deleted all galleries!");
      MyUtil.sendSuccessResponse(res);
    }
  });
}

/*
GET:
  /mfa/road/
Request parameters:
  null
Response: 
  success: true if roads in the database
  content: json file of roads
  err: error message
*/
// Show all artworks
exports.roadsShow = function(req, res) {
  Road.find({}).exec(function(err, result) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Successfully found all galleries!");
      MyUtil.sendSuccessResponse(res, {
        roads: result
      });
    }
  });
};

/*
GET:
  /mfa/road/id=...
Request parameters:
  id: a string representation of the desired gallery's _id
Response: 
  success: true if this gallery is in database
  content: json file of the requested gallery
  err: error message
*/
// Show one road
exports.roadShow = function(req, res) {
  var identity = req.url.substring(req.url.indexOf('/road/') + 9).trim();

  Road.find({
    _id: identity
  }).exec(function(err, result) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      MyUtil.sendErrResponse(res, 403, err.message);
    } else if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      // console.log(result + " success.");
      MyUtil.sendSuccessResponse(res, {
        gallery: result
      });
    }
  });
};

exports.roadsUpload = function(req, res) {
  MyUtil.upload(req, res, config.upload_path, function(res, server_fn) {
    // read each line 
    MyUtil.readCsvSync(server_fn,
      function(line, cb) {
        // save into db
        console.log("read: " + line);
        var line_seg = line.split(",");
        switch (line_seg[0]) {
          case "add":
            //  insert artwork
            var newRoad = new Road({
              name: line_seg[1],
              distance: parseFloat(line_seg[2])
            }).save(function(err) {
              if (err) MyUtil.sendErrResponse(res, 500, err.message);
              cb(null);
            });
            break;
          case "del":
            Road.remove({
              name: line_seg[1]
            }).exec(function(err) {
              if (err) MyUtil.sendErrResponse(res, 500, err.message);
              cb(null);
            });
            break;
          default:
            MyUtil.sendErrResponse(res, 500, "Unknown csv action by artwork: " + line_seg[0]);
        }
      });
  });
  MyUtil.sendSuccessResponse(res);
}


// End of current version