var mongoose = require( 'mongoose' )
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var posterSchema = new Schema( {
  name: {type: String, required: true},
  email: {type: String, required: true},
  picture: {type: String, required: true}

} );

module.exports = mongoose.model( 'Poster', posterSchema );