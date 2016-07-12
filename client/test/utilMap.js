// Lead author: Shidan Xu
// The three helper functions we implemented here are 
// 1. Clear all maps at the start of every qunit test call.
// 2. Create a new map of intended success (unique required fields and such), and check the name is right in the database. Return mapID if necessary
// 3. Check the total number of maps in the Map collection by calling /mfa/map.

var MapUtil = {

    clearMaps: function(){
        $.ajax({
            type: "GET",
            url: "/mfa/map/delete",
            async: false,
        });
    },

    newMap: function(name, description, image, gallerys, roads, cb){
        // var map = {name: name, description: description, image: image, gallerys: gallerys,  roads: roads};
        var map = {name: name, description: description};
        $.ajax({
            type: "POST",
            url:"/mfa/map/new",
            data: map,
            async: false,
            success: function(msg){
                console.log("done: "+msg);
                mapname = msg.content.map.name;
                equal(mapname, map.name);
                mapID = msg.content.map._id;
                if(cb){
                    cb(mapID);
                }
            }
        });
    },

    checkTotalNumberMaps: function(expectedNumberMaps){
        $.ajax({
            type: "GET",
            url: "/mfa/map",
            async: false,
            success: function(msg){
                var count = msg.content.maps.length;
                equal(count, expectedNumberMaps, "we have a total of " + expectedNumberMaps.toString() +  " map(s)");
            }
        });
    }
   
}