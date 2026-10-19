/**
 * Finds the dimension (number of variables) by diving down to any leaf node.
 */
function प्राप्त_आयाम(शाखा) {
    if (!Array.isArray(शाखा)) return 0;
    if (typeof शाखा[0] !== 'number') return 0;
    
    // Check if it's a leaf node
    let isLeaf = true;
    for (let इ = 0; इ < शाखा.length; इ++) {
        if (typeof शाखा[इ] !== 'number') {
            isLeaf = false;
            break;
        }
    }
    
    if (isLeaf) return शाखा.length - 1;
    
    // Otherwise, dive into the first child
    for (let इ = 1; इ < शाखा.length; इ++) {
        let dim = प्राप्त_आयाम(शाखा[इ]);
        if (dim > 0) return dim;
    }
    return 0;
}

/**
 * लघुकरण_सर्वदा_सत्य (Simplification Tautology rule: A + A' -> 1)
 * 
 * Takes an AST and a path (position array) to an OR node containing a 
 * tautology (A+A'), and transforms the entire node into a constant 1 leaf.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - The array of indices to the target node.
 * @returns {Array} The simplified AST.
 */
function लघुकरण_सर्वदा_सत्य(सूत्रम्, स्थानम्) {
    if (!स्थानम्) return सूत्रम्;

    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    let पितृ = null;
    let पितृ_सूचकांक = -1;
    let वर्तमान = नव_सूत्रम्;
    
    // Traverse down to the target node
    for (let इ = 0; इ < स्थानम्.length; इ++) {
        पितृ = वर्तमान;
        पितृ_सूचकांक = स्थानम्[इ];
        वर्तमान = वर्तमान[स्थानम्[इ]];
    }
    
    // Get the dimension to construct a proper constant leaf
    let आयाम = प्राप्त_आयाम(वर्तमान) || प्राप्त_आयाम(नव_सूत्रम्) || 1;
    
    // Create a pure constant 1 leaf
    let एक_पत्र = new Array(आयाम).fill(2);
    एक_पत्र.push(1);
    
    if (पितृ) {
        पितृ[पितृ_सूचकांक] = एक_पत्र;
    } else {
        नव_सूत्रम् = एक_पत्र;
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_सर्वदा_सत्य
};
