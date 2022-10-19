// Localhost connection
const hostname = '127.0.0.1';
const port = 3000;

// =====================================
// IMPORTS
// =====================================
// NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const flash = require('connect-flash');

// Config Imports
const config = require('./config');

// Route Imports
const recipeRoutes = require('./routes/recipes');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');

// Model Imports
const Recipe = require('./models/recipe');
const Comment = require('./models/comment');
const User = require('./models/user');

// =====================================
// DEVELOPMENT
// =====================================
// Morgan
//app.use(morgan('tiny'));

// =====================================
// CONFIG
// =====================================
// Connect to Database
mongoose.connect(config.db.connection, config.db.options);

// Seed the database
// const seed = require('./utils/seed');
// seed();

// Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.json({
    type: ["application/json", "text/plain"]
}));

// Express Session Config
app.use(expressSession({
    secret: "asdvnlk429aaflknb081ava8atjas3nza38gvlase",
    resave: false,
    saveUninitialized: false
}));

// Connect Flash
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session()); // Allows persistent sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session
passport.deserializeUser(User.deserializeUser()); // Get user data from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the Local Strategy

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Method Override Config
app.use(methodOverride('_method'));

// State Config
app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
})

// Routes Config
app.use("/", mainRoutes);
app.use("/", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

app.get("/pantry", (req,res) => {
    res.render("pantry");
})

// =====================================
// LISTEN
// =====================================
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});