var mongoose = require('mongoose'),
   User= mongoose.model('Users');

exports.create_a_user = function(req, res) {
   var new_user= new User(req.body);
   new_user.save(function(err, user){
         if (err)
            res.send(err);
        res.json(user);
   })
};

exports.list_all_users = function(req, res) {
User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.get_a_user = function(req, res) {
    //GET BY ID (i.e. the _id that gets created)--of coure want to call it ID in the routes
    //User.findByIdreq.params.UserName, function(err, user) 
    //Only pull out the 'status and over21 fields'
    //User.findOne({'name': req.params.UserName},'status over21' function(err, user) )

    User.findOne({'name': req.params.UserName}, function(err, user) {
    if (err)
      res.send(err);
    else if (user === null){
        res.statusCode='201'
        res.json({message:'Requested User Not Found in DB'});
    } 
    else {
      res.json(user);
    }
  })
};

exports.delete_a_user = function(req, res) {
    User.remove({'name': req.params.UserName}, function(err, user) {
    if (err)
      res.send(err);
    res.json({message:  'User successfully deleted'});
  });
};

exports.delete_all_users = function(req, res) {
    User.remove({ }, function(err, user) {
    if (err)
      res.send(err);
    res.json({message:  'ALL Users successfully deleted--hope you meant to do that!'});
  });
};
