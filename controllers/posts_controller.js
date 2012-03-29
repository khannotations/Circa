/*
 * GET home page.
 */

var Post = require( '../models/post.js' );
var util = require( 'util' );
var tolerance = 0;

var list1 = require( '../models/adj.js' );
var list2 = require( '../models/noun.js' );

module.exports.index = exports.list_posts = function( req, res ) {
  console.log("req.cookies.uname is " + req.cookies.uname);
  var passCookie= req.cookies.uname;
  if (passCookie !== undefined) {
  		
  		Post.find( function ( err, posts ) {
  		res.render( 'index.ejs', { posts: posts.reverse() } );
  		
  	} )
	}

  else{
  	console.log("passcookie statement initiated");
  	var indexa = Math.floor(Math.random()*list1.length);
  	var indexb = Math.floor(Math.random()*list2.length);

  	console.log("list1lenght is " + list1.length);
  	name = list1[indexa] + list2[indexb];

  	Post.find( function ( err, posts ) {
  		console.log("name in the else statement is" + name);
  		res.cookie('uname', name , { maxAge: 5400000 });
  		res.render( 'index.ejs', {  posts: posts.reverse() } );
  	} )
	}
};





module.exports.admin_list = exports.list_posts = function( req, res ) {
  
	Post.find( function ( err, posts ) {
		res.render( 'admin.ejs', {  posts: posts.reverse() } );
		
	} )

};


/*
 * Handler to create new post
 */	

module.exports.create_post = function( data, socket ) {

	
console.log("here's the create post method");

	new Post( {  content: data.content, latitude: data.latitude, longitude: data.longitude, location: data.location, username: data.username}
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
		
 
	} );

};

module.exports.delete_post = 

/**** WTG START ****/

module.exports.get_posts = function( req, res ) {
  console.log( "req query is" + util.inspect( req.query ) );
	var loc = req.query.location;
	
//"houdini", "wow", "user2", "user 3"
  Post
  .where('location', loc).asc('date')
  .run( function( err, posts ) {

  	
  	
    res.send( { posts: JSON.stringify( posts ) } );
  } ) 
};

module.exports.admin_get  = function( req, res ) {
 //console.log( "req params is" + req.body.room.name );

  var loc = req.query.location;


  Post
  .where('location', loc)
  .run( function( err, posts ) {

  		
        res.send( { posts: JSON.stringify( posts ) } );
  } ) 
  
 
};



/**** WTG STOP ****/