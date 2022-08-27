const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

// Index
router.get("/", async (req, res) => {
    console.log(req.user); // Check to see if logged in
    try {
        const recipes = await Recipe.find().exec();
        res.render("recipes", {recipes});
    } catch (err) {
        console.log(err);
        res.send("ERROR /index");
    }
})

// Create
router.post("/", async (req, res) => {
    console.log(req.body);
    const newRecipe = {
        mealType: req.body.mealType,
        recipeName: req.body.recipeName,
        description: req.body.description,
        image: req.body.image,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    }
    try {
        const recipe = await Recipe.create(newRecipe);
        console.log(recipe);
        res.redirect("/recipes/" + recipe._id);
    } catch (err) {
        console.log(err);
        res.send("ERROR /recipes POST");
    }
})

// New
router.get("/new", (req, res) => {
    res.render("recipes_new");
})

// Search
router.get("/search", async (req, res) => {
    try {
        const recipes = await Recipe.find({
            $text: {
                $search: req.query.term
            }
        });
        res.render("recipes", {recipes});
    } catch (err) {
        console.log(err);
        res.send("ERROR /search");
    }
})

// Show
router.get("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).exec();
        const comments = await Comment.find({recipeId: req.params.id});
        res.render("recipes_show", {recipe, comments});
    } catch (err) {
        console.log(err);
        res.send("ERROR /recipes/:id");
    }
})

// Edit
router.get("/:id/edit", async (req, res) => {
    try {
        // Get the recipe from the DB
        const recipe = await Recipe.findById(req.params.id).exec();
        // Render the edit form, passing in the recipe
        res.render("recipes_edit", {recipe});
    } catch (err) {
        console.log(err);
        res.send("ERROR /recipes/:id/edit");
    }
})

// Update
router.put("/:id/", async (req, res) => {
    const recipe = {
        mealType: req.body.mealType,
        recipeName: req.body.recipeName,
        description: req.body.description,
        image: req.body.image,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    }
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, recipe, {new: true}).exec();
        res.redirect(`/recipes/${req.params.id}`)
    } catch (err) {
        console.log(err);
        res.send("ERROR /recipes/:id PUT");
    }
})

// Delete
router.delete("/:id", async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id).exec();
        console.log("Deleted: ", deletedRecipe);
        res.redirect("/recipes");
    } catch (err) {
        console.log(err);
        res.send("ERROR /recipes/:id DELETE");
    }
})

module.exports = router;