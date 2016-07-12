var mongoose = require('mongoose')
	,Schema = mongoose.Schema

// https://developer.uber.com/v1/endpoints/
var uberSchema = Schema({
	// Returned by uber API
	productId: String,
	eta: Number, // in seconds "Estimated time of arrival"
	duration: Number, // in seconds
	costEstimateLow: Number,
	costEstimateHigh: Number,

	// Provided by us, used to make API
	originLng: Number,
	originLat: Number,
	destLng: Number,
	destLat: Number,
	timestamp: Number
});

var uu = mongoose.model('UberObject', uberSchema);

module.exports = {UberObject:uu};