var express = require('express');
var router = express.Router();
var apiResponder = require('../util/apiResponseFormatter');
var uberDataGetter = require('../model/uber_api/uber_data_getter');
var hubwayDataGetter = require('../model/hubway_api/hubway_data_getter');

router.get('/', function(req, res) {
	apiResponder.send(res, 200, "hello world", {});
});

// show the test results page!
router.get('/testing', function(req, res) {
	res.render('all_test_runner',{});
});

/*
	Gets an uber response.

	TAKES:
		start lng: Number
		start lat: Number
		end lng: Number
		end lat: Number

	ON SUCCESS:
		Returns the uber object response inside the schema via callback(data, null)

	ON FAILURE:
		Returns the error via callback(null, err)
*/
router.get('/uber',function(req, res) {
	// get params
	var startLat = req.param('start_lat');
	var startLng = req.param('start_lng');
	var endLat = req.param('end_lat');
	var endLng = req.param('end_lng');
	console.log("uber api call");
	console.log(startLat);
	console.log(startLng);
	console.log(endLat);
	console.log(endLng);

	uberDataGetter.getUberObject(startLng, startLat, endLng, endLat, function(data, err){
		if (err){
			console.log("error with uberDataGetter.getUberObject");
			console.log(err);
			apiResponder.send(res, 400, "error occurred", {});
		} else {
			console.log(data);
			apiResponder.send(res, 200, "OK. Returned the cheapest uber available", data);
		}
	});
});

/*
	Gets all uber responses for a trip.

	TAKES:
		start lng: Number
		start lat: Number
		end lng: Number
		end lat: Number

	ON SUCCESS:
		Returns the uber object response inside the schema via callback(data, null)

	ON FAILURE:
		Returns the error via callback(null, err)
*/
router.get('/ubers',function(req, res) {
	// get params
	var startLat = req.param('start_lat');
	var startLng = req.param('start_lng');
	var endLat = req.param('end_lat');
	var endLng = req.param('end_lng');
	console.log("uber api call");
	console.log(startLat);
	console.log(startLng);
	console.log(endLat);
	console.log(endLng);

	uberDataGetter.getAllUberObjects(startLng, startLat, endLng, endLat, function(data, err){
		if (err){
			console.log("error with uberDataGetter.getUberObject");
			console.log(err);
			apiResponder.send(res, 400, "error occurred", {});
		} else {
			console.log(data);
			apiResponder.send(res, 200, "OK. Returned all ubers and their ETAs", data);
		}
	});
});

router.get('/hubway',function(req, res) {
	// get params
	var startLat = req.param('start_lat');
	var startLng = req.param('start_lng');
	var endLat = req.param('end_lat');
	var endLng = req.param('end_lng');

	hubwayDataGetter.getHubwayObject(startLng, startLat, endLng, endLat, function(data, err){
		if (err){
			console.log("error with hubwayDataGetter.getHubwayObject");
			console.log(err);
			apiResponder.send(res, 400, "error occurred", {});
		} else {
			console.log(data);
			apiResponder.send(res, 200, "OK", data);
		}
	});
});

module.exports = router;