var passport = require('passport');
var db = require('../config/database');

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {;
      return res.json(400, {message: "Bad User"});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send(user.username);
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.session.destroy();
  req.logout();
  res.send(200);
}

exports.register = function(req, res) {
 console.log("Bodyyyy"+req.toJson);
   var user = new db.userModel();
    
  user.username = req.body.username;
  user.password = req.body.password;

  user.save(function(err) {
    if (err) {
      console.log("MY Error" +err);
      return res.sendStatus(400);
    }

    return res.sendStatus(200);
  });
}