const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    mealType: String,
    recipeName: String,
    description: String,
    image: String,
    ingredients: [String],
    instructions: [String],
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

recipeSchema.index({
    '$**': 'text'
});

const Recipe = mongoose.model("recipe", recipeSchema);

module.exports = Recipe;