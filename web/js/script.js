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
                    const d = new Date(zmogus.gimimoData);
                    let month = "00" + (d.getMonth() + 1);
                    month = month.substring(month.length - 2);
                    let day = "00" + d.getDate();
                    day = day.substring(day.length - 2);
                    zmogus.gimimoData = `${d.getFullYear()}-${month}-${day}`;
                    td.appendChild(document.createTextNode(zmogus.gimimoData));
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
            document.getElementById("vardas").value = "";
            document.getElementById("pavarde").value = "";
            document.getElementById("alga").value = "";
            document.getElementById("gimimoData").value = "";
            if (zmogus) {
                div.appendChild(document.createTextNode("ID:"));
                div.appendChild(document.createTextNode(zmogus.id));
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Vardas:"));
                div.appendChild(document.createTextNode(zmogus.vardas));
                document.getElementById("vardas").value = zmogus.vardas;
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Pavarde:"));
                div.appendChild(document.createTextNode(zmogus.pavarde));
                document.getElementById("pavarde").value = zmogus.pavarde;
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Gimimo data:"));
                if (zmogus.gimimoData) {
                    const d = new Date(zmogus.gimimoData);
                    let month = "00" + (d.getMonth() + 1);
                    month = month.substring(month.length - 2);
                    let day = "00" + d.getDate();
                    day = day.substring(day.length - 2);
                    zmogus.gimimoData = `${d.getFullYear()}-${month}-${day}`;
                    div.appendChild(document.createTextNode(zmogus.gimimoData));
                    document.getElementById("gimimoData").value = zmogus.gimimoData;
                }
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode("Alga:"));
                if (zmogus.alga) {
                    div.appendChild(document.createTextNode(zmogus.alga));
                    document.getElementById("alga").value = zmogus.alga;
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

async function addZmogus() {
    // alert("tipo naujas");
    const vardas = document.getElementById("vardas").value;
    const pavarde = document.getElementById("pavarde").value;
    const gimimoData = document.getElementById("gimimoData").value;
    const alga = parseInt(document.getElementById("alga").value);
    const zmogus = {
        vardas,
        pavarde,
        gimimoData,
        alga
    }
    try {
        const res = await fetch("/json/zmones/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // objektas, kuris bus siunciams - json
            },
            body: JSON.stringify(zmogus) // tai kas siunciama i serveri
        });
        if (res.ok) {
            getZmones();
        } else {
            console.log("Uzklausa is serverio atejo su klaida", res.status);
        }
    }
    catch (err) {
        console.log("Klaida gaunant duomenis is serverio", err);
    }
    console.log(zmogus);
}

async function updateZmogus() {
    alert("tipo update");
    return;
    const vardas = document.getElementById("vardas").value;
    const pavarde = document.getElementById("pavarde").value;
    const alga = parseInt(document.getElementById("alga").value);
    const zmogus = {
        vardas,
        pavarde,
        alga
    }
    try {
        const res = await fetch("/json/zmones/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // objektas, kuris bus siunciams - json
            },
            body: JSON.stringify(zmogus) // tai kas siunciama i serveri
        });
        if (res.ok) {
            getZmones();
        } else {
            console.log("Uzklausa is serverio atejo su klaida", res.status);
        }
    }
    catch (err) {
        console.log("Klaida gaunant duomenis is serverio", err);
    }
    console.log(zmogus);
}




function cleanNode(node) { // funkcija, kad nepridedu vis po nauja lentele paspaudus Get Data
    if (node instanceof Node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
}