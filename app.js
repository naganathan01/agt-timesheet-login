const express = require("express");
const mysql= require("mysql");
const doenv = require("dotenv");
const path = require("path");
const app = express();
const hbs = require('hbs');

doenv.config({
    path:'./.env',
});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});
db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('mysql connection success');
    }
});
app.use(express.urlencoded({extended:false}))

// console.log(__dirname);
const location = path.join(__dirname, "./public");
app.use(express.static(location));
app.set('view engine','hbs');

const partialsPath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialsPath);
// console.log(partialsPath)
// E:\js-project\login_system\views\partials

app.use("/", require('./routes/pages'));
app.use("/auth", require("./routes/auth"));

app.listen(5000,() =>{
    console.log("server start @ port 5000");

});