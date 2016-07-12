var markerArray = [];

/*
  This helper function sorts the search path results by price, with the cheapest first.
*/
function getPriceSortedResults() {
    var prices = [];
    var uberPrice = Math.floor((uberResult.costEstimateHigh + uberResult.costEstimateLow) / 2);

    // Uber can return no results, instead of placing not a number, rather use not available.
    if (isNaN(uberPrice)) {
        uberPrice = 'N/A';
    }
    prices.push({
        price: uberPrice,
        displayName: 'Uber'
    });
    prices.push({
        price: Math.round((googleWalkingRoute.routes[0].legs[0].distance.value * walkingCostPerMeter) * 100) / 100,
        displayName: 'Walking'
    });
    if (ownBike) {
        prices.push({
            price: Math.round((googleBikingRoute.routes[0].legs[0].distance.value * BikingCostPerMeter) * 100) / 100,
            displayName: 'Biking'
        });
    } else {
        prices.push({
            price: 0,
            displayName: 'Hubway'
        });
    }

    prices.push({
        price: MBTACost,
        displayName: 'MBTA'
    });

    // sort the results by price
    prices.sort(function(a, b) {
        if (a.price == 'N/A') {
            return true;
        } else if (b.price == 'N/A') {
            return false;
        }
        return a.price > b.price;
    })
    return prices;
};


/*
  This helper fucntion sorts the search path results by time, with fastest first
*/
function getTimeSortedResults() {
    var times = [];
    var uberTime = Math.floor((uberResult.duration + uberResult.eta) / 60);

    // In case Uber returns no results
    if (isNaN(uberTime)) {
        uberTime = 'N/A'
    }

    times.push({
        time: uberTime,
        displayName: 'Uber'
    });
    times.push({
        time: utils.findTotalTime(googleWalkingRoute.routes[0].legs),
        displayName: 'Walking'
    });
    if (ownBike) {
        times.push({
            time: utils.findTotalTime(googleBikingRoute.routes[0].legs),
            displayName: 'Biking'
        });
    } else {
        times.push({
            time: utils.findTotalTime(hubwayRoute.routes[0].legs),
            displayName: 'Hubway'
        });
    }

    times.push({
        Results: googleTransitRoute,
        time: utils.findTotalTime(googleTransitRoute.routes[0].legs),
        displayName: 'MBTA'
    });

    // sort the results by time
    times.sort(function(a, b) {
        if (a.time == 'N/A') {
            return true;
        } else if (b.time == 'N/A') {
            return false;
        }
        return a.time > b.time;
    })
    return times;
};

/*
  This helper function displays all the routes from our search path results onto the google maps
*/
function displayRoute(route) {
    if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }

    for (i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }

    markerArray = [];

    directionsDisplay = new google.maps.DirectionsRenderer({
        'map': map,
        suppressBicyclingLayer: true
    });
    directionsDisplay.set('directions', null);
    if (route == 'Uber') {
        directionsDisplay.setDirections(googleDrivingRoute);
    } else if (route == 'Walking') {
        directionsDisplay.setDirections(googleWalkingRoute);
    } else if (route == 'Biking') {
        directionsDisplay.setDirections(googleBikingRoute);
    } else if (route == 'Hubway') {
        var rendererOptions = {
            map: map,
            suppressMarkers: true
        }
        directionsDisplay.setOptions(rendererOptions);
        directionsDisplay.setDirections(hubwayRoute);
        drawHubwayMakers();
    } else if (route == 'MBTA') {
        directionsDisplay.setDirections(googleTransitRoute);
    }
    $('.results-line').removeClass('selectedRoute');
    $('.' + route).addClass('selectedRoute');

}

/*
  This helper function determines by which field we are sorting our results by.
*/
function setDisplayCategory(category) {
    if (category == 'Agony') {
        displayRoute(getAgonySortedResults()[0].displayName);
    } else if (category == 'Time') {
        displayRoute(getTimeSortedResults()[0].displayName);
    } else if (category == 'Price') {
        displayRoute(getPriceSortedResults()[0].displayName);
    }
}

/*
    This helper function draws makers for hubway route
*/
function drawHubwayMakers(){
    var icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=A|00CC00|000000";
    var marker = new google.maps.Marker({
        position: hubwayRoute.routes[0].legs[0].start_location, 
        map: map,
        icon: icon
    });
    markerArray.push(marker);

    icon = "https://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=" 
    + hubwayResponse.startStationName
    + "|12|008A00|bicycle|24|33CC33|FFFFFF";
    marker = new google.maps.Marker({
        position: hubwayRoute.routes[0].legs[1].start_location, 
        map: map,
        icon: icon
    });

    markerArray.push(marker);

    icon = "https://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=" 
    + hubwayResponse.endStationName
    + "|12|008A00|bicycle|24|33CC33|FFFFFF";
    marker = new google.maps.Marker({
        position: hubwayRoute.routes[0].legs[2].start_location, 
        map: map,
        icon: icon
    });
    markerArray.push(marker);

    var icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=B|FF3333|000000";
    var marker = new google.maps.Marker({
        position: hubwayRoute.routes[0].legs[2].end_location, 
        map: map,
        icon: icon
    });
    markerArray.push(marker);
}