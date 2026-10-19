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
 * Recursively traverses the AST to find the first occurrence of a '1' inside an AND term (product).
 * 
 * @param {Array} शाखा - The current AST node being evaluated.
 * @param {Array} वर्तमान_मार्ग - The array of indices taken to reach this node (e.g., [1, 2]).
 * @param {number|null} पितृ_संकारक - The operator code of this node's parent (0=AND, 1=OR, 2=NAND, 3=NOR).
 * @returns {Array|null} The distinct path array to the leaf if found, otherwise null.
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग, पितृ_संकारक) {
    // If it is a leaf, check if it matches the logic
    if (पत्र_अस्ति(शाखा)) {
        // Must be an AND-term (parent is 0 or 2)
        if (पितृ_संकारक === 0 || पितृ_संकारक === 2) {
            let अन्तिम_सूचकांक = शाखा.length - 1;
            let अचर_मूल्यम् = शाखा[अन्तिम_सूचकांक];
            
            // Constant flag 1 or 3 means a '1' is present
            if (अचर_मूल्यम् === 1 || अचर_मूल्यम् === 3) {
                return वर्तमान_मार्ग;
            }
        }
        return null; // Not a match
    }

    // If it's an operator node, traverse its children
    let संकारक = शाखा[0];
    for (let इ = 1; इ < शाखा.length; इ++) {
        let उप_मार्ग = [...वर्तमान_मार्ग, इ];
        let परिणाम = पुनरावर्ती_अन्वेषण(शाखा[इ], उप_मार्ग, संकारक);
        if (परिणाम) {
            return परिणाम; // Return the first match found
        }
    }
    
    return null; // No match found in any children
}

/**
 * अन्वेषण_तत्समक_अन् (Find Identity AND rule: A . 1 = A)
 * 
 * This function searches the entire AST tree and returns the FIRST distinct 
 * array index path where a constant 1 is found in an AND term (product).
 * An AND-term is identified when its parent operator is 0 (AND) or 2 (NAND).
 * 
 * @param {Array} पूर्ण_सूत्रम् - The full AST equation array.
 * @returns {Array|null} The distinct path of indices to the first matching node, else null.
 */
function अन्वेषण_तत्समक_अन्(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, [], null);
}

module.exports = {
    अन्वेषण_तत्समक_अन्
};
