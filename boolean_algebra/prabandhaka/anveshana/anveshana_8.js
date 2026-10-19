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
 * Recursively traverses the AST to find the first occurrence of the Distributive pattern: A . (B+C).
 * This is identified by an AND node containing at least one leaf node (A) and at least one OR node (B+C).
 * 
 * @param {Array} शाखा - The current AST node being evaluated.
 * @param {Array} वर्तमान_मार्ग - The array of indices taken to reach this node (e.g., [1, 2]).
 * @returns {Array|null} The distinct path array to the AND node if found, otherwise null.
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) {
        return null; // Leaves cannot be structural patterns
    }

    let संकारक = शाखा[0];
    
    // Check if this is an AND node (0 or 2)
    if (संकारक === 0 || संकारक === 2) {
        let पत्र_सूचकांक = -1;
        let अथवा_नोड_सूचकांक = -1;
        
        // Scan children to see if we have a mix of leaves and OR nodes
        for (let इ = 1; इ < शाखा.length; इ++) {
            let शिशु = शाखा[इ];
            if (पत्र_अस्ति(शिशु)) {
                if (पत्र_सूचकांक === -1) पत्र_सूचकांक = इ;
            } else if (Array.isArray(शिशु) && (शिशु[0] === 1 || शिशु[0] === 3)) {
                if (अथवा_नोड_सूचकांक === -1) अथवा_नोड_सूचकांक = इ;
            }
        }
        
        // If we have at least one leaf (A) and at least one OR node (B+C)
        if (पत्र_सूचकांक !== -1 && अथवा_नोड_सूचकांक !== -1) {
            return [ [...वर्तमान_मार्ग, पत्र_सूचकांक], [...वर्तमान_मार्ग, अथवा_नोड_सूचकांक] ];
        }
    }

    // Traverse children if pattern is not found here
    for (let इ = 1; इ < शाखा.length; इ++) {
        let उप_मार्ग = [...वर्तमान_मार्ग, इ];
        let परिणाम = पुनरावर्ती_अन्वेषण(शाखा[इ], उप_मार्ग);
        if (परिणाम) {
            return परिणाम; // Return the first match found
        }
    }
    
    return null; // No match found in any children
}

/**
 * अन्वेषण_वितरण_२ (Find Distributive structural pattern 2: A . (B+C))
 * 
 * This function searches the entire AST tree and returns the FIRST distinct 
 * array index path to an AND node that structurally contains at least one leaf term 
 * and at least one nested OR term.
 * 
 * @param {Array} पूर्ण_सूत्रम् - The full AST equation array.
 * @returns {Array|null} The distinct path of indices to the first matching node, else null.
 */
function अन्वेषण_वितरण_२(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_वितरण_२
};
