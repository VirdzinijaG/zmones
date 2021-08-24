import { default as express } from "express";
import exphbs from "express-handlebars";

import { getZmones } from "./db.js";

const app = express(); // paleidziama funkcija is node_modules
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

const port = 3000;

app.use(express.static("web")); // tikrina ar web direktorijoje yra failai, pats automatiskai perskaito
app.use(express.json()); // ateina duomenys json 

app.get("/", async (req, res) => {
    res.type("text/html");
    try {
        const zmones = getZmones(); // gaunamas sarasas
        res.render("zmones", { zmones }); // nusiunciamas sarasas i narsykle
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});