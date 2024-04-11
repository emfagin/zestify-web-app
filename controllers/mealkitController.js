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
const {mealkitModel} = require("../models/mealkitModel");
const router = express.Router();
const path = require("path");
const fs = require("fs"); // for removing files
const { authenticateUser, displayError, displayError500, displayError404 } = require("../modules/authentication");

// Mealkits get route (/mealkits) - for customers.
router.get("/", (req, res) => {
  authenticateUser(req, res, "Mealkits", false, true)
  .then((isAllowed)=> {
    if (isAllowed) {
      mealkitModel.find({})
      .then((db_mealkits) => {
        res.render("mealkits/on-the-menu", {
          categories: mealkitUtil.getMealKitsByCategory(db_mealkits),
          title: "On The Menu",
        });
      })
      .catch((err) =>{
        displayError500(res, "Home", "Error fetching mealkits from database: " + err);
      });
    }
  });
});

// Mealkit-list get route (/mealkits/list) - for clerks only.
router.get("/list", (req, res) => {
  authenticateUser(req, res, "List", true).then((isAllowed) => { 
    if (isAllowed) {
      mealkitModel
        .find({})
        .then((db_mealkits) => {
          res.render("mealkits/list", {
            title: "List",
            mealkits: db_mealkits,
          });
        })
        .catch((err) => {
          msg = "Failed retrieving mealkits: " + err;
          displayError500(res, "List", msg);
          displayError(res, "List", msg, 503, "Service Unavailable")
        });
    }
  });
});

// 'mealkits/add' GET route, handles loading page content
router.get("/add", (req, res) => {
  authenticateUser(req, res, "Add Mealkit", true)
  .then ((isAllowed) => {
    if (isAllowed) { // allowed to access it!
      res.render("mealkits/add", {
        title: "Add",
      });
    }
  });
});

// 'mealkit/add' POST route, handles submission/changes
router.post("/add", (req, res) => {
  const {
    title,
    includes,
    description,
    category,
    price,
    cookingTime,
    servings,
    featuredMealKit,
  } = req.body;

  const newMealkit = new mealkitModel({
    title,
    includes,
    description,
    category,
    price,
    cookingTime,
    servings,
    featuredMealKit: !!featuredMealKit, // Convert isFeatured to a boolean value
  });

  newMealkit
    .save()
    .then((mkSaved) => {
      console.log(`Mealkit ${mkSaved.title} has been added to the database.`);

      // Create a unique name for the picture, so that it can be stored in the static folder.
      const imageFile = req.files.imageUrl;
      const uniqueName = `mk-${mkSaved._id}${path.parse(imageFile.name).ext}`;

      // Copy the image data to a file on the system.
      imageFile
        .mv(`assets/mealkit-imgs/${uniqueName}`)
        .then(() => {
          // Successful
          mealkitModel
            .updateOne(
              { _id: mkSaved._id, },
              { $set: {imageUrl: uniqueName}} )
            .then(() => {
              // Successfully updated document
              console.log("Updated/Created mealkit picture");
              res.redirect("/mealkits/list");
            })
            .catch((err) => {
              console.error("Error updating mealkit... " + err);
              res.redirect("/mealkits/list");
            });
        })
        .catch((err) => {
          console.error("Error updating the mealkit image... " + err);
          res.redirect("/mealkits/list");
        });
    })
    .catch((err) => {
      console.log(`Error adding mealkit to the database ... ${err}`);
      res.render("mealkits/add", {
        title: "Add",
        error: "Error adding mealkit to the database. Try Again.",
      });
    });
});

// 'mealkits/edit/[id] GET route, handles loading page
router.get("/edit/:id", (req, res) => {
  authenticateUser(req, res, "Edit Mealkit", true)
  .then((isAllowed) => {
    if (isAllowed) {
      const id = req.params.id;
      mealkitModel
      .findOne({ _id: id })
      .then((mealkit) => {
        if (!mealkit) {
          // If meal kit is not found, render an error page
          displayError404(res, "Edit", "Mealkit not found.");
        }
        // Render the edit mealkit page
        res.render("mealkits/edit", {
          title: "Edit Meal Kit",
          mealkit: mealkit,
          id: id,
        });
      })
      .catch((err) => {
        // If an error occurs, render an error page
        msg = "An error occurred while editing the meal kit.";
        displayError500(res, "Edit", msg);
        // displayError(res, "Edit", msg, 500, "Internal Server Error");
      });
    }
  });
});

