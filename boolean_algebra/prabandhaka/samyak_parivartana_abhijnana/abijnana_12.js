/**
 * Checks if a given AST node is a leaf (a plain logic term array).
 * 
 * @param {Array} शाखा - The AST node to check.
 * @returns {boolean} True if it is a leaf node, false otherwise.
 */
function पत्र_अस्ति(शाखा) {
    if (!Array.isArray(शाखा)) return false;
    for (let इ = 0; इ < शाखा.length; इ++) {
        if (typeof शाखा[इ] !== 'number') return false;
    }
    return true;
}

/**
 * Checks if two leaves are exactly identical.
 */
function पत्राणि_समानानि(पत्र१, पत्र२) {
    if (!पत्र_अस्ति(पत्र१) || !पत्र_अस्ति(पत्र२)) return false;
    if (पत्र१.length !== पत्र२.length) return false;
    for (let इ = 0; इ < पत्र१.length; इ++) {
        if (पत्र१[इ] !== पत्र२[इ]) return false;
    }
    return true;
}

/**
 * Checks if two nodes are identical recursively.
 */
function ग्रन्थयः_समानाः(ग्रन्थि१, ग्रन्थि२) {
    if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
        return पत्राणि_समानानि(ग्रन्थि१, ग्रन्थि२);
    }
    if (Array.isArray(ग्रन्थि१) && Array.isArray(ग्रन्थि२)) {
        if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
        if (ग्रन्थि१[0] !== ग्रन्थि२[0]) return false;
        for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
            if (!ग्रन्थयः_समानाः(ग्रन्थि१[इ], ग्रन्थि२[इ])) return false;
        }
        return true;
    }
    return false;
}

/**
 * Checks if सूत्र२ is the result of applying ((A.B)')' = A.B (Double Negation of AND-term) on सूत्र१.
 * 
 * @param {Array} सूत्र१ - The original AST.
 * @param {Array} सूत्र२ - The transformed AST.
 * @returns {boolean} True if सूत्र२ is exactly सूत्र१ with exactly ONE Double Negation applied, else false.
 */
function अभिज्ञान_द्विगुण_निषेध_अन्(सूत्र१, सूत्र२) {
    let प्राप्त_परिवर्तनम् = 0;

    function अन्वेषणम्(ग्रन्थि१, ग्रन्थि२) {
        if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            return पत्राणि_समानानि(ग्रन्थि१, ग्रन्थि२);
        }

        if (Array.isArray(ग्रन्थि१)) {
            let संकारक१ = ग्रन्थि१[0];

            // Check if it's a unary NOT node (2 or 3 with 1 child)
            if ((संकारक१ === 2 || संकारक१ === 3) && ग्रन्थि१.length === 2) {
                let शिशु = ग्रन्थि१[1];

                if (!पत्र_अस्ति(शिशु) && Array.isArray(शिशु)) {
                    // Case 1: Child is a NAND node ('2') -> implicitly ((A.B...)')'
                    if (शिशु[0] === 2) {
                        // The transformed node (ग्रन्थि२) should be an AND node ('0' or '2') with the same children
                        // Typically it reduces to an AND node ('0')
                        if (Array.isArray(ग्रन्थि२) && (ग्रन्थि२[0] === 0 || ग्रन्थि२[0] === 2)) {
                            if (ग्रन्थि२[0] === 0 && शिशु.length === ग्रन्थि२.length) {
                                let match = true;
                                for (let क = 1; क < शिशु.length; क++) {
                                    if (!ग्रन्थयः_समानाः(शिशु[क], ग्रन्थि२[क])) {
                                        match = false;
                                        break;
                                    }
                                }
                                if (match) {
                                    प्राप्त_परिवर्तनम्++;
                                    return true;
                                }
                            }
                        }
                    }
                    
                    // Case 2: Child is another unary negation wrapped around an AND node
                    if ((शिशु[0] === 2 || शिशु[0] === 3) && शिशु.length === 2) {
                        let पौत्र = शिशु[1];
                        if (!पत्र_अस्ति(पौत्र) && Array.isArray(पौत्र) && पौत्र[0] === 0) {
                            // The transformed node should be exactly the पौत्र (the AND node)
                            if (ग्रन्थयः_समानाः(पौत्र, ग्रन्थि२)) {
                                प्राप्त_परिवर्तनम्++;
                                return true;
                            }
                        }
                    }
                }
            }

            // Normal recursive check if no transformation at this level
            if (Array.isArray(ग्रन्थि२)) {
                if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
                if (ग्रन्थि१[0] !== ग्रन्थि२[0]) return false; // operators must match

                for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
                    if (!अन्वेषणम्(ग्रन्थि१[इ], ग्रन्थि२[इ])) {
                        return false;
                    }
                }
                return true;
            }
        }

        return false;
    }

    let समान_अस्ति = अन्वेषणम्(सूत्र१, सूत्र२);
    return समान_अस्ति && प्राप्त_परिवर्तनम् === 1;
}

module.exports = {
    अभिज्ञान_द्विगुण_निषेध_अन्
};
