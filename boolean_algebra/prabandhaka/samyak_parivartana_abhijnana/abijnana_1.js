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
 * Checks if सूत्र२ is the result of applying A+0 (Identity OR) transformation on सूत्र१.
 * The transformation turns a constant 0 in an OR term to no constant.
 * Specifically, the last element of the leaf changes:
 * 0 -> 2
 * 3 -> 1
 * 
 * @param {Array} सूत्र१ - The original AST.
 * @param {Array} सूत्र२ - The transformed AST.
 * @returns {boolean} True if सूत्र२ is exactly सूत्र१ with A+0 transformation(s) applied, else false.
 */
function अभिज्ञान_तत्समक_अथवा(सूत्र१, सूत्र२) {
    let प्राप्त_परिवर्तनम् = 0;

    function अन्वेषणम्(ग्रन्थि१, ग्रन्थि२, पितृ_संकारकः) {
        if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
            
            let अन्तिम_सूचकाङ्कः = ग्रन्थि१.length - 1;

            // Check if all variable states are identical
            for (let इ = 0; इ < अन्तिम_सूचकाङ्कः; इ++) {
                if (ग्रन्थि१[इ] !== ग्रन्थि२[इ]) return false;
            }

            // Check the constant at the end of the leaf
            if (ग्रन्थि१[अन्तिम_सूचकाङ्कः] !== ग्रन्थि२[अन्तिम_सूचकाङ्कः]) {
                // Must be an OR-term (parent is 1 or 3)
                if (पितृ_संकारकः === 1 || पितृ_संकारकः === 3) {
                    if ((ग्रन्थि१[अन्तिम_सूचकाङ्कः] === 0 && ग्रन्थि२[अन्तिम_सूचकाङ्कः] === 2) || 
                        (ग्रन्थि१[अन्तिम_सूचकाङ्कः] === 3 && ग्रन्थि२[अन्तिम_सूचकाङ्कः] === 1)) {
                        प्राप्त_परिवर्तनम्++;
                        return true;
                    }
                }
                return false; // Difference that is not A+0
            }
            return true;
        }

        if (Array.isArray(ग्रन्थि१) && Array.isArray(ग्रन्थि२)) {
            // Check if ग्रन्थि१ has exactly one more child than ग्रन्थि२ (a 0 constant was removed)
            if (ग्रन्थि१.length === ग्रन्थि२.length + 1 && ग्रन्थि१[0] === ग्रन्थि२[0]) {
                let संकारकः = ग्रन्थि१[0];
                if (संकारकः === 1 || संकारकः === 3) {
                    for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
                        let शिशुः = ग्रन्थि१[इ];
                        if (पत्र_अस्ति(शिशुः)) {
                            let दीर्घता = शिशुः.length - 1;
                            let शून्य_अस्ति = true;
                            for (let क = 0; क < दीर्घता; क++) {
                                if (शिशुः[क] !== 2) शून्य_अस्ति = false;
                            }
                            if (शून्य_अस्ति && (शिशुः[दीर्घता] === 0 || शिशुः[दीर्घता] === 3)) {
                                let समान_अस्ति = true;
                                let ग्रन्थि२_सूचकाङ्कः = 1;
                                for (let ज = 1; ज < ग्रन्थि१.length; ज++) {
                                    if (ज === इ) continue;
                                    if (JSON.stringify(ग्रन्थि१[ज]) !== JSON.stringify(ग्रन्थि२[ग्रन्थि२_सूचकाङ्कः])) {
                                        समान_अस्ति = false;
                                        break;
                                    }
                                    ग्रन्थि२_सूचकाङ्कः++;
                                }
                                if (समान_अस्ति) {
                                    प्राप्त_परिवर्तनम्++;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }

            if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
            if (ग्रन्थि१[0] !== ग्रन्थि२[0]) return false; // operators must match

            for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
                if (!अन्वेषणम्(ग्रन्थि१[इ], ग्रन्थि२[इ], ग्रन्थि१[0])) {
                    return false;
                }
            }
            return true;
        }

        return ग्रन्थि१ === ग्रन्थि२; // For primitives if any exist outside leaves
    }

    if (!अन्वेषणम्(सूत्र१, सूत्र२, null)) {
        return false;
    }

    return प्राप्त_परिवर्तनम् === 1;
}

module.exports = {
    अभिज्ञान_तत्समक_अथवा
};
