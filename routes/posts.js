  /*
 * GET home page.
 */

var Post = require( '../models/post.js' )
  , Hashtag = require( '../models/hashtag.js' )
  , util = require( 'util' )
  , tolerance = 0;

/* ROUTES FROM ROUTER */

exports.all = function( req, res ) {
  console.log( "req query is" + util.inspect( req.query ) );
  var lat = req.query.lat;
  var lon = req.query.lon;
  Post.find({})
  //.where('location')
  //.near([lon, lat])
  //.maxDistance(1)
  .desc('date')
  .limit(25)
  .populate("comments")
  .run( function( err, posts ) {

    res.send( JSON.stringify( posts ) );
  }) 
};

exports.list_posts =function (req,res ){
  Post.findOne( { _id: req.body.post.id}).remove( function (err, posts) {
    res.render( 'admin' );
  } );
};

/* SOCKET ROUTES */

/*
 * Handler to create new post
 */	

exports.create = function( data ) {
  socket = this;
  c = data.content;
  hashtags = c.match(/#[a-zA-z_]+\w*/g);
  console.log(c)
  console.log(hashtags)
	new Post( {
    content: c, 
    location: data.location, 
    place: data.place, 
    username: data.username
  }).save( function (err, post) {
    if (err) throw err;
    // Emit message to all other sockets
    socket.broadcast.emit( 'new_post', post );

    // Also emit message to the socket that created it
    socket.emit( 'new_post', post );
    for(h in hashtags) {
      tag = hashtags[h].substring(1); // Remove '#'
      Hashtag.findOne({ text:tag }, function(err, hash) {
        if (err) throw err;
        if (hash) {
          hash.posts.push(post);
          hash.count++;
          hash.save();
        }
        else {
          hash = new Hashtag({
            text: tag,
            posts: [post],
            count: 1
          });
        }
        hash.save(function(err) {
          if (err) throw err;
          socket.emit("newhash")
          console.log("new hashtag "+ tag + " created!")
        })
      })
    }
		console.log("new post", util.inspect(post, false, null))
	});
};

exports.like = function(data) {
  socket = this;
  id = data.id || '';
  action = data.action || '';
  Post.findById(id, function(err, post) {
    if (err) throw err;
    if (action === "like") post.likes ++;
    else if (action === "unlike" && post.likes > 0) post.likes --;
    post.save(function(err) {
      if (err) throw err;
      socket.broadcast.emit("postlike", {id: id, likes: post.likes});
      socket.emit("postlike", {id: id, likes: post.likes})
    });
  })
}

exports.admin_get  = function( req, res ) {

  var loc = req.query.location;
  Post
  .where('location', loc)
  .run( function( err, posts ) {
        res.send( { posts: JSON.stringify( posts ) } );
  } ) 
};