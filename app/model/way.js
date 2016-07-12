// Lead author: Donglai Wei

module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

// make the way name unique
// so that we don't need to make seperate class for shortest paths 
  var WaySchema = new Schema({
    name: {
      type: String,
      default: '',
      trim: true,
      unique: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    galleries: [{
      type: String,
      default: '',
      trim: true
    }]
  });


  mongoose.model('Way', WaySchema);
}