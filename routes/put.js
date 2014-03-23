/*
 * UPDATE users
 */

 exports.user = function(mongodb,db,fileSystem,path,bcrypt){
  return function(req, res){
    //TODO check the values
    var newUser = req.body;
    var oldUser = req.session.user;
    if (newUser.name)
      oldUser.name = newUser.name;
    if (newUser.email)
      oldUser.email = newUser.email;
    if (newUser.password){
      var salt = bcrypt.genSaltSync(10);
      oldUser.hash = bcrypt.hashSync(newUser.password, salt);
    }
    var id = mongodb.ObjectID.createFromHexString(oldUser._id);
    delete oldUser._id;
    db.collection('user').find({email:oldUser.email}).toArray(function(err,users){
      if (! users.length){

        db.collection('user').update({_id:id},{$set:oldUser}, function(err){
          if(err){
            res.send(err);
            return;
          }
          oldUser._id = id;
          req.session.user = oldUser;
          if (req.files.photo){
            var tempPath = req.files.photo.path,
            targetPath = path.resolve("./public/userpics/"+oldUser.project_id+"/"+oldUser._id);
            fileSystem.rename(tempPath, targetPath, function(err) {
              if (err){
                console.log(targetPath+" is not found");
                throw err;
              } 
              else
                res.send("ok");
            });
          }else{
            res.send("ok");
          }
        });
      }else{
        res.send("already registered");
      }});
  };

};
exports.userpic = function(req,res){

}
/*
 * COMPLETE tasks
 */
 exports.task = function(mongodb,db){
  return function(req, res){
    //TODO check the values

    var userId = req.session.user._id;
    var taskId = req.params.id;
    userId = mongodb.ObjectID.createFromHexString(userId);
    taskId = mongodb.ObjectID.createFromHexString(taskId);
    var completion = req.body.isCompleted;
    //completion = completion === "on";
    completion = true;
    console.log(completion);
    db.collection('user').update({_id: userId, tasks:{ $elemMatch:{_id: taskId}}}, 
      {$set:{"tasks.$.isCompleted":completion}},
      function(err){
        req.session.user.tasks.forEach(function(entry){
          if(entry._id === req.params.id)
            entry.isCompleted = true;
        });
        res.send( err === null ? "ok" : err);
      });
  };
};
exports.currentTask = function(mongodb,db){
  return function(req,res){
    id = mongodb.ObjectID.createFromHexString(req.session.user._id);
 //   db.collection('user').update({_id:id},{$set:{currentTask:req.body.taskTitle}});
}
}