// Lead author: Neil Gurram, Shidan Xu
//projectThreeTestsWay.js


// In the utility function we checked that we can delete all ways and 
// make a new way successfully. And we can show all ways in the database.
// We test that we can generate new ways, delete ways, and update ways. Find way is easier checked using the client side.

asyncTest("way new Post", function(){
	start();
	WayUtil.clearWays();
	GalleryUtil.clearGalleries();
	ArtworkUtil.clearArtworks();
	var room1 = "";
	var room2 = "";
	GalleryUtil.newGallery("588", 2, 1, [], function(id, roomname){
		room1 = roomname;
	});
	GalleryUtil.newGallery("688", 2, 1, [], function(id, roomname){
		room2 = roomname;
	});
	WayUtil.newWay("dummy way", "no description", [room1, room2]);
	// We test that we cannot create the way with same name twice
	WayUtil.newWay("dummy way", "no description", [room1, room2]);
	WayUtil.checkTotalNumberWays(1);
});

// Check can delete way by id
asyncTest("way delete Post", function(){
	start();
	WayUtil.clearWays();
	GalleryUtil.clearGalleries();
	ArtworkUtil.clearArtworks();
	var room1 = "";
	var room2 = "";
	GalleryUtil.newGallery("588", 2, 1, [], function(id, roomname){
		room1 = roomname;
	});
	GalleryUtil.newGallery("688", 2, 1, [], function(id, roomname){
		room2 = roomname;
	});

	WayUtil.newWay("dummy way 1", "no description", [room1, room2]);

	var wayID = "";
	WayUtil.newWay("dummy way", "no description", [room1, room2], function(id){
		wayID = id;
	});
	WayUtil.checkTotalNumberWays(2);

	// can delete one way by id
	$.ajax({
		type: "POST",
		url:"/mfa/way/delete/id",
		data: {id: wayID},
		async: false,
		success: function(msg){
		}
	});
	WayUtil.checkTotalNumberWays(1);
});