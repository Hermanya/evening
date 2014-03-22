/*
 * DELETE posts.
 */

exports.post = function(db) {
  return function(req, res) {
    var post_id = req.params.id;
    db.collection('post').
    removeById(post_id, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};
/*
 * DELETE posts.
 */

exports.task = function(mongodb,db) {
  return function(req, res) {
 /*   var post_id = req.params.id;
    db.collection('post').
    removeById(post_id, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });*/
  }
};