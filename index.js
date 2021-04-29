const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

//mongodb connection
mongoose.connect("mongodb://localhost/nodetest");
let db = mongoose.connection;

//db check connection
db.once("open", function () {
    console.log("connected to mongo db");
});

//check for db errors
db.on("error", function (err) {
    console.log(err);
});

//init app
const app = express();

//Article modile connect
let Article = require("./model/articleModel");

//load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//home route
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

//Add article route
app.get("/articles/add", function (req, res) {
    res.render("add_article", {
        title: "Add Article",
    });
});

//Add submit article route
app.post("/articles/add", function (req, res) {
    console.log("submitted");
    return;
});
//start server
app.listen(3000, function () {
    console.log("server started at port 3000");
});
