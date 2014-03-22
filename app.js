
/**
 * Module dependencies.
 */

 var express = require('express');
 var routes = require('./routes/index');
 var get = require('./routes/get');
 var post = require('./routes/post');
 var remove = require('./routes/delete');
 var put = require('./routes/put');

 var http = require('http');
 var path = require('path');
 var fileSystem = require('fs');


 var mongodb = require('mongodb');
var mongoskin = require('mongoskin');
var db = mongoskin.db("mongodb://hermanya:gsmOsg4Z@dbh42.mongolab.com:27427/hubohub", {native_parser:true});
/*var mongoClient = mongodb.MongoClient;
mongoClient.connect("mongodb://localhost:27017/hubohub", function(err,db){
	if(err) throw err;
	console.log("connected to database");
*/
	var bcrypt = require('bcrypt');


	var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon(__dirname+'/public/favicon.ico'));
app.use(express.bodyParser({keepExtensions: true,uploadDir:__dirname +"/tmp"}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('w3st3nd8ir1s'));
app.use(express.cookieSession());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
app.get('/', routes.index);
app.post('/login-handler', routes.loginHandler(db,bcrypt));
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/register', routes.register);
app.get('/team', routes.team);

app.get('/invite/:id', routes.invite(mongodb,db));
app.get('/get/post/:skip', get.post(db));
app.get('/get/team', get.team(mongodb,db));
app.get('/get/tasks', get.tasks);
app.get('/get/attachment/:id', get.attachment(mongodb,db,path));
app.post('/post/post', post.post(db));
app.post('/post/user', post.user(db,fileSystem,path));
app.post('/post/task', post.task(mongodb,db));
app.post('/post/comment/:postId', post.comment(mongodb,db));
app.post('/post/project', post.project(db,bcrypt,path,fileSystem));
app.post('/post/attachment', post.attachment(db,path,fileSystem));
app.post('/delete/post/:id', remove.post(mongodb,db));
app.post('/delete/task', remove.task(mongodb,db));
app.post('/put/user', put.user(mongodb,db,fileSystem,path,bcrypt));
app.post('/put/task/:id', put.task(mongodb,db));



http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
//});
