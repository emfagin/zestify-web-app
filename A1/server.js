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
const app = express();

app.use(express.static(path.join(__dirname, "/assets"))); // Make assets folder static (or public), accessible

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/on-the-menu", (req, res) =>{
    res.send("On The Menu Page :)");
});

app.get("/sign-up", (req, res) => {
    res.send("Sign Up Page :)");
});

app.get("/log-in", (req, res) => {
    res.send("Log In Page");
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.use(function (err, req, res, next){
    console.error(err.stack);
    res.status(500).send("Something Broke!");
});

const HTTP_PORT = process.env.PORT || 8000;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);