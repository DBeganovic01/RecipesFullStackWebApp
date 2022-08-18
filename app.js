const hostname = '127.0.0.1';
const port = 3000;

// NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Config Imports
const config = require('./config');

// Route Imports
const recipeRoutes = require('./routes/recipes');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/main');

// Model Imports
const Recipe = require('./models/recipe');
const Comment = require('./models/comment');

// Connect to Database
mongoose.connect(config.db.connection);

// Config
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/pantry", (req,res) => {
    res.render("pantry");
})

// Use Routes
app.use("/", mainRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});