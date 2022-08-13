const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    mealType: String,
    recipeName: String,
    description: String,
    image: String,
    ingredients: [String],
    instructions: [String]
});

const Recipe = mongoose.model("recipe", recipeSchema);

module.exports = Recipe;