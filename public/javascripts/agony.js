/*
  Calculate agony score for a transportaion method based on routeCost, routeTime and costMeasure
  INPUT:
    method: Transportation method
    costMeasure: unity cost for the transportation method, in unit of "cost per meter"
    isUnitCost: whether travel cost chanages for distance. For MBTA, it doesn' change becuase price is static.
  OUTPUT:
    Agony score
*/
function getAgony(route, costMeasure, isUnitCost) {
    var routeTime = utils.findTotalTime(route.routes[0].legs);
    var routeCost;
    if (isUnitCost) {
        routeCost = costMeasure;
    } else {
        routeCost = costMeasure * route.routes[0].legs[0].distance.value;
    }
    return Math.round((routeTime * timeAgonySkew + routeCost * priceAgonySkew) * 100) / 100;
};

/*
  Calcuate agonay score for all transportation methods and return the results in a sorted array
*/
function getAgonySortedResults() {
    var agonies = []
    var uberAgony = getUberAgony();
    var walkingAgony = getAgony(googleWalkingRoute, walkingCostPerMeter, false);
    var transitAgony = getAgony(googleTransitRoute, MBTACost, true);
    agonies.push({
        Agony: uberAgony,
        displayName: 'Uber'
    });
    agonies.push({
        Agony: walkingAgony,
        displayName: 'Walking'
    });

    if (ownBike) {
        agonies.push({
            Agony: getAgony(googleBikingRoute, BikingCostPerMeter, false),
            displayName: 'Biking'
        });
    } else {
        agonies.push({
            Agony: getAgony(hubwayRoute, BikingCostPerMeter, false),
            displayName: 'Hubway'
        });
    }
    agonies.push({
        Agony: transitAgony,
        displayName: 'MBTA'
    });
    agonies.sort(function(a, b) {
        if (a.Agony == 'N/A') {
            return true;
        } else if (b.Agony == 'N/A') {
            return false;
        }
        return a.Agony > b.Agony;
    });
    return agonies;

};

/*
  gets the agony calculation of traveling using Uber, based on cost and time 
*/
function getUberAgony() {
    var uberTime = Math.floor((uberResult.duration + uberResult.eta) / 60);
    var uberCost = Math.floor((uberResult.costEstimateHigh + uberResult.costEstimateLow) / 2);
    var uberAgony = uberTime * timeAgonySkew + uberCost * priceAgonySkew;
    if (isNaN(uberAgony)) {
        uberAgony = 'N/A'
    }
    return Math.round(100 * uberAgony / 100);
}