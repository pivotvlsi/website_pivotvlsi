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
 * Recursively traverses the AST to find the first occurrence of the Distributive pattern: A + (B.C).
 * This is identified by an OR node containing at least one leaf node (A) and at least one AND node (B.C).
 * 
 * @param {Array} शाखा - The current AST node being evaluated.
 * @param {Array} वर्तमान_मार्ग - The array of indices taken to reach this node (e.g., [1, 2]).
 * @returns {Array|null} The distinct path array to the OR node if found, otherwise null.
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) {
        return null; // Leaves cannot be structural patterns
    }

    let संकारक = शाखा[0];
    
    // Check if this is an OR node (1 or 3)
    if (संकारक === 1 || संकारक === 3) {
        let पत्र_सूचकांक = -1;
        let अन्_नोड_सूचकांक = -1;
        
        // Scan children to see if we have a mix of leaves and AND nodes
        for (let इ = 1; इ < शाखा.length; इ++) {
            let शिशु = शाखा[इ];
            if (पत्र_अस्ति(शिशु)) {
                if (पत्र_सूचकांक === -1) पत्र_सूचकांक = इ;
            } else if (Array.isArray(शिशु) && (शिशु[0] === 0 || शिशु[0] === 2)) {
                if (अन्_नोड_सूचकांक === -1) अन्_नोड_सूचकांक = इ;
            }
        }
        
        // If we have at least one leaf (A) and at least one AND node (B.C)
        if (पत्र_सूचकांक !== -1 && अन्_नोड_सूचकांक !== -1) {
            return [ [...वर्तमान_मार्ग, पत्र_सूचकांक], [...वर्तमान_मार्ग, अन्_नोड_सूचकांक] ];
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
 * अन्वेषण_वितरण (Find Distributive structural pattern: A + (B.C))
 * 
 * This function searches the entire AST tree and returns the FIRST distinct 
 * array index path to an OR node that structurally contains at least one leaf term 
 * and at least one nested AND term.
 * 
 * @param {Array} पूर्ण_सूत्रम् - The full AST equation array.
 * @returns {Array|null} The distinct path of indices to the first matching node, else null.
 */
function अन्वेषण_वितरण(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_वितरण
};
