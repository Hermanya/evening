
/*
 * GET home page.
 */

 exports.index = function(req, res){
 	if(req.session.user === undefined){
 		res.render('welcome', {});
 	}else{
 		res.render('index', {});
 	}
 };


/*
 * REGISTRATION page.
 */

 exports.register = function(req, res){
 	res.render('register', {});
 };

/*
 * INVITE page.
 */

 exports.invite = function(mongodb,db){
 	return function(req, res){
 		var id = mongodb.ObjectID.createFromHexString(req.params.id);
 		console.log(id);
 		db.collection("user").findOne({_id:id},function(error,user){
 			if (error || user === null){
 				res.send('error');
 			}else{
 				if (user.email != null){
 					res.send('This invite has already been used.<a href="/"> Back to main page.</a>');
 				}else{
 					req.session.user = user;
 					res.render('invite', {role:user.role});
 				}
 			}
 		});
 	};
 };

/*
 * REGISTRATION page.
 */

 exports.team = function(req, res){
 	if(req.session.user === undefined){
 		res.render('welcome', {});
 	}else{
 		res.render('team', {});
 	}
 };

/*
 * Log in
 */

 exports.loginHandler = function(db,bcrypt){
 	return function(req, res){
 		var eMail = req.body.email;
 		var collection = db.collection('user');
 		collection.findOne({email:eMail},function(error,user){
 			if (error || user === null){
 				res.send('error');
 				return;
 			}
 			var password = req.body.password;
 			bcrypt.compare(password, user.hash, function(err, resp) {
 				if(resp){
 					req.session.user = user;
 					res.send('ok');
 				}else{
 					res.send(err);
 				}
 			});
 		});
 	};
 };
 exports.login = function(req,res){
 	res.render('login', {});
 }
 exports.logout = function(req,res){
 	delete req.session.user;
 	res.send('ok');
 }
