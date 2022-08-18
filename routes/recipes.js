const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

// Index
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

// Create
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
        res.redirect("/recipes/" + recipe._id);
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/recipes/" + recipe._id);
    });
})

// New
router.get("/new", (req, res) => {
    res.render("recipes_new");
})

// Show
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

// Edit
router.get("/:id/edit", (req, res) => {
    // Get the recipe from the DB
    Recipe.findById(req.params.id)
    .exec()
    .then((recipe) => {
        // Render the edit form, passing in the recipe
        res.render("recipes_edit", {recipe})
    })
})

// Update
router.put("/:id/", (req, res) => {
    const recipe = {
        mealType: req.body.mealType,
        recipeName: req.body.recipeName,
        description: req.body.description,
        image: req.body.image,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    }
    Recipe.findByIdAndUpdate(req.params.id, recipe, {new: true})
    .exec()
    .then((updatedRecipe) => {
        console.log(updatedRecipe)
        res.redirect(`/recipes/${req.params.id}`)
    })
    .catch((err) => {
        res.send("Error: ", err);
    })
})

// Delete
router.delete("/:id", (req, res) => {
    Recipe.findByIdAndDelete(req.params.id)
    .exec()
    .then((deletedRecipe) => {
        console.log("Deleted: ", deletedRecipe);
        res.redirect("/recipes");
    })
    .catch((err) => {
        res.send("Error deleting: ", err);
    })
})

module.exports = router;