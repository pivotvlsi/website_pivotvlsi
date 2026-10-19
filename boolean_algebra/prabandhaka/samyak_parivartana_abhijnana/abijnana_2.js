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
function createConstantNode(dimension, value) {
    let node = Array(dimension).fill(2);
    node.push(value);
    return node;
}

/**
 * Checks if सूत्र२ is the result of applying A+1 = 1 (One Property) on सूत्र१.
 * The transformation turns an OR term containing a 1 into just a constant 1.
 * 
 * @param {Array} सूत्र१ - The original AST.
 * @param {Array} सूत्र२ - The transformed AST.
 * @returns {boolean} True if सूत्र२ is exactly सूत्र१ with exactly ONE A+1 transformation applied, else false.
 */
function अभिज्ञान_एक_गुण(सूत्र१, सूत्र२) {
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

            // If not identical, check if it's a valid A+1 transformation
            // Must be an OR-term (parent is 1 or 3) and ग्रन्थि१ must end with 1 or 3
            if ((पितृ_संकारकः === 1 || पितृ_संकारकः === 3) && (ग्रन्थि१[अन्तिम_सूचकाङ्कः] === 1 || ग्रन्थि१[अन्तिम_सूचकाङ्कः] === 3)) {
                let स्थिर_ग्रन्थिः = createConstantNode(अन्तिम_सूचकाङ्कः, 1);
                
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
            
            return false; // Difference that is not A+1
        }

        // Check if an operator node collapsed into a constant leaf
        if (!पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            let संकारकः = ग्रन्थि१[0];
            if (संकारकः === 1 || संकारकः === 3) { // OR or NOR
                let एक_अस्ति = false;
                let आयामः = 0;
                for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
                    let शिशुः = ग्रन्थि१[इ];
                    if (पत्र_अस्ति(शिशुः)) {
                        आयामः = शिशुः.length - 1;
                        if (शिशुः[आयामः] === 1 || शिशुः[आयामः] === 3) {
                            एक_अस्ति = true;
                        }
                    }
                }
                
                if (एक_अस्ति) {
                    let अपेक्षित_स्थिरः = (संकारकः === 1) ? 1 : 0; // OR -> 1, NOR -> 0
                    let अपेक्षित_ग्रन्थिः = createConstantNode(आयामः, अपेक्षित_स्थिरः);
                    
                    let समान_अस्ति = true;
                    if (ग्रन्थि२.length !== अपेक्षित_ग्रन्थिः.length) समान_अस्ति = false;
                    else {
                        for (let इ = 0; इ < अपेक्षित_ग्रन्थिः.length; इ++) {
                            if (ग्रन्थि२[इ] !== अपेक्षित_ग्रन्थिः[इ]) {
                                समान_अस्ति = false;
                                break;
                            }
                        }
                    }
                    
                    if (समान_अस्ति) {
                        प्राप्त_परिवर्तनम्++;
                        return true;
                    }
                }
            }
            return false;
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
    अभिज्ञान_एक_गुण
};
