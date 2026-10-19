/**
 * लघुकरण_सम्मति_२ (Simplification Consensus Theorem 2: (A+B) . (A'+C) . (B+C) -> (A+B) . (A'+C))
 * 
 * Takes an AST and an array of three paths (position array) to the three terms 
 * inside an AND node, and drops the third (redundant consensus) term.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - Array of three paths: [path_to_A_plus_B, path_to_Anot_plus_C, path_to_B_plus_C]
 * @returns {Array} The simplified AST.
 */
function लघुकरण_सम्मति_२(सूत्रम्, स्थानम्) {
    if (!स्थानम् || स्थानम्.length !== 3) return सूत्रम्;

    // Create a deep copy of the AST to avoid mutating the original
    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    
    let मार्ग_सम्मति_पद = स्थानम्[2]; // Path to the redundant consensus term (B+C)
    
    let मार्ग_पितृ = मार्ग_सम्मति_पद.slice(0, -1);
    
    let पितृ = नव_सूत्रम्;
    
    // Traverse down to the target AND node (पितृ)
    for (let इ = 0; इ < मार्ग_पितृ.length; इ++) {
        let पितृ_सूचकांक = मार्ग_पितृ[इ];
        पितृ = पितृ[पितृ_सूचकांक];
    }
    
    let सम्मति_सूचकांक = मार्ग_सम्मति_पद[मार्ग_सम्मति_पद.length - 1];
    
    // Simply splice out the redundant consensus term from the AND node
    पितृ.splice(सम्मति_सूचकांक, 1);
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_सम्मति_२
};
