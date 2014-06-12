'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.register = (req, res)=>{
  res.render('users/register', {title: 'Arena Register Page'});
};

exports.validate = (req, res)=>{
  User.create(req.body, user=>{
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.firstLogin = (req, res)=>{
  User.findById(req.params.id, user=>{
    res.render('users/firstlogin', {user:user, title: 'User Login Page'});
  });
};

exports.update = (req, res)=>{
  User.findById(req.params.id, user=>{
    if(user){
      req.session.userId = user._id;
      user.savePassword(req.body.password, ()=>{
        user.save();
        res.redirect('/play');
      });
    }else{
      req.session.userId = null;
      res.redirect('/');
    }
  });
};



// exports.authenticate = (req, res)=>{
//   User.login(req.body, u=>{
//     if(u){
//       req.session.userId = u._id;
//       res.redirect('/play');
//     }else{
//       req.session.userId = null;
//       res.redirect('/login');
//     }
//   });
// };

// exports.lookup = (req, res, next)=>{
//   User.findByUserId(req.session.userId, u=>{
//     res.locals.user = u;
//     next();
//   });
// };
