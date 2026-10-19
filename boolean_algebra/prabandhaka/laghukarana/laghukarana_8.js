/**
 * लघुकरण_वितरण_२ (Simplification Distributive rule 2: A . (B+C) -> (A.B)+(A.C))
 * 
 * Takes an AST and an array of two paths (position array) to a leaf node 'A' 
 * and an OR node 'B+C' inside the same AND node, and applies the distributive law.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - Array of two paths: [path_to_A, path_to_B_plus_C]
 * @returns {Array} The simplified AST.
 */
function लघुकरण_वितरण_२(सूत्रम्, स्थानम्) {
    if (!स्थानम् || स्थानम्.length !== 2) return सूत्रम्;

    // Create a deep copy of the AST to avoid mutating the original
    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    
    let मार्ग_पत्र = स्थानम्[0]; // Path to leaf A
    let मार्ग_अथवा = स्थानम्[1]; // Path to OR node (B+C)
    
    let मार्ग_पितृ = मार्ग_पत्र.slice(0, -1);
    
    let पितृ = नव_सूत्रम्;
    let पितामह = null;
    let पितृ_सूचकांक = -1;
    
    // Traverse down to the target AND node (पितृ)
    for (let इ = 0; इ < मार्ग_पितृ.length; इ++) {
        पितामह = पितृ;
        पितृ_सूचकांक = मार्ग_पितृ[इ];
        पितृ = पितृ[पितृ_सूचकांक];
    }
    
    // For direct inline transformation, we only support exactly 2 operands in the AND node.
    if (पितृ.length !== 3) {
        return सूत्रम्;
    }
    
    let पत्र_सूचकांक = मार्ग_पत्र[मार्ग_पत्र.length - 1];
    let अथवा_सूचकांक = मार्ग_अथवा[मार्ग_अथवा.length - 1];
    
    let leafA = पितृ[पत्र_सूचकांक];
    let orNode = पितृ[अथवा_सूचकांक];
    
    // The OR node must have exactly 2 operands (B and C) for this simple rule implementation
    if (!Array.isArray(orNode) || orNode.length !== 3) {
        return सूत्रम्; 
    }
    
    let leafB = orNode[1];
    let leafC = orNode[2];
    
    // Construct the new node: (A.B)+(A.C)
    let new_node = [
        1, // OR
        [0, leafA, leafB], // (A.B)
        [0, leafA, leafC]  // (A.C)
    ];
    
    // Replace the old AND node in its parent
    if (पितामह && Array.isArray(पितामह)) {
        पितामह[पितृ_सूचकांक] = new_node;
    } else {
        // If it is the root node
        नव_सूत्रम् = new_node;
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_वितरण_२
};
