// Lead author: Neil Gurram, Shidan Xu

//projectThreeTestsArtwork.js

//We only focused mainly on testing the methods of Artwork, as the other methods are very similar, and we can check
//through simple visual inspection that the other classes do indeed return expected behavior.

// The helper functions can be found in utilArtworkTest.js


// Here starts our testing
// We did not test upload as upload is a combination of new artwork calls. 
// Check the csv file to make sure. We used postman to test that method

// Ensures new artwork is created with intended fields
asyncTest("mfa and artwork and new ", function(){
	start();
	ArtworkUtil.clearArtworks();
	ArtworkUtil.newArtwork("atletico229", "1234544629",function(artID){

	});
});

// Add two artworks and test count
asyncTest("test multiple artworks", function(){
	start();
	ArtworkUtil.clearArtworks();
	ArtworkUtil.newArtwork("atletico229", "1234544629");

	ArtworkUtil.checkTotalNumberPaintings(1);
	ArtworkUtil.newArtwork("atletico230", "1234544630");
	ArtworkUtil.checkTotalNumberPaintings(2);

});


// we now allow artworks to have the same name, so long the accessNumber is different
asyncTest("mfa and artwork and same painting", function(){
	start();
	ArtworkUtil.clearArtworks();
	ArtworkUtil.newArtwork("atletico229", "1234544629");
	
	var painting1 = {name: "atletico230", accessnumber: "1234544629"};
	$.ajax({
		type: "POST",
		url: "/mfa/artwork/new",
		data: painting1,
		async: false,
		error: function(msg, exception){
			if(msg.status === 403){
				equal(msg.status, 403, "duplicated username");
			}
		},
		success: function(msg){
			equal(5, 6, "Had same painting name.");
		}
	});
});

//test to make sure that same accessnumber cannot happen
asyncTest("mfa and artwork and same accessnumber", function(){
	start();
	ArtworkUtil.clearArtworks();
	ArtworkUtil.newArtwork("atletico229", "1234544629");
	var painting1 = {name: "atletico230", accessnumber: "1234544629"};
	$.ajax({
		type: "POST",
		url: "/mfa/artwork/new",
		data: painting1,
		async: false,
		error: function(msg, exception){
			if(msg.status === 403){
				equal(msg.status, 403, "duplicated accessnumber");
			}
		},
		success: function(msg){
			equal(5, 6, "Had same painting name.");
		}
	});
});

//test to make sure that painting is deleted (we assert after adding and then deleting, number of paintings is 1)
//observe we also have tested the GET method for /mfa/artwork as well.
asyncTest("mfa and artwork delete ID", function(){
	start();
	ArtworkUtil.clearArtworks();
	ArtworkUtil.newArtwork("atletico229", "1234544629");
	ArtworkUtil.checkTotalNumberPaintings(1);

	$.ajax({
		type: "POST",
		url:"/mfa/artwork/delete/id",
		data: {id: artID},
		async: false,
		success: function(msg){
		}
	});

	ArtworkUtil.checkTotalNumberPaintings(0);
});

//test to make sure artwork gets updated
//observe we have also tested the /mfa/artwork/ method as well
asyncTest("mfa and artwork and update POST", function(){
	start();
	ArtworkUtil.clearArtworks();
	ArtworkUtil.newArtwork("atletico229", "1234544629");
	$.ajax({
		type: "POST",
		url:"/mfa/artwork/update",
		data: {id: artID, name: "ngurram", accessnumber: "1415"},
		async: false,
		success: function(msg){
		}
	});
	$.ajax({
		type: "GET",
		url: "/mfa/artwork",
		async: false,
		success: function(msg){
			var paintingName = msg.content.artworks[0].name;
			equal(paintingName, "ngurram", "We have updated painting.");
		}
	});
});

//test to make sure we got the right ID for artwork
asyncTest("mfa and artwork and ID GET", function(){
	start();
	ArtworkUtil.clearArtworks();
	artID = "";
	artID2 = "";
	
	ArtworkUtil.newArtwork("atletico229", "1234544629", function(newID){
		artID = newID;
	});	
	ArtworkUtil.newArtwork("atletico230", "1234544630", function(newID){
		artID2 = newID;
	});


	$.ajax({
		type: "GET",
		url:"/mfa/artwork/id="+artID,
		async: false,
		success: function(msg){
			var paintingID = msg.content.artwork[0]._id;
			equal(paintingID, artID, "We have the right painting.");
		}
	});
	$.ajax({
		type: "GET",
		url:"/mfa/artwork/"+artID2,
		async: false,
		success: function(msg){
			var paintingID = msg.content.artwork[0]._id;
			equal(paintingID, artID2, "We have the right second painting.");
		}
	});
	ArtworkUtil.checkTotalNumberPaintings(2);

});

//test to make sure we deleted all the artworks
//I wasn't able to test for two paintings added, but we visually checked that all got deleted when we did two.
//I don't quite understand the asynchronous callback hell.
asyncTest("mfa and artwork and delete GET", function(){
	start();
	ArtworkUtil.clearArtworks();
	ArtworkUtil.newArtwork("atletico229", "1234544629");
	ArtworkUtil.clearArtworks();
	ArtworkUtil.checkTotalNumberPaintings(0);
})