var mongoose = require( 'mongoose' )
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;
	
var postSchema = new Schema( {
	content: {type: String, required: true}, 
	location: {type: [Number, Number], required: true}, // LONG, LAT
	date: { type: Date, default: Date.now },
	place: String,
	username: { type: String, required: true },
	comments: [
		{type: ObjectId, ref: "Comment"}
	],
	likes: {type: Number, required: true, default: 0}

	//poster: {type: ObjectId, ref: "Poster"},

} );

postSchema.methods.date_display = function ( cb ) {
	var date = this.date.getDate();
	var month = this.date.getMonth() + 1;
	var year = this.date.getFullYear();
	return month + "/" + date + "/" + year;
	return this.date.toLocaleDateString();
	return this.date.toLocaleTimeString();
};

module.exports = mongoose.model( 'Post', postSchema );