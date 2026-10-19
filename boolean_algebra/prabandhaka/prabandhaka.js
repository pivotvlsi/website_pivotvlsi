/**
 * प्रबन्धक (Master Orchestrator)
 * 
 * Unifies and coordinates the three pillars of the Boolean Algebra engine:
 * 1. अन्वेषण (Anveshana) - Pattern matching / Rule discovery in the AST
 * 2. लघुकरण (Laghukarana) - Rule-specific tree reduction / simplification
 * 3. अभिज्ञान (Abhijnana) - Semantic recognition and step verification
 * 
 * Supports both CommonJS (Node.js) and Browser environments.
 */

const isNodeEnv = typeof require !== 'undefined';

// 1. Module mappings for Anveshana (Rule discovery)
const अन्वेषण_मॉड्यूल् = isNodeEnv ? {
    1: require('./anveshana/anveshana_1.js'),
    2: require('./anveshana/anveshana_2.js'),
    3: require('./anveshana/anveshana_3.js'),
    4: require('./anveshana/anveshana_4.js'),
    5: require('./anveshana/anveshana_5.js'),
    6: require('./anveshana/anveshana_6.js'),
    7: require('./anveshana/anveshana_7.js'),
    8: require('./anveshana/anveshana_8.js'),
    9: require('./anveshana/anveshana_9.js'),
    10: require('./anveshana/anveshana_10.js'),
    11: require('./anveshana/anveshana_11.js'),
    12: require('./anveshana/anveshana_12.js'),
    13: require('./anveshana/anveshana_13.js'),
    14: require('./anveshana/anveshana_14.js'),
    15: require('./anveshana/anveshana_15.js'),
    16: require('./anveshana/anveshana_16.js'),
    17: require('./anveshana/anveshana_17.js'),
    18: require('./anveshana/anveshana_18.js'),
    19: require('./anveshana/anveshana_19.js'),
    20: require('./anveshana/anveshana_20.js'),
    21: require('./anveshana/anveshana_21.js'),
    22: require('./anveshana/anveshana_22.js'),
    23: require('./anveshana/anveshana_23.js')
} : {};

// 2. Module mappings for Laghukarana (Rule reduction)
const लघुकरण_मॉड्यूल् = isNodeEnv ? {
    1: require('./laghukarana/laghukarana_1.js'),
    2: require('./laghukarana/laghukarana_2.js'),
    3: require('./laghukarana/laghukarana_3.js'),
    4: require('./laghukarana/laghukarana_4.js'),
    5: require('./laghukarana/laghukarana_5.js'),
    6: require('./laghukarana/laghukarana_6.js'),
    7: require('./laghukarana/laghukarana_7.js'),
    8: require('./laghukarana/laghukarana_8.js'),
    9: require('./laghukarana/laghukarana_9.js'),
    10: require('./laghukarana/laghukarana_10.js'),
    11: require('./laghukarana/laghukarana_11.js'),
    12: require('./laghukarana/laghukarana_12.js'),
    13: require('./laghukarana/laghukarana_13.js'),
    14: require('./laghukarana/laghukarana_14.js'),
    15: require('./laghukarana/laghukarana_15.js'),
    16: require('./laghukarana/laghukarana_16.js'),
    17: require('./laghukarana/laghukarana_17.js'),
    18: require('./laghukarana/laghukarana_18.js'),
    19: require('./laghukarana/laghukarana_19.js'),
    20: require('./laghukarana/laghukarana_20.js'),
    21: require('./laghukarana/laghukarana_21.js'),
    22: require('./laghukarana/laghukarana_22.js'),
    23: require('./laghukarana/laghukarana_23.js')
} : {};

