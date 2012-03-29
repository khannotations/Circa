function updateElapsed( selector, dest, interval ) {
  // Sets an interval to update time elapsed for updates and the like
  
  if ( typeof interval === "undefined" ) {
    interval = 5000; // Default to updating every 16 seconds
  }
  
  var sI = setInterval( function() {
    $.each($(selector), function(key, obj) {
      date = new Date($(obj).attr('data-datetime'));
      elapsed = Date.now() - date;
      $( obj ).find( dest ).html( displayElapsed( elapsed ) );
    })
  }, interval );
}

function displayElapsed( elapsed ) {
  var minute = 60000; // 60000 milliseconds in a minute
  var hour = 60 * minute;
  var day = 24 * hour;
  var week = 7 * day;
  var month = 30 * day;
  var year = 365 * day;
  
  if ( elapsed < 5000 )
    // If within the last 10 seconds, say "just now..."
    return "just now...";
  else if ( elapsed < minute ) {
    var seconds = Math.round( elapsed / 1000 );
    return "circa " + seconds + " seconds ago";
  } 
  else if ( elapsed < minute * 59.5 ) { // 59.5 minutes
    var minutes = Math.round( elapsed / minute );
    return minutes == 1 ? "circa 1 minute ago" : "circa " + minutes + " minutes ago";
  } 
  else if ( elapsed < hour * 23.5 ) {  // 23.5 hours
    var hours = Math.round( elapsed / hour );
    return hours == 1 ? "circa 1 hour ago" : "circa " + hours + " hours ago";

  } 
  else if ( elapsed < day * 13.5 ) {  // 13.5 days
    var days = Math.round( elapsed / day );
    return days == 1 ? "circa 1 day ago" : "circa " + days + " days ago";
  } 
  else if ( elapsed < week * 3.5 ) {  // 3.5 weeks 
    var weeks = Math.round( elapsed / week );
    return weeks == 1 ? "circa 1 week ago" : "circa " + weeks + " weeks ago";
  } 
  else if ( elapsed < month * 11.5 ) {  // 11.5 months
    var months = Math.round( elapsed / month );
    return months == 1 ? "circa 1 month ago" : "circa " + months + " months ago";
  } 
  else {
    var years = Math.round( elapsed / year );
    return years == 1 ? "circa 1 year ago" : "circa " + years + " years ago";
  }   
}





