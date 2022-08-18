const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const Recipe = require('./models/recipe');
const Comment = require('./models/comment');

const mongoose = require('mongoose');
mongoose.connect(config.db.connection);

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// const recipes = [
//     {
//         recipeName: "Baked Potato",
//         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//         image: "https://www.simplyrecipes.com/thmb/GZwoVSMKQ2tiBKner6bDmCXJPi0=/1600x1067/filters:fill(auto,1)/Twice-Baked-Potatoes-LEAD-1v2-f7918849ddd245c5aecf0ec58fb2b47e.jpg"
//     },
//     {
//         recipeName: "Crepes",
//         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//         image: "https://handletheheat.com/wp-content/uploads/2014/02/How-to-Make-Crepes-SQUARE.jpg"
//     },
//     {
//         recipeName: "Baked Salmon",
//         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//         image: "https://www.acouplecooks.com/wp-content/uploads/2020/01/Broiled-Salmon-006-368x368.jpg"
//     }
// ]

app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/recipes", (req,res) => {
    Recipe.find()
    .exec()
    .then((foundRecipes) => {
        res.render("recipes", {recipes: foundRecipes});
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
});

app.post("/recipes", (req, res) => {
    console.log(req.body);
    const newRecipe = {
        mealType: req.body.mealType,
        recipeName: req.body.recipeName,
        description: req.body.description,
        image: req.body.image,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    }
    Recipe.create(newRecipe)
    .then((recipe) => {
        console.log(recipe);
        res.redirect("/recipes");
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/recipes");
    });
})

app.get("/recipes/new", (req, res) => {
    res.render("recipes_new");
})

app.get("/recipes/:id", (req, res) => {
    Recipe.findById(req.params.id)
    .exec()
    .then((recipe) => {
        res.render("recipes_show", {recipe});
    })
    .catch((err) => {
        res.send(err);
    })
})

// New Comment - Show Form
app.get("/recipes/:id/comments/new", (req, res) => {
    res.render("comments_new", {recipeId: req.params.id})
})

// Create Comment - Actually Update the DB
app.post("/recipes/:id/comments", (req, res) => {
    Comment.create({
        user: req.body.user,
        text: req.body.text,
        recipeId: req.body.recipeId
    })
    .then((newComment) => {
        console.log(newComment);
        res.redirect(`/recipes/${req.body.recipeId}`);
    })
    .catch((err) => {
        console.log(err);
        res.redirect(`/recipes/${req.body.recipeId}`);
    })
})


app.get("/pantry", (req,res) => {
    res.render("pantry");
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});