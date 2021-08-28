async function getZmones() {
    // alert("Gaunu duomenis is serverio")
    try {
        const res = await fetch("/json/zmones") // gaunami duomenys is /json/zmones ir grazina promisa
        if (res.ok) {
            const data = await res.json();
            // console.log(data); // console atspausdinama sarasas duomenu
            const div = document.getElementById("zmones"); // ieskomas elementas html pagal id
            cleanNode(div); // div'o valymas ir automatiskai sukuria nauja lentele
            const table = document.createElement("table"); // elemento sukurimas html
            for (const zmogus of data) {
                const tr = document.createElement("tr");
                let td;
                td = document.createElement("td");
                td.appendChild(document.createTextNode(zmogus.id)); // append elemento pridejimas // createTextNode sukuriamas tekstas
                tr.appendChild(td);
                td = document.createElement("td");
                td.appendChild(document.createTextNode(zmogus.vardas));
                tr.appendChild(td);
                td = document.createElement("td");
                td.appendChild(document.createTextNode(zmogus.pavarde));
                tr.appendChild(td);
                td = document.createElement("td");
                if (zmogus.gimimoData) { // rasomos reiksmes, kai jos yra pateiktos, o null nerasys
                    td.appendChild(document.createTextNode(zmogus.gimimoData.substring(0, 10))); // substring, imamos reiksmes nuo 0 iki 10, data tvarkingai rasoma
                }
                tr.appendChild(td);
                td = document.createElement("td");
                if (zmogus.alga) { // rasomos reiksmes, kai jos yra pateiktos, o null nerasys
                    td.appendChild(document.createTextNode(zmogus.alga));
                }
                tr.appendChild(td);
                table.appendChild(tr);
            }
            div.appendChild(table); // i div'a ikeliama lentele
        } else {
            console.log("Uzklausa is serverio atejo su klaida", res.status);
        }
    }
    catch (err) {
        console.log("Klaida gaunant duomenis is serverio", err);
    }
}

// parodoma zmogaus informacija pagal id
async function getZmogus() {
    let id = parseInt(document.getElementById("id").value);
    if (!isFinite(id)) {
        return;
    }
    try {
        const res = await fetch("/json/zmones/" + id)
        if (res.ok) {
            const zmogus = await res.json();
            const div = document.getElementById("zmones");
            cleanNode(div);
            if (zmogus) {
                div.appendChild(document.createTextNode("ID:"));
                div.appendChild(document.createTextNode(zmogus.id));
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Vardas:"));
                div.appendChild(document.createTextNode(zmogus.vardas));
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Pavarde:"));
                div.appendChild(document.createTextNode(zmogus.pavarde));
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Gimimo data:"));
                if (zmogus.gimimoData) {
                    div.appendChild(document.createTextNode(zmogus.gimimoData.substring(0, 10)))
                }
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Alga:"));
                if (zmogus.alga) {
                    div.appendChild(document.createTextNode(zmogus.alga));
                }
                div.appendChild(document.createElement("br"));
            }

        } else {
            console.log("Uzklausa is serverio atejo su klaida", res.status);
        }
    }
    catch (err) {
        console.log("Klaida gaunant duomenis is serverio", err);
    }
}

async function deleteZmogus() {
    let id = parseInt(document.getElementById("id").value);
    if (!isFinite(id)) {
        return;
    }
    try {
        const res = await fetch("/json/zmones/" + id, {
            method: "DELETE" // funkcijai delete prie fetch pridedamas objektas su metodu delete
        });
        if (res.ok) {
            // const div = document.getElementById("zmones");
            // div.appendChild(document.createTextNode("Istrintas zmogus su id:" + id));
            getZmones();
        } else {
            console.log("Uzklausa is serverio atejo su klaida", res.status);
        }
    }
    catch (err) {
        console.log("Klaida gaunant duomenis is serverio", err);
    }
}



function cleanNode(node) { // funkcija, kad nepridedu vis po nauja lentele paspaudus Get Data
    if (node instanceof Node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
}