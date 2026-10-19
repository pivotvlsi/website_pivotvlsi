const { सूत्र_विभाजन } = require('../../satyata_saarani_prarambha/sootra_vibhajana.js');
const { सत्यता_सारणी_प्रारंभ } = require('../../satyata_saarani_prarambha/satyata_saarani_prarambha.js');
const { सूचितः_सूत्रम् } = require('../../random_boolean_generator/yadrucchika_soochi.js');

// Load all modules and map them to logical rules
const नियम_सूचि = [
    { नियमः: 1, अन्वेषण: require('../anveshana/anveshana_1.js'), लघुकरण: require('../laghukarana/laghukarana_1.js') },
    { नियमः: 2, अन्वेषण: require('../anveshana/anveshana_2.js'), लघुकरण: require('../laghukarana/laghukarana_2.js') },
    { नियमः: 3, अन्वेषण: require('../anveshana/anveshana_3.js'), लघुकरण: require('../laghukarana/laghukarana_3.js') },
    { नियमः: 4, अन्वेषण: require('../anveshana/anveshana_4.js'), लघुकरण: require('../laghukarana/laghukarana_4.js') },
    { नियमः: 5, अन्वेषण: require('../anveshana/anveshana_5.js'), लघुकरण: require('../laghukarana/laghukarana_5.js') },
    { नियमः: 6, अन्वेषण: require('../anveshana/anveshana_6.js'), लघुकरण: require('../laghukarana/laghukarana_6.js') },
    { नियमः: 7, अन्वेषण: require('../anveshana/anveshana_7.js'), लघुकरण: require('../laghukarana/laghukarana_7.js') },
    { नियमः: 8, अन्वेषण: require('../anveshana/anveshana_8.js'), लघुकरण: require('../laghukarana/laghukarana_8.js') },
    { नियमः: 9, अन्वेषण: require('../anveshana/anveshana_9.js'), लघुकरण: require('../laghukarana/laghukarana_9.js') },
    { नियमः: 10, अन्वेषण: require('../anveshana/anveshana_10.js'), लघुकरण: require('../laghukarana/laghukarana_10.js') },
    { नियमः: 11, अन्वेषण: require('../anveshana/anveshana_11.js'), लघुकरण: require('../laghukarana/laghukarana_11.js') },
    { नियमः: 12, अन्वेषण: require('../anveshana/anveshana_12.js'), लघुकरण: require('../laghukarana/laghukarana_12.js') },
    { नियमः: 13, अन्वेषण: require('../anveshana/anveshana_13.js'), लघुकरण: require('../laghukarana/laghukarana_13.js') },
    { नियमः: 14, अन्वेषण: require('../anveshana/anveshana_14.js'), लघुकरण: require('../laghukarana/laghukarana_14.js') },
    { नियमः: 15, अन्वेषण: require('../anveshana/anveshana_15.js'), लघुकरण: require('../laghukarana/laghukarana_15.js') },
    { नियमः: 16, अन्वेषण: require('../anveshana/anveshana_16.js'), लघुकरण: require('../laghukarana/laghukarana_16.js') },
    { नियमः: 17, अन्वेषण: require('../anveshana/anveshana_17.js'), लघुकरण: require('../laghukarana/laghukarana_17.js') },
    { नियमः: 18, अन्वेषण: require('../anveshana/anveshana_18.js'), लघुकरण: require('../laghukarana/laghukarana_18.js') },
    { नियमः: 19, अन्वेषण: require('../anveshana/anveshana_19.js'), लघुकरण: require('../laghukarana/laghukarana_19.js') },
    { नियमः: 20, अन्वेषण: require('../anveshana/anveshana_20.js'), लघुकरण: require('../laghukarana/laghukarana_20.js') },
    { नियमः: 21, अन्वेषण: require('../anveshana/anveshana_21.js'), लघुकरण: require('../laghukarana/laghukarana_21.js') },
    { नियमः: 22, अन्वेषण: require('../anveshana/anveshana_22.js'), लघुकरण: require('../laghukarana/laghukarana_22.js') },
    { नियमः: 23, अन्वेषण: require('../anveshana/anveshana_23.js'), लघुकरण: require('../laghukarana/laghukarana_23.js') }
];