// 3. Module mappings for Abhijnana (Rule recognition / verification)
const अभिज्ञान_मॉड्यूल् = isNodeEnv ? {
    1: require('./samyak_parivartana_abhijnana/abijnana_1.js'),
    2: require('./samyak_parivartana_abhijnana/abijnana_2.js'),
    3: require('./samyak_parivartana_abhijnana/abijnana_3.js'),
    4: require('./samyak_parivartana_abhijnana/abijnana_4.js'),
    5: require('./samyak_parivartana_abhijnana/abijnana_5.js'),
    6: require('./samyak_parivartana_abhijnana/abijnana_6.js'),
    7: require('./samyak_parivartana_abhijnana/abijnana_7.js'),
    8: require('./samyak_parivartana_abhijnana/abijnana_8.js'),
    9: require('./samyak_parivartana_abhijnana/abijnana_9.js'),
    10: require('./samyak_parivartana_abhijnana/abijnana_10.js'),
    11: require('./samyak_parivartana_abhijnana/abijnana_11.js'),
    12: require('./samyak_parivartana_abhijnana/abijnana_12.js'),
    13: require('./samyak_parivartana_abhijnana/abijnana_13.js'),
    14: require('./samyak_parivartana_abhijnana/abijnana_14.js'),
    15: require('./samyak_parivartana_abhijnana/abijnana_15.js'),
    16: require('./samyak_parivartana_abhijnana/abijnana_16.js')
} : {};

/**
 * Metadata table detailing all supported rules, their titles, formal definitions,
 * and the specific function pointers for anveshana, laghukarana, and abhijnana.
 */
