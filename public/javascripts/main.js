$(document).ready( function () {
  var lat, lon, uname;
  //var socket = io.connect( 'http://circa.nodejitsu.com:80/' );
  var socket = io.connect( 'http://localhost/' );

  if(navigator.geolocation) {
    var fb = true;
    setTimeout(function() { // To prevent showing if location is given.
      if (fb) {
        var post = $(BrowserDetect.detect());
        $.fancybox(post)
      }
    }, 500)
    navigator.geolocation.getCurrentPosition(function(position) {
      fb = false;
      $.fancybox.close();
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      $.get("/posts", {lat: lat, lon:lon}, function(data) {
        render_feed(data);
      })
      get_trending();
      console.log(lon, lat)
    }, function(err) {
      console.log("location error: ", err)
    });

  }
  else {
    alert("I'm sorry, but geolocation services are not supported by your browser.");
  }

  setInterval(function() { // Update location every minute;
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    });
  }, 60000) 

  uname = $.cookie('circa_uname') || "no-like-cookies"
  console.log("name is " + uname);

  /* ============ SOCKET EVENTS ============== */

  socket.on("newhash", function(data) {
    console.log("newhas!!")
    get_trending();
  })
  socket.on('new_post', function ( data ) {
    console.log(data)
    render_post(data, function(html) {
      $("#feed").prepend(html);
      $(".postbox").first().slideDown(50);
    })
  } );
  socket.on('postlike', function(data) {
    post = $(".post[post-id='"+data.id+"']");
    if(post) {
      $(post).find(".likes").html(data.likes)
    }
  });
  socket.on('commentlike', function(data) {
    com = $(".comment[comment-id='"+data.id+"']");
    if(com) {
      $(com).find(".likes").html(data.likes)
    }
  });
  socket.on('newcomment', function(comment) {

    ctext = render_comment(comment, function(ctext) {
      post = $(".post[post-id='"+comment.post+"']");
      comments = $(post).parents(".postbox").find(".comments");
      console.log(ctext);
      $(comments[0]).append(ctext);

    });
  })
  
  /* ============= DOM EVENTS ============= */

  $("#feed").click(function(e) {
    t = e.target;
    if($(t).hasClass("post_like")) {
      $(t).hide();
      var id = $(t).parents(".post").attr("post-id");
      if($(t).hasClass("like")) {
        $(t).parent().children(".unlike").show();
        socket.emit("postlike", {id: id, action: "like"});
      }
      else if($(t).hasClass("unlike")) {
        $(t).parent().children(".like").show();
        socket.emit("postlike", {id: id, action: "unlike"});
      }
    }
    else if($(t).hasClass("comment_like")) {
      $(t).hide();
      var id = $(t).parents(".comment").attr("comment-id");
      if($(t).hasClass("like")) {
        $(t).parent().children(".unlike").show();
        socket.emit("commentlike", {id: id, action: "like"});
      }
      else if($(t).hasClass("unlike")) {
        $(t).parent().children(".like").show();
        socket.emit("commentlike", {id: id, action: "unlike"});
      }
    }
    else if($(t).hasClass("show_comments")) {
      $(t).parents(".postbox").children(".commentbox").slideToggle("fast");
    }
  });
  $('body').click(function(e) {
    t = e.target;
    if($(t).hasClass("search")) {
      $("#feed").html("<img src='/images/loading.gif' width='100' height='50' />")
      var tag = $(t).attr("data-tag");
      console.log("loading...", tag)
      $.get("/topic", { tag: tag }, function(data) {
        console.log(data)
        render_feed(data)
      })
    }
  })
  $("#feed").keypress(function(e) {
    if(e.which == 13 && $(e.target).hasClass("comment_input")) {
      t = e.target;
      if($(t).val() != "") {
        post_id = $(t).parents(".postbox").children(".post").attr("post-id");

        socket.emit("newcomment", {post_id: post_id, content: $(t).val()})
        $(t).val("");

      }
    }
  });

  $('#new_post_body').keypress(function(e) {
    if (e.which == 13){ 
      e.preventDefault();
      socketPost(socket, lon, lat, uname);
    }
  });
  $("#home").click(function() {
    if(location.hash != "") {
      $.get("/posts", {lat: lat, lon:lon}, function(data) {
        render_feed(data);
      })
    }
  })

});

/* ============= FUNCTIONS =========== */

function render_feed(data) {
  data = JSON.parse(data);
  if(!data) {
    $("#feed").html(render_no_posts())
    console.log("done")
  }
  else {
    $("#feed").html("");
    $.each(data, function(key, val) {
      $("#feed").append(render_post(val));
      $(".postbox").last().slideDown("fast");
    })
    updateElapsed(".time", ".elapsed", 1000)
  }
}

function render_no_posts() {
  return '<div class="postbox">\
    <div class="post">\
      <div class="post_body">Sorry, there aren\'t any posts to render</div>\
    </div>\
  </div>'

}

/* Renders a post from the post object */
function render_post(post, cb) {
  var hash_regex = /#([a-zA-z_]+\w*)/g;
  // The template into which we place our values
  var text = 
  '<div class="postbox" style="display:none">\
    <div class="post time" data-datetime="'+post.date+'" post-id="'+post._id+'">\
      <div class="post_user">'+post.username+'</div>\
      <div class="post_body">'+post.content+'</div>\
      <div class="elapsed post_time"></div>\
      <span class="like post_like">Like!</span>\
      <span class="unlike post_like">Unlike</span>\
      <div class="likes post_like">'+post.likes+'</div>\
      <a class="show_comments" href="#">Comments ('+post.comments.length+')</a>\
    </div>\
    <div class="commentbox"><div class="comments">';
    $.each(post.comments, function(key, comment) {
      text += render_comment(comment)
    })
    text += '</div><input class=comment_input placeholder="Write a comment!" />'
    text += '</div></div>'
  var text = text.replace(hash_regex, 
    "<a class='search' href='#/topic/$1' data-tag='$1'>#$1</a>");
  if(typeof cb === "function") cb(text);
  else return text;

}

function render_comment(comment, cb) {
  text = 
  '<div class="comment time" data-datetime='+comment.date+' comment-id="'+comment._id+'"+>\
    <div class="comment_user">'+comment.username+'</div>\
    <div class="comment_content">'+comment.content+'</div>\
    <div class="elapsed comment_time"></div>\
    <span class="like comment_like">Like!</span>\
    <span class="unlike comment_like">Unlike</span>\
    <div class="likes comment_likes">'+comment.likes+'</div>\
  </div>';
  if (typeof cb === "function") cb(text);
  else return text;
}

function get_trending(cb) {
  $.get("/trending", function(data) {
    d = JSON.parse(data);
    console.log(d)
    $("#trending").html("")
    $.each(d, function(k, val) {
      $("#trending").append(
        "<a class='trend search' href='#/topic/"
        +val.text+"' data-tag='"+val.text+"'>#"+val.text+'</a><br/>')
    })
    if(typeof cb === "function") cb();
  })
}

// Create post using socket post
function socketPost( socket, lon, lat, uname ) {
 
  if($("#new_post_body").val()!==""){
    var text = $( '#new_post_body' ).val();
    var place = $('#locname').html();
    socket.emit('create_post', {
      content: text, 
      location: [lon, lat], 
      place: place,
      username: uname
    });
    $("#new_post_body").val("")
  }
}

