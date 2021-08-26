import { default as express, json } from "express";
import exphbs from "express-handlebars";

import { getZmones, getZmogus, saveZmogus, deleteZmogus, getKontaktai, getKontaktas, saveKontaktas, deleteKontaktas } from "./db.js";

const app = express(); // paleidziama funkcija is node_modules
const hbs = exphbs({
    helpers: {
        dateFormat(d) {
            if (d instanceof Date) {
                return d.toISOString().substring(0, 10);
            } else {
                return d;
            }
        }
    }
})
app.engine("handlebars", hbs);
app.set("view engine", "handlebars");

const port = 3000;

app.use(express.static("web")); // tikrina ar web direktorijoje yra failai, pats automatiskai perskaito
app.use(express.urlencoded({ // analizuoja gaunamas uzklausas // kai ateina postas (save) uzpildys req.body
    extended: true
}));
app.use(express.json()); // ateina duomenys json 

app.get("/zmones", async (req, res) => {
    res.type("text/html");
    try {
        const zmones = await getZmones(); // gaunamas sarasas
        res.render("zmones", { zmones }); // nusiunciamas sarasas i narsykle
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/zmones/naujas", async (req, res) => {
    res.type("text/html");
    try {
        res.render("zmogus", {});
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/zmones/:id", async (req, res) => {
    res.type("text/html");
    try {
        const zmones = await getZmogus(req.params.id);
        if (zmones.length > 0) {
            res.render("zmogus", zmones[0]);
        } else {
            res.redirect("/zmones");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.post("/zmones/save", async (req, res) => {
    res.type("text/html");
    if (typeof req.body.vardas !== "string" || req.body.vardas.trim() === "") {
        res.redirect("/zmones");
        return;
    }
    if (
        typeof req.body.pavarde !== "string" || req.body.pavarde.trim() === ""
    ) {
        res.redirect("/zmones");
        return;
    }

    if (req.body.gimimoData === "") {
        req.body.gimimoData = null;
    } else {
        req.body.gimimoData = new Date(req.body.gimimoData);
        if (!isFinite(req.body.gimimoData.getTime())) {
            res.redirect("/zmones");
            return;
        }
    }
    if (req.body.alga === "") {
        req.body.alga = null;
    } else {
        req.body.alga = parseFloat(req.body.alga);
        if (!isFinite(req.body.alga)) {
            res.redirect("/zmones");
            return;
        }
    }
    try {
        await saveZmogus(
            req.body.id,
            req.body.vardas,
            req.body.pavarde,
            req.body.gimimoData,
            req.body.alga,
        );
        res.redirect("/zmones");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/zmones/:id/delete", async (req, res) => {
    res.type("text/html");
    // console.log("cia tureciau istrinti zmogu su id: " + req.params.id);
    try {
        await deleteZmogus(req.params.id);
        res.redirect("/zmones");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/zmones/:id/kontaktai", async (req, res) => {
    res.type("text/html");
    try {
        const zmones = await getZmogus(req.params.id);
        if (zmones.length > 0) {
            const kontaktai = await getKontaktai(req.params.id)
            res.render("kontaktai", { // generuojamas views
                zmogus: zmones[0],
                kontaktai
            });
        } else {
            res.redirect("/zmones");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
app.get("/zmones/:id/kontaktai/naujas", async (req, res) => {
    res.type("text/html");
    try {
        const zmones = await getZmogus(req.params.id);
        if (zmones.length > 0) {
            res.render("kontaktas", {
                zmogus: zmones[0],
            });
        } else {
            res.redirect("/zmones");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/zmones/:zmogusId/kontaktai/:id", async (req, res) => {
    res.type("text/html");
    try {
        const zmones = await getZmogus(req.params.zmogusId);
        if (zmones.length > 0) {
            const kontaktai = await getKontaktas(req.params.id, req.params.zmogusId); // tikrinamas id, kad sutaptu ir neleistu, redaguoti kontakto, jei id ne toks
            if (kontaktai.length > 0) {
                res.render("kontaktas", {
                    zmogus: zmones[0],
                    kontaktas: kontaktai[0],
                });
            } else {
                res.redirect(`/zmones/${req.params.zmogusId}/kontaktai`);
            }
        } else {
            res.redirect("/zmones");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.post("/zmones/:zmogusId/kontaktai/save", async (req, res) => {
    res.type("text/html");
    try {
        const zmones = await getZmogus(req.params.zmogusId); // tikrinama ar yra toks zmogus
        if (zmones.length > 0) {
            await saveKontaktas(req.body.id, req.params.zmogusId, req.body.tipas, req.body.reiksme);
            res.redirect(`/zmones/${req.params.zmogusId}/kontaktai`);
        } else {
            res.redirect("/zmones");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/zmones/:zmogusId/kontaktai/:id/delete", async (req, res) => {
    res.type("text/html");
    try {
        await deleteKontaktas(req.params.id, req.params.zmogusId);
        res.redirect(`/zmones/${req.params.zmogusId}/kontaktai`);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// parodytas per pamoka
// app.get("/zmones/:zmogusId/kontaktai/:id/delete", async (req, res) => {
//     res.type("text/html");
//     try {
//       const zmones = await getZmogus(req.params.zmogusId);
//       if (zmones.length > 0) {
//         await deleteKontaktas(req.params.id, req.params.zmogusId);
//         res.redirect(`/zmones/${req.params.zmogusId}/kontaktai`);
//       } else {
//         res.redirect("/zmones");
//       }
//     } catch (err) {
//       console.log(err);
//       res.status(500).send(err);
//     }
//   });

// duomenu perdavimas  naudojant json
// grazins ne html jau, o tik zmoniu sarasa 
app.get("/json/zmones", async (req, res) => {
    res.type("application/json");
    try {
        const zmones = await getZmones();
        res.send(JSON.stringify(zmones));
    } catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify({
            err
        }));
    }
});

app.listen(port, () => { // narsykles port
    console.log(`Example app listening at http://localhost:${port}`);
});