const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/account", isLoggeIn, (req, res) => {
    res.render("account");
});

function isLoggeIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = router;