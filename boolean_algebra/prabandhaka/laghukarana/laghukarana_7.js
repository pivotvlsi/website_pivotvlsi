/**
 * लघुकरण_वितरण_१ (Simplification Distributive rule: A + (B.C) -> (A+B).(A+C))
 * 
 * Takes an AST and an array of two paths (position array) to a leaf node 'A' 
 * and an AND node 'B.C' inside the same OR node, and applies the distributive law.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - Array of two paths: [path_to_A, path_to_BC]
 * @returns {Array} The simplified AST.
 */
function लघुकरण_वितरण_१(सूत्रम्, स्थानम्) {
    if (!स्थानम् || स्थानम्.length !== 2) return सूत्रम्;

    // Create a deep copy of the AST to avoid mutating the original
    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    
    let मार्ग_पत्र = स्थानम्[0]; // Path to leaf A
    let मार्ग_अन् = स्थानम्[1]; // Path to AND node (B.C)
    
    let मार्ग_पितृ = मार्ग_पत्र.slice(0, -1);
    
    let पितृ = नव_सूत्रम्;
    let पितामह = null;
    let पितृ_सूचकांक = -1;
    
    // Traverse down to the target OR node (पितृ)
    for (let इ = 0; इ < मार्ग_पितृ.length; इ++) {
        पितामह = पितृ;
        पितृ_सूचकांक = मार्ग_पितृ[इ];
        पितृ = पितृ[पितृ_सूचकांक];
    }
    
    // For direct inline transformation, we only support exactly 2 operands in the OR node.
    // If it's an n-ary OR node (e.g., A + D + B.C), the transformation requires structural breakdown first.
    if (पितृ.length !== 3) {
        return सूत्रम्;
    }
    
    let पत्र_सूचकांक = मार्ग_पत्र[मार्ग_पत्र.length - 1];
    let अन्_सूचकांक = मार्ग_अन्[मार्ग_अन्.length - 1];
    
    let leafA = पितृ[पत्र_सूचकांक];
    let andNode = पितृ[अन्_सूचकांक];
    
    // The AND node must have exactly 2 operands (B and C) for this simple rule implementation
    if (!Array.isArray(andNode) || andNode.length !== 3) {
        return सूत्रम्; 
    }
    
    let leafB = andNode[1];
    let leafC = andNode[2];
    
    // Construct the new node: (A+B).(A+C)
    let new_node = [
        0, // AND
        [1, leafA, leafB], // (A+B)
        [1, leafA, leafC]  // (A+C)
    ];
    
    // Replace the old OR node in its parent
    if (पितामह && Array.isArray(पितामह)) {
        पितामह[पितृ_सूचकांक] = new_node;
    } else {
        // If it is the root node
        नव_सूत्रम् = new_node;
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_वितरण_१
};
