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
 * Checks if सूत्र२ is the result of applying A + A.B = A (Absorption 1) on सूत्र१.
 * 
 * @param {Array} सूत्र१ - The original AST.
 * @param {Array} सूत्र२ - The transformed AST.
 * @returns {boolean} True if सूत्र२ is exactly सूत्र१ with exactly ONE Absorption transformation applied, else false.
 */
function अभिज्ञान_अवशोषण_१(सूत्र१, सूत्र२) {
    let प्राप्त_परिवर्तनम् = 0;

    function अन्वेषणम्(ग्रन्थि१, ग्रन्थि२, पितृ_संकारकः) {
        if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            return पत्राणि_समानानि(ग्रन्थि१, ग्रन्थि२);
        }

        // Check for Absorption transformation: A + A.B -> A
        // ग्रन्थि१ is an OR node, and it transforms to just a leaf (A) in ग्रन्थि२
        if (Array.isArray(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            if ((ग्रन्थि१[0] === 1 || ग्रन्थि१[0] === 3) && ग्रन्थि१.length === 3) {
                let leafA = ग्रन्थि१[1];
                let andNode = ग्रन्थि१[2];

                // If the order is reversed: [1, [0, leafA, leafB], leafA]
                if (!पत्र_अस्ति(leafA) && पत्र_अस्ति(andNode)) {
                    leafA = ग्रन्थि१[2];
                    andNode = ग्रन्थि१[1];
                }

                if (पत्र_अस्ति(leafA) && Array.isArray(andNode) && (andNode[0] === 0 || andNode[0] === 2) && andNode.length === 3) {
                    let term1 = andNode[1];
                    let term2 = andNode[2];

                    if (पत्र_अस्ति(term1) && पत्र_अस्ति(term2)) {
                        // Check if one of the AND terms is identical to leafA
                        if (पत्राणि_समानानि(term1, leafA) || पत्राणि_समानानि(term2, leafA)) {
                            // And the final transformed node is leafA
                            if (पत्राणि_समानानि(ग्रन्थि२, leafA)) {
                                प्राप्त_परिवर्तनम्++;
                                return true;
                            }
                        }
                    }
                }
            }
        }

        if (Array.isArray(ग्रन्थि१) && Array.isArray(ग्रन्थि२)) {
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
    अभिज्ञान_अवशोषण_१
};
