var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Tool  = require("./models/tool"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
// configure dotenv
require('dotenv').config();

// setup vars
const PORT = process.env.PORT || 3000;
const PASSCODE = process.env.PASSCODE || "Once again Rusty wins cutest dog!";
const DB_USER = process.env.DB_USER   || "admin";
const DB_PASS = process.env.DB_PASS   || "admin";
const DB_HOST = process.env.DB_HOST;
const DB = process.env.DB;


//requiring routes
var commentRoutes    = require("./routes/comments"),
    toolRoutes = require("./routes/tools"),
    indexRoutes      = require("./routes/index")
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = "mongodb://" + DB_USER + ':' + DB_PASS + "@" + DB_HOST + "/" + DB
console.log(databaseUri)

mongoose.connect(databaseUri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => console.log(`Database connected`))
      .catch(err => {
          console.log(`Database connection error: ${err.message}`);
          process.exit(1);
      });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: PASSCODE,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/tools", toolRoutes);
app.use("/tools/:id/comments", commentRoutes);

app.listen(PORT, function(){
   console.log("The DevopsTools Server has started on port: " + PORT);
   
});