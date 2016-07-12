var request = require('request');
var baseUrl = 'http://thpcod.es/hubwaypi/'
var hubwayModel = require('../schemas/hubway_schema');

var numStations = 5;

/*
    Gets a start->destination uber response.

    MVP: just return the object for the cheapest ride

    TAKES:
        startlng: Number, start point Longitute
        startlat: Number, start point Latitute
        endlng: Number, end point Longitute
        endlat: Number, end point Lattitute

    ON SUCCESS:
        Returns the hubway object response inside the schema via callback(data, null)
        Hubway object contains information of closest available hubway station near origin
        and closest available hubway station near destination

    ON FAILURE:
        Returns the error via callback(null, err)
*/
var getHubwayObject = function(startLng, startLat, endLng, endLat, callback) {
    //Get 5 closest stations to start location, find the nearest one with bike
    var startQuery = {
        url: (baseUrl + 'stations/closest/' + startLat + '/' + startLng + '/' + numStations)
    }

    request(startQuery, function(err, response, body) {
        var startStations = JSON.parse(body);
        if (err) {
            callback(err, null);
        } else {
            var startStation = null;
            if (startStations.length > 0) {
                for (var i = 0; i < startStations.length; i++) {
                    var st = startStations[i];
                    if (isValidStation(st) && st.nbBikes > 0) {
                        startStation = st;
                        break;
                    }
                }
            }
            if (startStation == null) {
                callback('All hubway stations around starting point is unavailable or out of bikes', null);
            } else {
                var endQuery = {
                    url: (baseUrl + 'stations/closest/' + endLat + '/' + endLng + '/' + numStations)
                }
                request(endQuery, function(err, response, body) {
                    var endStations = JSON.parse(body);
                    if (err) {
                        callback(err, null);
                    } else {
                        var endStation = null;
                        if (endStations.length > 0) {
                            for (var i = 0; i < endStations.length; i++) {
                                var st = endStations[i];
                                if (isValidStation(st) && st.nbEmptyDocks > 0) {
                                    endStation = st;
                                    break;
                                }
                            }
                        }
                        if (endStation == null) {
                            callback('All hubway stations around destination is unavailable or full', null);
                        } else {
                            var hubwayObject = new hubwayModel.HubwayObject({
                                startStationLng: startStation.long,
                                startStationLat: startStation.lat,
                                startStationId: startStation.id,
                                startStationName: startStation.name,

                                endStationLng: endStation.long,
                                endStationLat: endStation.lat,
                                endStationId: endStation.id,
                                endStationName: endStation.name,

                                // Provided by us, used to make API
                                originLng: startLng,
                                originLat: startLat,
                                destLng: endLng,
                                destLat: endLat,
                                timestamp: Date.now()
                            });

                            hubwayObject.save(function(err, doc) {
                                if (err) {
                                    console.log("Error saving hubwayObject");
                                    console.log(err);
                                    callback(null, err);
                                } else {
                                    callback(hubwayObject, null);
                                }
                            });
                        }
                    };
                });
            }
        };
    });
}

var isValidStation = function(station) {
    return (station.installed == "true" && station.locked == "false" && station.public == "true");
}

module.exports = {
    getHubwayObject: getHubwayObject
};