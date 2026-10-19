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
 * Recursively traverses the AST to find the first occurrence of Distributive AND expansion structure.
 * Specifically: an AND node (0 or 2) that contains >1 child, where at least one child is an OR node (1 or 3).
 * This matches A.(B+C) or (A+B).(C+D) which can be expanded.
 * 
 * @param {Array} शाखा - The current AST node being evaluated.
 * @param {Array} वर्तमान_मार्ग - The array of indices taken to reach this node.
 * @returns {Array|null} The path array to the AND node if found, otherwise null.
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    if (संकारक === 0 || संकारक === 2) {
        // Must have at least two children to perform distribution
        if (शाखा.length > 2) {
            let has_or_child = false;
            
            for (let इ = 1; इ < शाखा.length; इ++) {
                let शिशु = शाखा[इ];
                if (!पत्र_अस्ति(शिशु) && Array.isArray(शिशु)) {
                    if (शिशु[0] === 1 || शिशु[0] === 3) {
                        has_or_child = true;
                        break;
                    }
                }
            }
            
            if (has_or_child) {
                return वर्तमान_मार्ग;
            }
        }
    }

    // If it's an operator node, traverse its children
    for (let इ = 1; इ < शाखा.length; इ++) {
        let उप_मार्ग = [...वर्तमान_मार्ग, इ];
        let परिणाम = पुनरावर्ती_अन्वेषण(शाखा[इ], उप_मार्ग);
        if (परिणाम) {
            return परिणाम; 
        }
    }
    
    return null;
}

/**
 * अन्वेषण_विस्तरण_अन् (Find Distributive AND expansion: A.(B+C) -> A.B + A.C)
 * 
 * This function searches the entire AST tree and returns the FIRST distinct 
 * array index path where an AND term contains an OR node as a child alongside other terms.
 * 
 * @param {Array} पूर्ण_सूत्रम् - The full AST equation array.
 * @returns {Array|null} The path of indices to the first matching node, else null.
 */
function अन्वेषण_विस्तरण_अन्(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_विस्तरण_अन्
};
