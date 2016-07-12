// Lead author: Neil Gurram
$(function() {
	$('#query1_error').hide();
	$('#query2_error').hide();
	var img_bg1 = document.getElementById('img_bg1');
	myCanvas = Pad(document.getElementById('myCanvas'));
	myMap = new Image();
	myMap.onload = function() {
		myCanvas.set_width(img_bg1.width);
		myCanvas.set_height(img_bg1.width / myMap.width * myMap.height);
		myCanvas.draw_image(myMap);
	};
	myMap.src = '/img/floorplan/fplan_3.png';

	var DefaultTagName = 'enter query';

	function verifyInput(tag, cb) {
		MyWay.CheckSearchInput({
				name: tag
			},
			cb);
	}
	$('#query2').tagsInput({
		'defaultText': DefaultTagName,
		'height': '20px',
		'width': '400px',
		'onAddTag': function(tag) {
			verifyInput(tag, function(Mycontent) {
				console.log(Mycontent);
				if (!Mycontent.valid) {
					$('#query2').removeTag(tag);
					$('#query2_error').show();
				}
			});
		}
	});
	$('#query1').tagsInput({
		'defaultText': DefaultTagName,
		'height': '20px',
		'width': '400px',
		'onAddTag': function(tag) {
			verifyInput(tag, function(Mycontent) {
				console.log(Mycontent);
				if (!Mycontent.valid) {
					$('#query1').removeTag(tag);
					// DSPLAY CRAP
					$('#query1_error').show();
				}
			});
		}
	});

	// search box in the first page
	$(".searchbutton1").click(function() {
		search("1");
	});
	// search box in the second page
	$(".searchbutton2").click(function() {
		search("2");
	});
	// recommendatation in the first page
	$(".recommendbutton1").click(function() {
		recommend("1");
	});
	// recommendatation in the first page
	$(".recommendbutton2").click(function() {
		recommend("2");
	});

	function search(Id) {
		$("label#query_err" + Id).hide();
		var roomsString = $("input#query" + Id).val();
		var roomsArray = roomsString.split(',');
		for (i = 0; i < roomsArray.length; i++) {
			roomsArray[i] = roomsArray[i].trim();
		}
		console.log(roomsArray.length);
		// no more validataion
		// var booleanRooms = roomsArray;
		// roomsArray.forEach(function(element, index) {
		// 	isValidRoom(element, booleanRooms, index);
		// });
		//var numFalse = booleanRooms.filter(function(v){ return v === false; }).length
		var numFalse = 0;
		//console.log(numFalse + " boolroom: "+booleanRooms);
		if (numFalse >0) {
			$("label#query_err" + Id).show();
			$("input#query" + Id).focus();
			return false;
		} else {
			myCanvas.draw_image(myMap);
			console.log("draw searched way:" + roomsArray.join());
			if (Id === "1") {
				// copy the search box content
				console.log(roomsArray.join());
				$("input#query2").importTags(roomsArray.join());
			}
			// draw the way
			MyWay.SearchWayByInput({
					name: roomsArray.join()
				},
				function(obj) {
					console.log(obj.pos);
					drawpath(obj.pos, 1);
				});
		}
		$('#query1_error').hide();
		$('#query2_error').hide();
	}

	function recommend(Id) {
		myCanvas.draw_image(myMap);
		console.log("draw recommended way");
		// draw the way
		MyWay.SearchWayByDescription({
				desc: "Tour"
			},
			function(obj) {
				console.log("re:" + obj);
				for (var i = 0; i < obj.pos[0].length; i++) {
					// TODO: display them properly
					var name = obj.pos[1][i];
					var description = obj.pos[2][i];
					console.log("way name:" + obj.pos[1][i]);
					console.log("way description:" + obj.pos[2][i]);
					$("p#recommend").text(obj.pos[1][i]);
					drawpath(obj.pos[0][i], i + 1);
					displayWayInfo(name, description, i);
				}
			});
	}

	function displayWayInfo(name, desc, i) {
		// myCanvas = Pad(document.getElementById('myCanvas'));
		canvas = document.getElementById('myCanvas');
		ctx = canvas.getContext("2d");
		ctx.font = '20pt Arial';

		var line1 = "Recommendation " + (i + 1).toString() + ": " + name;
		var line2 = desc;

		ctx.fillText(line1, 50, 175 + 100 * i);

		ctx.fillStyle = "white";
		ctx.fillText(line2, 50, 175 + 50 * (2 * i + 1));
		var width = ctx.measureText(line1).width;
		var width2 = ctx.measureText(line2).width;
		var txtHeight = parseInt(ctx.font);
		myCanvas.draw_rectangle(Coord(40, 175 + 100 * i - txtHeight - 5), Math.max(width, width2) + 20, 100, 8, Color(0, 51, 102));
		// ctx.strokeRect(50, 150 + 100 * i, max(width, width2), 100):
	}

	function isValidRoom(possibleRoom, arr, index) {
		var trimmedRoom = possibleRoom.trim();
		console.log(trimmedRoom + " has length of " + trimmedRoom.length);
		if (trimmedRoom.length == 0) {
			arr[index] = false;
		} else if (trimmedRoom[0] != "3") {
			arr[index] = false;
		} else {
			var Isvalid;
			MyWay.GetObjSync('/mfa/gallery/name=' + trimmedRoom, function(Mycontent) {
				console.log("hello: " + Mycontent.gallery);
				if (Mycontent.gallery) {
					arr[index] = true;
				} else {
					arr[index] = false;
				}
				console.log("hello2: " + arr);
			});
		}
	}
})