/*
    We need to know from which files tests are being run, 
    so we prefix them per test file here
*/
var testingNamePrefixUber = "Uber test: ";
var testingNamePrefixHubway = "Hubway test: ";

// http://api.qunitjs.com/QUnit.asyncTest/
QUnit.asyncTest(testingNamePrefixUber + "basic GET", function(assert) {
    // 233 mass ave 02139 to 905 main st 02139

    var start_lat = 42.361666;
    var start_lng = -71.097042;
    var end_lat = 42.363447;
    var end_lng = -71.099652;

    $.ajax({
        type: "GET",
        url: "/api/uber",
        data: {
            "start_lat": start_lat,
            "start_lng": start_lng,
            "end_lat": end_lat,
            "end_lng": end_lng
        },
        success: function(data) {
            var payload = data.payload;
            equal(data.status, "200", "Status for valid api GET should be 200 OK");

            // verify data echo
            equal(payload.originLat, start_lat, "Origin latitude should match the provided latitude to the Uber api");
            equal(payload.originLng, start_lng, "Origin longitude should match the provided longitude to the Uber api");
            equal(payload.destLat, end_lat, "Destination latitude should match the provided latitude to the Uber api");
            equal(payload.destLng, end_lng, "Destination longitude should match the provided longitude to the Uber api");

            // verify nonzero values
            notEqual(0, payload.costEstimateHigh, "Value should not be zero");
            notEqual(0, payload.costEstimateLow, "Value should not be zero");
            notEqual(0, payload.duration, "Value should not be zero");
            notEqual(0, payload.eta, "Value should not be zero");
            notEqual(0, payload.timestamp, "Value should not be zero");

            // Let the other async tests know it's their time to shine
            QUnit.start();
        }
    });
});

QUnit.asyncTest(testingNamePrefixUber + "basic GET", function(assert) {
    // 233 mass ave 02139 to 905 main st 02139

    var start_lat = 42.361666;
    var start_lng = -71.097042;
    var end_lat = 42.363447;
    var end_lng = -71.099652;

    $.ajax({
        type: "GET",
        url: "/api/ubers",
        data: {
            "start_lat": start_lat,
            "start_lng": start_lng,
            "end_lat": end_lat,
            "end_lng": end_lng
        },
        success: function(data) {
            var payloadArray = data.payload;
            equal(data.status, "200", "Status for valid api GET should be 200 OK.");

            for (var i = 0; i < payloadArray.length; i++) {
                payload = payloadArray[i];
                
                // verify data echo
                equal(payload.originLat, start_lat, "Origin latitude should match the provided latitude to the Uber api");
                equal(payload.originLng, start_lng, "Origin longitude should match the provided longitude to the Uber api");
                equal(payload.destLat, end_lat, "Destination latitude should match the provided latitude to the Uber api");
                equal(payload.destLng, end_lng, "Destination longitude should match the provided longitude to the Uber api");

                // verify nonzero values
                notEqual(0, payload.costEstimateHigh, "Value should not be zero");
                notEqual(0, payload.costEstimateLow, "Value should not be zero");
                notEqual(0, payload.duration, "Value should not be zero");
                notEqual(0, payload.eta, "Value should not be zero");
                notEqual(0, payload.timestamp, "Value should not be zero");
            };


            // Let the other async tests know it's their time to shine
            QUnit.start();
        }
    });
});



QUnit.asyncTest(testingNamePrefixHubway + "basic GET", function(assert) {
    //Harvard Square to South Station
    //we can safely assume (in most cases that there will be hubway station available around those two locations)
    var start_lat = 42.373532;
    var start_lng = -71.11896;
    var end_lat = 42.352311;
    var end_lng = -71.05530399999998;

    $.ajax({
        type: "GET",
        url: "/api/hubway",
        data: {
            "start_lat": start_lat,
            "start_lng": start_lng,
            "end_lat": end_lat,
            "end_lng": end_lng
        },
        success: function(data) {
            var payload = data.payload;
            equal(data.status, "200", "Status for valid api GET should be 200 OK.");

            // verify data echo
            equal(payload.originLat, start_lat, "Origin latitude should match the provided latitude to the Hubway api");
            equal(payload.originLng, start_lng, "Origin longitude should match the provided longitude to the Hubway api");
            equal(payload.destLat, end_lat, "Destination latitude should match the provided latitude to the Hubway api");
            equal(payload.destLng, end_lng, "Destination longitude should match the provided longitude to the Hubway api");

            // verify nonzero values
            notEqual(0, payload.startStationLng, "startStation longitude should not be zero");
            notEqual(0, payload.startStationLat, "startStation latitude should not be zero");
            notEqual(0, payload.startStationId, "startStation id should not be zero");
            notEqual('', payload.startStationName, "startStation name should not be blank");
            notEqual(0, payload.endStationLng, "endStation longitude should not be zero");
            notEqual(0, payload.endStationLat, "endStation latitude should not be zero");
            notEqual(0, payload.endStationId, "endStation id should not be zero");
            notEqual('', payload.endStationName, "endStation name should not be blank");

            // Let the other async tests know it's their time to shine
            QUnit.start();
        }
    });
});