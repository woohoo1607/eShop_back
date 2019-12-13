const user = require("./user/user");
const categories = require("./categories/categories");
const products = require("./products/products");

module.exports = (app) => {
    user(app);
    categories(app);
    products(app);
};