/* 
  Calcluate the best route, based on agongy, time and price and display results on main interface.
  Called when time, cost and route results are returned from google and Uber API
  OUTPUT: Displays results (time, distance, agony) on map.
*/

function calculateBestRoute() {
    // Check to make sure routes are valid
    if ((ownBike && googleBikingRoute == null) || (!ownBike && hubwayRoute == null) || googleWalkingRoute == null || googleTransitRoute == null || googleDrivingRoute == null || uberResult == null) {
        return;
    }
    $("#agony").html('');
    $("#price").html('');
    $("#time").html('');
    // Get sorted routes
    var agonySortedRoutes = getAgonySortedResults();
    var priceSortedResults = getPriceSortedResults();
    var timeSortedResults = getTimeSortedResults();
    // console.log(agonySortedRoutes);
    // console.log(priceSortedResults);

    // Add in each route and onclick methods
    for (var i = 0; i < agonySortedRoutes.length; i++) {
        $("#agony").append('<div class="results-line ' + agonySortedRoutes[i].displayName + '" onclick="displayRoute(' + "'" + agonySortedRoutes[i].displayName + "'" + ')"><div class="pull-left">' + agonySortedRoutes[i].displayName + '</div><div class="pull-right">score: ' + agonySortedRoutes[i].Agony + '</div></div><div class="clearfix"></div>')
    }
    for (var i = 0; i < priceSortedResults.length; i++) {
        $("#price").append('<div class="results-line ' + priceSortedResults[i].displayName + '" onclick="displayRoute(' + "'" + priceSortedResults[i].displayName + "'" + ')""><div class="pull-left">' + priceSortedResults[i].displayName + '</div><div class="pull-right">$' + priceSortedResults[i].price + '</div></div><div class="clearfix"></div>')
    }
    for (var i = 0; i < timeSortedResults.length; i++) {
        $("#time").append('<div class="results-line ' + timeSortedResults[i].displayName + '" onclick="displayRoute(' + "'" + timeSortedResults[i].displayName + "'" + ')""><div class="pull-left">' + timeSortedResults[i].displayName + '</div><div class="pull-right">' + timeSortedResults[i].time + ' minutes</div></div><div class="clearfix"></div>')
    }
    // Display the lowest agony route as default
    displayRoute(agonySortedRoutes[0].displayName);

    
    $(".searchbox-container").show();
    $("#loadingOverlay").fadeOut(500);


}

/*
  Calls google and uber API for route, time and cost for three transportation: Walking, Public transportation and Driving
  This function is called when user clicks "Hiproute"
  INPUT: none. Fetches the start location and destination locatoin from markers on the map
  OUTPUT: none. Saved return resutls from API and call calculateBestRoute() to compare results.
*/
function getGoogleRoutes() {



    $("#loadingOverlay").fadeIn(500);
    // Get the data to pass into hubway api
    var startLat = OriginMarker.position.lat();
    var startLng = OriginMarker.position.lng();
    var endLat = DestinationMarker.position.lat();
    var endLng = DestinationMarker.position.lng();
    //Get route for bike from google
    if (!ownBike) {
        $.ajax({
            type: "GET",
            url: "/api/hubway",
            data: {
                "start_lat": startLat,
                "start_lng": startLng,
                "end_lat": endLat,
                "end_lng": endLng
            },
            success: function(data) {
                // console.log(data);
                hubwayResponse = data.payload;
                routeGoogle(google.maps.DirectionsTravelMode.BICYCLING, function(res) {
                    hubwayRoute = res;
                    routeGoogle(google.maps.DirectionsTravelMode.WALKING, function(res) {
                        var newlegs = new Array(res.routes[0].legs[0])
                        newlegs.push(hubwayRoute.routes[0].legs[0])
                        hubwayRoute.routes[0].legs = newlegs;
                        routeGoogle(google.maps.DirectionsTravelMode.WALKING, function(res) {
                            hubwayRoute.routes[0].legs.push(res.routes[0].legs[0]);
                            console.log(hubwayRoute);
                            calculateBestRoute();
                        }, "(" + data.payload.endStationLat + "," + data.payload.endStationLng + ")", DestinationMarker.position);
                    }, OriginMarker.position, "(" + data.payload.startStationLat + "," + data.payload.startStationLng + ")");
                }, "(" + data.payload.startStationLat + "," + data.payload.startStationLng + ")", "(" + data.payload.endStationLat + "," + data.payload.endStationLng + ")");
            }
        })
    } else {
        routeGoogle(google.maps.DirectionsTravelMode.BICYCLING, function(res) {
            googleBikingRoute = res;
            calculateBestRoute();
        });
    }

    //Get route for walking from google
    routeGoogle(google.maps.DirectionsTravelMode.WALKING, function(res) {
        googleWalkingRoute = res;
        calculateBestRoute();

    });

    //Get route for public transportation from google
    routeGoogle(google.maps.DirectionsTravelMode.TRANSIT, function(res) {
        googleTransitRoute = res;
        calculateBestRoute();
    });

    //Get route for driving from google
    routeGoogle(google.maps.DirectionsTravelMode.DRIVING, function(res) {
        googleDrivingRoute = res;
        calculateBestRoute();

    });

    // Getting Uber data, first get lat long from Origin and Destination maker displayed on map.



    var data = {
        "start_lat": startLat,
        "start_lng": startLng,
        "end_lat": endLat,
        "end_lng": endLng
    };

    //call API provided on our server for uber cost and time
    routeUber(data, function(res) {
        uberResult = res;
        calculateBestRoute();
    });
}

