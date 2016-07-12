// Lead author: Donglai Wei

module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var Gallery = mongoose.model('Gallery');
	var Road = mongoose.model('Road');

	var MapSchema = new Schema({
		name: {
			type: String,
			default: '',
			trim: true,
			required: true,
			unique: true
		},
		description: {
			type: String,
			default: ''
		},
		image: {
			data: Buffer,
			contentType: String
		},
		gallerys: [{
			type: Schema.ObjectId,
			ref: 'Gallery'
		}],
		roads: [{
			type: Schema.ObjectId,
			ref: 'Road'
		}]
	});

	MapSchema.methods = {
		delGallery: function(del_id) {
			var index = this.Gallerys.indexOf(del_id);
			if (index > -1) {
				this.Gallerys.splice(index, 1);
				Gallery.findByIdAndRemove(del_id, function(err) {
					if (err) console.log(err);
				});
			}
		},
		delRoad: function(del_id) {
			var index = this.Roads.indexOf(del_id);
			if (index > -1) {
				this.Roads.splice(index, 1);
				Road.findByIdAndRemove(del_id, function(err) {
					if (err) console.log(err);
				});
			}
		},
		delAllGallerys: function() {
			Gallery.find({
				_id: {
					$in: this.Gallerys
				}
			}, function(err, results) {
				results.forEach(function(result) {
					console.log("rm: " + result._id);
					Gallery.findByIdAndRemove(result._id, function(err) {
						if (err) console.log(err);
					});
				});
			});
			this.Gallerys = [];
		},
		delAllRoads: function(del_id) {
			Road.find({
				_id: {
					$in: this.Roads
				}
			}, function(err, results) {
				results.forEach(function(result) {
					Road.findByIdAndRemove(result._id, function(err) {
						if (err) console.log(err);
					});
				});
			});
			this.Roads = [];
		},
		addGallery: function(new_id, cb) {
			this.Gallerys.push(new_id);
			this.save(cb);
		},
		addRoad: function(new_id, cb) {
			this.Roads.push(new_id);
			this.save(cb);
		},
	};

	mongoose.model('Map', MapSchema);
}