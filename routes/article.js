const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

// Bringing in the Article modile connect
let Article = require("../model/articleModel");

// Add article route
router.get("/add", function (req, res) {
    res.render("add_article", {
        title: "Add Article",
    });
});

// Add submit article route
router.post( "/add",[
    body("title", "Title is Required").not().isEmpty(),
    body("author", "Author is Required").not().isEmpty(),
    body("body", "Body is Required").not().isEmpty().trim().escape(),],
    function (req, res) {
        const errors = validationResult(req);
        console.log(req.body);
        if (!errors.isEmpty()) {
            console.log(errors);
            res.render("add_article", {
                title: "Add Article",
                errors: errors.array(),
            });
        }
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash("success", "Article Added");
                res.redirect("/");
            }
        });
    }
);

// Get single article
router.get("/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("article", {
            article: article,
        });
    });
});

// Edit the single article
router.get("/edit/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("edit_article", {
            title: "Edit Article",
            article: article,
        });
    });
});

// Edit/Update article route
router.post("/edit/:id", function (req, res) {
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
            req.flash("primary", "Article Edited");
            res.redirect("/");
        }
    });
    return;
});

// Delete article route
router.delete("/:id", function (req, res) {
    let query = { _id: req.params.id };
    Article.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send("Success");
    });
});

module.exports = router;
