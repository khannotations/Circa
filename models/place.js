var mongoose = require( 'mongoose' )
	, Schema = mongoose.Schema;
	
var placeSchema = new Schema( {
  name: String, 
  location: {type: [Number, Number], required: true}, // LONG, LAT
} );

module.exports = mongoose.model( 'Place', placeSchema );