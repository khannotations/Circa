/*
 * GET home page.
 */
 var Post = require( '../models/post.js' )
  , Hashtag = require( '../models/hashtag.js' )
  , util = require( 'util' )

var adjectives = require( '../models/adj.js' )
  , nouns = require( '../models/noun.js' );

exports.index = function( req, res, socket ) { // All sockets in this session
  var maxage = 60000*60*3; // 3 hours
  var name = req.cookies.circa_uname;

  if(!name) {
    a = Math.floor(Math.random()*adjectives.length);
    b = Math.floor(Math.random()*nouns.length);
    name = adjectives[a] +"-"+ nouns[b]
    res.cookie('circa_uname', name, { maxAge: maxage }); // 3 hours
  }
  res.render('index');
};


exports.search = function( req, res ) {
  tag = req.query.tag;
  console.log(req)
  Hashtag
  .findOne({text: tag})
  .populate("posts")
  .run(function(err, hashtag) {
    if (err) throw err;
    console.log(hashtag)
    posts = hashtag ? hashtag.posts.reverse() : null; // posts comes in reverse order

    res.send(JSON.stringify(posts));
  })
}

exports.trending = function(req, res) {
  Hashtag.find({}).desc('count').limit(5).run(function(err, tags) {
    if (err) throw err;
    res.send(JSON.stringify(tags))
  })
}