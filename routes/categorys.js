const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const toServer = require('./toServer');

const categorys = (app) => {
    app.get("/categorys", function (request, response) {
        const query = {
            text: 'SELECT * from categorys ORDER BY id',
            values: []
        };
        toServer(query).then(res => {
            response.status(200);
            response.json({result: res.rows, status: 1});
        } ).catch(e=> {
            response.send("error");
        });
    });
    app.get("/categorys/:id", function (request, response) {
        let id = request.params.id;
        const query = {
            text: 'SELECT * from categorys WHERE id = $1',
            values: [id]
        };
        toServer(query).then(res => {
            response.status(200);
            if (res.rowCount === 0) {
                response.json({message: 'Category is not found', status: 0});
            } else {
                response.json({result: res.rows, status: 1});
            }
        } ).catch(e=> {
            response.send("error");
        });
    });
    app.post("/categorys", urlencodedParser, function (request, response) {
        let data = request.body;
        const queryCHECK = {
            text: 'SELECT * from categorys WHERE title=$1',
            values: [data.title]
        };
        const query = {
            text: 'INSERT INTO categorys (title, description) VALUES ($1, $2)',
            values: [data.title, data.description]
        };
        toServer(queryCHECK).then(res => {
            if (res.rowCount === 0) {
                toServer(query).then(res => {
                    response.status(200);
                    if (res.rowCount === 0) {
                        response.json({message: 'Category not added', status: 0});
                    } else {
                        response.json({message: 'Category added', status: 1});
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
    app.delete("/categorys", urlencodedParser, function (request, response) {
        let data = request.body;
        const query = {
            text: 'DELETE FROM categorys WHERE id = $1',
            values: [data.id]
        };
        toServer(query).then(res => {
            response.status(200);
            if (res.rowCount === 0) {
                response.json({message: 'Category is not found', status: 0});
            } else {
                response.json({message: 'Category removed', status: 1});
            }
        } ).catch(e=> {
            response.send("error");
        });
    });
    app.put("/categorys", urlencodedParser, function (request, response) {
        let data = request.body;
        const queryCHECK = {
            text: 'SELECT * from categorys WHERE title=$1',
            values: [data.title]
        };
        const query = {
            text: 'UPDATE categorys SET id=$1, title=$2, description=$3 WHERE id = $1',
            values: [data.id, data.title, data.description]
        };
        toServer(queryCHECK).then(res => {
            if (res.rowCount === 0|| res.rowCount===1 && res.rows[0].id == data.id) {
                toServer(query).then(res => {
                    response.status(200);
                    if (res.rowCount === 0) {
                        response.json({message: 'Category not updated', status: 0});
                    } else {
                        response.json({message: 'Category updated', status: 1});
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
module.exports = categorys;