/**
 * प्रधान_लघुकारक (Master Optimizer)
 * 
 * Takes a raw boolean algebra string, converts it to a standard AST, 
 * and runs a continuous optimization loop using modules 1-22.
 * 
 * @param {string} मूल_सूत्रम् - The input boolean string (e.g. "(A+B).C'")
 * @param {string} प्रारूप - Target format: "SOP" or "POS" (default is "SOP")
 * @returns {Array} The fully simplified AST representation.
 */
function प्रधान_लघुकारक(मूल_सूत्रम्, प्रारूप = "SOP") {
    let संरूपित_सूत्रम् = सूत्र_विभाजन(मूल_सूत्रम्);
    let सूत्र_वृक्षः = सत्यता_सारणी_प्रारंभ(संरूपित_सूत्रम्);
    
    let वर्णाः = मूल_सूत्रम्.toUpperCase().match(/[A-Z]/g);
    let चरसूची = वर्णाः ? Array.from(new Set(वर्णाः)).sort() : [];
    
    console.log(`\n======================================================`);
    console.log(`प्रधान_लघुकारक (Master Optimizer)`);
    console.log(`======================================================`);
    console.log(`मूल_सूत्रम् (Original) : ${मूल_सूत्रम्}`);
    console.log(`प्रारंभिक (Initial)    : ${सूचितः_सूत्रम्(सूत्र_वृक्षः, चरसूची)}`);
    console.log(`------------------------------------------------------`);

    // Filter rules based on target format to prevent infinite loops from antagonistic expansions
    let सक्रिय_नियम_सूचि = नियम_सूचि.filter(नियम_वस्तु => {
        if (नियम_वस्तु.नियमः === 7 || नियम_वस्तु.नियमः === 8) return false; // Disable original rules 7 and 8 as they have an infinite loop bug on n-ary nodes
        if (प्रारूप === "SOP" && नियम_वस्तु.नियमः === 21) return false; // Disable OR distribution A+(B.C)
        if (प्रारूप === "POS" && नियम_वस्तु.नियमः === 22) return false; // Disable AND distribution A.(B+C)
        return true;
    });

    let परिवर्तनम्_अभवत् = true;
    let चक्रम् = 1;
    
    while (परिवर्तनम्_अभवत्) {
        परिवर्तनम्_अभवत् = false;
        
        for (let नियम_वस्तु of सक्रिय_नियम_सूचि) {
            let अन्वेषण_कार्यम् = Object.values(नियम_वस्तु.अन्वेषण)[0];
            let लघुकरण_कार्यम् = Object.values(नियम_वस्तु.लघुकरण)[0];
            
            let स्थानम् = अन्वेषण_कार्यम्(सूत्र_वृक्षः);
            
            if (स्थानम् !== null) {
                सूत्र_वृक्षः = लघुकरण_कार्यम्(सूत्र_वृक्षः, स्थानम्);
                परिवर्तनम्_अभवत् = true;
                
                let नियम_नाम = Object.keys(नियम_वस्तु.लघुकरण)[0];
                console.log(`[चक्रम् ${चक्रम्}] नियमः ${नियम_वस्तु.नियमः} प्रयुक्तः (${नियम_नाम})`);
                console.log(`वर्तमान_सूत्रम्      : ${सूचितः_सूत्रम्(सूत्र_वृक्षः, चरसूची)}`);
                if (चक्रम् === 7) { console.log("AST at cycle 7:"); console.dir(सूत्र_वृक्षः, {depth: null}); }
                चक्रम्++;
                break; // Restart loop from rule 1 after modification
            }
        }
        
        if (चक्रम् > 100) {
            console.log(`\n⚠️  Maximum steps (100) reached. Stopping simplification to prevent infinite loops.`);
            break;
        }
    }
    
    console.log(`------------------------------------------------------`);
    console.log(`अन्तिम_सूत्रम् (Final)  : ${सूचितः_सूत्रम्(सूत्र_वृक्षः, चरसूची)}`);
    console.log(`======================================================\n`);
    
    return सूत्र_वृक्षः;
}

// Example usage to test the AST conversion
if (require.main === module) {
    let निवेशः = "A.A' + B.1 + C.C + (D+D')";
    प्रधान_लघुकारक(निवेशः, "SOP");
}

module.exports = {
    प्रधान_लघुकारक
};
