// Lead author: Shidan Xu
// The three helper functions we implemented here are 
// 1. Clear all ways at the start of every qunit test call.
// 2. Create a new way of intended success (unique required fields and such), and check the name is right in the database. Return wayID if necessary
// 3. Check the total number of ways in the Way collection by calling /mfa/way.

var WayUtil = {

    clearWays: function(){
        $.ajax({
            type: "GET",
            url: "/mfa/way/delete",
            async: false,
        });
    },

    newWay: function(name, description, galleries, cb){
        var way = {name: name, description: description, galleries: galleries};
        $.ajax({
            type: "POST",
            url:"/mfa/way/new",
            data: way,
            async: false,
            success: function(msg){
                wayname = msg.content.way.name;
                equal(wayname, way.name);
                wayID = msg.content.way._id;
                if(cb){
                    cb(wayID);
                }
            }
        });
    },

    checkTotalNumberWays: function(expectedNumberWays){
        $.ajax({
            type: "GET",
            url: "/mfa/way",
            async: false,
            success: function(msg){
                var count = msg.content.ways.length;
                equal(count, expectedNumberWays, "we have a total of " + expectedNumberWays.toString() +  " way(s)");
            }
        });
    }
   
}