var mongoose = require( 'mongoose' )
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  
var tagSchema = new Schema( {
  text: {type: String, required: true, unique: true}, 
  posts: [
    {type: ObjectId, required: true, ref: "Post"}
  ],
  count: {type: Number, required: true, default: 0}

} );

module.exports = mongoose.model( 'Hashtag', tagSchema );