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

router.get("/", (req, res) => {
    res.render("general/home", {
        featuredMealkits : mealkitUtil.getFeaturedMealKits(mealkitUtil.getAllMealKits()),
        title: "Home"
    });
});

module.exports = router; // export router