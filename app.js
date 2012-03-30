/**
 * Module dependencies.
 */

var express = require( 'express' )
  , mongoose = require( 'mongoose' )
  , sio = require('socket.io')
  , less = require('less')

// App
var app = module.exports = express.createServer()
  , io = sio.listen( app )

// Import routes

var routes = require( './routes/index.js' )
  , posts = require('./routes/posts.js')
  , comments = require('./routes/comments.js')
  , sockets = require('./routes/sockets.js')
  , admin = require('./routes/admin.js')

app.configure(function () {
  app.set( 'views' , __dirname + '/views' );
  app.set( 'view engine', 'jade' );
  app.use( express.bodyParser() );
  app.use( express.cookieParser());
  app.use( express.session({
    secret: "secret"
  }));
  //app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use( express.methodOverride() );  
  app.use( express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use( app.router );
  app.use( express.static(__dirname + '/public') );
});

app.configure( 'development', function () {
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) );
	var mongoose_uri = 'mongodb://circa:circa@ds031657.mongolab.com:31657/circa_test';
	mongoose.connect( mongoose_uri );
} );

app.configure( 'production', function () {
  app.use(express.errorHandler() ); 
  var mongoose_uri = 'mongodb://circa:circa@ds031657.mongolab.com:31657/circa_test';
	mongoose.connect( mongoose_uri );
} );

// Routes

app.get("/", function(req, res) {
  
  sockets = io.sockets.in(req.sessionID);
  io.sockets.in(req.sessionID).send("ready");
  routes.index(req, res, sockets);
});
app.get("/posts", posts.all);

app.get("/admin!!5423", admin.index)
app.get("/get_admin_posts", posts.get_posts)
app.get("/topic", routes.search);
app.get("/trending", routes.trending)

//app.post("/topic", post.search);

app.post("/admin!!5432", admin.delete)

// Attach socket listeners

io.sockets.on('connection', function ( socket ) {
    socket.join(socket.handshake.sessionID)
    socket.on('create_post', posts.create);
    socket.on('postlike', posts.like)
    socket.on('commentlike', comments.like)
    socket.on('newcomment', comments.create)
} );

var port = process.env.PORT || 3000;

app.listen( port );
//console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
