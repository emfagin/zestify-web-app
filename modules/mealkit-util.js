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
mealkits = [
    {
        title: "Birria Burrito",
        includes: "Fresh Mango Salsa & Cilantro Lime Rice",
        description: "Chuck Roast Pulled Beef, Fresh Vegetables, Mango Salsa, Cilantro Lime Rice.",
        category: "Slow Cooked Delights",
        price: 34.99,
        cookingTime: 190,
        servings: 3,
        imageUrl: "burrito-dish.png",
        featuredMealKit: false
    },
    {
        title: "Smoked Salmon Eggs Benedict",
        includes: "Hollandaise Sauce & Zesty Greens Salad",
        description: "Poached Eggs on Smokey Salamon, on Sourdough Bread With Hollandaise Sauce with a Side of Green Salad.",
        category: "Classic Meals",
        price: 28.99,
        cookingTime: 20,
        servings: 2,
        imageUrl: "eggs-beni.jpg",
        featuredMealKit: true
    },
    {
        title: "Vegetarian Grilled Burger",
        includes: "Black Sesame Buns & Grilled Vegetables",
        description: "Juicy Vegetarian Paddy on Roasted Charcoal Sesame Buns, With Grilled Vegetables and Teriyaki.",
        category: "Vegetarian Meals",
        price: 22.99,
        cookingTime: 35,
        servings: 2,
        imageUrl: "hamburger.jpg",
        featuredMealKit: true
    },
    {
        title: "Italian Lampredotto Stew",
        includes: "Panino Bread & Salsa Verde",
        description: "Delicious Italian Cow-Stomach Stew, Seasoned in Salsa Verde, Served with Crusty Panino Bread.",
        category: "Slow Cooked Delights",
        price: 40.99,
        cookingTime: 70,
        servings: 4,
        imageUrl: "lampredotto.jpg",
        featuredMealKit: false
    },
    {
        title: "Chicken Pad Thai",
        includes: "Toasted Peanuts & Tofu",
        description: "Chicken Pad Thai Topped with Roasted Peanuts and Chilli Flakes.",
        category: "Classic Meals",
        price: 19.99,
        cookingTime: 20,
        servings: 2,
        imageUrl: "pad-thai.jpg",
        featuredMealKit: true
    },
    {
        title: "Arugula Prosciutto Pizza",
        includes: "Dried Peppers & Pesto",
        description: "An Arugala Prosciutto Pizza Topeed with Pesto, Dried Peppers and Basil.",
        category: "Classic Meals",
        price: 20.99,
        cookingTime: 30,
        servings: 3,
        imageUrl: "pizza.jpg",
        featuredMealKit: false
    },
    {
        title: "Chicken Mushroom Ramen",
        includes: "Baked Bok Choy & Fried Tofu",
        description: "A Miso-Based Chicken Ramen with Juicy Fungi and Baked Bok Choy, Paired with Chicken Karagee.",
        category: "Classic Meals",
        price: 24.99,
        cookingTime: 35,
        servings: 2,
        imageUrl: "ramen-dish.jpg",
        featuredMealKit: true
    },
    {
        title: "Vegetarian Tofu Stirfry",
        includes: "Spinach Mushroom Soup & Jasmine Rice",
        description: "Vegetarian Tofu and Brocolli Stirfry, with a Side of Mushroom Soup and Jasmine Rice.",
        category: "Vegetarian Meals",
        price: 19.99,
        cookingTime: 20,
        servings: 2,
        imageUrl: "tofu-salad.jpg",
        featuredMealKit: false
    },
]

module.exports.getAllMealKits = function (){
    return mealkits;
}


module.exports.getFeaturedMealKits = function (mealkits){
    featured = [];
    mealkits.forEach(mk => {
        if (mk.featuredMealKit){
            featured.push(mk);
        }
    });
    return featured;
}


module.exports.getMealKitsByCategory = function (mealkits) {
    let sorted = [];
  
    mealkits.forEach(mk => {
        const existingCategory = sorted.find(cat => cat.categoryName === mk.category);
        if (existingCategory) {
            existingCategory.mealkits.push(mk);
        } else {
            const newCat = {
            categoryName: mk.category,
            mealkits: [mk]
            };
            sorted.push(newCat);
        }
    });
    return sorted;
}