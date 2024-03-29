const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require('express-session'); // manipulando sessão - npm install express-session --save

const categoriesController = require("./Categories/CategoriesController");
const articlesController = require("./Articles/ArticlesController")
const userController = require("./User/userController")

const Articles = require("./Articles/Articles");
const Categories = require("./Categories/Categories");
const User  = require("./User/user");
//view engine
app.set('view engine', 'ejs');

//sessions
app.use(session({
    secret: "qualquercoisa", cookie:{maxAge:120000}
}))
//Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conectar no banco
connection.authenticate()
    .then(() => {
        console.log("Conexão com banco realizada");
    }).catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);


app.get("/", (req, res) => {
    Articles.findAll({
        order: [
            ['id', 'desc']
        ],
        limit: 4
    }).then(articles => {
        Categories.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        })

    });

});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Articles.findOne({
        where: { slug: slug }
    }).then(articles => {
        if (articles != undefined) {
            Categories.findAll().then(categories => {
                res.render("article", { articles: articles, categories: categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
})

app.get("/categories/:slug", (req, res) => {
    var slug = req.params.slug;
    Categories.findOne({
        where: { slug: slug }
    }).then(category => {
        if (category != undefined) {
            Articles.findAll({
                where: { categoryId: category.id }
            }).then(articles => {
                Categories.findAll().then(categories => {
                    res.render("index", { articles: articles, categories: categories });
                });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})

app.listen(3000, () => {
    console.log("Servidor online")
});