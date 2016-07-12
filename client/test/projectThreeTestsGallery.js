// Lead author: Neil Gurram, Shidan Xu

//projectThreeTestsGallery.js



// Check making new gallery
asyncTest("gallery new Post", function(){
	start();
	GalleryUtil.clearGalleries();
	ArtworkUtil.clearArtworks();
	GalleryUtil.newGallery("588", 2, 1);
});

// Check can create gallery with an artwork
asyncTest("gallery new Post with artwork", function(){
	start();
	GalleryUtil.clearGalleries();
	ArtworkUtil.clearArtworks();
	var artID = "";
	ArtworkUtil.newArtwork("atletico229", "1234544629", function(newID){
		artID = newID;
	});
	
	GalleryUtil.newGallery("588", 2, 1, artID);
	GalleryUtil.checkTotalNumberGalleries(1);
});


// Check for two galleries with the same name, second one does not get inserted into database.
asyncTest("gallery duplicate name", function(){
	start();
	GalleryUtil.clearGalleries();
	ArtworkUtil.clearArtworks();
	GalleryUtil.newGallery("588", 2, 1);

	var gallery = {name: "588", x: 2, y:1};
        $.ajax({
            type: "POST",
            url:"/mfa/gallery/new",
            data: gallery,
            async: false,
            error: function(msg, exception){
				if(msg.status === 403){
					equal(msg.status, 403, "duplicated gallery name");
				}
			}
    	}); 
    GalleryUtil.checkTotalNumberGalleries(1);
});


// Delete a gallery by ID
asyncTest("gallery delete ID", function(){
	start();
	GalleryUtil.clearGalleries();
	ArtworkUtil.clearArtworks();
	var galleryID = "";
	var galleryID2 = "";
	GalleryUtil.newGallery("588", 2, 1, [], function(newID){
		galleryID = newID;
	});
	GalleryUtil.newGallery("688", 2, 1, [], function(newID){
		galleryID2 = newID;
	});
	GalleryUtil.checkTotalNumberGalleries(2);

	$.ajax({
		type: "POST",
		url:"/mfa/gallery/delete/id",
		data: {id: galleryID},
		async: false,
		success: function(msg){
		}
	});

	GalleryUtil.checkTotalNumberGalleries(1);
	$.ajax({
		type: "POST",
		url:"/mfa/gallery/delete/id",
		data: {id: galleryID2},
		async: false,
		success: function(msg){
		}
	});

	GalleryUtil.checkTotalNumberGalleries(0);
});



// Test gallery update
asyncTest("gallery update POST", function(){
	start();
	GalleryUtil.clearGalleries();
	ArtworkUtil.clearArtworks();

	var ArtID = "";
	var GalleryID = "";
	ArtworkUtil.newArtwork("atletico229", "1234544629", function(newID){
		ArtID = newID;
	});

	GalleryUtil.newGallery("588", 1, 2, [ArtID], function(galleryID){
		GalleryID = galleryID;
	});
	$.ajax({
		type: "POST",
		url:"/mfa/gallery/update/",
		data: {id: GalleryID, name: "294", x: 2, y: 3, artworks: []},
		async: false,
		success: function(msg){
		},
	});
	$.ajax({
		type: "GET",
		url: "/mfa/gallery",
		async: false,
		success: function(msg){
			var galleryName = msg.content.galleries[0].name;
			equal(galleryName, "294", "We have updated gallery.");
		}
	});
});