// Lead author: Donglai Wei
var path = require('path');
// setup database
module.exports = function(mongoose) {
    if (deploy) {
        var connection_string = 'localhost:27017/MyWay';
        if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
            connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
                process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
                process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
                process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
                process.env.OPENSHIFT_APP_NAME;
        }
        mongoose.connect('mongodb://' + connection_string);
    } else {
        mongoose.connect('localhost:27017/' + config.dbName);
    }
    
    // register models in order
    // var fs = require('fs');
    // fs.readdirSync(config.models_path).forEach(function(file) {
    //     require(path.join(config.models_path,file));
    // });
    require(path.join(config.models_path, "artwork"))(mongoose);
    require(path.join(config.models_path, "gallery"))(mongoose);
    require(path.join(config.models_path, "road"))(mongoose);
    require(path.join(config.models_path, "way"))(mongoose);
    require(path.join(config.models_path, "map"))(mongoose);
    require(path.join(config.models_path, "mfa"))(mongoose);
    require(path.join(config.models_path, "problem"))(mongoose);
}