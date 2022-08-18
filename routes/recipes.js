const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

router.get("/", (req,res) => {
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

router.post("/", (req, res) => {
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

router.get("/new", (req, res) => {
    res.render("recipes_new");
})

router.get("/:id", (req, res) => {
    Recipe.findById(req.params.id)
    .exec()
    .then((recipe) => {
        // res.render("recipes_show", {recipe});
        Comment.find({recipeId: req.params.id}, (err, comments) => {
            if (err) {
                res.send(err);
            } else {
                res.render("recipes_show", {recipe, comments})
            }
        })
    })
    .catch((err) => {
        res.send(err);
    })
})

module.exports = router;