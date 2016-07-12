// Lead author: Shidan Xu


var Mongoose = require('mongoose');
var MFA = Mongoose.model('MFA');
var Artwork = Mongoose.model('Artwork');
var path = require('path');
var MyUtil = require(path.join(config.controllers_path, 'util'));
// -------------------------
// private method
function artworkCreateObj(req, res, cb) {
  var artObj = {}
  if (req.body.name) {
    artObj["name"] = req.body.name;
  }
  if (req.body.accessnumber) {
    artObj["accessNumber"] = req.body.accessnumber;
  }
  if (req.body.galleryName) {
    artObj["galleryName"] = req.body.galleryName;
  }
  if (req.body.author){
    artObj["author"] = req.body.author;
  }
  cb(artObj);
}

// POST methods

/*
POST:
  /mfa/artwork/new
Request body:
  name: the name of the artwork
  access_number: the access number of the artwork
Response:
  success: true if new artwork created
  content: a JSON file called artwork
  err: error message
*/
// Creates a new artwork with given fields
exports.artworkNew = function(req, res) {
  artworkCreateObj(req, res,
    function(artObj) {
      var newArtwork = new Artwork(artObj)
        .save(function(err, result) {
          if (err && (err.code === 11000 || err.code === 11001)) {
            MyUtil.sendErrResponse(res, 403, err.message);
          } else if (err) {
            MyUtil.sendErrResponse(res, 500, err.message);
          } else {
            // console.log(result + " success.");
            MyUtil.sendSuccessResponse(res, {
              artwork: result
            });
          }
        });
    });
}


/*
POST:
  /mfa/artwork/delete/id
Request body:
  id: the _id of the artwork to be deleted
Response:
  success: true if successfully deleted artwork with given id in database
  content: null
  err: error message
*/
// Delete one artwork
exports.artworkDel = function(req, res) {
  var identity = req.body.id;

  Artwork.remove({
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
        artwork_affected: result
      });
    }
  });
}

/*
Post:
  /mfa/artwork/update/
Request body:
  content: content of the fields to be changed (other fields can be null, id is required)
    - id: the _id of the artwork in question
    - name: the new name for the artwork
    - access_number: the new access number
Response:
  success: true if successfully updated the artwork
  content: json file of the modified artwork
  err: error message
*/
exports.artworkUpdate = function(req, res) {
  console.log("update:"+req.body.id);
  var identity = req.body.id;
  artworkCreateObj(req, res, function(artObj) {
    Artwork.update({
      _id: identity
    }, {
      $set: artObj
    }, function(err, result) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        console.log("Succesfully updated one artwork!");
        MyUtil.sendSuccessResponse(res, {
          artworks_affected: result
        });
      }
    });
  });
}

// GET methods

/*
GET:
  /mfa/artwork/
Request parameters:
  null
Response: 
  success: true if there are artworks in the database
  content: json file of artworks
  err: error message
*/
// Show all artworks
exports.artworksShow = function(req, res) {
  Artwork.find({}).exec(function(err, result) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Successfully found all artworks!");
      MyUtil.sendSuccessResponse(res, {
        artworks: result
      });
    }
  });
};

/*
GET:
  /mfa/artwork/id=...
Request parameters:
  id: a string representation of the desired artwork's _id
Response: 
  success: true if this artwork is in database
  content: json file of the requested artwork
  err: error message
*/
// Show one artwork
exports.artworkShow = function(req, res) {
  var identity = req.url.substring(req.url.indexOf('/artwork/') + 12).trim();
  Artwork.find({
    _id: identity
  }).exec(function(err, result) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      MyUtil.sendErrResponse(res, 403, err.message);
    } else if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      // console.log(result + " success.");
      MyUtil.sendSuccessResponse(res, {
        artwork: result
      });
    }
  });
};

/*
GET:
  /mfa/artwork/delete
Request body:
  null
Response:
  success: true if successfully deleted all artworks
  content: null
  err: error message
*/
// Delete all artworks
exports.artworksDel = function(req, res) {
  Artwork.remove({}, function(err) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Succesfully deleted all artworks!");
      MyUtil.sendSuccessResponse(res);
    }
  });
}


exports.artworksUpload = function(req, res) {
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
            var newArtwork = new Artwork({
              accessNumber: line_seg[1],
              name: line_seg[2],
              galleryName: line_seg[3],
              author: line_seg[4]
            }).save(function(err) {
              if (err) MyUtil.sendErrResponse(res, 500, err.message);
              cb(null);
            });
            break;
          case "del":
            Artwork.remove({
              accessNumber: line_seg[1]
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

exports.mTest = function(req, res) {
  MyUtil.readcsv(config.upload_path + 'map.csv',
    function(line) {
      console.log(line);
    }
  );
}
// END OF CURRENT VERSION