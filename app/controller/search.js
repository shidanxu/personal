// Lead author: Shidan Xu

// implement the search functionality

var Mongoose = require('mongoose');
var MFA = Mongoose.model('MFA');
var Artwork = Mongoose.model('Artwork');
var Gallery = Mongoose.model('Gallery');
var Road = Mongoose.model('Road');
var Way = Mongoose.model('Way');

var path = require('path');
var MyUtil = require(path.join(config.controllers_path, 'util'));
// -------------------------

function ArtworkAuthor2GalleryName(ArtworkAuthor, cb) {
  var outName = new Array(ArtworkAuthor.length);
  MyUtil.dbGetArr(Artwork, ArtworkAuthor, outName,
    function(dbVal, cb) {
      cb({
        author: new RegExp(dbVal, "i")
      });
    },
    function(arr, index, artworkobj) {
      if (artworkobj != undefined && artworkobj.length > 0) {
        arr[index] = artworkobj[0].galleryName;
      }
    },
    function(err) {
      // put in values for gallery name
      cb(err, outName);
    },
    false);
}

function ArtworkName2GalleryName(ArtworkName, cb_done) {
  var outName = new Array(ArtworkName.length);
  MyUtil.dbGetArr(Artwork, ArtworkName, outName,
    function(dbVal, cb) {
      cb({
        name: dbVal
      });
    },
    function(arr, index, artworkobj) {
      if (artworkobj != undefined && artworkobj.length > 0) {
        //console.log(artworkobj);
        arr[index] = artworkobj[0].galleryName;
      }
    },
    function(err) {
      // put in values for gallery name
      cb_done(err, outName);
    },
    false);
}

function Description2GalleryName(descriptions, cb_done, do_sync) {
  var outWays = MyUtil.createArray(3, descriptions.length);

  //console.log("final: "+galleryNames);
  MyUtil.dbGetArr(Way, descriptions, outWays,
    function(dbVal, cb) {
      cb({
        description: new RegExp(dbVal, "i")
      });
    },
    function(arr, index, wayobjs) {
      arr[0][index] = [];
      arr[1][index] = [];
      arr[2][index] = [];
      wayobjs.forEach(function(wayobj) {
        arr[0][index].push(wayobj.galleries);
        arr[1][index].push(wayobj.name);
        arr[2][index].push(wayobj.description);
      });

    },
    function(err) {
      cb_done(err, outWays);
    },
    do_sync);
}

function OrderedGalleryName2WayGalleries(galleryNames, cb_done, do_sync) {
  if (galleryNames.length == 1) {
    cb_done(null, [galleryNames, [1]]);
  } else {
    var galleryPairs = MyUtil.zipOrder(galleryNames);
    // ways: adjacent pair of galleries
    //console.log(galleryPairs)
    Way2WayGalleries(galleryPairs, function(dbVal, cb) {
        cb({
          name: dbVal[0]
        });
      },
      cb_done,
      do_sync);
  }
}

function Way2WayGalleries(dbVals, dbQueryCb, cb_done, do_sync) {
  var outName = MyUtil.createArray(2, dbVals.length);
  MyUtil.dbGetArr(Way, dbVals, outName,
    dbQueryCb,
    function(arr, index, wayobj) {
      // gallery names
      arr[0][index] = wayobj[0].galleries;
      var tmp_gallery = dbVals[index][0].split('_');
      if ( dbVals[index][1] === 1 ) {
          arr[0][index].reverse();
      }
      // gallery in query
      arr[1][index] = MyUtil.createConstantArray(arr[0][index].length, 0);
      arr[1][index][0] = 1;
      arr[1][index][arr[0][index].length - 1] = 1;
    },
    function(err) {
      //console.log("bc: " + outName);
      cb_done(err, [MyUtil.getConcat(outName[0]), MyUtil.getConcat(outName[1])]);
    },
    do_sync);
}

function WayGalleries2Pos(galleryNames, cb_done, do_sync) {
  //console.log("gallery: " + galleryNames);
  var pos = new Array(galleryNames.length);
  //console.log("final: "+galleryNames);
  MyUtil.dbGetArr(Gallery, galleryNames, pos,
    function(dbVal, cb) {
      cb({
        name: dbVal
      });
    },
    function(arr, index, galleryobj) {
      arr[index] = [galleryobj[0].x, galleryobj[0].y];
    },
    function(err) {
      cb_done(err, pos);
    },
    do_sync);
}

function PosOutput(req, res, err, pos) {
  if (err) {
    MyUtil.sendErrResponse(res, 500, err.message);
  } else {
    MyUtil.sendSuccessResponse(res, {
      pos: pos
    });
  }
}

