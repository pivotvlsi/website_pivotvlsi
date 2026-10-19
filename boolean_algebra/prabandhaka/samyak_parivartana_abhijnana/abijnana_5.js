/**
 * Checks if a given AST node is a leaf (a plain logic term array).
 * In this AST, a leaf node is an array consisting entirely of numbers 
 * (variable states and trailing constant), unlike operator nodes whose 
 * children are other nested arrays.
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
 * Creates a constant node.
 */
function स्थिर_ग्रन्थि_रचयतु(आयामः, मूल्यम्) {
    let ग्रन्थिः = Array(आयामः).fill(2);
    ग्रन्थिः.push(मूल्यम्);
    return ग्रन्थिः;
}

/**
 * Checks if सूत्र२ is the result of applying A.A' = 0 (Contradiction/विरोधः) on सूत्र१.
 * The transformation turns a leaf containing both a variable and its complement (state 3) 
 * inside an AND/NAND term into a constant 0 leaf.
 * 
 * @param {Array} सूत्र१ - The original AST.
 * @param {Array} सूत्र२ - The transformed AST.
 * @returns {boolean} True if सूत्र२ is exactly सूत्र१ with exactly ONE A.A'=0 transformation applied, else false.
 */
function अभिज्ञान_विरोध(सूत्र१, सूत्र२) {
    let प्राप्त_परिवर्तनम् = 0;

    function अन्वेषणम्(ग्रन्थि१, ग्रन्थि२, पितृ_संकारकः) {
        if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
            
            let अन्तिम_सूचकाङ्कः = ग्रन्थि१.length - 1;

            let सर्वसमान_अस्ति = true;
            for (let इ = 0; इ <= अन्तिम_सूचकाङ्कः; इ++) {
                if (ग्रन्थि१[इ] !== ग्रन्थि२[इ]) {
                    सर्वसमान_अस्ति = false;
                    break;
                }
            }

            if (सर्वसमान_अस्ति) {
                return true;
            }

            // If not identical, check if it's a valid A.A'=0 transformation
            // Must be an AND-term (parent is 0 or 2)
            if (पितृ_संकारकः === 0 || पितृ_संकारकः === 2) {
                // Check if any variable is state 3 (both A and A' present)
                let विरोधाभास_अस्ति = false;
                for (let क = 0; क < अन्तिम_सूचकाङ्कः; क++) {
                    if (ग्रन्थि१[क] === 3) {
                        विरोधाभास_अस्ति = true;
                        break;
                    }
                }
                
                if (विरोधाभास_अस्ति) {
                    let स्थिर_ग्रन्थिः = स्थिर_ग्रन्थि_रचयतु(अन्तिम_सूचकाङ्कः, 0);
                    
                    let परिवर्तित_अस्ति = true;
                    for (let इ = 0; इ <= अन्तिम_सूचकाङ्कः; इ++) {
                        if (ग्रन्थि२[इ] !== स्थिर_ग्रन्थिः[इ]) {
                            परिवर्तित_अस्ति = false;
                            break;
                        }
                    }
                    
                    if (परिवर्तित_अस्ति) {
                        प्राप्त_परिवर्तनम्++;
                        return true;
                    }
                }
            }
            
            return false; // Difference that is not A.A'=0
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

        return ग्रन्थि१ === ग्रन्थि२; 
    }

    if (!अन्वेषणम्(सूत्र१, सूत्र२, null)) {
        return false;
    }

    return प्राप्त_परिवर्तनम् === 1;
}

module.exports = {
    अभिज्ञान_विरोध
};
