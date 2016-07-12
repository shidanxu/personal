// Lead author: Neil Gurram

module.exports = function(mongoose) {
	var Schema = mongoose.Schema;

	// ## Define MFASchema
	// non-empty and uniqueness requirement
	var MFASchema = new Schema({
		username: {
			type: String,
			default: '',
			trim: true,
			required: true,
			unique: true
		},
		password: {
			type: String,
			default: '',
			required: true
		},
	});

	MFASchema.statics = {
		// Check Uniqueness
		load: function(user, cb) {
			this.findOne(user)
				.exec(cb);
		}
	}
	mongoose.model('MFA', MFASchema);
}