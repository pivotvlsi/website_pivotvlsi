/**
 * लघुकरण_तत्समक_अन् (Simplification Identity AND rule: A . 1 -> A)
 * 
 * Takes an AST and a path (position array) to a leaf node containing a '1'
 * in an AND term, and simplifies it by removing the '1'.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - The array of indices to the target node.
 * @returns {Array} The simplified AST.
 */
function लघुकरण_तत्समक_अन्(सूत्रम्, स्थानम्) {
    if (!स्थानम् || स्थानम्.length === 0) return सूत्रम्;

    // Create a deep copy of the AST to avoid mutating the original
    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    
    let वर्तमान = नव_सूत्रम्;
    let पितृ = null;
    let अन्तिम_सूचकांक = null;
    
    // Traverse down to the target node
    for (let इ = 0; इ < स्थानम्.length; इ++) {
        पितृ = वर्तमान;
        अन्तिम_सूचकांक = स्थानम्[इ];
        वर्तमान = वर्तमान[अन्तिम_सूचकांक];
    }
    
    // Check if the leaf has any variables (0 or 1)
    let चर_अस्ति = false;
    for (let इ = 0; इ < वर्तमान.length - 1; इ++) {
        if (वर्तमान[इ] === 0 || वर्तमान[इ] === 1) {
            चर_अस्ति = true;
            break;
        }
    }
    
    let अचर_सूचकांक = वर्तमान.length - 1;
    let अचर = वर्तमान[अचर_सूचकांक];
    
    if (चर_अस्ति) {
        // If there are variables (like A . 1 inside a single term leaf), 
        // we just remove the 1 constant (change to 2)
        if (अचर === 1) {
            वर्तमान[अचर_सूचकांक] = 2;
        } else if (अचर === 3) {
            // 3 represents both 0 and 1, removing 1 leaves 0
            वर्तमान[अचर_सूचकांक] = 0;
        }
    } else {
        // If it's purely a constant 1 leaf (no variables), 
        // we remove the leaf entirely from its parent AND node.
        if (पितृ && Array.isArray(पितृ)) {
            पितृ.splice(अन्तिम_सूचकांक, 1);
        } else {
            // If the root itself was just a constant 1 leaf, simplifying A.1 isn't applicable
        }
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_तत्समक_अन्
};
