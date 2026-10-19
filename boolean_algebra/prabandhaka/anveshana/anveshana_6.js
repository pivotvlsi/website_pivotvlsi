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
 * Extracts all variable values within a node recursively if they are bounded under valid operators.
 * 
 * @param {Array} शाखा - The AST node to check.
 * @param {number} लक्ष्य_संकारक - 0 (AND) or 1 (OR).
 * @param {Object} चर_स्थितिः - Accumulator for variable states { index: value }
 * @returns {boolean} True if a contradiction/tautology is found, False otherwise.
 */
function सर्व_चर_प्राप्त_करो(शाखा, लक्ष्य_संकारक, चर_स्थितिः) {
    if (पत्र_अस्ति(शाखा)) {
        let अन्तिम_सूचकांक = शाखा.length - 1;
        for (let इ = 0; इ < अन्तिम_सूचकांक; इ++) {
            if (शाखा[इ] === 3) return true; // Direct contradiction/tautology inside a leaf
            
            if (शाखा[इ] === 0 || शाखा[इ] === 1) {
                if (चर_स्थितिः[इ] !== undefined && चर_स्थितिः[इ] !== शाखा[इ]) {
                    return true; // Found opposite states for the same variable across nodes!
                }
                चर_स्थितिः[इ] = शाखा[इ];
            }
        }
        return false;
    }
    
    let संकारक = शाखा[0];
    // For Contradiction (A.A'=0), we only extract variables across AND/NAND boundaries.
    if (लक्ष्य_संकारक === 0 && (संकारक !== 0 && संकारक !== 2)) return false;
    // For Tautology (A+A'=1), we only extract variables across OR/NOR boundaries.
    if (लक्ष्य_संकारक === 1 && (संकारक !== 1 && संकारक !== 3)) return false;
    
    for (let इ = 1; इ < शाखा.length; इ++) {
        if (सर्व_चर_प्राप्त_करो(शाखा[इ], लक्ष्य_संकारक, चर_स्थितिः)) {
            return true;
        }
    }
    return false;
}

/**
 * Recursively traverses the AST to find the first occurrence of A+A' inside an OR term (sum).
 * 
 * @param {Array} शाखा - The current AST node being evaluated.
 * @param {Array} वर्तमान_मार्ग - The array of indices taken to reach this node (e.g., [1, 2]).
 * @returns {Array|null} The distinct path array to the OR parent if found, otherwise null.
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    // Check if this node is an OR node (1) or NOR node (3)
    if (संकारक === 1 || संकारक === 3) {
        let चर_स्थितिः = {};
        if (सर्व_चर_प्राप्त_करो(शाखा, 1, चर_स्थितिः)) {
            return वर्तमान_मार्ग;
        }
    }

    // If no tautology found at this level, traverse children
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
 * अन्वेषण_सर्वदा_सत्य (Find Tautology rule: A + A' = 1)
 * 
 * This function searches the entire AST tree and returns the FIRST distinct 
 * array index path where a variable and its complement (A + A') are found in an OR term (sum).
 * 
 * @param {Array} पूर्ण_सूत्रम् - The full AST equation array.
 * @returns {Array|null} The distinct path of indices to the first matching node, else null.
 */
function अन्वेषण_सर्वदा_सत्य(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_सर्वदा_सत्य
};
