const userDatabaseManager = require ('./userDatabaseManager');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const toServer = require('../toServer');


const user = (app) => {
    app.get("/users", function (request,response) {
        let query;
        if (request.query.page) {
            let page = (request.query.page-1)*10;
            (page<0) ? page = 0 : page=page;
            query = {
                text: 'SELECT * from Users ORDER BY id LIMIT 10 OFFSET $1',
                values: [page]
            };
        } else {
            query = {
                text: 'SELECT * from Users ORDER BY id LIMIT 10 OFFSET 0',
                values: []
            };
        }
        const queryCount = {
            text: 'SELECT COUNT (*) from Users',
            values: []
        };
        let getUsers = async () => {
            try {
                let users = await toServer(query);
                let count = await toServer(queryCount);
                response.status(200);
                response.json({result: users.rows, count: +count.rows[0].count, status: 1});
            } catch(e) {
                response.send("error");
            }
        };
        getUsers();
    });

    app.get("/users/:id", function (request,response) {
        let id = request.params.id;
        const query = {
            text: 'SELECT * from Users WHERE id = $1',
            values: [id]
        };
        toServer(query).then(res => {
            response.status(200);
            if (res.rowCount === 0) {
                response.send({message: 'User is not found', status: 0});
            } else {
                response.json({result: res.rows, status: 1});
            }
        } ).catch(e=> {
            response.send("error");
        });
    });

    app.post("/users", urlencodedParser, function (request, response) {
        let data = request.body;
        const queryCHECK = {
            text: 'SELECT * from users WHERE login=$1 OR phonenumber=$2 OR email=$3',
            values: [data.login, data.phonenumber, data.email ]
        };
        const query = {
            text: 'INSERT INTO users (login, pass, firstname, surname, phonenumber, email) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [data.login, data.pass, data.firstname, data.surname, data.phonenumber, data.email]
        };
        toServer(queryCHECK).then(res => {
            if (res.rowCount === 0) {
                toServer(query).then(res => {
                    response.status(200);
                    if (res.rowCount === 0) {
                        response.json({message: 'User not added', status: 0});
                    } else {
                        response.json({message: 'User added', status: 1});
                    }
                } ).catch(e=> {
                    console.log(e);
                    response.send("error");
                });
            } else {
                response.status(200);
                response.json({message: 'login or phonenumber or email are not UNIQUE', status: 0});
            }
        } ).catch(e=> {
            console.log(e);
            response.send("error");
        });
    });

    app.post("/delete/user", urlencodedParser, function (request, response) {
        let data = request.body;
        const query = {
            text: 'DELETE FROM users WHERE id = $1',
            values: [data.id]
        };
        toServer(query).then(res => {
            response.status(200);
            if (res.rowCount === 0) {
                response.json({message: 'User is not found', status: 0});
            } else {
                response.json({message: 'User removed', status: 1});
            }
        } ).catch(e=> {
            response.send("error");
        });
    });

    app.put("/users", urlencodedParser, function (request, response) {
        let data = request.body;
        const query = userDatabaseManager.update(data);

        const queryCHECK = {
            text: 'SELECT * from users WHERE login=$1 OR phonenumber=$2 OR email=$3',
            values: [data.login, data.phonenumber, data.email ]
        };

        toServer(queryCHECK).then(res => {
            if (res.rowCount === 0|| res.rowCount===1 && res.rows[0].id == data.id) {
                toServer(query).then(res => {
                    response.status(200);
                    if (res.rowCount === 0) {
                        response.json({message: 'User not updated', status: 0});
                    } else {
                        response.json({message: 'User updated', status: 1});
                    }
                } ).catch(e=> {
                    console.log(e);
                    response.send("error");
                });
            } else {
                response.status(200);
                response.json({message: 'login or phonenumber or email are not UNIQUE', status: 0});
            }
        } ).catch(e=> {
            console.log(e);
            response.send("error");
        });
    });

};

module.exports = user;