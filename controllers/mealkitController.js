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

// Mealkits get route (/mealkits) - for customers.
router.get("/", (req, res) =>{
    res.render("mealkits/on-the-menu", {
        categories: mealkitUtil.getMealKitsByCategory(mealkitUtil.getAllMealKits()),
        title: "On The Menu"
    });
});

// Mealkit-list get route (/mealkits/list) - for clerks only.
router.get("/list", (req, res) =>{ // list mealkits 
    res.render("mealkits/list", {
        title: "List"
    });
});

module.exports = router; // export router