/**
 * लघुकरण_द्विगुण_निषेध_अन् (Simplification Double Negation AND rule: ((A.B)')' -> A.B)
 * 
 * Takes an AST and a path (position array) to a double-negated AND node,
 * and simplifies it by stripping the two layers of negation.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - The path to the outer NOT node.
 * @returns {Array} The simplified AST.
 */
function लघुकरण_द्विगुण_निषेध_अन्(सूत्रम्, स्थानम्) {
    if (!स्थानम्) return सूत्रम्;

    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    let वर्तमान = नव_सूत्रम्;
    let पितृ = null;
    let पितृ_सूचकांक = -1;
    
    // Traverse down to the target node
    for (let इ = 0; इ < स्थानम्.length; इ++) {
        पितृ = वर्तमान;
        पितृ_सूचकांक = स्थानम्[इ];
        वर्तमान = वर्तमान[पितृ_सूचकांक];
    }
    
    // वर्तमान is the outer NOT node: e.g. [2, [...]] or [3, [...]]
    if (!Array.isArray(वर्तमान) || वर्तमान.length !== 2) {
        return सूत्रम्;
    }
    
    let शिशु = वर्तमान[1];
    let new_node = null;
    
    if (Array.isArray(शिशु)) {
        if (शिशु[0] === 2) {
            // Case 1: [2, [2, A, B]] -> [0, A, B]
            // Outer NOT applied to a NAND node. NAND is effectively (A.B)'
            new_node = [0, ...शिशु.slice(1)];
        } else if ((शिशु[0] === 2 || शिशु[0] === 3) && शिशु.length === 2) {
            // Case 2: [2, [2, [0, A, B]]] -> [0, A, B]
            // Outer NOT applied to an inner NOT over AND node.
            new_node = शिशु[1];
        }
    }
    
    if (new_node) {
        if (पितृ) {
            पितृ[पितृ_सूचकांक] = new_node;
        } else {
            नव_सूत्रम् = new_node;
        }
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_द्विगुण_निषेध_अन्
};
