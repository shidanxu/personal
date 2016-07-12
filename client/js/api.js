// Lead author: Shidan Xu
// global configuration variables

// api server url
API_URL = "http://localhost:3000";




// API calls 
var MyWay = {
    // generic http GET
    GetObj: function(query, cb) {
        $.ajax({
            type: "GET",
            url: API_URL + query,
            success: function(msg) {
                cb(msg.content);
            }
        });
    },
    GetObjSync: function(query, cb) {
        $.ajax({
            type: "GET",
            url: API_URL + query,
            async: false,
            success: function(msg) {
                cb(msg.content);
            }
        });
    },
    // to show objects in the database
    CheckSearchInput: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/way/search/validation/",
            data: query,
            success: function(msg) {
                cb(msg.content);
            }
        });
    },
    // to show objects in the database
    SearchWayByDescription: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/way/search/way/description/",
            data: query,
            success: function(msg) {
                cb(msg.content);
            }
        });
    },
    SearchWayByInput: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/way/search/",
            data: query,
            success: function(msg) {
                cb(msg.content);
            }
        });
    },

    AddArtwork: function(name, anumber, galleryName, author,cb) {
        var painting = {
            name: name,
            accessnumber: anumber,
            galleryName: galleryName,
            author: author
        };
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/artwork/new",
            data: painting,
            success: function(msg) {
                alert("Successfully added artwork!");
                if(cb){
                    cb(msg);
                }
            }
        })
    },
    DeleteArtwork: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/artwork/delete/id",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully deleted artwork!");
            }
        })
    },

    UpdateArtwork: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/artwork/update",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully updated artwork!");
            }
        })
    },


    UploadArtwork: function(file, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/artwork/upload",
            data: file,
            async: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            cache: false,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Upload artwork successful!");
            }
        });
    },

    ShowArtwork: function(query, cb){
        $.ajax({
            type: "GET",
            url: API_URL + "/mfa/artwork/id=" + query.id.toString(),
            async: false,
            success: function(msg) {
                if(cb){
                    cb(msg.content.artwork);
                }
            }
        });
    },
    ShowArtworks: function(cb){
        $.ajax({
            type: "GET",
            url: API_URL + "/mfa/artwork/",
            dataType: 'json',
            async: false,
            success: function(msg) {
                cb(msg.content.artworks);
            }
        });
    },

    LoginUser: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/",
            data: query,
            success: function(msg) {
                cb(msg.content.url);
            }
        });
        // .done(function(authResult){
        //     //cb(authResult);
        // });
    },
    // AddUser: function(query, cb) {
    //     $.ajax({
    //         type: "POST",
    //         url: API_URL + "/mfa/new",
    //         data: query,
    //         success: function(msg) {
    //             alert(msg);
    //         }
    //     });
    // },

    AddGallery: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/gallery/new",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully added gallery!");
            }
        })
    },
    DeleteGallery: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/gallery/delete/id",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully deleted gallery!");
            }
        })
    },


    UpdateGallery: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/gallery/update",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully updated gallery!");
            }
        })
    },
    ShowGallery: function(query, cb){
        $.ajax({
            type: "GET",
            url: API_URL + "/mfa/gallery/id=" + query.id.toString(),
            async: false,
            success: function(msg) {
                if(cb){
                    cb(msg.content.gallery);
                }
            }
        });
    },
    ShowGalleries: function(cb){
        $.ajax({
            type: "GET",
            url: API_URL + "/mfa/gallery/",
            dataType: 'json',
            async: false,
            success: function(msg) {
                cb(msg.content.galleries);
            }
        });
    },

    AddWay: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/way/new",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully added way!");
            }
        })
    },
    DeleteWay: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/way/delete/id",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully deleted way!");
            }
        })
    },


    UpdateWay: function(query, cb) {
        $.ajax({
            type: "POST",
            url: API_URL + "/mfa/way/update",
            data: query,
            success: function(msg) {
                if(cb){
                    cb(msg);
                }
                alert("Successfully updated way!");
            }
        })
    },

    ShowWay: function(query, cb){
        $.ajax({
            type: "GET",
            url: API_URL + "/mfa/way/id=" + query.id.toString(),
            async: false,
            success: function(msg) {
                if(cb){
                    cb(msg.content.way);
                }
                // alert("Find way successful!");
            }
        });
    },
    ShowWays: function(cb){
        $.ajax({
            type: "GET",
            url: API_URL + "/mfa/way/",
            dataType: 'json',
            async: false,
            success: function(msg) {
                cb(msg.content.ways);
            }
        });
    }
}

