// Lead author: Donglai Wei

module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var GallerySchema = new Schema({
    name: {
      type: String,
      default: '',
      trim: true,
      required: true,
      unique: true
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    artworks: [{
      type: Schema.ObjectId,
      ref: 'Artwork'
    }],
  });
  mongoose.model('Gallery', GallerySchema);
}