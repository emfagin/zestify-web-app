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