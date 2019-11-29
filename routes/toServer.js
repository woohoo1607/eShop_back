const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

const toServer = async (query) => {
    return pool
        .connect()
        .then(client => {
            return client
                .query(query)
                .then(res => {
                    console.log(res);
                    client.release();
                    return res;
                })
                .catch(e => {
                    client.release();
                    console.log(err.stack);
                    return e;
                })
        });
};

module.exports = toServer;