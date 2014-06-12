'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');

  //app.all('*', dbg, users.lookup);

  app.get('/', dbg, home.index);
  app.get('/register', dbg, users.register);
  app.post('/register', dbg, users.validate);
  app.get('/verify/:id', dbg, users.firstLogin);
  app.post('/users/:id/firstlogin', dbg, users.update);

  app.all('*', users.bounce);
  // app.get('/login', dbg, users.login);
  // app.post('/login', dbg, users.authenticate);
  console.log('Routes Loaded');
  fn();
}
