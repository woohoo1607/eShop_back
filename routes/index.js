const user = require("./user");
const categorys = require("./categorys");
const products = require("./products")

module.exports = (app) => {
    user(app);
    categorys(app);
    products(app);
};