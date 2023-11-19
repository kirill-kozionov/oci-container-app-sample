import {fetch, Headers} from "cross-fetch";

import express from 'express'
import {QdrantClient} from '@qdrant/js-client-rest';
import mysql from 'mysql2'

// @ts-ignore
global.Headers = global.Headers || Headers;
global.fetch = global.fetch || fetch;

const app = express()
const port = 3000

const QDRANT_URL = process.env.QDRANT_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

app.get('/', (req, res) => {
    res.send('Sample app is working')
})

app.get('/health', (req, res) => {
    Promise.all([mySQlCheckPromise(), qdrantCheckPromise()]).then(function (values) {
        res.send(values);
    }).catch((error) => {
        res.send(error)
    });
})

app.get('/qdrant', (req, res) => {
    Promise.all([qdrantCheckPromise()]).then(function (values) {
        res.send(values);
    }).catch((error) => {
        res.send(error)
    });
})

app.get('/mysql', (req, res) => {
    Promise.all([mySQlCheckPromise()]).then(function (values) {
        res.send(values);
    }).catch((error) => {
        res.send(error)
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function qdrantCheckPromise() {
    return new Promise((resolve, reject) => {
        const qDrantClient = new QdrantClient({url: QDRANT_URL});
        var collections = qDrantClient.getCollections().then(function () {
            resolve('QDRANT connection is healthy');
        }).catch(function (e) {
            reject('QDRANT connection has failed: ' + e);
        });
    });
}

function mySQlCheckPromise() {
    return new Promise((resolve, reject) => {
        const mySQLConnection = mysql.createConnection({
            host: MYSQL_URL,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD
        });

        mySQLConnection.connect(function (err) {
            if (err) {
                reject('MySQL connection has failed: ' + err);
            } else {
                resolve('MySQL connection is healthy');
            }
        })
    });
}
