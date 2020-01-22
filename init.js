const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const session = require("express-session");
const mysql = require('mysql')
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'SETU'
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
    key: "sid",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

module.exports = {
    'app': app,
    'bodyParser': bodyParser,
    'path': path,
    'session': session,
    'mysql': mysql,
    'connection': connection,
    'PORT': PORT
}

