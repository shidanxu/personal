// Lead author: Donglai Wei

var fs = require('fs');
var readline = require('readline');
var async = require('async');

// Lines I added
var Mongoose = require('mongoose');
var Artwork = Mongoose.model('Artwork');
var Gallery = Mongoose.model('Gallery');
var Road = Mongoose.model('Road');
var Way = Mongoose.model('Way');
var Problem = Mongoose.model('Problem');

var utils = {};

/*
  Send a 200 OK with success:true in the request body to the
  response argument provided.
  The caller of this function should return after calling
*/
utils.sendSuccessResponse = function(res, content) {
  res.status(200).json({
    success: true,
    content: content
  }).end();
};

/*
  Send an error code with success:false and error message
  as provided in the arguments to the response argument provided.
  The caller of this function should return after calling
*/
utils.sendErrResponse = function(res, errcode, err) {
  res.status(errcode).json({
    success: false,
    err: err
  }).end();
};



utils.upload = function(req, res, upload_name, cb) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    var server_fn = upload_name + filename;
    console.log("Uploading: " + server_fn);
    fstream = fs.createWriteStream(server_fn);
    file.pipe(fstream);
    fstream.on('close', function() {
      console.log("Done Upload");
      cb(res, server_fn);
    });
  });
};

utils.dbFuncArr = function(dbValues,dbOut,dbFunc,cb_done,do_sync) {
  // create all queries
  var dbcalls = [];
  dbValues.forEach(
    function(dbValue, ii) {
      dbcalls.push(function(cb) {
         dbFunc(dbOut,ii,dbValue,cb);
         //console.log(ii+"_done");
        });
      });
  // execute all queries
  // execute all queries
  if (do_sync) {
    async.series(dbcalls, function(err) {
      //console.log("done sync: dbFuncArr");
      cb_done(err)
    });
  } else {
    async.parallel(dbcalls, function(err) {
      //console.log("done async: dbFuncArr");
      cb_done(err)
    });
  }
}

utils.dbGetArr = function(dbModel, dbValues, dbOut, dbQueryCb , dbAssignCb, cb_done,do_sync) {
  // create all queries
  var dbcalls = [];
  dbValues.forEach(
    function(dbValue, ii) {
      dbcalls.push(function(cb) {
        dbQueryCb(dbValue, function(query) {
          dbModel.find(query,
            function(err, result) {
              //console.log(dbValue+" arr: " + result);
              if (err == null && result != null) {
                dbAssignCb(dbOut, ii, result);
              }
              cb(null);
            });
        });
      });
    });
  // execute all queries
  if (do_sync) {
    async.series(dbcalls, function(err) {
      //console.log("done sync: dbGetArr");
      cb_done(err)
    });
  } else {
    async.parallel(dbcalls, function(err) {
      //console.log("done async: dbGetArr");
      cb_done(err)
    });
  }
}

utils.dbExistNames = function(dbModel, itemNames, cb_done) {
  // create all queries
  var calls = [];
  itemNames.forEach(function(itemName) {
    calls.push(function(cb) {
      dbModel.findOne({
        name: itemName
      }, cb);
    });
  });
  // execute all queries
  async.parallel(calls, function(err) {
    cb_done(err)
  });
}

utils.dbExistIds = function(dbModel, itemIds, cb_done) {
  // create all queries
  var calls = [];
  itemIds.forEach(function(itemId) {
    calls.push(function(cb) {
      dbModel.findById(itemId, cb);
    });
  });
  // execute all queries
  async.parallel(calls, function(err) {
    cb_done(err)
  });
}


utils.readCsvSync = function(filename, func_line) {
  var arrs = fs.readFileSync(filename).toString().split("\n");
  // remove header
  arrs.splice(0, 1);
  // remove tail
  if (arrs[arrs.length - 1] == "") {
    arrs.splice(arrs.length - 1, 1);
  }


  var calls = [];
  arrs.forEach(function(arr) {
    calls.push(function(cb) {
      func_line(arr, cb);
    });
  });
  async.series(calls, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log(filename + " load successfully.");
    }
  });
}

utils.zip = function(arr) {
  var arrayA = arr.slice(0, arr.length);
  var arrayB = arr.slice(1, arr.length + 1);
  var length = Math.min(arrayA.length, arrayB.length);
  var result = [];
  for (var n = 0; n < length; n++) {
    result.push([arrayA[n], arrayB[n]]);
  }
  return result;
}
utils.zipOrder = function(inArr) {
  var arrayA = inArr.slice(0, inArr.length);
  var arrayB = inArr.slice(1, inArr.length + 1);
  var length = Math.min(arrayA.length, arrayB.length);
  var result = [];
  // the second bit is to indicate a flip{}
  for (var n = 0; n < length; n++) {
    if (arrayA[n] < arrayB[n]) {
      result.push([arrayA[n] + '_' + arrayB[n],0]);
    } else {
      result.push([arrayB[n] + '_' + arrayA[n],1]);
    }
  }
  return result;
}

utils.createConstantArray = function(length,num) {
  return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,num);
  }
utils.createArray = function(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = utils.createArray.apply(this, args);
    }
    return arr;
}
utils.getConcat = function(arr) {
  var arr2 = [];
  return arr2.concat.apply(arr2, arr);
}
utils.getUnique = function(arr) {
  return arr.filter(function(item, i, ar) {
    return ar.indexOf(item) === i;
  });
}

utils.getUrlParam = function(inputUrl, name) {
  var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
    val = inputUrl.match(rx);
  return !val ? '' : val[1];
}




module.exports = utils;
// Read in the image file as a binary string.
// reader.onloadend = function(evt) {
//   if (evt.target.readyState == FileReader.DONE) { // DONE == 2
//     // directly output 
//     //document.getElementById('byte_content').textContent = evt.target.result;
//     var csv = evt.target.result;
//     var data = $.csv.toArrays(csv, {
//       onParseValue: $.csv.hooks.castToScalar
//     });
//   }
// };
// }