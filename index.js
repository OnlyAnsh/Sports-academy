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
const Player = require('./models/player');


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

app.use(async (req, res, next) => {
    res.locals.currentUser = await req.user;
    next();
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
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(Player.authenticate()));

passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());



app.get("/login", (req, res) => {

    req.logOut();
    res.render("login");


})

app.post("/loginUser", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect("/home");
})


app.post('/registerUser', async (req, res) => {

    const userSchemaValid = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        pswd: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),

        cpswd: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required().valid(Joi.ref('pswd')),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
    })

    const emailValid = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
    })


    const body = req.body;
    const result = userSchemaValid.validate(body);
    const mailToBeChecked = { email: body.email };
    const emailCheck = emailValid.validate(mailToBeChecked);
    if (!emailCheck.error) {
        const saved = await Player.findOne({ email: body.email });
        if (saved) {
            console.log(saved);
            req.flash('info', `Email already exists`);
            res.redirect('/register');
        }
        else if (result.error) {
            const err = result;
            console.log(err);
            req.flash('info', `Passwords didn't match`);
            res.redirect('/register');
        }
        else {
            const user = new Player({ username: body.username, email: body.email });
            const newUser = await Player.register(user, body.pswd)
            console.log()
            res.redirect('/login');
        }
    }
    else {
        console.log(emailCheck);
        req.flash('info', `Invalid Username or Email`);
        res.redirect('/register');
    }

})

app.get('/register', async (req, res) => {
    await res.render('register');
})



app.get('*', (req, res) => {
    res.render('home');
})
app.listen(3000, () => {
    console.log("Listening on PORT 3000");
})
