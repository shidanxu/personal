
module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  // ## Define Problem Schema
  // non-empty and uniqueness requirement
  var ProblemSchema = new Schema({
    definition: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    companys: [{
      type: String,
      required: true,
      trim: true
    }],
    author: {
      type: String,
      default: '',
      unique: false
    },
  });

  ProblemSchema.statics = {
    // Check Uniqueness
    load: function(user, cb) {
      this.findOne(user)
        .exec(cb);
    }
  }

  mongoose.model('Problem', ProblemSchema);
}