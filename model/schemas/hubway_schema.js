var mongoose = require('mongoose'),
    Schema = mongoose.Schema

//http://codepen.io/thethp/details/jtare
var hubwaySchema = Schema({
    // Returned by hubway API
    startStationLng: Number,
    startStationLat: Number,
    startStationId: Number,
    startStationName: String,

    endStationLng: Number,
    endStationLat: Number,
    endStationId: Number,
    endStationName: String,

    // Provided by us, used to make API
    originLng: Number,
    originLat: Number,
    destLng: Number,
    destLat: Number,
    timestamp: Number
});

var hb = mongoose.model('HubwayObject', hubwaySchema);

module.exports = {
    HubwayObject: hb
};