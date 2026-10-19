const { सूत्र_विभाजन } = require('../satyata_saarani_prarambha/sootra_vibhajana.js');
const { सत्यता_सारणी_प्रारंभ } = require('../satyata_saarani_prarambha/satyata_saarani_prarambha.js');
const { अन्वेषण_विस्तरण_अन् } = require('../anveshana/anveshana_22.js');
const { लघुकरण_विस्तरण_अन् } = require('../laghukarana/laghukarana_22.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let equation2 = "((A'.B.C'.D'.F)+(A'.B.D.E'.G)+(B'.C'.F')+(A.C'.D.G')+(A.B'.C.F')+(D.E')+(A.B.C.D'.F'.G')+(A'.C.D.E'.F'.G')+(C'.G')+(B'.C.F')+(B.C'.D.F)+(A'.G'))";

let संरूपित_सूत्रम् = सूत्र_विभाजन(equation2);
let सूत्र_वृक्षः = सत्यता_सारणी_प्रारंभ(संरूपित_सूत्रम्);
let वर्णाः = equation2.toUpperCase().match(/[A-Z]/g);
let चरसूची = वर्णाः ? Array.from(new Set(वर्णाः)).sort() : [];

console.log("Initial:", सूचितः_सूत्रम्(सूत्र_वृक्षः, चरसूची));

let path = अन्वेषण_विस्तरण_अन्(सूत्र_वृक्षः);
console.log("Path found:", path);

if (path) {
    let res = लघुकरण_विस्तरण_अन्(सूत्र_वृक्षः, path);
    console.log("After Laghukarana:", सूचितः_सूत्रम्(res, चरसूची));
}
