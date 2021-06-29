const express = require('express');
const app = express();
const path = require('path');
const Joi = require('joi');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const { execArgv, nextTick } = require('process');
const sanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/sportsAcademy', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        console.log("Connected Mongo Successfully")
    })
    .catch(err => {
        console.log("Uh Oh couldnt connect mongo!!")
        console.log(err);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/gopih')));
app.use(express.static(path.join(__dirname, '/image')));
app.use(express.static(path.join(__dirname, '/js')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.static(path.join(__dirname, '/particlejs')));

app.get('*', (req, res) => {
    res.render('home');
})
app.listen(3000, () => {
    console.log("Listening on PORT 3000");
})
