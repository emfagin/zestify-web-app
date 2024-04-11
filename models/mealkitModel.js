// Set up mongoose
const mongoose = require("mongoose");

// Just the schema, blueprint.
const mealkitSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  includes: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  cookingTime: {
    type: Number,
    require: true,
  },
  servings: {
    type: Number,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  featuredMealKit: {
    type: Boolean,
    require: true,
  },
});

const mealkitModel = mongoose.model("mealkits", mealkitSchema);

module.exports = {mealkitModel};
