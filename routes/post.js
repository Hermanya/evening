/*
 * POST posts
 */

 exports.post = function(db){
   return function(req, res){
    //TODO check the values
    var post = req.body;
    post.author_id = req.session.user._id;
    post.author_name = req.session.user.name;
    post.author_role = req.session.user.role;
    post.project_id = req.session.user.project_id;
    post.timestamp = Date.now();
    post.replies = [];

    db.collection('post').insert(post, function(err){
      res.send( err === null ? post :  err);
    })
  };
};

/*
 * CREATE users
 */

 exports.user = function(db,fileSystem,path){
  return function(req, res){
    //TODO check the values
    var user = req.body;
    user.invitedBy = req.session.user._id;
    user.project_id = req.session.user.project_id;
    user.canInvite = true;
    user.tasks = [];

    db.collection('user').insert(req.body, function(err){
      if (err === null){
        fileSystem.mkdir(path.resolve("./uploads/"+user.project_id+"/"+user._id));
        res.send(user);
      }else{
        res.send(err);
      }
    });
    
  };
};

/*
 * ASSIGN tasks
 */

 exports.task = function(mongodb,db){
  return function(req, res){
    //TODO check the values
    var task = req.body;
    task.startTimestamp = Date.now();
    task.from_user_id = req.session.user._id;
    task.isCompleted = false;
    task._id = new mongodb.ObjectID();
    var otherUserId = task.assigning_to_id;
    otherUserId = mongodb.ObjectID.createFromHexString(otherUserId);
    delete task.assigning_to_id;

    db.collection('user').update({_id:otherUserId}, 
      {$push:{tasks:task}},
      function(err,result){
        req.session.user.tasks.push(task);
        res.send( err === null ? task : err);
      });
    
  };
};

/*
 * CREATE projects
 */

 exports.project = function(db,bcrypt,path,fileSystem){
  return function(req, res){
    var user = req.body.user,
    project = req.body.project;

    db.collection('user').find({email:user.email}).toArray(function(err,users){
      if (users.length == 0){

        db.collection('project').insert(project, function(err){
          if (err !== null){
            res.send(err);
          }else{
            fileSystem.mkdir(path.resolve("./uploads/"+project._id));
            fileSystem.mkdir(path.resolve("./public/userpics/"+project._id));

            user.project_id = project._id.toString();
            user.canInvite = true;
            user.tasks = [];
            var salt = bcrypt.genSaltSync(10);
            user.hash = bcrypt.hashSync(user.password, salt);
            delete user.password;

            db.collection('user').insert(user, function(err){
              req.session.user = user;
              fileSystem.mkdir(path.resolve("./uploads/"+project._id+"/"+user._id));

              if (req.files.photo == undefined){
                res.send((err === null) ? "ok" : err);
                return;
              }
              var tempPath = req.files.photo.path,
              targetPath = path.resolve("./public/userpics/"+project._id+"/"+user._id);
              fileSystem.rename(tempPath, targetPath, function(err) {
                if (err){
                  console.log(targetPath+" is not found");
                  throw err;
                } 
                else
                  res.send(err === null ? "ok" : err);
              });
            });
          }
        });
}else{
  res.send("already registered"); 
}
});
};
};
/*
 * UPLOAD attachments
 */

 exports.attachment = function(db,path,fileSystem){
  return function(req, res){
    //TODO check the values
    console.log("here");
    var attachment = req.files.attachment;

    var record = {};
    record.name = attachment.name;
    record.type = attachment.type;
    record.size = attachment.size;
    record.project_id = req.session.user.project_id;
    record.user_id = req.session.user._id;
    console.log(record);
    db.collection('attachment').insert(record, function(err){
      if (err === null){
        var tempPath = attachment.path,
        targetPath = path.resolve("./uploads/"+record.project_id+"/"+record.user_id+"/"+record.name);
        fileSystem.rename(tempPath, targetPath, function(err) {
          if (err){
            res.send(err);
            throw err;
          }else{
            res.send(record);
          }
        });
      }else{
        res.send(err);
      }
    });
  };
};
/*
 * COMMENT
 */
 exports.comment = function(mongodb,db){
  return function(req,res){
    var comment = req.body;
    comment._id = new mongodb.ObjectID();
    comment.timestamp = Date.now();
    comment.author_id = req.session.user._id;
    comment.author_name = req.session.user.name;
    comment.replies = [];

    var path = comment.path.split("/");
    path.splice(0,1);
    path.splice(-1,1);
    var queryPath = "";
    if (path.length!=0){
      for (var i = 0; i < path.length; i++) {
        queryPath += "replies."+path[i]+".";
      };
      queryPath+="replies";
    }else{
      queryPath = "replies";
    }
    delete comment.path;
    var post_id = mongodb.ObjectID.createFromHexString(req.params.postId);

    var action = {};
    action[queryPath] = comment;
    db.collection('post')
    .update({_id : post_id},
      {$push:action}, 
      function(err){
        if (err === null)
          res.send(comment);
        else
          res.send(error);
      });
  }

}
