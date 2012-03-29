var Post = require( '../models/post.js' )
  , Comment = require('../models/comment.js')
  , util = require( 'util' );

exports.create = function(data) {
  socket= this;
  post_id = data.post_id;
  content = data.content;

  Post.findById(post_id, function(err, post) {
    if (err) throw err;
    name = post.username;
    new Comment({
      post: post, 
      username: name,
      content: content
    }).save(function(err, comment) {
      if (err) throw err;
      post.comments.push(comment._id);
      post.save(function(err) {
        if (err) throw err
        socket.broadcast.emit("newcomment", comment);
        socket.emit("newcomment", comment);
      })
    })
  })
}


exports.like = function(data) {
  socket = this;
  id = data.id;
  action = data.action;

  Comment.findById(id, function(err, comment) {
    if (err) throw err;
    if (action === "like") comment.likes ++;
    else if (action === "unlike" && comment.likes > 0) comment.likes --;
    comment.save(function(err, comment) {
      if (err) throw err;
      socket.broadcast.emit("commentlike", {id: id, likes: comment.likes})
      socket.emit("commentlike", {id: id, likes: comment.likes})
    });
  })
}