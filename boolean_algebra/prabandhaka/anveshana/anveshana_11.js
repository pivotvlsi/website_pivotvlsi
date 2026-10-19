/**
 * Checks if a given AST node is a leaf (a plain logic term array).
 */
function पत्र_अस्ति(शाखा) {
    if (!Array.isArray(शाखा)) return false;
    for (let इ = 0; इ < शाखा.length; इ++) {
        if (typeof शाखा[इ] !== 'number') return false;
    }
    return true;
}

/**
 * Recursively traverses the AST to find a Double Negation over an OR-term: ((A+B)')'.
 * 
 * It looks for a unary NOT node (NAND '2' or NOR '3' with exactly 1 child) where:
 * 1. The child is a NOR node ('3') -> implicitly an inverted OR-term.
 * 2. OR the child is another unary NOT node wrapped around an OR node ('1').
 * 
 * @param {Array} शाखा - The current AST node being evaluated.
 * @param {Array} वर्तमान_मार्ग - The array of indices taken to reach this node.
 * @returns {Array|null} The distinct path array to the outer unary NOT node, else null.
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    // Check if this node is a unary negation (NAND or NOR with exactly 1 child)
    if ((संकारक === 2 || संकारक === 3) && शाखा.length === 2) {
        let शिशु = शाखा[1];
        
        if (!पत्र_अस्ति(शिशु) && Array.isArray(शिशु)) {
            // Case 1: Child is a NOR node (which evaluates to (A+B+...)' )
            if (शिशु[0] === 3) {
                return वर्तमान_मार्ग;
            }
            
            // Case 2: Child is another unary negation wrapped around any node
            if ((शिशु[0] === 2 || शिशु[0] === 3) && शिशु.length === 2) {
                return वर्तमान_मार्ग;
            }
        }
    }

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
 * अन्वेषण_द्विगुण_निषेध_अथवा (Find Double Negation of OR-term: ((A+B)')' = A+B)
 */
function अन्वेषण_द्विगुण_निषेध_अथवा(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_द्विगुण_निषेध_अथवा
};
