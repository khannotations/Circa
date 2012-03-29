/*
 * GET admin page.
 */

 exports.index = function( req, res ) {
  
  Post.find( function ( err, posts ) {
    res.render( 'admin.ejs', {  posts: posts.reverse() } );
    
  } )

};

exports.delete =function (req,res ){
    
  console.log("req.body in delete_post is " + req.body.post.id);
  Post.findOne( { _id: req.body.post.id}).remove( function (err, posts) {
    res.render( 'admin.ejs' );
  } );
};

exports.admin = function(req, res){
  res.render('admin.ejs', { title: 'Something different' })
};