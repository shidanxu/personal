// Origin/Destination marker keeps track of the origin/destination on the google maps
var OriginMarker;
var DestinationMarker;

// The time and price weight in calculation of agony
var timeAgonySkew = 5;
var priceAgonySkew = 5;

// Since walking and biking do not have cost, we associate with our estimate of opportunity cost
var walkingCostPerMeter = 0;
var BikingCostPerMeter = 0;
// This is a design choice to hard code MBTACost. 
var MBTACost = 2.1;

//The setting for owining a bike versus using hubway
var ownBike = true;


// The google map
var map;

// The search echo from Google, Uber
var googleBikingRoute;
var googleWalkingRoute;
var googleTransitRoute;
var googleDrivingRoute;
var hubwayRoute;
var hubwayResponse;
var uberResult;

// This renderer helps put paths onto the map
var directionsDisplay = new google.maps.DirectionsRenderer({
    'map': map,
    suppressBicyclingLayer: true
});

// This method puts the search boxes and buttons onto the map
function initialize() {
    // var bool = true;

    var markers = [];
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Set our default search map to center around Cambridge
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(42.34, -71.11),
        new google.maps.LatLng(42.38, -71.07));
    map.fitBounds(defaultBounds);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var input2 = document.getElementById('pac-input2');
    var preferences = document.getElementById('prefs')
        // tabs lets user select search results sorted in a field
    var tabs = document.getElementById('searchbox-container');

    // route is the route button for search
    var route = document.getElementById('route');
    // Indicate loading when search is not done
    var loadingOverlay = document.getElementById('loadingOverlay');


    // Putting all the UI elements on the map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(tabs);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(route);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(preferences);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(loadingOverlay);


    // Make two search boxes for origin and destination
    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input));

    var searchBox2 = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input2));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        // New places are empty, do nothing to the display.
        if (places.length == 0) {
            return;
        }


        // For each place, get the icon, place name, and location.
        if (places.length > 1) {
            for (var i = 0, marker; marker = markers[i]; i++) {
                if (marker != DestinationMarker && marker != OriginMarker)
                    marker.setMap(null);
            }
        }
        // clear OriginMarker
        if (places.length == 1 && OriginMarker != null) {
            OriginMarker.setMap(null);
            OriginMarker = null;
            markers = [DestinationMarker];
        }


        // Fit the google map to bounds that enclose all the position markers.
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            // Set the origin marker only if 1 place entered
            if (places.length == 1) {
                OriginMarker = marker;
            }

            markers.push(marker);

            // make sure we can see all locations entered
            bounds.extend(place.geometry.location);
        }

        // zoom in if only one place, fit otherwise
        if (places.length == 1) {
            map.setCenter(bounds.getCenter());
            map.setZoom(14);
        } else {
            map.fitBounds(bounds);
        }
    });

    // Do the same thing on search box 2
    google.maps.event.addListener(searchBox2, 'places_changed', function() {
        var places = searchBox2.getPlaces();

        // new places has nothing, do nothing.
        if (places.length == 0) {
            return;
        }


        // For each place, get the icon, place name, and location.
        if (places.length > 1) {
            for (var i = 0, marker; marker = markers[i]; i++) {
                if (marker != DestinationMarker && marker != OriginMarker) {
                    marker.setMap(null);
                }
            }
        }

        // Reset the marker on the map if one place entered
        if (places.length == 1 && DestinationMarker != null) {
            DestinationMarker.setMap(null);
            DestinationMarker = null;
            markers = [OriginMarker];
        }

        // Fit bounds to the places entered.
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {

            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            // Change the destination only if one place entered
            if (places.length == 1) {
                DestinationMarker = marker;
            }
            markers.push(marker);

            // Make sure we see all locations
            bounds.extend(place.geometry.location);
        }
        // Zoom if only one place, fit otherwise
        if (places.length == 1) {
            map.setCenter(bounds.getCenter());
            map.setZoom(14);
        } else {
            map.fitBounds(bounds);
        }

        // console.log("Origin marker: " + OriginMarker.title);
        // console.log("Origin coordinates: " + OriginMarker.position);
        // console.log("Destination marker: " + DestinationMarker.title);
        // console.log("Destination coordinates: " + DestinationMarker.position);

        // When the route button is called, clear the markers after calculation
        route.addEventListener('click', function() {

            // Check whether either origin or destination is too far away from MIT,
            // in which case we do not support and alert the user.
            var dist1 = utils.findDistance(OriginMarker.position.lat(), OriginMarker.position.lng());
            var dist2 = utils.findDistance(DestinationMarker.position.lat(), DestinationMarker.position.lng());

            if (dist1 > 50 || dist2 > 50) {
                alert("We only support 50 miles within center of universe (MIT).");
            } 
            // Otherwise Calculate the routes
            else {
                getGoogleRoutes();
            }

            // Clear the markers after the computation, as the results have their own markers.
            OriginMarker.setMap(null);
            DestinationMarker.setMap(null);
        });

    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
        searchBox2.setBounds(bounds);
    });
}

// Helper function when user selects own bike
function setOwn() {
    $("#ownBike").prop('checked', true);
    $("#hubway").prop('checked', false);
    ownBike = true;

}

// Helper function when user selects hubway
function setHubway() {
    $("#hubway").prop('checked', true);
    $("#ownBike").prop('checked', false);
    ownBike = false;
}

// Given the states of the slider bar, set the time and price agony skews accordingly.
function setPrefVals() {
    var sliderval = $("#tradeOff").val()
    console.log(sliderval)
    timeAgonySkew = (100-sliderval)/10;
    priceAgonySkew = sliderval/10;
    if(DestinationMarker!=null&&OriginMarker!=null){
      //this can be uncommented to re-display routes when changing the slider. WARNING: Changing too quickly will overload google maps API requests
      //getGoogleRoutes();
      calculateBestRoute();
    }
}

// call initialize on load
google.maps.event.addDomListener(window, 'load', initialize);