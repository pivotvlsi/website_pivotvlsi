/**
 * लघुकरण_तत्समक_अथवा (Simplification Identity OR rule: A + 0 -> A)
 * 
 * Takes an AST and a path (position array) to a leaf node containing a '0'
 * in an OR term, and simplifies it by removing the '0'.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - The array of indices to the target node.
 * @returns {Array} The simplified AST.
 */
function लघुकरण_तत्समक_अथवा(सूत्रम्, स्थानम्) {
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
        // If there are variables (like A + 0 inside a single term leaf), 
        // we just remove the 0 constant (change to 2)
        if (अचर === 0) {
            वर्तमान[अचर_सूचकांक] = 2;
        } else if (अचर === 3) {
            // 3 represents both 0 and 1, removing 0 leaves 1
            वर्तमान[अचर_सूचकांक] = 1;
        }
    } else {
        if (पितृ && Array.isArray(पितृ)) {
            पितृ.splice(अन्तिम_सूचकांक, 1);
            
            // If the parent OR node now has no children (length 1 for just the operator), 
            // it represents an empty sum, which is 0.
            if (पितृ.length === 1) {
                let आयाम = वर्तमान.length - 1;
                let शून्य_पत्र = new Array(आयाम).fill(2);
                शून्य_पत्र.push(0);
                
                // Replace the empty parent node with the 0 leaf
                // We need the grandparent to replace 'पितृ'
                if (स्थानम्.length > 1) {
                    let पितामह = नव_सूत्रम्;
                    for (let इ = 0; इ < स्थानम्.length - 2; इ++) {
                        पितामह = पितामह[स्थानम्[इ]];
                    }
                    पितामह[स्थानम्[स्थानम्.length - 2]] = शून्य_पत्र;
                } else {
                    नव_सूत्रम् = शून्य_पत्र;
                }
            }
        } else {
            // If the root itself was just a constant 0 leaf, simplifying A+0 isn't applicable
            // but if called, it reduces to an empty node.
        }
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_तत्समक_अथवा
};
