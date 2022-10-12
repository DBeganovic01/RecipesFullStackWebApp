const Recipe = require('../models/recipe');

const checkRecipeOwner = async (req, res, next) => {
    if (req.isAuthenticated()) { // Check if user is logged in
        const recipe = await Recipe.findById(req.params.id).exec(); // Get the recipe from the DB
        if (recipe.owner.id.equals(req.user._id)) { // Check if user owns the recipe
            next(); // Continue to next page
        } else { 
            req.flash("error", "You don't have permission to do that");
            res.redirect("back"); // Go back to previous page
        }
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/login"); // If not logged in, redirect to /login
    }
}

module.exports = checkRecipeOwner;