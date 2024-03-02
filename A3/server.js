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

const app = express();
const mealkitUtil = require("./modules/mealkit-util");

app.use(express.static(path.join(__dirname, "/assets"))); // Make assets folder static (or public), accessible
app.set('view engine', 'ejs');
app.set("layout", "layouts/main"); // automatically searches /views
app.use(expressLayouts);

app.get("/", (req, res) => {
    res.render("home", {
        featuredMealkits : mealkitUtil.getFeaturedMealKits(mealkitUtil.getAllMealKits()),
        title: "Home"
    });
});

app.get("/on-the-menu", (req, res) =>{
    res.render("on-the-menu", {
        categories: mealkitUtil.getMealKitsByCategory(mealkitUtil.getAllMealKits()),
        title: "On The Menu"
    });
});

app.get("/sign-up", (req, res) => {
    res.render("sign-up", {title: "Sign Up"});
});

app.get("/log-in", (req, res) => {
    res.render("log-in", {title: "Log In"});
});

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