var userCollection = global.nss.db.collection('users');
var request = require('request');
var Mongo = require('mongodb');
var _ = require('lodash');
var bcrypt = require('bcrypt');

class User{

  savePassword(password, fn){
    this.password = bcrypt.hashSync(password, 8);
    this.isValid = true;
    fn();
  }

  save(fn){
    userCollection.save(this, ()=>fn());
  }

  static create(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        fn(null);
      }else{
        var user = new User();
        user.email = obj.email;
        user.password = '';
        user.isValid = false;
        userCollection.save(user, ()=>{
          sendVerificationEmail(user, fn);
        });
      }
    });
  }

  static findById(id, fn){
    id = Mongo.ObjectID(id);
    userCollection.findOne({_id:id}, (e,user)=>{
      user = _.create(User.prototype, user);
      fn(user);
    });
  }
  //
  // static findById(id, fn){
  //   id = Mongo.ObjectID(id);
  //   userCollection.findOne({_id:id}, (e,u)=>{
  //     u.isValid = true;
  //     fn(u);
  //   });
  // }

}

function sendVerificationEmail(user, fn){
  'use strict';
  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandbox6491d429aa2d465f8236b97ac938208b.mailgun.org/messages';
  var post = request.post(url, function(err, response, body){
    console.log('SENDING MESSAGE============');
    console.log(body);
    fn(user);
  });

  var form = post.form();
  form.append('from', 'admin@arena.com');
  form.append('to', user.email);
  form.append('subject', 'Please verify your email address on ARENA');
  form.append('html', `<a href="http://localhost:3001/verify/${user._id}">Click to Verify</a>`);
}

module.exports = User;
