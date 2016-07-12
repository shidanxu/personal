// Lead author: Shidan Xu
// Lead author: Neil Gurram
// 
module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  // ## Define MFASchema
  // non-empty and uniqueness requirement
  var ArtworkSchema = new Schema({
    accessNumber: {
      type: String,
      default: '',
      trim: true,
      required: true,
      unique: true
    },

    name: {
      type: String,
      default: '',
      required: true,
      unique: false
    },
    galleryName: {
      type: String,
      default: '',
      unique: false
    },
    author: {
      type: String,
      default: '',
      unique: false
    },

    // image: {
    //   data: Buffer,
    //   contentType: String
    // },
  });

  ArtworkSchema.statics = {
    // Check Uniqueness
    load: function(user, cb) {
      this.findOne(user)
        .exec(cb);
    }
  }

  mongoose.model('Artwork', ArtworkSchema);
}