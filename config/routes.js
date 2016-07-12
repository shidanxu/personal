// Lead author: Donglai Wei and Shidan Xu

var express = require('express');
var path = require('path');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = "We love MFA!";

module.exports = function(router) {
	var user = require(path.join(config.controllers_path, 'user'));
	// var artwork = require(path.join(config.controllers_path, 'artwork'));

	router.get('/', user.home);
	router.get('/company', user.displaycompanylogin);

	router.post('/company', user.login);

	router.post('/search', user.search);

	router.get('/results', user.display_results);

	router.get('/new', user.new_thread);



	// var map = require(path.join(config.controllers_path, 'map'));
	// var gallery = require(path.join(config.controllers_path, 'gallery'));
	// var road = require(path.join(config.controllers_path, 'road'));
	// var way = require(path.join(config.controllers_path, 'way'));
	// var search = require(path.join(config.controllers_path, 'search'));
	// var mfa = require(path.join(config.controllers_path, 'mfa'));
	// log in and out
	//router.get('/mfa/', mfa.index);
	// login & logout
	//  to test if the authentation works
	//router.use('/mfa/road', expressJwt({secret: secret}));



	//--------------- User Methods-------------------

	//POST Methods
	// disable website registration
	// the users will be edited in the mongodb directly
	//Create new user
	// router.post('/mfa/new', mfa.mfaNew);

	//GET Methods

	//Login user
	// router.post('/mfa/', mfa.mfaLogin);


	// -------------- Artwork methods ---------------

	// POST methods

	// // Create new artwork
	// router.post('/mfa/artwork/new', artwork.artworkNew);

	// // Delete a particular artwork
	// router.post('/mfa/artwork/delete/id', artwork.artworkDel);

	// // Update a particular artwork
	// router.post('/mfa/artwork/update', artwork.artworkUpdate);


	// // GET methods

	// // Show all artworks
	// router.get('/mfa/artwork/', artwork.artworksShow);

	// // Show a particular artwork
	// router.get('/mfa/artwork/id=' + '\[a-z0-9]+', artwork.artworkShow);

	// // Delete all artworks
	// router.get('/mfa/artwork/delete', artwork.artworksDel);

	// // Upload a csv file of artworks
	// router.post('/mfa/artwork/upload', artwork.artworksUpload);
	
	// // If url unrecognized above, just show artworks
	// // router.get('/mfa/artwork/*', artwork.artworksShow);


	// // ------------- Gallery Methods ------------
	// // POST methods

	// // Create new gallery
	// router.post('/mfa/gallery/new', gallery.galleryNew);

	// // Delete a gallery
	// router.post('/mfa/gallery/delete/id', gallery.galleryDel);

	// // Update a gallery
	// router.post('/mfa/gallery/update/', gallery.galleryUpdate);


	// // GET methods
	// // Delete all galleies
	// router.get('/mfa/gallery/delete', gallery.galleriesDel);

	// // Show a particular gallery
	// router.get('/mfa/gallery/id=' + '\[a-z0-9]+', gallery.galleryShow);

	// // Show a particular gallery
	// router.get('/mfa/gallery/name=' + '\[a-z0-9]+', gallery.galleryShowByName);

	// // Show all galleries
	// router.get('/mfa/gallery/', gallery.galleriesShow);

	// // Upload a csv file of galleries
	// router.post('/mfa/gallery/upload', gallery.galleriesUpload);
	// // ------------- Road Methods ---------------

	// // POST methods

	// // Create a new road
	// router.post('/mfa/road/new', road.roadNew);

	// // Delete a specific road
	// router.post('/mfa/road/delete/id', road.roadDel);


	// // GET methods

	// // Show one road
	// router.get('/mfa/road/id', road.roadShow);

	// // Show all roads
	// router.get('/mfa/road/', road.roadsShow);

	// // Delete all roads
	// router.get('/mfa/road/delete', road.roadsDel);

	// // Upload a csv file of roads
	// router.post('/mfa/road/upload', road.roadsUpload);
	
	// // ------------- Way methods -----------------

	// // POST methods

	// // Create a new way
	// router.post('/mfa/way/new', way.wayNew);

	// // Delete a specific way
	// router.post('/mfa/way/delete/id', way.wayDel);

	// // Update a way
	// router.post('/mfa/way/update/', way.wayUpdate);

	

	// // GET methods
	// // Show one way
	// router.get('/mfa/way/id=' + '\[a-z0-9]+', way.wayShow);

	// // Show all ways
	// router.get('/mfa/way/', way.waysShow);

	// // Delete all ways
	// router.get('/mfa/way/delete', way.waysDel);

	// // Upload a csv file of ways
	// router.post('/mfa/way/upload', way.waysUpload);

	// // Search a way by gallery names
	// router.post('/mfa/way/search/gallery', search.searchByGalleryName);

	// // Search a way by artwork names
	// router.post('/mfa/way/search/artwork/name', search.searchByArtworkName);
	// router.post('/mfa/way/search/artwork/author', search.searchByArtworkAuthor);
	
	// router.post('/mfa/way/search/', search.search);
	// router.post('/mfa/way/search/way/description', search.searchByDescription);
	// router.post('/mfa/way/search/validation', search.searchValidName);
	

	// // ------------- Map methods ----------------

	// //TODO
	// router.post('/mfa/map/new', map.mapNew);
	// // Show all maps
	// router.get('/mfa/map/', map.mapsShow);

	// // Delete all maps
	// router.get('/mfa/map/delete', map.mapsDelete);
	// // router.post('/mfa/map/upload', map.mUpload);
	// // router.get('/mfa/map/*',  map.mGet);
	// // router.get('/donglai/',  map.mUpload_test);


	// // router.get('/traveller/search', traveller.enterPath);
	// // router.post('/traveller/search', traveller.processPath);
	// // router.get('/traveller/display', traveller.displayWay);

	// //router.post('/mfa/map/create', map.mCreate);
	// //router.post('/mfa/map/upload', map.mUpload);
	// //router.get('/mfa/map/*', map.mGet);

	// // handy mongodb clean up
	// //router.get('/mfa/show', mfa.show);
	// //router.get('/mfa/del', mfa.del);

	// // default url
	// //router.get('*', mfa.show);
	
	// // ------------- Client htmls ----------------
	// // Get HTML for MFA
	// router.get('/', function(req, res){
	// 	res.sendfile(config.client_path+"html/traveller.html");
	// })
	// router.get('/admin', function(req, res){
	// 	res.sendfile(config.client_path+"html/mfa.html");
	// })
	// router.get('/adminDB', function(req, res){
	// 	res.sendfile(config.client_path+"html/mfaDB.html");
	// })
	// ------------- QUnit tests ----------------

	//TODO
	// router.get('/test1', function(req,res){
	// 	res.render("/test/test_artwork.html");
	// });
	// router.get('/test2', function(req,res){
	// 	res.render("/test/test_gallery.html");
	// });
	// router.get('/test3', function(req,res){
	// 	res.render("/test/test_road.html");
	// });
	// router.get('/test4', function(req,res){
	// 	res.render("/test/test_way.html");
	// });
}