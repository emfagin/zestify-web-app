const express = require("express");
const router = express.Router();

router.get("/welcome", (req, res) => {
    res.render("account/welcome", {title: "Welcome"});
})

router.get("/sign-up", (req, res) => {
    res.render("account/sign-up", {title: "Sign Up"});
});

router.get("/log-in", (req, res) => {
    res.render("account/log-in", {title: "Log In"});
});

module.exports = router; // export router