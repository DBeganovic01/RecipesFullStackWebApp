const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');

// New Comment - Show Form
router.get("/new", (req, res) => {
    res.render("comments_new", {recipeId: req.params.id})
})

// Create Comment - Actually Update the DB
router.post("/", (req, res) => {
    Comment.create({
        user: req.body.user,
        text: req.body.text,
        recipeId: req.body.recipeId
    })
    .then((newComment) => {
        console.log(newComment);
        res.redirect(`/recipes/${req.body.recipeId}`);
    })
    .catch((err) => {
        console.log(err);
        res.redirect(`/recipes/${req.body.recipeId}`);
    })
})

module.exports = router;