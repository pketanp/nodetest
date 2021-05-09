const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

// mongodb connection
mongoose.connect("mongodb://localhost/nodetest");
let db = mongoose.connection;

// db check connection
db.once("open", function () {
    console.log("connected to mongo db");
});

// check for db errors
db.on("error", function (err) {
    console.log(err);
});

// init app
const app = express();

// Article modile connect
let Article = require("./model/articleModel");

// load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public folder
app.use(express.static(path.join(__dirname, "public")));

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

// Add article route
app.get("/articles/add", function (req, res) {
    res.render("add_article", {
        title: "Add Article",
    });
});

// Add submit article route
app.post("/articles/add", function (req, res) {
    //console.log("submitted");
    //console.log(req.body.title);
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect("/");
        }
    });
    return;
});

// Get single article
app.get("/article/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("article", {
            article: article,
        });
    });
});

// Edit the single article
app.get("/article/edit/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("edit_article", {
            title: "Edit Article",
            article: article,
        });
    });
});

// Edit/Update article route
app.post("/articles/edit/:id", function (req, res) {
    //console.log("submitted");
    //console.log(req.body.title);
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id };
    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect("/");
        }
    });
    return;
});

// Delete article route
app.delete("/article/:id", function (req, res) {
    let query = { _id: req.params.id };
    Article.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send("Success");
    });
});

// Start Server
app.listen(3000, function () {
    console.log("server started at port 3000");
});
