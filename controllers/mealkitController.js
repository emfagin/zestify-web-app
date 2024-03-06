const express = require("express");
const mealkitUtil = require("../modules/mealkit-util");
const router = express.Router();

router.get("/on-the-menu", (req, res) =>{
    res.render("mealkits/on-the-menu", {
        categories: mealkitUtil.getMealKitsByCategory(mealkitUtil.getAllMealKits()),
        title: "On The Menu"
    });
});

module.exports = router; // export router