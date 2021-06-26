const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require('passport');
var config = require("./config/database");

// mongodb connection
mongoose.connect(config.database);
let db = mongoose.connection;

// db check connection
db.once("open", function () {
    console.log("connected to mongo db");
});

// check for db errors
db.on("error", function (err) {
    console.log(err);
});

// Article modile connect
let Article = require("./model/articleModel");

// init app
const app = express();

// load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Express session middleware
app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
    })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
    res.locals.messages = require("express-messages")(req, res);
    next();
});

// Express Validator Middleware
app.use(express.json());

// Set Public folder
app.use(express.static(path.join(__dirname, "public")));

// passport config
require('./config/passport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function( req, res, next){
	res.locals.user = req.user || null;
	next();
});

// home route
app.get("/", function (req, res) {
    // let articles = [
    //     { id: 1, title: "Article one", author: "pk...", body: "This is article one", },
    //     { id: 2, title: "Article two", author: "csfx", body: "This is article two", },
    //     { id: 3, title: "Article three", author: "anon", body: "This is article three", },
    // ];

    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                title: "Hello",
                articles: articles,
            });
        }
    });
});

// Article Router file
let articles = require("./routes/article");
app.use("/articles", articles);

// User Router file
let users = require("./routes/users");
app.use("/users", users);

// Start Server
app.listen(3000, function () {
    console.log("server started at port 3000");
});
