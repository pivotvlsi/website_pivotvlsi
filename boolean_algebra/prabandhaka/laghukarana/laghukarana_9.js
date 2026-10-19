/**
 * लघुकरण_अवशोषण_१ (Simplification Absorption 1: A + A.B -> A)
 * 
 * Takes an AST and an array of two paths (position array) to a subset term (A) 
 * and a superset term (A.B) inside the same OR node, and drops the superset.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - Array of two paths: [path_to_A, path_to_AB]
 * @returns {Array} The simplified AST.
 */
function लघुकरण_अवशोषण_१(सूत्रम्, स्थानम्) {
    if (!स्थानम् || स्थानम्.length !== 2) return सूत्रम्;

    // Create a deep copy of the AST to avoid mutating the original
    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    
    let मार्ग_उपसमुच्चय = स्थानम्[0]; // Path to A
    let मार्ग_अधिसमुच्चय = स्थानम्[1]; // Path to A.B
    
    let मार्ग_पितृ = मार्ग_उपसमुच्चय.slice(0, -1);
    
    let पितृ = नव_सूत्रम्;
    let पितामह = null;
    let पितृ_सूचकांक = -1;
    
    // Traverse down to the target OR node (पितृ)
    for (let इ = 0; इ < मार्ग_पितृ.length; इ++) {
        पितामह = पितृ;
        पितृ_सूचकांक = मार्ग_पितृ[इ];
        पितृ = पितृ[पितृ_सूचकांक];
    }
    
    let उपसमुच्चय_सूचकांक = मार्ग_उपसमुच्चय[मार्ग_उपसमुच्चय.length - 1];
    let अधिसमुच्चय_सूचकांक = मार्ग_अधिसमुच्चय[मार्ग_अधिसमुच्चय.length - 1];
    
    // If the OR node has exactly 2 operands (length 3), the result is just the surviving node.
    // e.g., [1, leafA, andNode_AB] -> leafA
    if (पितृ.length === 3) {
        let surviving_node = पितृ[उपसमुच्चय_सूचकांक];
        if (पितामह && Array.isArray(पितामह)) {
            पितामह[पितृ_सूचकांक] = surviving_node;
        } else {
            नव_सूत्रम् = surviving_node;
        }
    } else {
        // If it's an n-ary OR node (length > 3), just splice out the redundant A.B node
        पितृ.splice(अधिसमुच्चय_सूचकांक, 1);
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_अवशोषण_१
};
