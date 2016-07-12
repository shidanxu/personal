// Lead author: Shidan Xu
//projectThreeTestsMap.js

// In the utility function we checked that we can delete all maps and 
// make a new map successfully. And we can show all maps in the database.
// We test that we can generate new maps, delete maps, and update maps. Find map is easier checked using the client side.

// Check can delete way by id
asyncTest("way delete Post", function(){
	start();
	MapUtil.clearMaps();
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

asyncTest("map new Post", function(){
	start();
	MapUtil.clearMaps();
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
	GalleryUtil.checkTotalNumberGalleries(2);
	alert("WWwwwwwwwwwWWWWWWWWWWWWWWWWWasdf");
	var img = "../public/img/floorplan/fplan_3.png";
	MapUtil.newMap("third floor", "no description");
	// We test that we cannot create the way with same name twice
	MapUtil.checkTotalNumberMaps(1);
});

