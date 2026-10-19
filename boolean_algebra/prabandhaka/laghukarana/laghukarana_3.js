/**
 * लघुकरण_शून्य_गुण (Simplification Zero Property rule: A . 0 -> 0)
 * 
 * Takes an AST and a path (position array) to a leaf node containing a '0'
 * in an AND term, and simplifies it.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - The array of indices to the target node.
 * @returns {Array} The simplified AST.
 */
function लघुकरण_शून्य_गुण(सूत्रम्, स्थानम्) {
    if (!स्थानम् || स्थानम्.length === 0) return सूत्रम्;

    // Create a deep copy of the AST to avoid mutating the original
    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    
    let वर्तमान = नव_सूत्रम्;
    let पितृ = null;
    let पितामह = null;
    let पितृ_सूचकांक = null;
    let अन्तिम_सूचकांक = null;
    
    // Traverse down to the target node
    for (let इ = 0; इ < स्थानम्.length; इ++) {
        पितामह = पितृ;
        पितृ_सूचकांक = अन्तिम_सूचकांक;
        
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
    
    if (चर_अस्ति) {
        // If there are variables (like A . 0 inside a single term leaf),
        // we erase all variables and leave just the 0.
        for (let इ = 0; इ < वर्तमान.length - 1; इ++) {
            वर्तमान[इ] = 2; 
        }
        वर्तमान[अचर_सूचकांक] = 0;
    } else {
        // If it's purely a constant 0 leaf (no variables),
        // the entire parent AND node evaluates to 0.
        let constant_0_leaf = new Array(वर्तमान.length).fill(2);
        constant_0_leaf[अचर_सूचकांक] = 0;

        if (पितामह && Array.isArray(पितामह)) {
            // Replace the AND node in its parent with constant 0 leaf
            पितामह[पितृ_सूचकांक] = constant_0_leaf;
        } else {
            // If the AND node is the root itself
            return constant_0_leaf;
        }
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_शून्य_गुण
};
