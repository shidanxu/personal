// Lead author: Shidan Xu


var path = require('path');
var Mongoose = require('mongoose');
var Problem = Mongoose.model('Problem');
var NLP = require(path.join(config.controllers_path, 'nlp'));
var MyUtil = require(path.join(config.controllers_path, 'util'));
// -------------------------


/*
GET:
  /
Request parameters:
  null
Response: 
  success: true if this gallery is in database
  content: json file of the requested gallery
  err: error message
*/
// Show one artwork
exports.home = function(req, res) {
    res.render('home.ejs');
};

exports.displaycompanylogin = function(req, res) {
    res.render('companylogin.ejs');
};

exports.login = function(req, res) {
    username = req.body.username;
    password = req.body.password;
    console.log(username);
    console.log(password);

    Database.login(username, password);
};

function check_DB(problem){
    Problem.find({
        definition: problem
    }).exec(function(err, result) {
        if (err && (err.code === 11000 || err.code === 11001)) {
            return false;
        } else if (err) {
            return false;
        } else {
            return true;
        }
    });
};

function add_to_DB(problem) {
    var problemObj = {};
    problemObj["definition"] = problem;
    problemObj["companys"] = [];


    var newProblem = new Problem(problemObj)
        .save(function(err, result) {
            if (err && (err.code === 11000 || err.code === 11001)) {
                // MyUtil.sendErrResponse(res, 403, err.message);
            } else if (err) {
                // MyUtil.sendErrResponse(res, 500, err.message);
            } else {
                // MyUtil.sendSuccessResponse(res, {
                //     problem: result
                // });
            }
        });
}

function query_DB(problem) {
    Problem.find({
        definition: problem
    }).exec(function(err, result) {
        if (err) {
            // MyUtil.sendErrResponse(res, 500, err.message);
        } else {
            // MyUtil.sendSuccessResponse(res, {
            //     problem: result
            // });
    		return result
        }
    });
};
exports.search = function(req, res) {
    console.log(req.body)
    raw_problem = req.body.query1;
    console.log(raw_problem);

    refined_problem = NLP.refine(raw_problem);
    console.log(refined_problem);

    if (check_DB(refined_problem) == false) {
        add_to_DB(refined_problem);
        // return false;
    } else {
        problem =  query_DB(refined_problem);
    }

    res.render('search_results.ejs', {
        problem: refined_problem
    });
}

exports.display_results = function(req, res) {
	res.render('results.ejs');
}

exports.new_thread = function(req, res){
	res.render('new_thread.ejs');
}