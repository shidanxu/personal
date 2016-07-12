var mongoose = require('mongoose');

mongoose.connect("mongodb://hiproute:hiproute@ds053130.mongolab.com:53130/6170_proj_4");

var db = mongoose.connection;

// error handler middleware
db.on('error', console.error.bind(console, 'connection error:'));
module.exports = db;