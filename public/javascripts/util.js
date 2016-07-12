var utils = {};

// These are the coordinates of 77 Mass Ave.
var lat1 = 42.360091;
var lon1 = -71.09416;

// helper function to determine the distance from a point to MIT. Returns distance in miles.
utils.findDistance = function(lat2, lon2) {
    var R = 3959; // miles
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2 - lat1) * Math.PI / 180;
    var Δλ = (lon2 - lon1) * Math.PI / 180;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return d;
};

// This helper function changes colors of the search results backgrounds.
// Unused due to asthetical reasons. sortByField is one of 'Agony', 'time', 'price'.
utils.changeColors = function(sortedRoutes, sortByField){
    var base = sortedRoutes[0][sortByField];

    // normalized = largest - smallest. Take the entire interval of the field(Agony for example) values.
    var normalize = sortedRoutes[sortedRoutes.length - 1][sortByField] - base;

    // Then for each results, figure out where the value is in the interval. Returns a ratio from 0 to 1.
    // Hence best result always have ratio 1, worst result always have ratio 0.
    for(var i = 0 ; i < sortedRoutes.length; i++){
        ratio = (sortedRoutes[i][sortByField] - base) / normalize;
        // Figure out the new color
        var color = utils.findColor(ratio);
        var id = ".results-line." + sortedRoutes[i].displayName;

        // Change the background color with a JQuery call.
        $(id).css("background-color", color);
    }
}

// This helper function takes in a ratio, and figure out the new color on the color spectrum from color1 to color2.
utils.findColor = function(ratio) {
    // color1 is bad red, color2 is good green. Change here if want other colors.
    var color1 = 'FF0000';
    var color2 = '00FF00';

    // Helper function to turn number into hex
    var hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    // Figure out the rgb of the new color.
    var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
    var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
    var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

    var middle = hex(r) + hex(g) + hex(b);
    var string = "#" + middle.toString();
    return string;
};

// This helper function is for time calculations on Hubway, since there are more than one legs (walking, hubway, walking).
utils.findTotalTime = function(legs) {
    var totalTime = 0;
    for (i = 0; i < legs.length; i++) {
        totalTime += legs[i].duration.value / 60.0;
    }
    return Math.floor(totalTime);
}