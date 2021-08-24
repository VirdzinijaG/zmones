import { default as express } from "express";
import exphbs from "express-handlebars";

const app = express(); // paleidziama funkcija is node_modules
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

const port = 3000;

app.use(express.static("web")); // tikrina ar web direktorijoje yra failai, pats automatiskai perskaito
app.use(express.json()); // ateina duomenys json 

app.get("/", async (req, res) => {
    res.type("text/html");
    try {
        const fZmones = await readFile("zmones.json", {
            encoding: "utf8",
        });
        const zmones = JSON.parse(fZmones);
        res.render("zmones", { zmones });
    }
    catch (err) {
        res.status(500).send(err);
    }
});