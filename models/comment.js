var mongoose = require( 'mongoose' )
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  
var commentSchema = new Schema( {
  post: {type: ObjectId, required: true, ref: "Post"},
  content: {type: String, required: true}, 
  date: { type: Date, default: Date.now, required: true },
  username : { type: String, default: "theETHER!!" },
  likes: {type: Number, required: true, default: 0}

} );

module.exports = mongoose.model( 'Comment', commentSchema );