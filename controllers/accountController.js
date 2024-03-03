const express = require("express");
const router = express.Router();
const validation = require("../modules/validation");


router.get("/welcome", (req, res) => {
    res.render("account/welcome", {title: "Welcome"});
})

router.get("/sign-up", (req, res) => {
    res.render("account/sign-up", 
        {title: "Sign Up",
        values: {firstName: "",
                lastName: "",
                email: ""},
        validationMessages: {} });
});

router.post("/sign-up", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    let validationMessages = {};
    let passedValidation = true;

    validationMessages.firstName = validation.isInvalidText(firstName, "firstName");
    validationMessages.lastName = validation.isInvalidText(lastName, "lastName");
    validationMessages.email = validation.isInvalidEmail(email);
    validationMessages.password = validation.isInvalidPassword(password);

    if (Object.values(validationMessages).every(field => field === "")){
        res.send("PASSED YAYY!");
    }
    else{
        res.render("account/sign-up", 
            {title: "sign-up",
             values: req.body,
             "validationMessages": validationMessages});
    }
});

router.get("/log-in", (req, res) => {
    res.render("account/log-in", 
        {title: "Log In",
        values: {email: ""},
        "validationMessages": {} });
});

router.post("/log-in", (req, res) => {
    const { email, password } = req.body;
    let validationMessages = {};
    let passedValidation = true;

    validationMessages.email = validation.isInvalidEmail(email);
    validationMessages.password = validation.isInvalidPassword(password);

    if (Object.values(validationMessages).every(field => field === "")){
        res.send("PASSED YAYY!");
    }
    else{
        res.render("account/log-in", 
            {title: "Log In",
             values: req.body,
             "validationMessages": validationMessages});
    }
});

module.exports = router; // export router