// 'mealkits/edit/[id] POST route, handles submission of changes
router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  // Extract updated values from the form
  const input = {
    title: req.body.title,
    includes: req.body.includes,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    cookingTime: req.body.cookingTime,
    servings: req.body.servings,
    featuredMealKit: req.body.featuredMealKit ? true : false,
  };
  
  const changeImage = req.body.changeImageCheckbox ? true : false

  mealkitModel
  .findOne({ _id: id })
  .then((mealkit) => {
    if (!mealkit) { // If meal kit is not found, render an error page
      displayError404(res, "Edit", "Mealkit not found.");
    } else { // Mealkit found
      
      const edited = {};
      Object.keys(input).forEach(key => {
        if (mealkit[key].toString() !== input[key].toString()){
          edited[key] = input[key];
        }
      });

      // if image changed && submitted, and change image checked off
      if (req.files && req.files.imageUrl && typeof req.files.imageUrl !== "undefined" && changeImage){ 
        const imageFile = req.files.imageUrl;
        const uniqueName = `mk-${id}${path.parse(imageFile.name).ext}`
        edited.imageUrl = uniqueName; // set what to be changed to
          
        if (uniqueName !== mealkit.imageUrl){ // if not the same file uploaded
          if (mealkit.imageUrl){
            const oldFilePath = path.join(__dirname,"../assets/mealkit-imgs/" + mealkit.imageUrl);
            console.log(uniqueName + ": " + oldFilePath);
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                displayError500(res, "Edit", "Error removing file: " + err);
              }
              else{
                imageFile.mv(`assets/mealkit-imgs/${uniqueName}`)
                .then(() => {
                  updateMealkit();
                })
                .catch((err) => {
                  displayError500(res, "Edit", "Error while moving Mealkit image: " + err);
                });
              }
            })
          }
          else{
            imageFile.mv(`assets/mealkit-imgs/${uniqueName}`)
            .then(() => {
              updateMealkit();
            })
            .catch((err) => {
              displayError500(res, "Edit", "Error while moving Mealkit image: " + err);
            });
          }
        }
        else{
          updateMealKit();
        }
      } else { // if image not changed.
        updateMealkit();
      }
      function updateMealkit() {
        mealkitModel.updateOne(
          { _id: id }, 
          { $set: edited })
        .then(() => {
            console.log("Updated Mealkit Successfully.");
            res.redirect("/mealkits/list");
        })
        .catch((err) => {
          console.error("Error updating mealkit: " + err);
          displayError500(res, "Edit", "Error while updating Mealkit: " + err);
        })
      }
    }
  })
  .catch((err) => { // If an error occurs, render an error page
    msg = "An error occurred while editing the meal kit.";
    displayError(res, "Edit", msg, 500, "Service Unavailable");
    // displayError500(res, "Edit", msg);
  });
});

// 'mealkits/remove/[id] GET route, handles loading page
router.get("/remove/:id", (req, res) => {
  authenticateUser(req, res, "Remove Mealkit", true).then((isAllowed) =>{
    if (isAllowed) {
      const id = req.params.id;
      mealkitModel
      .findOne({ _id: id })
      .then((mealkit) => {
        if (!mealkit) { // If meal kit is not found, render an error page
  
        displayError404(res, "Remove", "Mealkit not found.");
        } else { // Render the delete confirmation page with the meal kit details
          res.render("mealkits/remove", {
            title: "Remove Meal Kit",
            mealkit: mealkit,
          });
        }
      })
      .catch((err) => { // If an error occurs, render an error page
        msg = "An error occurred while removing the meal kit.";
        displayError500(res, "Remove", msg);
      });
    }
  });
});

// 'mealkits/remove/[id] POST route, handles submission/changes
router.post("/remove/:id", (req, res) => {
  const id = req.params.id;
  mealkitModel
    .findOne({ _id: id })
    .then((mealkit) => {
      if (!mealkit) { // If meal kit is not found, render an error page
        displayError404(res, "Remove", "Mealkit not found.");
      } else {
        mealkitModel
        .deleteOne({ _id: id })
        .then(() => {
          const filePath = path.join(__dirname,"../assets/mealkit-imgs/" + mealkit.imageUrl);

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error removing file:", err);
            } else {
              console.log("File has been successfully removed");
            }
          });

          res.redirect("/mealkits/list");

        })
        .catch((err) => {
          console.log("Error removing mealkit: " + err);
        });
      }
    })
    .catch((err) => {
      msg = "An error occurred while removing the meal kit.";
      displayError500(res, "Remove", msg);
    });
});

module.exports = router; // export router
