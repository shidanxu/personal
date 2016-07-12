// Lead author: Shidan Xu
var token;
$(function() {
	var login_user = $(function() {
		$('.error').hide();
		$(".login_button").click(function() {
			//validate and process form here
			//$('.error').hide();
			var query = {
				username: $("input#username_login").val(),
				password: $("input#password_login").val()
			};
			//window.location.href="http://www.mit.edu";

			MyWay.LoginUser(query, function(newurl) {
				// token = authResult.token;
				// var encoded = token.split('.')[1];
				// var profile = JSON.parse(url_base64_decode(encoded));
				// alert('Hello ' + profile.name);
				// // set up later ajax calls
				// $.ajaxSetup({
				// 	beforeSend: function(xhr) {
				// 		if (!token) return;
				// 		xhr.setRequestHeader('Authorization', 'Bearer ' + token);
				// 	}
				// });
				//console.log("redirect:"+newurl);
				window.location.replace(API_URL + newurl);
				//window.location.href="http://www.mit.edu"

			});
			return false;
		});
	});

	// var sign_up = $(function() {
	// 	$('.error').hide();
	// 	$(".signup_button").click(function() {
	// 		//validate and process form here
	// 		$('.error').hide();
	// 		var query = {
	// 			username: $("input#username_signup").val(),
	// 			password: $("input#password_signup").val()
	// 		};
	// 		MyWay.AddUser(query);
	// 	});
	// });

	var submitArtwork = $(function() {
		$('.error').hide();
		$("#new_artwork").click(function() {
			//validate and process form here
			$('.error').hide();
			var accessnumber = $("input#accessnumber").val();
			var name = $("input#name").val();
			var galleryname = $("input#galleryName").val();
			var author = $("input#author").val();

			MyWay.AddArtwork(name, accessnumber, galleryname, author, function(msg) {
				alert(msg.success);
			});
		});
	});


	var deleteArtwork = $(function() {
		$('.error').hide();
		$("#delete_artwork").click(function() {
			//validate and process form here
			$('.error').hide();
			var artID = $("input#artID").val();

			MyWay.DeleteArtwork({
				id: artID
			}, function(msg) {
				alert(msg);
			});
		});
	});

	var updateArtwork = $(function() {
		$('.error').hide();
		$("#update_artwork").click(function() {
			//validate and process form here
			$('.error').hide();
			MyWay.UpdateArtwork({
				id: $("input#findartID").val(),
				name: $("input#newname").val(),
				galleryName: $("input#newgalleryname").val(),
				author: $("input#newauthor").val()
			}, function(msg) {
				alert(msg.success);
			});
		});
	});

	var showArtworks = $(function() {
		$("#display_artwork_btn").click(function() {
			//validate and process form here
			MyWay.ShowArtworks(
				function(msg) {
					// array of object
					var ptext = $('<table></table>').addClass('foo');
					var row = $('<tr></tr>').addClass('bar');
					// .text('result ' + i);
					ptext+="<tr><td>accessNumber</td><td>name</td><td>galleryName</td><td>author</td><td>id</td></tr>";
					msg.forEach(function(artwork) {
						ptext += "<tr>";
						ptext += "<td>"+artwork.accessNumber+"</td>";
						ptext += "<td>"+artwork.name+"</td>";
						ptext += "<td>"+artwork.galleryName+"</td>";
						ptext += "<td>"+artwork.author+"</td>";
						ptext += "<td>"+artwork._id+"</td>";
						ptext += "</tr>";
					});
					ptext += "</table>";
					$("#display_artwork_p").html(ptext);
				});
		return false;
		});
	});


	var showArtwork = $(function() {
		$('.error').hide();
		$("#display_artwork").click(function() {
			//validate and process form here
			// $('.error').hide();
			MyWay.ShowArtwork({
				id: $("input#displayartwork").val()
			}, function(msg) {
				var ptext = $('<table></table>').addClass('foo');
				var row = $('<tr></tr>').addClass('bar');

				ptext+="<tr><td>accessNumber</td><td>name</td><td>galleryName</td><td>author</td><td>id</td></tr>";
				msg.forEach(function(artwork) {
						ptext += "<tr>";
						ptext += "<td>"+artwork.accessNumber+"</td>";
						ptext += "<td>"+artwork.name+"</td>";
						ptext += "<td>"+artwork.galleryName+"</td>";
						ptext += "<td>"+artwork.author+"</td>";
						ptext += "<td>"+artwork._id+"</td>";
						ptext += "</tr>";
					});
					ptext += "</table>";
					$("#display_artwork_p").html(ptext);
			});
			return false;
		});
	});

	var showGallery = $(function() {
		$('.error').hide();
		$("#display_gallery").click(function() {
			//validate and process form here
			// $('.error').hide();
			MyWay.ShowGallery({
				id: $("input#displaygallery").val()
			}, function(msg) {
				var ptext = $('<table></table>').addClass('foo');
				var row = $('<tr></tr>').addClass('bar');

				ptext+="<tr><td>Name</td><td>x</td><td>y</td><td>artworks</td><td>id</td></tr>";
				msg.forEach(function(gallery) {
						ptext += "<tr>";
						ptext += "<td>"+gallery.name+"</td>";
						ptext += "<td>"+gallery.x+"</td>";
						ptext += "<td>"+gallery.y+"</td>";
						ptext += "<td>"+gallery.artworks+"</td>";
						ptext += "<td>"+gallery._id+"</td>";
						ptext += "</tr>";
					});
					ptext += "</table>";
					$("#display_gallery_p").html(ptext);
			});
			return false;
		});
	});

	var showGalleries = $(function() {
		$("#display_galleries").click(function() {
			//validate and process form here
			MyWay.ShowGalleries(
				function(msg) {
					// array of object
					var ptext = $('<table></table>').addClass('foo');
					var row = $('<tr></tr>').addClass('bar');

					ptext+="<tr><td>Name</td><td>x</td><td>y</td><td>artworks</td><td>id</td></tr>";
					msg.forEach(function(gallery) {
						ptext += "<tr>";
						ptext += "<td>"+gallery.name+"</td>";
						ptext += "<td>"+gallery.x+"</td>";
						ptext += "<td>"+gallery.y+"</td>";
						ptext += "<td>"+gallery.artworks+"</td>";
						ptext += "<td>"+gallery._id+"</td>";
						ptext += "</tr>";
					});
					ptext += "</table>";
					$("#display_gallery_p").html(ptext);
				});
		return false;
		});
	});

	// var uploadArtwork = $(function() {
	// 	$("#upload_artwork").click(function() {
	// 		var formData = new FormData($('input#upload_artwork')[0]);
	// 		var data = new FormData();
	// 		$.each($('#upload_artwork')[0].files, function(i, file) {
	// 			console.log(file);
	// 			data.append('file', file);
	// 		});
	// 		MyWay.UploadArtwork(formData);

	// 	});
	// });


	var submitGallery = $(function() {
		$('.error').hide();
		$("#new_gallery").click(function() {
			//validate and process form here
			$('.error').hide();
			var name = $("input#nameGallery").val();
			var x = $("input#x").val();
			var y = $("input#y").val();

			MyWay.AddGallery({
				name: name,
				x: x,
				y: y
			}, function(msg) {
				alert(msg.success);
			});
		});
	});


	var deleteGallery = $(function() {
		$('.error').hide();
		$("#delete_gallery").click(function() {
			//validate and process form here
			$('.error').hide();
			var galleryID = $("input#galleryID").val();

			MyWay.DeleteGallery({
				id: galleryID
			}, function(msg) {
				alert(msg);
			});
		});
	});


	var updateGallery = $(function() {
		$('.error').hide();
		$("#update_gallery").click(function() {
			//validate and process form here
			$('.error').hide();
			MyWay.UpdateGallery({
				id: $("input#findgalleryID").val(),
				name: $("input#newnameG").val(),
				x: $("input#newX").val(),
				y: $("input#newY").val()
			}, function(msg) {
				alert(msg.success);
			});
		});
	});

	var submitWay = $(function() {
		$('.error').hide();
		$("#new_way").click(function() {
			//validate and process form here
			$('.error').hide();
			var name = $("input#nameWay").val();
			var description = $("input#description").val();
			var galleries = $("input#galleries").val();

			MyWay.AddWay({
				name: name,
				description: description,
				galleries: galleries
			}, function(msg) {
				alert(msg.success);
			});
		});
	});


	var deleteWay = $(function() {
		$('.error').hide();
		$("#delete_way").click(function() {
			//validate and process form here
			$('.error').hide();
			var wayID = $("input#wayID").val();

			MyWay.DeleteWay({
				id: wayID
			}, function(msg) {
				alert(msg);
			});
		});
	});


	var updateWay = $(function() {
		$('.error').hide();
		$("#update_way").click(function() {
			//validate and process form here
			$('.error').hide();
			MyWay.UpdateWay({
				id: $("input#findwayID").val(),
				name: $("input#newnameW").val(),
				description: $("input#newDescription").val(),
				galleries: $("input#newGalleries").val()
			});
		}, function(msg) {
			alert(msg.success);
		});
	});

	var showWay = $(function() {
		$('.error').hide();
		$("#display_way").click(function() {
			//validate and process form here
			// $('.error').hide();
			MyWay.ShowWay({
				id: $("input#displayway").val()
			}, function(msg) {
				var ptext = $('<table></table>').addClass('foo');
				var row = $('<tr></tr>').addClass('bar');

				ptext+="<tr><td>Name</td><td>description</td><td>Galleries</td><td>ID</td></tr>";
				msg.forEach(function(way) {
						ptext += "<tr>";
						ptext += "<td>"+way.name+"</td>";
						ptext += "<td>"+way.description+"</td>";
						ptext += "<td>"+way.galleries+"</td>";
						ptext += "<td>"+way._id+"</td>";
						ptext += "</tr>";
					});
					ptext += "</table>";
					$("#display_way_p").html(ptext);
			});
			return false;
		});
	});

	var showWays = $(function() {
		$("#display_ways").click(function() {
			//validate and process form here
			MyWay.ShowWays(
				function(msg) {
					// array of object
					var ptext = $('<table></table>').addClass('foo');
					var row = $('<tr></tr>').addClass('bar');

					ptext+="<tr><td>Name</td><td>description</td><td>Galleries</td><td>ID</td></tr>";
					msg.forEach(function(way) {
						ptext += "<tr>";
						ptext += "<td>"+way.name+"</td>";
						ptext += "<td>"+way.description+"</td>";
						ptext += "<td>"+way.galleries+"</td>";
						ptext += "<td>"+way._id+"</td>";
						ptext += "</tr>";
					});
					ptext += "</table>";
					$("#display_way_p").html(ptext);
				});
		return false;
		});
	});

})