function GalleryName2Pos(galleryNames, SearchCb, cb_done, do_sync) {
  // in: a list of gallery names
  // out: a connected list of gallery names from a way
  SearchCb(galleryNames,
    function(err, outWay) {
      if (err) {
        cb_done(err, []);
      } else {
        // out: positions of the galleries
        //console.log("way:" + outWay.length);
        WayGalleries2Pos(outWay[0],
          function(err, outPos) {
            cb_done(err, [outPos, outWay[1]]);
          }, do_sync);
      }
    },
    do_sync);
}

function GalleryName2PosOutput(req, res, galleryNames, SearchCb, do_sync) {
  GalleryName2Pos(galleryNames, SearchCb,
    function(err, out) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      } else {
        PosOutput(req, res, err, out);
      }
    },
    do_sync);
}

/*
POST:
  /mfa/way/search/artworks_id/
Request body:
  ids: the list of artwork ids
Response:
  success: true if successfully found a way connecting all artworks minimizing total distance
  content: json file of the way
  err: error message
*/
// Currently only dummy, so no graph optimization is done. Dummy only returns a path conencting some specific ndoes.
// Current dummy finds a random way in the graph, only works if there is already a graph.
exports.searchByGalleryName = function(req, res) {
  // input: gallery names
  var inNames = req.body.name.split(",");
  GalleryName2PosOutput(req, res, inNames, OrderedGalleryName2WayGalleries, false);
}

exports.searchValidName = function(req, res) {
  // input: gallery names
  var query = req.body.name;
  Gallery.findOne({
    name: query
  }, function(err, result) {
    if (result != null) {
      // found the query
      MyUtil.sendSuccessResponse(res, {
        valid: true
      });
    } else {
      Artwork.findOne({
        $or: [{
          name: query
        }, {
          author: new RegExp(query, "i")
        }, ],
      }, function(err, result2) {
        if (result2 != null) {
          // found the query
          MyUtil.sendSuccessResponse(res, {
            valid: true
          });
        } else {
          MyUtil.sendSuccessResponse(res, {
            valid: false
          });
        }
      });
    }
  });
}

exports.searchByArtworkName = function(req, res) {
  // convert into way names
  var inNames = req.body.name.split(",");
  ArtworkName2GalleryName(inNames,
    function(err, GalleryNames) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      }
      // get unique gallerynames
      // get unique gallerynames
      var UniqueNames = MyUtil.getUnique(GalleryNames);
      GalleryName2PosOutput(req, res, UniqueNames, OrderedGalleryName2WayGalleries, false);
    });
}

exports.searchByArtworkAuthor = function(req, res) {
  // convert into way names
  var inNames = req.body.author.split(",");
  ArtworkAuthor2GalleryName(inNames,
    function(err, outGalleryNames) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      }
      // get unique gallerynames
      var uniqueName = MyUtil.getUnique(outGalleryNames);
      GalleryName2PosOutput(req, res, uniqueName, OrderedGalleryName2WayGalleries, false);
    });
}

exports.searchByDescription = function(req, res) {
  // only one description
  //var desc = req.body.desc.split(",");
  var desc = [req.body.desc];
  console.log(desc);
  // for each found way,
  // do GalleryName2Pos
  Description2GalleryName(desc,
    function(err, ways) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      }
      console.log(ways);
      var GalleryNames = ways[0][0];
      var pos = new MyUtil.createArray(3, GalleryNames.length);
      // save way name
      pos[1] = ways[1][0];
      // save way description
      pos[2] = ways[2][0];
      MyUtil.dbFuncArr(GalleryNames, pos[0],
        function(dbOut, index, dbValue, cb) {
          GalleryName2Pos(dbValue, OrderedGalleryName2WayGalleries,
            function(err, out) {
              console.log(index + ": " + out);
              dbOut[index] = out;
              cb(null);
            },
            false);
        },
        function(err) {
          if (err) {
            MyUtil.sendErrResponse(res, 500, err.message);
          } else {
            PosOutput(req, res, err, pos);
          }
        },
        false);
    },
    false);
}

exports.search = function(req, res) {
  // convert into way names
  var inNames = req.body.name.split(",");
  // replace artwork name with gallery name
  ArtworkName2GalleryName(inNames,
    function(err, result1) {
      if (err) {
        MyUtil.sendErrResponse(res, 500, err.message);
      }
      for (var ii = 0; ii < result1.length; ii++) {
        if (result1[ii] === undefined) {
          result1[ii] = inNames[ii];
        }
      }
      // replace artwork author with gallery name
      //console.log("s2: " + result1);
      ArtworkAuthor2GalleryName(result1,
        function(err, result2) {
          if (err) {
            MyUtil.sendErrResponse(res, 500, err.message);
          }
          //console.log("s3: " + result2);
          for (var ii = 0; ii < result2.length; ii++) {
            if (result2[ii] === undefined) {
              result2[ii] = result1[ii];
            }
          }
          //console.log("s4: " + result2);
          // replace gallery names to pos
          GalleryName2PosOutput(req, res, MyUtil.getUnique(result2), OrderedGalleryName2WayGalleries, false);
        });
    });
}


// END OF CURRENT VERSION