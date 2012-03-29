/*
 * GET home page.
 */

var Room = require( '../models/room.js' );
var util = require( 'util' );
var tolerance = 0;


exports.list_posts = function( req, res ) {
  
	Post
	.where('latitude').gte(tolerance)

	.run( function ( err, posts ) {
		res.render( 'index.ejs', { title: 'CrushFlow', posts: posts.reverse() } );
		
	} )

};

/*
 * Handler to create new post
 */	

exports.create_post = function( data, socket ) {

	new Post( { title: data.title, content: data.content, latitude: data.latitude, longitude: data.longitude }
	 ).save( function (err) {
		
		if ( !err ) {
			console.log( 'Success!' );
			
			// Emit message to all other sockets
			socket.broadcast.emit( 'new_post_created', data );
			
			// Also emit message to the socket that created it
			socket.emit( 'new_post_created', data );
			
		} else {
			console.log( 'Had an error' + err );
		}
	});
};