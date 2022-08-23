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
const morgan = require('morgan');

// Config Imports
const config = require('./config');

// Route Imports
const recipeRoutes = require('./routes/recipes');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/main');

// Model Imports
const Recipe = require('./models/recipe');
const Comment = require('./models/comment');

// =====================================
// DEVELOPMENT
// =====================================
// Morgan
app.use(morgan('tiny'));

// =====================================
// CONFIG
// =====================================
// Connect to Database
mongoose.connect(config.db.connection);

// Seed the database
const seed = require('./utils/seed');
seed();

// Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Method Override Config
app.use(methodOverride('_method'));

// Routes Config
app.use("/", mainRoutes);
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