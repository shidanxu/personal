// Lead author: Shidan Xu
// The three helper functions we implemented here are 
// 1. Clear all galleries at the start of every qunit test call.
// 2. Create a new gallery of intended success (unique required fields and such), and check the name is right in the database. Return galleryId if necessary
// 3. Check the total number of galleries in the Gallery collection by calling /mfa/gallery.

var GalleryUtil = {

    clearGalleries: function(){
        $.ajax({
            type: "GET",
            url: "/mfa/gallery/delete",
            async: false,
        });
    },

    newGallery: function(name, x,y, artworks, cb){
        var gallery = {name: name, x: x, y: y, artworks: artworks};
        $.ajax({
            type: "POST",
            url:"/mfa/gallery/new",
            data: gallery,
            async: false,
            success: function(msg){
                roomName = msg.content.Gallery.name;
                equal(roomName, gallery.name);
                galleryID = msg.content.Gallery._id;
                if(cb){
                    cb(galleryID, roomName);
                }
            }
        });
    },

    checkTotalNumberGalleries: function(expectedNumberGalleries){
        $.ajax({
            type: "GET",
            url: "/mfa/gallery",
            async: false,
            success: function(msg){
                var count = msg.content.galleries.length;
                equal(count, expectedNumberGalleries, "we have a total of " + expectedNumberGalleries.toString() +  " galleries(s)");
            }
        });
    }
   
}