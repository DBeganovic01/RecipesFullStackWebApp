const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

const recipe_seeds = [
    {
        mealType: "Breakfast",
        recipeName: "Crepes",
        description: "Yummy breakfast",
        image: "https://handletheheat.com/wp-content/uploads/2014/02/How-to-Make-Crepes-SQUARE.jpg",
        ingredients: ["Crepes ingredients"],
        instructions: ["Crepes instructions"]
        
    },
    {
        mealType: "Lunch",
        recipeName: "Baked Salmon",
        description: "A healthy lunch option",
        image: "https://www.acouplecooks.com/wp-content/uploads/2020/01/Broiled-Salmon-006-368x368.jpg",
        ingredients: ["Baked Salmon ingredients"],
        instructions: ["Baked Salmon instructions"]
    },
    {
        mealType: "Dinner",
        recipeName: "Baked Potato",
        description: "A hearty dinner",
        image: "https://www.simplyrecipes.com/thmb/GZwoVSMKQ2tiBKner6bDmCXJPi0=/1600x1067/filters:fill(auto,1)/Twice-Baked-Potatoes-LEAD-1v2-f7918849ddd245c5aecf0ec58fb2b47e.jpg",
        ingredients: ["Baked Potato ingredients"],
        instructions: ["Baked Potato instructions"]
    }
]

const seed = async () => {
    console.log("Seed DB");
    // Delete all the current recipes and comments
    await Recipe.deleteMany();
    console.log("Deleted all of the recipes");
    await Comment.deleteMany();
    console.log("Deleted all of the comments");
    // Create three new recipes
    // for (const recipe_seed of recipe_seeds) {
    //     let recipe = await Recipe.create(recipe_seed);
    //     console.log("Created a new recipe: ", recipe.recipeName)
    //     // Create a new comment for each recipe
    //     await Comment.create({
    //         text: "One of my favorite meals!",
    //         user: "Bob",
    //         recipeId: recipe._id
    //     })
    //     console.log("Created a new comment for ", recipe.recipeName);
    // }
}

module.exports = seed;