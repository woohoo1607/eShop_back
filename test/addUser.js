"use strict";

const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'forShopTEST',
    password: 'postgres',
    port: 5432,
});
client.connect();
const query = {
    text: 'INSERT INTO users (login, pass, firstname, lastname, phonenumber, email) VALUES ($1, $2, $3, $4, $5, $6)',
    values: ['user1', '1234567890', 'Alex', 'Kolton', '0504930293', 'alex@gmail.com']
};
const query2 = {
    text: 'SELECT * from users',
    values: []
};



describe('Проверка записи в таблицу users', () => {
    it('Добавлин ли new user', () => {

        let trueResult = {
            login: 'user1',
            pass: '1234567890',
            firstname: 'Alex',
            lastname: 'Kolton',
            phonenumber: '0504930293',
            email: 'alex@gmail.com' };
        client
            .query(query)
            .then(res => {
                console.log(res.rows);
                client
                    .query(query2)
                    .then(res => {
                        console.log(res.rows);
                        client.end();
                        expect(res.rows[0]).to.have.property(trueResult.login);
                    })
                    .catch(e => {
                        console.error(e.stack);
                        client.end();
                    });

            })
            .catch(e => {
                console.error(e.stack);
                client.end();
            });

    });
});


