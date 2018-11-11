var express = require('express');
var app     = express();
var router  = express.Router();
var request = require('request');
var User    = require('../models/user'); // get our mongoose model
var passport = require('passport');

/**
 * Display Signup form
 * GET method
 */
router.get('/register', function(req, res){
  res.render('register', { 
    title: "Signup",
    register_is_active: true, // Active corresponding item in menu
    message: req.flash('signupMessage')
  });
});

/**
 * Register a new user.
 * POST request
 */
router.post('/register', passport.authenticate('local-signup', {
  successRedirect : '/', // redirect to the index page
  failureRedirect : '/user/register', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages
}));

/**
 * Display login form
 * GET method
 */
router.get('/login', function(req, res){
  res.render('login', { 
    title: "Login",
    login_is_active: true, // Active corresponding item in menu
    message: req.flash('loginMessage')
  });
});

/**
 * Authenticate an user with local-signup strategy
 * POST method
 */
router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/', // redirect to the secure profile section
  failureRedirect : '/user/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

/* GET logout current authenticated user */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


/**
 * Update user pokedex.
 * POST AJAX request
 */
router.post('/updatePokedex', function(req, res, next) {

  if(!req.user) {
    res.json({ 
      success: false,
      message: "You're not authenticated. Please login."
    });
  } else {
    // Update user's pokedex and save it
    req.user.pokemons = req.body.pokemons;
    req.user.shinies = req.body.shinies;
    console.log(req.user);
    req.user.save(function(err) {
      if (err) { throw err; }

      res.json({ 
        success: true,
      });
    });
  }
});



module.exports = router;