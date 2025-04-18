const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Sign Up - New
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Sign Up - Create
router.post("/signup", async (req, res) => {
    try {
        const newUser = await User.register(
            new User({
                username: req.body.username,
                email: req.body.email
            }), req.body.password);
            req.flash("success", `Account created successfully for ${newUser.username}`);
            passport.authenticate("local")(req, res, () => {
                res.redirect("/recipes");
            });   
        } catch (err) {
            console.log(err);
            res.send("ERROR /signup POST");
    }
});

// Login - Show Form
router.get("/login", (req, res) => {
    res.render("login");
});

// Login 
router.post("/login", passport.authenticate("local", {
    successRedirect: "/recipes",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Logged in successfully"
}));

// Logout
router.get("/logout", function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success", "You have logged out");
      res.redirect("/recipes");
    });
});

module.exports = router;