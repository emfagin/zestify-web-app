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

// Configure/set-up controllers
const generalController = require("./controllers/generalController");
const mealkitController = require("./controllers/mealkitController");
const accountController = require("./controllers/accountController");

// Load controllers into express
app.use('/', generalController);
app.use('/on-the-menu', mealkitController);
app.use('/account', accountController);

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

app.listen(HTTP_PORT, onHttpStart);