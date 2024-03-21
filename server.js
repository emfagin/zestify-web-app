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
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session")
// Set up dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config/keys.env" })

// Set up express
const app = express();

// Set up public folder - make "/assets" public
app.use(express.static(path.join(__dirname, "/assets"))); // Make assets folder static (or public), accessible

// Set up EJS
app.set('view engine', 'ejs');
app.set("layout", "layouts/main"); // automatically searches /views
app.use(expressLayouts);

// Set up body-parser
app.use(express.urlencoded({extended : false}));

// Set up mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => {
    console.log("Connected to MongoDB.");
    app.listen(HTTP_PORT, onHttpStart); // start up express server
})
.catch(err => {
    console.log("Unable to connect to MongoDB: ", err);
})

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// Make req.session.user global - accessible anywhere in EJS
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
})

// Configure/set-up controllers
const generalController = require("./controllers/generalController");
const mealkitController = require("./controllers/mealkitController");

// Load controllers into express
app.use('/', generalController);
app.use('/mealkits', mealkitController);

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.use(function (err, req, res, next){
    console.error(err.stack);
    res.status(500).send("Something Broke!");
});

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
