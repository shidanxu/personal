var request = require('request');
var uberModel = require('../schemas/uber_schema');

var uberApiToken = "Token 5hbZbecaeUS31PBvzBLYJgju732mUg2LUaYH3Myg";

/*
	Gets a start pt price data response

	TAKES:
		start lng: Number
		start lat: Number

	ON SUCCESS:
		Returns the uber product response via callback(data, null)

	ON FAILURE:
		Returns the error via callback(null, err)
*/
var getProductResponse = function(startLng, startLat, callback){
	var options = {
	    url: 'https://api.uber.com/v1/products',
	    headers: {
	        'Authorization': uberApiToken
    	},
    	qs: {
			"latitude": startLat,
			"longitude": startLng
    	}
	};

	request(options, function(err, response, body){
		var data = JSON.parse(body);
		if (err){
			callback(err, null);
		} else {
			callback(null, data);
		}
	});
}

/*
	Gets a start->destination price data response

	TAKES:
		start lng: Number
		start lat: Number
		end lng: Number
		end lat: Number

	ON SUCCESS:
		Returns the uber price response via callback(data, null)

	ON FAILURE:
		Returns the error via callback(null, err)
*/
var getPriceResponse = function(startLng, startLat, endLng, endLat, callback){
	var options = {
	    url: 'https://api.uber.com/v1/estimates/price',
	    headers: {
	        'Authorization': uberApiToken
    	},
    	qs: {
			"start_latitude": startLat,
			"start_longitude": startLng,
			"end_latitude": endLat,
			"end_longitude": endLng
    	}
	};

	request(options, function(err, response, body){
		var data = JSON.parse(body);
		if (err){
			callback(null, err);
		} else {
			callback(data, null);
		}
	});
}

/*
	Gets a time estimate response

	TAKES:
		start lng: Number
		start lat: Number

	ON SUCCESS:
		Returns the uber price response via callback(data, null)

	ON FAILURE:
		Returns the error via callback(null, err)
*/
var getTimeEstimateResponse = function(startLng, startLat, callback){
	var options = {
	    url: 'https://api.uber.com/v1/estimates/time',
	    headers: {
	        'Authorization': uberApiToken
    	},
    	qs: {
			"start_latitude": startLat,
			"start_longitude": startLng
    	}
	};

	request(options, function(err, response, body){
		var data = JSON.parse(body);
		if (err){
			callback(null, err);
		} else {
			callback(data, null);
		}
	});
}

/*
	Gets a start->destination uber response.

	MVP: just return the object for the cheapest ride

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
var getUberObject = function(startLng, startLat, endLng, endLat, callback){
	// check each param first
	if (!startLng || !startLat || !endLng || !endLat){
		// return a huge error
		callback(null, {msg:"invalid input"});
		return;
	}

	// get a price callback
	getPriceResponse(startLng, startLat, endLng, endLat, function(priceData, priceError){
		if (priceError){
			callback(null, priceError);
		} else {
			// we got the price data! get the time data as well
			getTimeEstimateResponse(startLng, startLat, function(timeData, timeError){
				if (timeError){
					callback(null, timeError);
				} else {
					// we have the time & price data
					// find the cheapest out of all the products in the price response
					var prices = priceData.prices;

					if (!prices || prices.length==0){
						// fail on empty prices data
						callback(null, {msg: "no prices available"});
						return;
					}

					// set default values
					var cheapestProductId = prices[0].product_id;
					var cheapestPrice = 10000; // ~infinity
					var cheapestJson; // the actual json value for the cheapest found thus far

					for (var i = 0; i < prices.length; i++) {
						if ( prices[i].low_estimate != null && prices[i].low_estimate < cheapestPrice){
							// update the best price
							cheapestPrice = prices[i].low_estimate;
							cheapestProductId = prices[i].product_id;
							cheapestJson = prices[i];
						}
					};

					// then match that product to a time estimate
					var times = timeData.times;
					var timesJson;

					if (!times || times.length == 0){
						// fail on empty times data
						callback(null, {msg: "no time estimates available"});
						return;
					}

					for (var i = 0; i < times.length; i++) {
						if (times[i].product_id == cheapestProductId){
							timesJson = times[i];
							break;
						}
					};

					// now the data for the object is inside timesJson and cheapestJson. Merging the two gives us all the data we need
					var uberObject = new uberModel.UberObject({
						productId: cheapestProductId,
						eta: timesJson.estimate,
						duration: cheapestJson.duration,
						costEstimateLow: cheapestJson.low_estimate,
						costEstimateHigh: cheapestJson.high_estimate,
						originLng: startLng,
						originLat: startLat,
						destLng: endLng,
						destLat: endLat,
						timestamp: Date.now()
					});

					uberObject.save(function(err, doc){
						if (err){
							console.log("Error saving uberObject");
							console.log(err);
							callback(null, err);
						} else {
							callback(uberObject, null);
						}
					});

				}
			});
		}
	});

}

/*
	Gets all the start->destination uber responses.

	TAKES:
		start lng: Number
		start lat: Number
		end lng: Number
		end lat: Number

	ON SUCCESS:
		Returns the uber object responses inside the schema via callback(data, null)
		Returned docs may not be fully saved to the db

	ON FAILURE:
		Returns the error via callback(null, err)
*/
var getAllUberObjects = function(startLng, startLat, endLng, endLat, callback){
	// check each param first
	if (!startLng || !startLat || !endLng || !endLat){
		// return a huge error
		callback(null, {msg:"invalid input"});
		return;
	}

	// get a price callback
	getPriceResponse(startLng, startLat, endLng, endLat, function(priceData, priceError){
		if (priceError){
			callback(null, priceError);
		} else {
			// we got the price data! get the time data as well
			getTimeEstimateResponse(startLng, startLat, function(timeData, timeError){
				if (timeError){
					callback(null, timeError);
				} else {
					// we have the time & price data, now combine them
					var prices = priceData.prices;

					if (!prices || prices.length==0){
						// fail on empty prices data
						callback(null, {msg: "no prices available"});
						return;
					}

					var times = timeData.times;

					if (!times || times.length == 0){
						// fail on empty times data
						callback(null, {msg: "no time estimates available"});
						return;
					}

					// create a hash of all the times data to their product id
					var productIdToEstimateHash = {};
					for (var i = 0; i < times.length; i++) {
						productIdToEstimateHash[times[i].product_id] = times[i].estimate;
					};

					// create the uber objects here
					var uberObjectResultList = [];
					for (var i = 0; i < prices.length; i++) {
						var uberObject = new uberModel.UberObject({
							productId: prices[i].product_id,
							eta: productIdToEstimateHash[prices[i].product_id],
							duration: prices[i].duration,
							costEstimateLow: prices[i].low_estimate,
							costEstimateHigh: prices[i].high_estimate,
							originLng: startLng,
							originLat: startLat,
							destLng: endLng,
							destLat: endLat,
							timestamp: Date.now()
						});

						uberObject.save(function(err, doc){
							if (err){
								console.log("Error saving uberObject");
								console.log(uberObject);
								console.log(err);
							}
						});

						uberObjectResultList.push(uberObject);
					};

					callback(uberObjectResultList, null);
				}
			});
		}
	});

}

module.exports = {getUberObject:getUberObject, getAllUberObjects:getAllUberObjects};