const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const db = require('./config/database');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const notificationMiddleware = require('./middlewares/notificationMiddleware');

app.use(express.urlencoded({
    extended: false
}));

app.use(expressLayouts);
app.use(express.static('./assets'));
app.use(session({
    secret:'codingninja',
    resave:false,
    saveUninitialized:false,
    resave:false,
})); 


app.use(flash());
app.use(notificationMiddleware.setFlash);

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Example app listening at http://localhost:${port}`)
    }
);
