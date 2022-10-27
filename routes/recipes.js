const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkRecipeOwner = require('../utils/checkRecipeOwner');

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
router.post("/", isLoggedIn, async (req, res) => {
    console.log(req.body);
    const newRecipe = {
        mealType: req.body.mealType.toLocaleLowerCase(),
        recipeName: req.body.recipeName,
        description: req.body.description,
        image: req.body.image,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        owner: {
            id: req.user._id,
            username: req.user.username
        },
        upvotes: [req.user.username], //Automatically upvote own recipe
        downvotes: []
    }
    try {
        const recipe = await Recipe.create(newRecipe);
        req.flash("success", "Recipe created!");
        console.log(recipe);
        res.redirect("/recipes/" + recipe._id);
    } catch (err) {
        req.flash("error", "Error creating recipe");
        console.log(err);
        res.redirect("/recipes/new");
    }
})

// New
router.get("/new", isLoggedIn, (req, res) => {
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

// Meal Type/Category
router.get("/meal/:meal", async (req, res) => {
    const validMealType = ["breakfast", "lunch", "dinner", "dessert", "snack"];
    if (validMealType.includes(req.params.meal.toLocaleLowerCase())){
        const recipes = await Recipe.find({mealType: req.params.meal}).exec();
        res.render("recipes", {recipes});
    } else {
        res.send("Please enter a valid meal type");
    }
})

// Vote
router.post("/vote", isLoggedIn, async (req, res) => {
    console.log("Request body:", req.body);
    const recipe = await Recipe.findById(req.body.recipeId);
    const alreadyUpvoted = recipe.upvotes.indexOf(req.user.username); // returns -1 if not found
    const alreadyDownvoted = recipe.downvotes.indexOf(req.user.username); // returns -1 if not found

    let response = {};
    // Voting logic
    if (alreadyUpvoted === -1 && alreadyDownvoted === -1) { // Has not voted yet
        if (req.body.voteType === "up") { // Upvoting
            recipe.upvotes.push(req.user.username);
            recipe.save();
            response.message = "Upvote tallied!";
        } else if (req.body.voteType === "down"){ // Downvoting
            recipe.downvotes.push(req.user.username);
            recipe.save();
            response.message = "Downvote tallied!";
        } else { // Error
            response.message = "Error voting (1)";
        }
    } else if (alreadyUpvoted >= 0) { // Already upvoted
        if (req.body.voteType === "up") {
            recipe.upvotes.splice(alreadyUpvoted, 1);
            recipe.save();
            response.message = "Upvote removed";
        } else if (req.body.voteType === "down"){
            recipe.upvotes.splice(alreadyUpvoted, 1);
            recipe.downvotes.push(req.user.username);
            recipe.save();
            response.message = "Changed upvote to downvote";
        } else { // Error
            response.message = "Error voting (2)";
        }
    } else if (alreadyDownvoted >= 0) { // Already downvoted
        if (req.body.voteType === "up") {
            recipe.downvotes.splice(alreadyDownvoted, 1);
            recipe.upvotes.push(req.user.username);
            recipe.save();
            response.message = "Changed downvote to upvote";
        } else if (req.body.voteType === "down"){
            recipe.downvotes.splice(alreadyDownvoted, 1);
            recipe.save();
            response.message = "Downvote removed";
        } else { // Error
            response.message = "Error voting (3)";
        }
    } else { // Error
        response.message = "Error voting (4)";
    }
    console.log(recipe);
    res.json(response);
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
router.get("/:id/edit", checkRecipeOwner, async (req, res) => {
    if (req.isAuthenticated()) { // Check if user is logged in
        const recipe = await Recipe.findById(req.params.id).exec(); // Get the recipe from the DB
            try {
                res.render("recipes_edit", {recipe}); // Render the edit form, passing in the recipe
            } catch (err) {
                console.log(err);
                res.send("ERROR /recipes/:id/edit");
            }
        } else { // If not, redirect back to show page
            res.redirect(`/recipes/${recipe._id}`);
        }
})

// Update
router.put("/:id/", checkRecipeOwner, async (req, res) => {
    const recipe = {
        mealType: req.body.mealType.toLocaleLowerCase(),
        recipeName: req.body.recipeName,
        description: req.body.description,
        image: req.body.image,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    }
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, recipe, {new: true}).exec();
        req.flash("success", "Recipe updated!");
        res.redirect(`/recipes/${req.params.id}`)
    } catch (err) {
        console.log(err);
        req.flash("error", "Error updating recipe");
        res.redirect(`/recipes/${recipe._id}`);
    }
})

// Delete
router.delete("/:id", checkRecipeOwner, async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id).exec();
        console.log("Deleted: ", deletedRecipe);
        req.flash("success", "Recipe deleted!");
        res.redirect("/recipes");
    } catch (err) {
        console.log(err);
        req.flash("error", "Error deleting recipe");
        res.redirect(`/recipes/${recipe._id}`);
    }
})

module.exports = router;