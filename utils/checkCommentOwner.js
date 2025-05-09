const Comment = require('../models/comment');

const checkCommentOwner = async (req, res, next) => {
    if (req.isAuthenticated()) { // Check if user is logged in
        const comment = await Comment.findById(req.params.commentId).exec(); // Get the comment from the DB
        if (comment.user.id.equals(req.user._id)) { // Check if user owns the comment
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

module.exports = checkCommentOwner;