const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const toServer = require('../toServer');

const products = (app) => {
    app.get("/products", function (request, response) {
        const query = {
            //text: 'SELECT * from products ORDER BY id',
            text: 'SELECT products.id, products.title, products.categoryid, products.price, products.manufacturer, products.quantity, products.guarantee, products.description, categorys.title AS category_name, categorys.description AS category_description from products FULL OUTER JOIN categorys ON products.categoryid = categorys.id',
            values: []
        };
        toServer(query).then(res => {
            response.status(200);
            response.json({result: res.rows, status: 1});
        } ).catch(e=> {
            response.send("error");
        });
    });
    app.get("/products/:id", function (request, response) {
        let id = request.params.id;
        const query = {
            text: 'SELECT * from products WHERE id = $1',
            values: [id]
        };
        toServer(query).then(res => {
            response.status(200);
            if (res.rowCount === 0) {
                response.json({message: 'Products is not found', status: 0});
            } else {
                response.json({result: res.rows, status: 1});
            }
        } ).catch(e=> {
            response.send("error");
        });
    });
    app.post("/products", urlencodedParser, function (request, response) {
        let data = request.body;
        const queryCHECK = {
            text: 'SELECT * from products WHERE title=$1',
            values: [data.title]
        };
        const query = {
            text: 'INSERT INTO products (title, categoryid, price, manufacturer, quantity, guarantee, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [data.title, data.categoryid, data.price, data.manufacturer, data.quantity, data.guarantee, data.description]
        };
        toServer(queryCHECK).then(res => {
            if (res.rowCount === 0) {
                toServer(query).then(res => {
                    response.status(200);
                    if (res.rowCount === 0) {
                        response.json({message: 'Products not added', status: 0});
                    } else {
                        response.json({message: 'Products added', status: 1});
                    }
                } ).catch(e=> {
                    console.log(e);
                    response.send("error");
                });
            } else {
                response.status(200);
                response.json({message: 'Title is not UNIQUE', status: 0});
            }
        } ).catch(e=> {
            console.log(e);
            response.send("error");
        });
    });
    app.delete("/products", urlencodedParser, function (request, response) {
        let data = request.body;
        const query = {
            text: 'DELETE FROM products WHERE id = $1',
            values: [data.id]
        };
        toServer(query).then(res => {
            response.status(200);
            if (res.rowCount === 0) {
                response.json({message: 'Products is not found', status: 0});
            } else {
                response.json({message: 'Products removed', status: 1});
            }
        } ).catch(e=> {
            response.send("error");
        });
    });
    app.put("/products", urlencodedParser, function (request, response) {
        let data = request.body;
        const queryCHECK = {
            text: 'SELECT * from products WHERE title=$1',
            values: [data.title]
        };
        const query = {
            text: 'UPDATE products SET id=$1, title=$2, categoryid=$3, price=$4, manufacturer=$5, quantity=$6, guarantee=$7, description=$8 WHERE id = $1',
            values: [data.id, data.title, data.categoryid, data.price, data.manufacturer, data.quantity, data.guarantee, data.description]
        };
        toServer(queryCHECK).then(res => {
            if (res.rowCount === 0 || res.rowCount===1 && res.rows[0].id == data.id) {
                toServer(query).then(res => {
                    response.status(200);
                    if (res.rowCount === 0) {
                        response.json({message: 'Products not updated', status: 0});
                    } else {
                        response.json({message: 'Products updated', status: 1});
                    }
                } ).catch(e=> {
                    console.log(e);
                    response.send("error");
                });
            } else {
                response.status(200);
                response.json({message: 'Title is not UNIQUE', status: 0});
            }
        } ).catch(e=> {
            console.log(e);
            response.send("error");
        });
    });
};
module.exports = products;