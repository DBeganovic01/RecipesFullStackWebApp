const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

const recipes = [
    {
        recipeName: "Baked Potato",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://www.simplyrecipes.com/thmb/GZwoVSMKQ2tiBKner6bDmCXJPi0=/1600x1067/filters:fill(auto,1)/Twice-Baked-Potatoes-LEAD-1v2-f7918849ddd245c5aecf0ec58fb2b47e.jpg"
    },
    {
        recipeName: "Crepes",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://handletheheat.com/wp-content/uploads/2014/02/How-to-Make-Crepes-SQUARE.jpg"
    },
    {
        recipeName: "Baked Salmon",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://www.acouplecooks.com/wp-content/uploads/2020/01/Broiled-Salmon-006-368x368.jpg"
    }
]

app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/recipes", (req,res) => {
    res.render("recipes", {recipes});
})

app.post("/recipes", (req, res) => {
    console.log(req.body);
    recipes.push(req.body);
    res.redirect("/recipes");
})

app.get("/recipes/new", (req, res) => {
    res.render("recipes_new");
})

app.get("/pantry", (req,res) => {
    res.render("pantry");
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});