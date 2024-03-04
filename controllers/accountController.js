const express = require("express");
const router = express.Router();
const validation = require("../modules/validation");
const sgMail = require("@sendgrid/mail");

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

    validationMessages.firstName = validation.isInvalidText(firstName, "firstName");
    validationMessages.lastName = validation.isInvalidText(lastName, "lastName");
    validationMessages.email = validation.isInvalidEmail(email);
    validationMessages.password = validation.isInvalidPassword(password);

    if (Object.values(validationMessages).every(field => field === "")){
        
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        
        const msg = {
            to: email,
            from: "efagin@myseneca.ca",
            subject: "Welcome to Zestify!",
            html: `Hi there ${firstName} ${lastName}, welcome to Zestify, from me`
        };

        console.log(msg);

        sgMail.send(msg)
            .then(() => {
                res.render("account/welcome", 
                {title: "Welcome",
                user: {firstName: firstName,
                    lastName: lastName}}); 
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