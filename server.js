// Lead author: Shidan Xu and Donglai Wei

// global variable
deploy = true;

// load configuration
var path = require('path');
config = require(path.join(__dirname,  'config', 'config'));

// build database
var mongoose = require('mongoose');
require(path.join(__dirname,  'config', 'mongoose'))(mongoose);


// build app
var express = require('express');
var app = express();
// express settings
require(path.join(__dirname,  'config', 'express'))(app);
// routes settings
require(path.join(__dirname,  'config', 'routes'))(app);

console.log(__dirname);


// setup the server
if (deploy) {
	var port = process.env.OPENSHIFT_NODEJS_PORT;
	var ip = process.env.OPENSHIFT_NODEJS_IP;
	app.listen(port || 3000, ip);
} else {
	// Start the app by listening on port
	app.set('port', process.env.PORT || 3000);
	var debug = require('debug')('app');
	var server = app.listen(app.get('port'), function() {
		console.log('Express api server listening on port ' + server.address().port);
	});
}
