const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./Categories/CategoriesController");
const articlesController = require("./Articles/ArticlesController")

const Articles = require("./Articles/Articles");
const Categories = require("./Categories/Categories");

//view engine
app.set('view engine', 'ejs');

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


app.get("/", (req, res) => {
    Articles.findAll().then(articles =>{
        res.render("index",{articles:articles});
    });
    
});

app.get("/:slug",(req,res)=>{
    var slug = req.params.slug;
    Articles.findOne({
        where:{ slug : slug}
    }).then(articles =>{
        if(articles != undefined){
            res.render("article",{articles: articles});
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    });
})

app.listen(8080, () => {
    console.log("Servidor online")
});