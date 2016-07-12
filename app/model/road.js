// Lead author: Donglai Wei

module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var RoadSchema = new Schema({
    name: {
      type: String,
      default: '',
      trim: true,
      required: true,
      unique: true
    },
    // gallery1: {
    //   type: Schema.ObjectId,
    //   ref: 'Gallery',
    //   unique: false
    // },
    // gallery2: {
    //   type: Schema.ObjectId,
    //   ref: 'Gallery',
    //   unique: false
    // },
    // paths: [{
    //   type: Number, required: false
    // }],
    dist: {
      type: Number,
      default: 0
    }
  });

  mongoose.model('Road', RoadSchema);
}