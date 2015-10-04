// Includes
var express         = require('express');
var app             = express();

var databaseConfig  = require('./config/database');
var session         = require('express-session');
var path            = require('path');
var morgan          = require('morgan');    // Logger
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var hbs             = require('hbs');

var mongoose    = require('mongoose');
var MongoStore  = require('connect-mongo')(session);
var passport    = require('passport');
var flash       = require('connect-flash');

// Database ========================================================
mongoose.connect(databaseConfig.mongoUrl);

// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + databaseConfig.mongoUrl);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

// Configuration ===================================================
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());    // read cookies (needed for auth)
app.use(require('less-middleware')(path.join(__dirname, 'public'), {
    compiler: {
        sourceMap: true
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Session  ========================================================
require('./config/passport')(passport);
app.use(session({
    secret: databaseConfig.secret,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        url: databaseConfig.mongoUrl
    })
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Use for storing user session and share it to the view
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// Routes ==========================================================
var indexRoutes     = require('./routes/index');
var sessionRoutes   = require('./routes/session');
var boxesRoutes     = require('./routes/boxes');
var pokemonRoutes   = require('./routes/pokemon');

app.use('/', indexRoutes);
app.use('/user', sessionRoutes);
app.use('/boxes', boxesRoutes);
app.use('/pokemon', pokemonRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Template engine ==================================================
hbs.registerPartials(__dirname + '/views/partials'); // Configure partials in template engine

hbs.registerHelper('times', function(n, block) { // Custom 'for' loop helper
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// Environnement ====================================================
if (app.get('env') === 'development') { // Dev env will print stacktrack
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) { // Prod env: no stacktraces leaked to user
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
