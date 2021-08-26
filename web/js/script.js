async function getZmones() {
    // alert("Gaunu duomenis is serverio")
    try {
        const res = await fetch("/json/zmones") // gaunami duomenys is /json/zmones ir grazina promisa
        if (res.ok) {
            const data = await res.json();
            // console.log(data); // console atspausdinama sarasas duomenu
            const div = document.getElementById("zmones"); // ieskomas elementas html pagal id
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
                td.appendChild(document.createTextNode(zmogus.gimimoData));
                tr.appendChild(td);
                td = document.createElement("td");
                td.appendChild(document.createTextNode(zmogus.alga));
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