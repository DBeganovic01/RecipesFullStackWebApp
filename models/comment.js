const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String,
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;