/*************************************************************************************
* WEB322 - 2241 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Emily Fagin
* Student ID    : efagin (139498224)
* Course/Section: WEB322/NEE
*
**************************************************************************************/
const express = require("express");
const router = express.Router();
const validation = require("../modules/validation");
const sgMail = require("@sendgrid/mail");

router.get("/welcome", (req, res) => {
    res.render("account/welcome", 
        {title: "Welcome",
        name: req.query.name });
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

    validationMessages.firstName = validation.isInvalidText(firstName, "firstName");
    validationMessages.lastName = validation.isInvalidText(lastName, "lastName");
    validationMessages.email = validation.isInvalidEmail(email);
    validationMessages.password = validation.isInvalidPassword(password);

    if (Object.values(validationMessages).every(field => field === "")){
        
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        
        const msg = {
            to: email,
            from: "emilyfagin200@gmail.com",
            subject: "Welcome to Zestify!",
            html: `<h2 style="color:blue;">Hi ${firstName} ${lastName}!</h2><h3>Welcome to Zestify - my WEB322 Assignment.</h3>From me - Emily Fagin`
        };

        sgMail.send(msg)
            .then(() => {
                const queryString = "?name=" + firstName;
                console.log(queryString);
                res.redirect("/welcome" + queryString); 
            })
            .catch(err => {
                console.log(err);
                validationMessages.sendEmail = "Email could not be sent, try again."
                res.render("account/sign-up", 
                {title: "sign-up",
                 values: req.body,
                 "validationMessages": validationMessages}); 
            });
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