const नियम_तालिका = [
    {
        संख्या: 1,
        नाम: "तत्समक_अथवा",
        अंग्रेजी_नाम: "Identity OR",
        समीकरण: "A + 0 = A",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[1] ? अन्वेषण_मॉड्यूल्[1].अन्वेषण_तत्समक_अथवा : (typeof window !== "undefined" ? window.अन्वेषण_तत्समक_अथवा : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[1] ? लघुकरण_मॉड्यूल्[1].लघुकरण_तत्समक_अथवा : (typeof window !== "undefined" ? window.लघुकरण_तत्समक_अथवा : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[1] ? अभिज्ञान_मॉड्यूल्[1].अभिज्ञान_तत्समक_अथवा : (typeof window !== "undefined" ? window.अभिज्ञान_तत्समक_अथवा : null))
    },
    {
        संख्या: 2,
        नाम: "एक_गुण",
        अंग्रेजी_नाम: "One Property",
        समीकरण: "A + 1 = 1",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[2] ? अन्वेषण_मॉड्यूल्[2].अन्वेषण_एक_गुण : (typeof window !== "undefined" ? window.अन्वेषण_एक_गुण : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[2] ? लघुकरण_मॉड्यूल्[2].लघुकरण_एक_गुण : (typeof window !== "undefined" ? window.लघुकरण_एक_गुण : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[2] ? अभिज्ञान_मॉड्यूल्[2].अभिज्ञान_एक_गुण : (typeof window !== "undefined" ? window.अभिज्ञान_एक_गुण : null))
    },
    {
        संख्या: 3,
        नाम: "शून्य_गुण",
        अंग्रेजी_नाम: "Zero Property",
        समीकरण: "A . 0 = 0",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[3] ? अन्वेषण_मॉड्यूल्[3].अन्वेषण_शून्य_गुण : (typeof window !== "undefined" ? window.अन्वेषण_शून्य_गुण : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[3] ? लघुकरण_मॉड्यूल्[3].लघुकरण_शून्य_गुण : (typeof window !== "undefined" ? window.लघुकरण_शून्य_गुण : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[3] ? अभिज्ञान_मॉड्यूल्[3].अभिज्ञान_शून्य_गुण : (typeof window !== "undefined" ? window.अभिज्ञान_शून्य_गुण : null))
    },
    {
        संख्या: 4,
        नाम: "तत्समक_अन्",
        अंग्रेजी_नाम: "Identity AND",
        समीकरण: "A . 1 = A",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[4] ? अन्वेषण_मॉड्यूल्[4].अन्वेषण_तत्समक_अन् : (typeof window !== "undefined" ? window.अन्वेषण_तत्समक_अन् : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[4] ? लघुकरण_मॉड्यूल्[4].लघुकरण_तत्समक_अन् : (typeof window !== "undefined" ? window.लघुकरण_तत्समक_अन् : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[4] ? अभिज्ञान_मॉड्यूल्[4].अभिज्ञान_तत्समक_अन् : (typeof window !== "undefined" ? window.अभिज्ञान_तत्समक_अन् : null))
    },
    {
        संख्या: 5,
        नाम: "विरोध",
        अंग्रेजी_नाम: "Contradiction",
        समीकरण: "A . A' = 0",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[5] ? अन्वेषण_मॉड्यूल्[5].अन्वेषण_विरोधाभास : (typeof window !== "undefined" ? window.अन्वेषण_विरोधाभास : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[5] ? लघुकरण_मॉड्यूल्[5].लघुकरण_विरोध : (typeof window !== "undefined" ? window.लघुकरण_विरोध : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[5] ? अभिज्ञान_मॉड्यूल्[5].अभिज्ञान_विरोध : (typeof window !== "undefined" ? window.अभिज्ञान_विरोध : null))
    },
    {
        संख्या: 6,
        नाम: "सर्वदा_सत्य",
        अंग्रेजी_नाम: "Tautology",
        समीकरण: "A + A' = 1",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[6] ? अन्वेषण_मॉड्यूल्[6].अन्वेषण_सर्वदा_सत्य : (typeof window !== "undefined" ? window.अन्वेषण_सर्वदा_सत्य : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[6] ? लघुकरण_मॉड्यूल्[6].लघुकरण_सर्वदा_सत्य : (typeof window !== "undefined" ? window.लघुकरण_सर्वदा_सत्य : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[6] ? अभिज्ञान_मॉड्यूल्[6].अभिज्ञान_सर्वदा_सत्य : (typeof window !== "undefined" ? window.अभिज्ञान_सर्वदा_सत्य : null))
    },
    {
        संख्या: 7,
        नाम: "वितरण_१",
        अंग्रेजी_नाम: "Distribution 1",
        समीकरण: "A + (B . C) = (A + B) . (A + C)",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[7] ? अन्वेषण_मॉड्यूल्[7].अन्वेषण_वितरण : (typeof window !== "undefined" ? window.अन्वेषण_वितरण : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[7] ? लघुकरण_मॉड्यूल्[7].लघुकरण_वितरण_१ : (typeof window !== "undefined" ? window.लघुकरण_वितरण_१ : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[7] ? अभिज्ञान_मॉड्यूल्[7].अभिज्ञान_वितरण_१ : (typeof window !== "undefined" ? window.अभिज्ञान_वितरण_१ : null))
    },
    {
        संख्या: 8,
        नाम: "वितरण_२",
        अंग्रेजी_नाम: "Distribution 2",
        समीकरण: "A . (B + C) = (A . B) + (A . C)",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[8] ? अन्वेषण_मॉड्यूल्[8].अन्वेषण_वितरण_२ : (typeof window !== "undefined" ? window.अन्वेषण_वितरण_२ : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[8] ? लघुकरण_मॉड्यूल्[8].लघुकरण_वितरण_२ : (typeof window !== "undefined" ? window.लघुकरण_वितरण_२ : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[8] ? अभिज्ञान_मॉड्यूल्[8].अभिज्ञान_वितरण_२ : (typeof window !== "undefined" ? window.अभिज्ञान_वितरण_२ : null))
    },
    {
        संख्या: 9,
        नाम: "अवशोषण_१",
        अंग्रेजी_नाम: "Absorption 1",
        समीकरण: "A + (A . B) = A",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[9] ? अन्वेषण_मॉड्यूल्[9].अन्वेषण_अवशोषण : (typeof window !== "undefined" ? window.अन्वेषण_अवशोषण : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[9] ? लघुकरण_मॉड्यूल्[9].लघुकरण_अवशोषण_१ : (typeof window !== "undefined" ? window.लघुकरण_अवशोषण_१ : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[9] ? अभिज्ञान_मॉड्यूल्[9].अभिज्ञान_अवशोषण_१ : (typeof window !== "undefined" ? window.अभिज्ञान_अवशोषण_१ : null))
    },
    {
        संख्या: 10,
        नाम: "अवशोषण_२",
        अंग्रेजी_नाम: "Absorption 2",
        समीकरण: "A . (A + B) = A",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[10] ? अन्वेषण_मॉड्यूल्[10].अन्वेषण_अवशोषण_२ : (typeof window !== "undefined" ? window.अन्वेषण_अवशोषण_२ : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[10] ? लघुकरण_मॉड्यूल्[10].लघुकरण_अवशोषण_२ : (typeof window !== "undefined" ? window.लघुकरण_अवशोषण_२ : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[10] ? अभिज्ञान_मॉड्यूल्[10].अभिज्ञान_अवशोषण_२ : (typeof window !== "undefined" ? window.अभिज्ञान_अवशोषण_२ : null))
    },
    {
        संख्या: 11,
        नाम: "द्विगुण_निषेध_अथवा",
        अंग्रेजी_नाम: "Double Negation OR",
        समीकरण: "((A + B)')' = A + B",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[11] ? अन्वेषण_मॉड्यूल्[11].अन्वेषण_द्विगुण_निषेध_अथवा : (typeof window !== "undefined" ? window.अन्वेषण_द्विगुण_निषेध_अथवा : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[11] ? लघुकरण_मॉड्यूल्[11].लघुकरण_द्विगुण_निषेध_अथवा : (typeof window !== "undefined" ? window.लघुकरण_द्विगुण_निषेध_अथवा : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[11] ? अभिज्ञान_मॉड्यूल्[11].अभिज्ञान_द्विगुण_निषेध_अथवा : (typeof window !== "undefined" ? window.अभिज्ञान_द्विगुण_निषेध_अथवा : null))
    },
    {
        संख्या: 12,
        नाम: "द्विगुण_निषेध_अन्",
        अंग्रेजी_नाम: "Double Negation AND",
        समीकरण: "((A . B)')' = A . B",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[12] ? अन्वेषण_मॉड्यूल्[12].अन्वेषण_द्विगुण_निषेध_अन् : (typeof window !== "undefined" ? window.अन्वेषण_द्विगुण_निषेध_अन् : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[12] ? लघुकरण_मॉड्यूल्[12].लघुकरण_द्विगुण_निषेध_अन् : (typeof window !== "undefined" ? window.लघुकरण_द्विगुण_निषेध_अन् : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[12] ? अभिज्ञान_मॉड्यूल्[12].अभिज्ञान_द्विगुण_निषेध_अन् : (typeof window !== "undefined" ? window.अभिज्ञान_द्विगुण_निषेध_अन् : null))
    },
    {
        संख्या: 13,
        नाम: "सम्मति",
        अंग्रेजी_नाम: "Consensus Theorem",
        समीकरण: "(A . B) + (A' . C) + (B . C) = (A . B) + (A' . C)",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[13] ? अन्वेषण_मॉड्यूल्[13].अन्वेषण_सम्मति : (typeof window !== "undefined" ? window.अन्वेषण_सम्मति : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[13] ? लघुकरण_मॉड्यूल्[13].लघुकरण_सम्मति : (typeof window !== "undefined" ? window.लघुकरण_सम्मति : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[13] ? अभिज्ञान_मॉड्यूल्[13].अभिज्ञान_सम्मति : (typeof window !== "undefined" ? window.अभिज्ञान_सम्मति : null))
    },
    {
        संख्या: 14,
        नाम: "सम्मति_२",
        अंग्रेजी_नाम: "Consensus Theorem 2",
        समीकरण: "(A + B) . (A' + C) . (B + C) = (A + B) . (A' + C)",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[14] ? अन्वेषण_मॉड्यूल्[14].अन्वेषण_सम्मति_२ : (typeof window !== "undefined" ? window.अन्वेषण_सम्मति_२ : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[14] ? लघुकरण_मॉड्यूल्[14].लघुकरण_सम्मति_२ : (typeof window !== "undefined" ? window.लघुकरण_सम्मति_२ : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[14] ? अभिज्ञान_मॉड्यूल्[14].अभिज्ञान_सम्मति_२ : (typeof window !== "undefined" ? window.अभिज्ञान_सम्मति_२ : null))
    },
    {
        संख्या: 15,
        नाम: "डीमॉर्गन_अथवा",
        अंग्रेजी_नाम: "De Morgan's NOR",
        समीकरण: "(A + B)' = A' . B'",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[15] ? अन्वेषण_मॉड्यूल्[15].अन्वेषण_नोर : (typeof window !== "undefined" ? window.अन्वेषण_नोर : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[15] ? लघुकरण_मॉड्यूल्[15].लघुकरण_डीमॉर्गन_अथवा : (typeof window !== "undefined" ? window.लघुकरण_डीमॉर्गन_अथवा : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[15] ? अभिज्ञान_मॉड्यूल्[15].अभिज्ञान_डीमॉर्गन_अथवा : (typeof window !== "undefined" ? window.अभिज्ञान_डीमॉर्गन_अथवा : null))
    },
    {
        संख्या: 16,
        नाम: "डीमॉर्गन_अन्",
        अंग्रेजी_नाम: "De Morgan's NAND",
        समीकरण: "(A . B)' = A' + B'",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[16] ? अन्वेषण_मॉड्यूल्[16].अन्वेषण_नैण्ड : (typeof window !== "undefined" ? window.अन्वेषण_नैण्ड : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[16] ? लघुकरण_मॉड्यूल्[16].लघुकरण_डीमॉर्गन_अन् : (typeof window !== "undefined" ? window.लघुकरण_डीमॉर्गन_अन् : null)),
        अभिज्ञान: (अभिज्ञान_मॉड्यूल्[16] ? अभिज्ञान_मॉड्यूल्[16].अभिज्ञान_डीमॉर्गन_अन् : (typeof window !== "undefined" ? window.अभिज्ञान_डीमॉर्गन_अन् : null))
    },
    {
        संख्या: 17,
        नाम: "अवशोषण_३",
        अंग्रेजी_नाम: "Advanced Absorption SOP",
        समीकरण: "A + A'.B = A + B",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[17] ? अन्वेषण_मॉड्यूल्[17].अन्वेषण_अवशोषण_३ : (typeof window !== "undefined" ? window.अन्वेषण_अवशोषण_३ : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[17] ? लघुकरण_मॉड्यूल्[17].लघुकरण_अवशोषण_३ : (typeof window !== "undefined" ? window.लघुकरण_अवशोषण_३ : null)),
        अभिज्ञान: null
    },
    {
        संख्या: 18,
        नाम: "अवशोषण_४",
        अंग्रेजी_नाम: "Advanced Absorption POS",
        समीकरण: "A . (A' + B) = A . B",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[18] ? अन्वेषण_मॉड्यूल्[18].अन्वेषण_अवशोषण_४ : (typeof window !== "undefined" ? window.अन्वेषण_अवशोषण_४ : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[18] ? लघुकरण_मॉड्यूल्[18].लघुकरण_अवशोषण_४ : (typeof window !== "undefined" ? window.लघुकरण_अवशोषण_४ : null)),
        अभिज्ञान: null
    },
    {
        संख्या: 19,
        नाम: "सम्मति_३",
        अंग्रेजी_नाम: "Advanced Consensus SOP",
        समीकरण: "A.B + A'.C + B.C.D = A.B + A'.C",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[19] ? अन्वेषण_मॉड्यूल्[19].अन्वेषण_सम्मति_३ : (typeof window !== "undefined" ? window.अन्वेषण_सम्मति_३ : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[19] ? लघुकरण_मॉड्यूल्[19].लघुकरण_सम्मति_३ : (typeof window !== "undefined" ? window.लघुकरण_सम्मति_३ : null)),
        अभिज्ञान: null
    },
    {
        संख्या: 20,
        नाम: "सम्मति_४",
        अंग्रेजी_नाम: "Advanced Consensus POS",
        समीकरण: "(A+B) . (A'+C) . (B+C+D) = (A+B) . (A'+C)",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[20] ? अन्वेषण_मॉड्यूल्[20].अन्वेषण_सम्मति_४ : (typeof window !== "undefined" ? window.अन्वेषण_सम्मति_४ : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[20] ? लघुकरण_मॉड्यूल्[20].लघुकरण_सम्मति_४ : (typeof window !== "undefined" ? window.लघुकरण_सम्मति_४ : null)),
        अभिज्ञान: null
    },
    {
        संख्या: 21,
        नाम: "विस्तरण_अथवा",
        अंग्रेजी_नाम: "Expansion OR",
        समीकरण: "A + (B . C) -> (A + B) . (A + C)",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[21] ? अन्वेषण_मॉड्यूल्[21].अन्वेषण_विस्तरण_अथवा : (typeof window !== "undefined" ? window.अन्वेषण_विस्तरण_अथवा : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[21] ? लघुकरण_मॉड्यूल्[21].लघुकरण_विस्तरण_अथवा : (typeof window !== "undefined" ? window.लघुकरण_विस्तरण_अथवा : null)),
        अभिज्ञान: null
    },
    {
        संख्या: 22,
        नाम: "विस्तरण_अन्",
        अंग्रेजी_नाम: "Expansion AND",
        समीकरण: "A . (B + C) -> (A . B) + (A . C)",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[22] ? अन्वेषण_मॉड्यूल्[22].अन्वेषण_विस्तरण_अन् : (typeof window !== "undefined" ? window.अन्वेषण_विस्तरण_अन् : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[22] ? लघुकरण_मॉड्यूल्[22].लघुकरण_विस्तरण_अन् : (typeof window !== "undefined" ? window.लघुकरण_विस्तरण_अन् : null)),
        अभिज्ञान: null
    },
    {
        संख्या: 23,
        नाम: "वर्गसम_गुण",
        अंग्रेजी_नाम: "Idempotent Law",
        समीकरण: "A + A = A / A . A = A",
        अन्वेषण: (अन्वेषण_मॉड्यूल्[23] ? अन्वेषण_मॉड्यूल्[23].अन्वेषण_वर्गसम_गुण : (typeof window !== "undefined" ? window.अन्वेषण_वर्गसम_गुण : null)),
        लघुकरण: (लघुकरण_मॉड्यूल्[23] ? लघुकरण_मॉड्यूल्[23].लघुकरण_वर्गसम_गुण : (typeof window !== "undefined" ? window.लघुकरण_वर्गसम_गुण : null)),
        अभिज्ञान: null
    }
];

/**
 * Finds all rules applicable to a given AST.
 * 
 * @param {Array} ast - AST to inspect
 * @returns {Array<Object>} List of applicable rules with their found paths
 */
function अन्वेषण_सर्व(ast) {
    let प्रयोज्य_नियमाः = [];
    for (let नियम of नियम_तालिका) {
        if (typeof नियम.अन्वेषण === 'function') {
            let स्थानम् = नियम.अन्वेषण(ast);
            if (स्थानम् !== null) {
                प्रयोज्य_नियमाः.push({
                    संख्या: नियम.संख्या,
                    नाम: नियम.नाम,
                    अंग्रेजी_नाम: नियम.अंग्रेजी_नाम,
                    समीकरण: नियम.समीकरण,
                    स्थानम्: स्थानम्
                });
            }
        }
    }
    return प्रयोज्य_नियमाः;
}

/**
 * Applies a specific rule reduction to an AST.
 * 
 * @param {Array} ast - Original AST
 * @param {number} नियम_संख्या - Rule number (1-23)
 * @param {Array|null} स्थानम् - Pre-computed path (optional; will find if omitted)
 * @returns {Array} The simplified AST
 */
function लघुकरण_प्रयुञ्जीत(ast, नियम_संख्या, स्थानम् = null) {
    let नियम = नियम_तालिका.find(item => item.संख्या === नियम_संख्या);
    if (!नियम || typeof नियम.लघुकरण !== 'function') {
        throw new Error(`नियमः ${नियम_संख्या} न लब्धः अथवा लघुकरणं नास्ति।`);
    }

    let मार्ग = स्थानम्;
    if (मार्ग === null && typeof नियम.अन्वेषण === 'function') {
        मार्ग = नियम.अन्वेषण(ast);
    }

    if (मार्ग === null) {
        return ast; // Rule does not apply
    }

    return नियम.लघुकरण(ast, मार्ग);
}

/**
 * Recognizes and verifies which rule was applied between ast1 and ast2.
 * 
 * @param {Array} ast1 - The previous AST
 * @param {Array} ast2 - The transformed AST
 * @param {number|null} नियम_संख्या - Specific rule number to check (optional)
 * @returns {Object|null} The recognized rule info, or null if no rule recognized
 */
function अभिज्ञान_परीक्षणम्(ast1, ast2, नियम_संख्या = null) {
    if (नियम_संख्या !== null) {
        let नियम = नियम_तालिका.find(item => item.संख्या === नियम_संख्या);
        if (!नियम || typeof नियम.अभिज्ञान !== 'function') {
            return null;
        }
        let सत्यम् = नियम.अभिज्ञान(ast1, ast2);
        return सत्यम् ? { संख्या: नियम.संख्या, नाम: नियम.नाम, समीकरण: नियम.समीकरण } : null;
    }

    // Try all available abhijnana rules
    for (let नियम of नियम_तालिका) {
        if (typeof नियम.अभिज्ञान === 'function') {
            try {
                if (नियम.अभिज्ञान(ast1, ast2)) {
                    return {
                        संख्या: नियम.संख्या,
                        नाम: नियम.नाम,
                        अंग्रेजी_नाम: नियम.अंग्रेजी_नाम,
                        समीकरण: नियम.समीकरण
                    };
                }
            } catch (err) {
                // Ignore rule mismatch exceptions
            }
        }
    }

    return null;
}

/**
 * Executes a single coordinated step:
 * Finds an applicable rule, reduces the AST with laghukarana,
 * and validates the transition with abhijnana if available.
 * 
 * @param {Array} ast - Current AST
 * @param {Object} विकल्प - Configuration options (e.g. format: 'SOP' | 'POS')
 * @returns {Object|null} Step outcome with { ast, नियम, स्थानम्, अभिज्ञान_सत्यापितम् }
 */
function पद_चालनम्(ast, विकल्प = { प्रारूप: "SOP" }) {
    for (let नियम of नियम_तालिका) {
        // Respect SOP / POS format restrictions matching pradhana_laghukaraka
        if (नियम.संख्या === 7 || नियम.संख्या === 8) continue;
        if (विकल्प.प्रारूप === "SOP" && नियम.संख्या === 21) continue;
        if (विकल्प.प्रारूप === "POS" && नियम.संख्या === 22) continue;

        if (typeof नियम.अन्वेषण === 'function' && typeof नियम.लघुकरण === 'function') {
            let स्थानम् = नियम.अन्वेषण(ast);
            if (स्थानम् !== null) {
                let नव_ast = नियम.लघुकरण(ast, स्थानम्);
                let सत्यापितम् = null;

                if (typeof नियम.अभिज्ञान === 'function') {
                    try {
                        सत्यापितम् = नियम.अभिज्ञान(ast, नव_ast);
                    } catch (e) {
                        सत्यापितम् = false;
                    }
                }

                return {
                    पूर्व_ast: ast,
                    नव_ast: नव_ast,
                    नियम: {
                        संख्या: नियम.संख्या,
                        नाम: नियम.नाम,
                        अंग्रेजी_नाम: नियम.अंग्रेजी_नाम,
                        समीकरण: नियम.समीकरण
                    },
                    स्थानम्: स्थानम्,
                    अभिज्ञान_सत्यापितम्: सत्यापितम्
                };
            }
        }
    }

    return null; // Irreducible
}

/**
 * Generates a random boolean equation via AST synthesis.
 * 
 * @param {Object} विकल्प - Configuration options
 * @param {string} विकल्प.प्रारूप - "SOP", "POS", or "ANY"
 * @param {number} [विकल्प.चरसंख्या] - Variable count (default 4 to 6)
 * @param {Array<string>} [विकल्प.चरसरणी] - Variable array (e.g. ['A', 'B', 'C', 'D'])
 * @param {number} [विकल्प.पदसंख्या] - Number of terms (default 3 to 6)
 * @returns {Object} { समीकरणम्, ast, चरसरणी, चरसंख्या, प्रारूप }
 */
function समीकरण_जननम्(विकल्प = {}) {
    let प्रारूप = (विकल्प.प्रारूप || "SOP").toUpperCase();
    let प्रकार = null;
    if (प्रारूप === "SOP") प्रकार = "SOP";
    else if (प्रारूप === "POS") प्रकार = "POS";
    else प्रकार = null; // "ANY" - mixed form

    let चरसंख्या = विकल्प.चरसंख्या || (Math.floor(Math.random() * 3) + 4);
    let चरसरणी = विकल्प.चरसरणी;
    if (!चरसरणी || चरसरणी.length !== चरसंख्या) {
        let मूल_वर्णाः = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        चरसरणी = मूल_वर्णाः.slice(0, चरसंख्या);
    }

    let पदसंख्या = विकल्प.पदसंख्या || (Math.floor(Math.random() * 4) + 3);

    // Get yadrucchika_soochi generator function
    let निर्माण_फलनम् = null;
    let सूत्रम्_फलनम् = null;

    if (typeof require !== 'undefined') {
        try {
            const y = require('./random_boolean_generator/yadrucchika_soochi.js');
            निर्माण_फलनम् = y.यादृच्छिक_सूचि_निर्माण;
            सूत्रम्_फलनम् = y.सूचितः_सूत्रम्;
        } catch (e) {}
    }
    if (!निर्माण_फलनम् && typeof window !== 'undefined') {
        निर्माण_फलनम् = window.यादृच्छिक_सूचि_निर्माण;
        सूत्रम्_फलनम् = window.सूचितः_सूत्रम्;
    }

    let ast = null;
    let समीकरणम् = "";

    if (typeof निर्माण_फलनम् === 'function') {
        ast = निर्माण_फलनम्(चरसंख्या, 0, 1, प्रकार, पदसंख्या);
        if (typeof सूत्रम्_फलनम् === 'function') {
            समीकरणम् = सूत्रम्_फलनम्(ast, चरसरणी);
        }
    }

    // Fallback if needed using सारणीतः_सूत्रम्
    if (!समीकरणम् && typeof window !== 'undefined' && typeof window.सारणीतः_सूत्रम् === 'function' && ast) {
        let code = (प्रकार === "POS") ? 0 : 1;
        समीकरणम् = window.सारणीतः_सूत्रम्(ast, चरसरणी, code);
    }

    return {
        समीकरणम्: समीकरणम्,
        ast: ast,
        चरसरणी: चरसरणी,
        चरसंख्या: चरसंख्या,
        प्रारूप: प्रारूप
    };
}

const प्रबन्धक = {
    अन्वेषण_मॉड्यूल्,
    लघुकरण_मॉड्यूल्,
    अभिज्ञान_मॉड्यूल्,
    नियम_तालिका,
    अन्वेषण_सर्व,
    लघुकरण_प्रयुञ्जीत,
    अभिज्ञान_परीक्षणम्,
    पद_चालनम्,
    समीकरण_जननम्
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = प्रबन्धक;
}
if (typeof window !== 'undefined') {
    window.प्रबन्धक = प्रबन्धक;
}
