const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

/*const { Client } = require('pg');
let client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});*/
const { Pool } = require('pg');
let pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

/*const toServer = (query, response) => {
    client.connect();
    client
        .query(query)
        .then(res => {
            client.end();
            response.status(200);
            response.send("ok");
            console.log(res);
        })
        .catch(e => console.error(e.stack));
};*/

const toServer = async (query) => {
    return pool
        .connect()
        .then(client => {
            return client
                .query(query)
                .then(res => {
                    client.release();
                    //console.log(res.rows[0]);
                    return res;
                })
                .catch(e => {
                    client.release();
                    console.log(err.stack);
                    return e;
                })
        });
};

const user = (app) => {
    app.get("/users", function (request,response) {

        const query = {
            text: 'SELECT * from Users',
            values: []
        };
       toServer(query).then(res => {
           response.status(200);
           response.json(res.rows);
       } ).catch(e=> {
           response.send("error");
       });

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
                response.send("User is not found");
            } else {
                response.json(res.rows);
            }
        } ).catch(e=> {
            response.send("error");
        });
    });

    app.post("/users", urlencodedParser, function (request, response) {
        let data = request.body;
        const query = {
            text: 'INSERT INTO users (login, pass, firstname, surname, phonenumber, email) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [data.login, data.pass, data.firstname, data.surname, data.phonenumber, data.email ]
        };
        toServer(query).then(res => {
            response.status(200);
            console.log(res);
            if (res.rowCount === 0) {
                response.send("User not added");
            } else {
                response.send("User added");
            }
        } ).catch(e=> {
            console.log(e);
            response.send("error");
        });
    });

    app.delete("/users", urlencodedParser, function (request, response) {
        let data = request.body;
        console.log(data);
        const query = {
            text: 'DELETE FROM users WHERE id = $1',
            values: [data.id]
        };
        toServer(query).then(res => {
            response.status(200);
            console.log(res);
            if (res.rowCount === 0) {
                response.send("User is not found");
            } else {
                response.send("User removed");
            }
        } ).catch(e=> {
            response.send("error");
        });
    });

};

module.exports = user;