/*
  Call google api for direction from start to destination.
  INPUT: 
    mode: transportation mode
    cb: callback function used to pass returned results
*/
function routeGoogle(mode, cb, manualOrigin, manualDestination) {
    var directionsService = new google.maps.DirectionsService();
    var start;
    var end;
    if (manualDestination == null && manualOrigin == null) {
        start = OriginMarker.position;
        end = DestinationMarker.position;
    } else {
        start = manualOrigin;
        end = manualDestination
    }
    // console.log("Start: " + start);
    // console.log("End: " + end);
    var waypoints = []; // init an empty waypoints array

    var request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        unitSystem: google.maps.UnitSystem.IMPERIAL,

        //fix this for not driving
        travelMode: mode,
    };

    directionsService.route(request, function(response, status) {

        //if routes are returned correct, pass it to callback function
        if (status == google.maps.DirectionsStatus.OK) {
            $('#directionsPanel').empty(); // clear the directions panel before adding new directions

            cb(response);
        } else {
            // alert an error message when the route could nog be calculated.
            if (status == 'ZERO_RESULTS') {
                alert('No route could be found between the origin and destination.');
            } else if (status == 'UNKNOWN_ERROR') {
                alert('A directions request could not be processed due to a server error. The request may succeed if you try again.');
            } else if (status == 'REQUEST_DENIED') {
                alert('This webpage is not allowed to use the directions service.');
            } else if (status == 'OVER_QUERY_LIMIT') {
                alert('The webpage has gone over the requests limit in too short a period of time.');
            } else if (status == 'NOT_FOUND') {
                alert('At least one of the origin, destination, or waypoints could not be geocoded.');
            } else if (status == 'INVALID_REQUEST') {
                alert('The DirectionsRequest provided was invalid.');
            } else {
                alert("There was an unknown error in your request. Requeststatus: nn" + status);
            }
        }
    });
}

/* 
  Wrapper to call API provided on server for getting uber results
  Input:
    query: query string to send through uber api
    cb: callback function used to pass returned data
*/

function routeUber(query, cb) {
    $.ajax({
        type: "GET",
        url: '/api/uber',
        data: query,
        success: function(msg) {
            cb(msg.payload);
        }
    });
}

/* 
  Wrapper to call API provided on server for getting hubway results
  Input:
    query: query string to send through hubway api
    cb: callback function used to pass returned data
*/
function routeHubway(query, cb) {
    $.ajax({
        type: "GET",
        url: '/api/hubway',
        data: query,
        success: function(msg) {
            cb(msg.payload);
        }
    });
}