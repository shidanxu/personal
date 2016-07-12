// Lead author: Donglai Wei

var Mongoose = require('mongoose');
//var MFA = Mongoose.model('MFA');
var Map = Mongoose.model('Map');
var Road = Mongoose.model('Road');
var Gallery = Mongoose.model('Gallery');

var path = require('path');
var MyUtil = require(path.join(config.controllers_path, 'util'));



// private methods
function mapCheckRef(req, res, map_obj) {
  if (map_obj.gallery) {
    MyUtil.dbExistIds(Gallery, map_obj.galleries, function(err) {
      if (err && (err.code === 11000 || err.code === 11001)) {
        MyUtil.sendErrResponse(res, 403, err.message);
      } else if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        console.log("successfully found galleries to be added.");
        // MyUtil.sendSuccessResponse(res, {map: result});
      }
    });
  }
  if (map_obj.roads) {
    MyUtil.dbExistIds(Road, map_obj.roads, function(err) {
      if (err && (err.code === 11000 || err.code === 11001)) {
        MyUtil.sendErrResponse(res, 403, err.message);
      } else if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        console.log("successfully found roads to be added.");
        // MyUtil.sendSuccessResponse(res, {map: result});
      }
    });
  }
}

function mapCreateObj(req, res, cb) {
  // since we need to upload image
  // use busybody +form instead of bodyparser+json
  valid_filenames = ['image'];
  valid_fieldnames = ['name', 'roads', 'galleries', 'description'];
  var mapObj = {};
  // read file
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    if (valid_filenames.indexOf(fieldname) > -1) {
      file.on('data', function(data) {
        // mongoose only store binary buffer anyway...
        mapObj[fieldname] = {
          data: data,
          contentType: "image/" + filename.substring(filename.lastIndexOf('.') + 1)
        }
      });
    }
  });
  // read field
  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    if (valid_fieldnames.indexOf(fieldname) > -1) {
      mapObj[fieldname] = val;
    }
  });
  req.busboy.on('finish', function() {
    console.log('Done parsing form!');
    cb(mapObj);
  });
}
/*
POST:
  /mfa/map/new
Request body:
  name: the room number of the map
  description: some description of the map
  roads: list of roads in the map
  galleries: list of galleries in the map
  image: an image of the map
Response:
  success: true if new map created
  content: a JSON file for the map created
  err: error message
*/
// Creates a new map with given fields
exports.mapNew = function(req, res) {
  mapCreateObj(req, res, function(map_obj) {
    mapCheckRef(req, res, map_obj);
    console.log(map_obj);
    var newmap = new Map(map_obj)
      .save(function(err, result) {
        if (err && (err.code === 11000 || err.code === 11001)) {
          MyUtil.sendErrResponse(res, 403, err.message);
        } else if (err) {
          console.log("could not save");
          MyUtil.sendErrResponse(res, 500, err.message);
        } else {
          MyUtil.sendSuccessResponse(res, {
            map: result
          });
        }
      });
  })
  // console.log("name is " + name + ", number is " +access_number + ", map is: "+ map);
}

/*
GET:
  /mfa/map/id=...
Request parameters:
  id: a string representation of the desired gallery's _id
Response: 
  success: true if this gallery is in database
  content: json file of the requested gallery
  err: error message
*/
// Show one road
exports.mapShow = function(req, res) {
  var identity = req.url.substring(req.url.indexOf('/map/') + 8).trim();
  Map.find({
    _id: identity
  }).exec(function(err, result) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      MyUtil.sendErrResponse(res, 403, err.message);
    } else if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log(result + " success.");
      MyUtil.sendSuccessResponse(res, {
        map: result
      });
    }
  });
};

/*
GET:
  /mfa/map/delete
Request parameters:
  null
Response: 
  success: true if maps in the database
  content: null
  err: error message
*/
// Delete all maps
exports.mapsDelete = function(req, res){
  Map.remove({}).exec(function(err){
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Succesfully deleted all maps!");
      MyUtil.sendSuccessResponse(res);
    }
  });
};

/*
GET:
  /mfa/map/
Request parameters:
  null
Response: 
  success: true if roads in the database
  content: json file of roads
  err: error message
*/
// Show all artworks
exports.mapsShow = function(req, res) {
  Map.find({}).exec(function(err, result) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Successfully found all maps!");
      MyUtil.sendSuccessResponse(res, {
        maps: result
      });
    }
  });
};

/*
POST:
  /mfa/gallery/delete/id
Request body:
  id: the _id of the gallery to be deleted
Response:
  success: true if successfully deleted gallery with given id in database
  content: null
  err: error message
*/
// Delete one artwork
exports.mapDel = function(req, res) {
  var identity = req.body.id;

  Map.remove({
    _id: identity
  }, function(err) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Succesfully deleted one map!");
      MyUtil.sendSuccessResponse(res);
    }
  });
}

/*
POST:
  /mfa/map/update/
Request body:
  content: content of the fields to be changed (other fields can be null, id is required)
    - id: the _id of the map in question
    - image: the new image for the map, overwrites old one
    - name: the room number of the map
    - description: some description of the map
    - roads: list of roads in the map
    - galleries: list of galleries in the map
Response:
  success: true if successfully updated the map
  content: json file of the modified map
  err: error message
*/
exports.mapUpdate = function(req, res) {
  var identity = req.body.id;
  mapCheckRef(req, res);
  mapCreateObj(req, res, function(map_obj) {
    Map.update({
      _id: identity
    }, {
      $set: update
    }, function(err, result) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        console.log("Succesfully updated one map!");
        MyUtil.sendSuccessResponse(res, {
          maps_affected: result
        });
      }
    });
  });
}