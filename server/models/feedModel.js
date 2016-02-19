const db = require("../middlewares/db"),
	Schema  = db.Schema;

var feedSchema = new Schema({
	email : {type: String, required: true},
	feeds : {
		id : {type: String, required: true, unique: true},
		message : {type: String},
		name : {type: String},
		picture : {type: String}
	},
	saved_at : {type: Date, default: new Date().toDateString()},
	saved_by : {type: String, default: "Guest User"}
});

var feedModel = db.model('FeedModel', feedSchema);

module.exports = feedModel;