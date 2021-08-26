async function getZmones() {
    // alert("Gaunu duomenis is serverio")
    try {
        const res = await fetch("/json/zmones") // gaunami duomenys is /json/zmones ir grazina promisa
        if (res.ok) {
            const data = await res.json();
            console.log(data); // console atspausdinama sarasas duomenu
        } else {
            console.log("Uzklausa is serverio atejo su klaida", res.status);
        }
    }
    catch (err) {
        console.log("Kalida gaunant duomenis is serverio", err);
    }
}