'use strict';

const session       = require('express-session');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt        = require('bcrypt');
const User          = require('./models/user');

// config dotenv
require('dotenv').config();

module.exports = (app) => {
    console.log(process.env.SESSION_SECRET);
    // set a session
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    }));

    // set passport
    app.use(passport.initialize());
    app.use(passport.session());

    // serialize the user object w.r.t mongodb _id of user object
    passport.serializeUser((user, done) => {
        done(null, user.mobileNo);
      });
  
      // deserailize the user and get the user document based on its name
      passport.deserializeUser((mobileNo, done) => {
        User.findUserByMobileNo(mobileNo)
          .then(doc => {
            const user = doc[0];
            done(null, user);
          })
          .catch(err => {
              console.log(err);
              done(null, false);
          });
      });

      // local strategy to login
      passport.use(new LocalStrategy({
            usernameField: 'mobileNo',
            passwordField: 'password',
        },
        function(username, password, done) {
            console.log('username', username, 'password: ', password);
            User.findUserByMobileNo(username)
                .then(user => {
                    console.log('User ' + user + ' attempted to login');
                    if (!user) {
                        return done(null, false);
                    }
                    console.log( 'pass', password, 'hash_new', bcrypt.hashSync(password, 12), 'hash_old' , user[0].password);
                    bcrypt.compare(password, user[0].password)
                        .then(res => {
                            if (res) {
                                return done(null, user[0]);
                            }
                            return done(null, false);
                        });
                    
                })
                .catch(err => {
                    return done(err);
                });
        })
      );
}