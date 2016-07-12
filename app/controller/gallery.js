// Lead author: Shidan Xu

var Mongoose = require('mongoose');
var MFA = Mongoose.model('MFA');
var Artwork = Mongoose.model('Artwork');
var Gallery = Mongoose.model('Gallery');
var path = require('path');
var MyUtil = require(path.join(config.controllers_path, 'util'));
// -------------------------


// private method
function galleryCheckRef(req, res, galleryObj) {
  console.log(galleryObj);

  if (galleryObj.artworks.length > 0) {
    MyUtil.dbExistIds(Artwork, galleryObj.artworks, function(err) {
      if (err && (err.code === 11000 || err.code === 11001)) {
        MyUtil.sendErrResponse(res, 403, err.message);
      } else if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        console.log("successfully found artworks to be added.");
        // MyUtil.sendSuccessResponse(res, {Gallery: result});
      }
    });
  }
}

function galleryCreateObj(req, res, cb) {
  var galleryObj = {}
  if (req.body.name) {
    galleryObj["name"] = req.body.name;
  }
  if (req.body.x) {
    galleryObj["x"] = req.body.x;
  }
  if (req.body.y) {
    galleryObj["y"] = req.body.y;
  }

  galleryObj["artworks"] = [];
  if (req.body.artworks != undefined && req.body.artworks.length > 0) {
    galleryObj["artworks"] = req.body.artworks.split(",");
  }
  cb(galleryObj);
}
/*exports.findGallery = function(req, res){
  Gallery.find({}).exec(function(err, result) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Successfully found all galleries!");
      MyUtil.sendSuccessResponse(res, {
        galleries: result
      });
    }
  });
};*/


// POST methods

/*
POST:
  /mfa/gallery/new
Request body:
  name: the room number of the gallery
  x: the x coordinate of the gallery chamber
  y: the y coordinate of the gallery chamber
  artworks: a list of artwork in the gallery, separated by ','
Response:
  success: true if new gallery created
  content: a JSON file for the gallery created
  err: error message
*/
// Creates a new gallery with given fields

exports.galleryNew = function(req, res) {
  galleryCreateObj(req, res, function(galleryObj) {
    galleryCheckRef(req, res, galleryObj);
    var newGallery = new Gallery(galleryObj)
      .save(function(err, result) {
        if (err && (err.code === 11000 || err.code === 11001)) {
          MyUtil.sendErrResponse(res, 403, err.message);
        } else if (err) {
          MyUtil.sendErrResponse(res, 500, err.message);
        } else {
          // console.log(result + " success.");
          MyUtil.sendSuccessResponse(res, {
            Gallery: result
          });
        }
      });
  });
}



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
exports.galleryDel = function(req, res) {
  var identity = req.body.id;

  Gallery.remove({
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



/*
POST:
  /mfa/gallery/update/
Request body:
  content: content of the fields to be changed (other fields can be null, id is required)
    - id: the _id of the gallery in question
    - x: the new x position of the gallery
    - y: the new y position of the gallery
    - artworks: the new list of artworks in the gallery, overwrites old one
Response:
  success: true if successfully updated the gallery
  content: json file of the modified gallery
  err: error message
*/
exports.galleryUpdate = function(req, res) {
  var identity = req.body.id;
  console.log("identity is: "+ identity);
  galleryCreateObj(req, res, function(galleryObj) {
    galleryCheckRef(req, res, galleryObj);

    Gallery.update({
      _id: identity
    }, {
      $set: galleryObj
    }, function(err, result) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        console.log("Succesfully updated one gallery!");
        MyUtil.sendSuccessResponse(res, {
          galleries_affected: result
        });
      }
    });
  });
}


// GET methods

/*
GET:
  /mfa/gallery/delete
Request body:
  null
Response:
  success: true if successfully deleted all galleries
  content: null
  err: error message
*/
// Delete all galleries
exports.galleriesDel = function(req, res) {
  Gallery.remove({}, function(err) {
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
  /mfa/gallery/
Request parameters:
  null
Response: 
  success: true if galleries in the database
  content: json file of galleries
  err: error message
*/
// Show all artworks
exports.galleriesShow = function(req, res) {
  Gallery.find({}).exec(function(err, result) {
    if (err) {
      MyUtil.sendErrResponse(res, 500, err.message);
    } else {
      console.log("Successfully found all galleries!");
      MyUtil.sendSuccessResponse(res, {
        galleries: result
      });
    }
  });
};

/*
GET:
  /mfa/gallery/id=...
Request parameters:
  id: a string representation of the desired gallery's _id
Response: 
  success: true if this gallery is in database
  content: json file of the requested gallery
  err: error message
*/
// Show one artwork
exports.galleryShow = function(req, res) {
  var identity = req.url.substring(req.url.indexOf('/gallery/') + 12).trim();

  Gallery.find({
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
exports.galleryShowByName = function(req, res) {
  var identity = req.url.substring(req.url.indexOf('/gallery/') + 14).trim();
  console.log(identity);

  Gallery.findOne({
    name: identity
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
exports.galleriesUpload = function(req, res) {
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
            var newGallery = new Gallery({
              name: line_seg[1],
              x: Number(line_seg[2]),
              y: Number(line_seg[3])
            }).save(function(err) {
              if (err) MyUtil.sendErrResponse(res, 500, err.message);
              cb(null);
            });
            break;
          case "del":
            Gallery.remove({
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