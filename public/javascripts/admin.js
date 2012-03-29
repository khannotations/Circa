$(  document).ready( function () {
    
  var socket = io.connect( 'http://circa.nodejitsu.com/' );
  //var socket = io.connect( 'http://localhost/' );
  $( '#radio input' ).click( function () {
    submitRoom();
    $('.postbox').hide();
    var loc = $('#locname').html();
    console.log("loca is " + loc);

    ajaxPosts( loc );
  } );

  $( '#submit_admin_post' ).click( function () {
    socketAdminPost( socket );
  } );
});

//function radiopush(){
  //var val = $("input:radio[name=room[name]]:checked").val();
   //$('#locname').html($('#sizeSmall').val());
   //console.log(" val is " + val);
  // $('#locname').html(val);

//}
function submitRoom(){
  var selected =$("input:radio[name=room[name]]:checked");
  var val =selected.val();
  console.log('selected val is' + val);
  selected.attr('checked','checked');
  console.log("attribute is " + selected.attr('checked'));
  $('#locname').html(val);
  $('#new_post_title').val("Where are you in " + $("#locname").html() + "?");
}

function socketAdminPost( socket ) {
  console.log("here's the socketpost method");
 
  if($("#new_post_body").val()!="Write Your Post Here."){  
    var content = $( '#new_crush_box' ).find( 'textarea' ).val();
    var latitude= $('#lat').html();
    var longitude= $('#lon').html();
    var location = $('#locname').html();
    var username = $('#admin_user_id').val();
    socket.emit( 'create_post', { 
      content: content, 
      location: { lat: latitude, long: longitude}, 
      place: location, 
      username: username 
    });
  }
  else{
    jAlert("You've gotta write a post!", "Circa");
  }
}



