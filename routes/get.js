/*
 * GET posts
 */

exports.post = function(db){
	return function(req, res){
		var skip   = req.params.skip;

  	db.collection('post')
  	.find({project_id:req.session.user.project_id})
  	.sort({timestamp: -1})
  	.skip(skip)
  	.limit(10)
  	.toArray(function (err, items) {
      res.json(items);
    })
	};
};

/*
 * DOWNLOAD attachment
 */

exports.attachment = function(mongo,db,path){
	return function(req, res){
		var id = req.params.id;
		id = mongo.ObjectID.createFromHexString(id);
  	
  	db.collection('attachment')
  	.findOne({_id:id},function (err, record) {

  		if(err){
  			res.send(err);
  			return;
  		}
      if(record.project_id === req.session.user.project_id){
      	res.sendfile(
      		path.resolve(
      			"./uploads/"+record.project_id+"/"+record.user_id+"/"+record.name
      		)
      	);
      }
    })
	};
};
/*
 * GET team
 */

exports.team = function(mongodb,db){
  return function(req, res){
    var id = req.session.user.project_id;
    db.collection('user')
    .find({project_id:id})
    .toArray(function (err, items) {
      res.json(items);
    })
  };
};
/*
 * GET tasks
 */

exports.tasks =  function(req, res){
    res.json(req.session.user.tasks);
};