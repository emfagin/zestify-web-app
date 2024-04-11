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
const mealkitUtil = require("../modules/mealkit-util");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const {mealkitModel} = require("../models/mealkitModel");
const { authenticateUser, displayError } = require("../modules/authentication");
const { isInvalidText, isInvalidEmail, isInvalidPassword } = require("../modules/validation");

// Home get route
router.get("/", (req, res) => {
  authenticateUser(req, res, "Home", false, true).then((isAllowed) => {
    if (isAllowed) {
      mealkitModel.find({})
      .then((db_mealkits) => {
          res.render("general/home", {
            featuredMealkits: mealkitUtil.getFeaturedMealKits(
              db_mealkits
            ),
            title: "Home",
          });
      })
    }
  })
});

// Signup get route
router.get("/sign-up", (req, res) => {
  res.render("general/sign-up", {
    title: "Sign Up",
    values: { firstName: "", lastName: "", email: "" },
    errors: {},
  });
});

// Signup post route -> process form info
router.post("/sign-up", (req, res) => {
  const { firstName, lastName, email: rawEmail, password } = req.body;
  const email = rawEmail.toLowerCase();
  let errors = {};

  errors.firstName = isInvalidText(firstName, "firstName");
  errors.lastName = isInvalidText(lastName, "lastName");
  errors.email = isInvalidEmail(email.toLowerCase());
  errors.password = isInvalidPassword(password);

  if (Object.values(errors).every((field) => field === "")) {
    // Ensure user doesn't exist, with email
    userModel
      .findOne({ email })
      .then((user) => {
        // Completed the search successfully.
        if (!user) {
          // Didn't find the user document

          const newUser = new userModel({
            firstName,
            lastName,
            email,
            password,
          }); // Create new user

          newUser
            .save() // save user
            .then((userSaved) => {
              console.log(
                `User ${userSaved.firstName} has been added to the database.`
              );

              // Send email to user
              sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

              const msg = {
                to: email,
                from: "emilyfagin200@gmail.com",
                subject: "Welcome to Zestify!",
                html: `<h2 style="color:blue;">Hi ${firstName} ${lastName}!</h2><h3>Welcome to Zestify - my WEB322 Assignment.</h3>From me - Emily Fagin`,
              };

              sgMail
                .send(msg)
                .then(() => {
                  // valid, redirect to home.
                  res.redirect("/");
                })
                .catch((err) => {
                  console.log(err);
                  errors.err = "Email could not be sent, try again.";
                  res.render("general/sign-up", {
                    title: "sign-up",
                    values: req.body,
                    errors: errors,
                  });
                });
            })
            .catch((err) => {
              console.log(`Error adding user to the database ... ${err}`);
              res.render("general/sign-up");
            });
        } else {
          // User already exists
          errors.err = "User already exists!";
          res.render("general/sign-up", {
            title: "sign-up",
            values: req.body,
            errors: errors,
          });
        }
      })
      .catch((err) => {
        // Couldn't query the database.
        errors.err = "Couldn't get the document. " + err;
        res.render("general/sign-up", {
          title: "sign-up",
          values: {},
          errors: errors,
        });
      });
  } else {
    res.render("general/sign-up", {
      title: "sign-up",
      values: req.body,
      errors: errors,
    });
  }
});

// Login get route
router.get("/log-in", (req, res) => {
  res.render("general/log-in", {
    title: "Log In",
    values: { email: "" },
    errors: {},
  });
});

// Login post route -> process form info
router.post("/log-in", (req, res) => {
  const { email: rawEmail, password, userType } = req.body;
  const email = rawEmail.toLowerCase();
  let errors = {};

  errors.email = isInvalidEmail(email);
  errors.password = isInvalidPassword(password);

  if (Object.values(errors).every((field) => field === "")) {
    userModel
      .findOne({ email }) // find if email exists
      .then((user) => {
        // Completed the search successfully.
        if (user) {
          // User with email exists
          bcryptjs
            .compare(password, user.password) // Compare the password submitted with the document.
            .then((matched) => {
              // Done comparing the passwords.
              if (matched) {
                // Password matches.
                req.session.user = { ...user.toObject(), isClerk: !!(userType === "clerk")}; // Create a new session.
                if (!req.session.user.isClerk) {
                  res.redirect("/cart");
                } else {
                  res.redirect("/mealkits/list");
                }
              } else {
                // Password didn't match.
                errors.err = "Password doesn't match the database";
                res.render("general/log-in", {
                  title: "Log In",
                  values: req.body,
                  errors: errors,
                });
              }
            })
            .catch((err) => {
              // Couldn't compare the password
              errors.err = "Couldn't compare the password. " + err;
              res.render("general/log-in", {
                title: "Log In",
                values: req.body,
                errors: errors,
              });
            });
        } else {
          // Couldn't find the user document.
          errors.err = "Couldn't find the user";
          console.log(errors[0]);
          res.render("general/log-in", {
            title: "Log In",
            values: req.body,
            errors: errors,
          });
        }
      })
      .catch((err) => {
        // Couldn't query the database.
        errors.err = "Couldn't get the document. " + err;
        res.render("general/log-in", {
          title: "Log In",
          values: req.body,
          errors: errors,
        });
      });
  } else {
    res.render("general/log-in", {
      title: "Log In",
      values: req.body,
      errors: errors,
    });
  }
});

// Cart get route
router.get("/cart", (req, res) => {
  // ensure customer, returns true if allowed
  authenticateUser(req, res, "Cart", false, false).then((isAllowed) => {
    if (isAllowed) { 
      res.render("general/cart", {
        title: "Cart",
      });
    }
  }) 
});

// Logout route, destroys session.
router.get("/log-out", (req, res) => {
  req.session.destroy(); // Clear the session.
  res.redirect("/log-in"); // direct back to homepage.
});

module.exports = router; // export router
