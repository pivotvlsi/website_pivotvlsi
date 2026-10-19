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
 * Checks if सूत्र२ is the result of applying A + B.C = (A+B).(A+C) (Distribution 1) on सूत्र१.
 * 
 * @param {Array} सूत्र१ - The original AST.
 * @param {Array} सूत्र२ - The transformed AST.
 * @returns {boolean} True if सूत्र२ is exactly सूत्र१ with exactly ONE Distribution transformation applied, else false.
 */
function अभिज्ञान_वितरण_१(सूत्र१, सूत्र२) {
    let प्राप्त_परिवर्तनम् = 0;

    function अन्वेषणम्(ग्रन्थि१, ग्रन्थि२, पितृ_संकारकः) {
        if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            return पत्राणि_समानानि(ग्रन्थि१, ग्रन्थि२);
        }

        if (Array.isArray(ग्रन्थि१) && Array.isArray(ग्रन्थि२)) {
            // Check for Distributive transformation at this level
            // A + B.C -> (A+B).(A+C)
            // ग्रन्थि१ MUST be an OR node (1 or 3), ग्रन्थि२ MUST be an AND node (0 or 2)
            if ((ग्रन्थि१[0] === 1 || ग्रन्थि१[0] === 3) && (ग्रन्थि२[0] === 0 || ग्रन्थि२[0] === 2)) {
                // For simplicity in this implementation, we check the exact structure:
                // ग्रन्थि१: [1, leafA, [0, leafB, leafC]]
                // ग्रन्थि२: [0, [1, leafA, leafB], [1, leafA, leafC]]
                
                if (ग्रन्थि१.length === 3 && ग्रन्थि२.length === 3) {
                    let leafA = ग्रन्थि१[1];
                    let andNode = ग्रन्थि१[2];
                    
                    // If the order is reversed: [1, [0, leafB, leafC], leafA]
                    if (!पत्र_अस्ति(leafA) && पत्र_अस्ति(andNode)) {
                        leafA = ग्रन्थि१[2];
                        andNode = ग्रन्थि१[1];
                    }

                    if (पत्र_अस्ति(leafA) && Array.isArray(andNode) && (andNode[0] === 0 || andNode[0] === 2) && andNode.length === 3) {
                        let leafB = andNode[1];
                        let leafC = andNode[2];

                        if (पत्र_अस्ति(leafB) && पत्र_अस्ति(leafC)) {
                            // Now check if ग्रन्थि२ matches (A+B).(A+C)
                            let term1 = ग्रन्थि२[1];
                            let term2 = ग्रन्थि२[2];
                            
                            if (Array.isArray(term1) && (term1[0] === 1 || term1[0] === 3) && term1.length === 3 &&
                                Array.isArray(term2) && (term2[0] === 1 || term2[0] === 3) && term2.length === 3) {
                                
                                let check1 = (पत्राणि_समानानि(term1[1], leafA) && पत्राणि_समानानि(term1[2], leafB)) || 
                                             (पत्राणि_समानानि(term1[1], leafB) && पत्राणि_समानानि(term1[2], leafA));
                                             
                                let check2 = (पत्राणि_समानानि(term2[1], leafA) && पत्राणि_समानानि(term2[2], leafC)) || 
                                             (पत्राणि_समानानि(term2[1], leafC) && पत्राणि_समानानि(term2[2], leafA));

                                if (check1 && check2) {
                                    प्राप्त_परिवर्तनम्++;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }

            // Normal recursive check if no transformation at this level
            if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
            if (ग्रन्थि१[0] !== ग्रन्थि२[0]) return false; // operators must match

            for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
                if (!अन्वेषणम्(ग्रन्थि१[इ], ग्रन्थि२[इ], ग्रन्थि१[0])) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    let समान_अस्ति = अन्वेषणम्(सूत्र१, सूत्र२, null);
    return समान_अस्ति && प्राप्त_परिवर्तनम् === 1;
}

module.exports = {
    अभिज्ञान_वितरण_१
};
