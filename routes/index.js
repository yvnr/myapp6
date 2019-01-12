var express = require('express');
var router = express.Router();
var User = require('./../models/user');
var Query = require('./../models/query');
var Suggestion = require('./../models/suggestion');
var Path = require('path');
var multer = require('multer');
var passport = require('passport');
var bcrypt = require('bcrypt');

//for images
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + Path.extname(file.originalname) /*'.jpg'*/ );
  }
});

var upload = multer({
  storage: storage
});


/* GET home page. */
router.route('/')
  .get(function (req, res) {
    res.render('index', {

    })
  })
  //add authentication for different users
  .post(passport.authenticate('local', {
    failureRedirect: '/'
  }), function (req, res) {
    res.redirect('/home');
  });

//for adding new users
router.route('/signUp')
  .get(function (req, res) {
    res.render('signUp', {});
  })
  .post(function (req, res, next) {
    // read post data
    var mobileNo = req.body.mobileNo;
    var pincode = req.body.pincode;
    var password = req.body.password;

    let hash = bcrypt.hashSync(password, 12);

    var user = new User({
      mobileNo: mobileNo,
      pincode: pincode,
      password: hash
    });

    // check if user already exists
    User.findUserByMobileNo(mobileNo)
      .then(doc => {
        if (doc.length !== 0) {
          console.log('hello');
          res.redirect('/signUp');
        } else {
          User.createUser(user, function (err, user) {
            if (err)
              throw err;
            else
              console.log('User created in DB: ', user);
            next(null, user);
          });
        }
      })
      .catch(err => {
        next(err);
      })
  }, passport.authenticate('local', {
    failureRedirect: '/'
  }), (req, res, next) => {
    res.redirect('/home');
  });

//protected route
router.route('/home')
  .get(ensureAuthenticated, function (req, res) {
    res.render('home', {

    });
  })
  .post(ensureAuthenticated, upload.any(), function (req, res) {
    //console.log(req.user);
    var mobileNo = req.user.mobileNo;
    var filePath = [];
    for (var index in req.files) {
      filePath.push(req.files[index].path);
    }
    var pincode = req.user.pincode;
    var question = req.body.query;
    var answerNumber = 0;
    var query = new Query({
      mobileNo: mobileNo,
      filePath: filePath,
      pincode: pincode,
      question: question,
      answerNumber: answerNumber
    });
    Query.create(query, (err, query) => {
      if (err)
        throw err;
      else
        console.log(query);
    });
    res.render('home', {
      message: 'Successful submission'
    });
  });

//mobileNo in cookies
router.route('/queriesPrivate')
  .get(ensureAuthenticated, function (req, res) {
    Query.getPrivateQuery(req.user.mobileNo)
      .then(function (queryArray) {
        res.render('queriesPrivate', {
          queryArray: queryArray
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  });

//pincode in cookiess
router.route('/queriesPublic')
  .get(ensureAuthenticated, function (req, res) {
    Query.getPublicQuery(req.user.pincode)
      .then(function (queryArray) {
        //console.log(queryArray);
        res.render('queriesPublic', {
          queryArray: queryArray
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  });

//  
router.route('/answer')
  //to get answer form
  .get(ensureAuthenticated, function (req, res) {
    res.render('answer', {
      reference: req.query.id
    })
  })
  //to post answer form 
  .post(ensureAuthenticated, upload.any(), function (req, res) {
    //console.log(req.query.id);
    var mobileNo = req.user.mobileNo;
    var filePath = [];
    for (var index in req.files) {
      filePath.push(req.files[index].path);
    }
    var answer = req.body.answer;
    var referenceIdQuery = req.query.id;

    var suggestion = new Suggestion({
      referenceIdQuery: referenceIdQuery,
      referenceIdUser: mobileNo,
      filePath: filePath,
      answer: answer
    });

    Suggestion.create(suggestion, function (err, suggestion) {
      if (err)
        throw err;
      else
        console.log(suggestion);
    });
    Query.updateNumberOfAnswers(req.query.id)
      .then((doc) => {
        console.log(doc[0].answerNumber);
        var x = doc[0].answerNumber + 1;
        Query.updateOne({
          _id: req.query.id
        }, {
          answerNumber: x
        }, function (err, res) {
          res.redirect('/home');
        })
      })
      .catch(function (err) {
        throw err;
      });
  });

router.route('/queryAnswers')
  .get(function (req, res) {
    console.log(req.query.id);
    Suggestion.findAnswers(req.query.id)
      .then(function (answerArray) {
        //console.log(answerArray);
        res.render('queryAnswers', {
          particularQueryAnswers: answerArray
        })
      })
      .catch(function (err) {
        throw err;
      });
  });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;