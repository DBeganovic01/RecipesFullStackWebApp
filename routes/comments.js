const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Recipe = require('../models/recipe');

// New Comment - Show Form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("comments_new", {recipeId: req.params.id})
})

// Create Comment - Actually Update the DB
router.post("/", isLoggedIn, async (req, res) => {
     try {
        const comment = await Comment.create({
            user: {
                id: req.user._id,
                username: req.user.username
            },
            text: req.body.text,
            recipeId: req.body.recipeId
         });
        console.log(comment);
        res.redirect(`/recipes/${req.body.recipeId}`);
     } catch (err) {
        console.log(err);
        res.send("ERROR /recipes/:id/comments/new POST");
     }
})

// Edit Comment - Show the edit form
router.get("/:commentId/edit", isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).exec();
        const comment = await Comment.findById(req.params.commentId).exec();
        console.log("recipe: ", recipe);
        console.log("comment: ", comment);
        res.render("comments_edit", {recipe, comment});
    } catch (err) {
        console.log(err);
        res.send("ERROR comments/:commentId/edit GET");
    }
})

// Update Comment - Actually Update the DB
router.put("/:commentId", isLoggedIn, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
        console.log(comment);
        res.redirect(`/recipes/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("ERROR comments/commentId/edit PUT");
    }
})

// Delete Comment
router.delete("/:commentId", isLoggedIn, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        console.log(comment);
        res.redirect(`/recipes/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("ERROR /comments/:commentId DELETE");
    }
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;