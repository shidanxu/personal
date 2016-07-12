// Lead author: Neil Gurram
//projectThreeTestsRoad.js

asyncTest("road new Post", function(){
	$.ajax({
		type: "GET",
		url: "/mfa/gallery/delete",
		async: false,
	});
	$.ajax({
		type: "GET",
		url: "/mfa/artwork/delete",
		async: false,
	});
	$.ajax({
		type: "GET",
		url: "/mfa/road/delete",
		async: false,
	})
	var galleryA = {name: "588", x: 2, y: 1};
	$.ajax({
		type: "POST",
		url:"/mfa/gallery/new",
		data: galleryA,
		async: false,
		success: function(msg){
			id1 = msg.content.Gallery._id;
			roomName = msg.content.Gallery.name;
			equal(roomName, galleryA.name);
		}
	});
	var galleryB = {name: "688", x: 2, y: 1};
	$.ajax({
		type: "POST",
		url:"/mfa/gallery/new",
		data: galleryB,
		async: false,
		success: function(msg){
			id2 = msg.content.Gallery._id;
			roomName = msg.content.Gallery.name;
			equal(roomName, galleryB.name);
		}
	});
	// var road = {gallery1: id1, gallery2: id2};
	// $.ajax({
	// 	type: "POST",
	// 	url:"/mfa/road/new",
	// 	data: road,
	// 	async: false,
	// 	success: function(msg){
	// 		galleryID1 = msg.content.Road.gallery1;
	// 		equal(galleryID1, road.gallery1);
	// 		start();
	// 	}
	// });
	var road = {name: "588_688"};
	$.ajax({
		type: "POST",
		url:"/mfa/road/new",
		data: road,
		async: false,
		success: function(msg){
			name = msg.content.Road.name;
			equal("588_688", road.name);
			start();
		}
	});

});