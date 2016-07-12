// Lead author: Shidan Xu
// The three helper functions we implemented here are 
// 1. Clear all artworks at the start of every qunit test call.
// 2. Create a new artwork of intended success (unique names and accessnumber), and check the name is right in the database. Return artID if necessary
// 3. Check the total number of paintings in the Artwork collection by calling /mfa/artwork.

var ArtworkUtil = {

    clearArtworks: function(){
        $.ajax({
            type: "GET",
            url: "/mfa/artwork/delete",
            async: false,
        });
    },

    newArtwork: function(name, anumber, cb){
    var painting = {name: name, accessnumber: anumber};
        $.ajax({
            type: "POST",
            url:"/mfa/artwork/new",
            data: painting,
            async: false,
            success: function(msg){
                artname = msg.content.artwork.name;
                artID = msg.content.artwork._id;
                equal(painting.name, artname);
                if(cb){
                    cb(artID);
                }
            }
        });
    },

    checkTotalNumberPaintings: function(expectedNumberPaintings){
        $.ajax({
            type: "GET",
            url: "/mfa/artwork",
            async: false,
            success: function(msg){
                var count = msg.content.artworks.length;
                equal(count, expectedNumberPaintings, "we have a total of " + expectedNumberPaintings.toString() +  " painting(s)");
            }
        });
    }
   
}