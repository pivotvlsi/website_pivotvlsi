/**
 * निषेध_करो (Negate a node)
 * Helper function to flip variables or operators logically.
 */
function निषेध_करो(नोड) {
    // If it's a leaf node, flip 1 to 0 and 0 to 1
    if (Array.isArray(नोड) && नोड.every(val => typeof val === 'number')) {
        let नया_पत्र = [...नोड];
        for (let इ = 0; इ < नया_पत्र.length - 1; इ++) {
            if (नया_पत्र[इ] === 1) नया_पत्र[इ] = 0;
            else if (नया_पत्र[इ] === 0) नया_पत्र[इ] = 1;
        }
        return नया_पत्र;
    }
    
    // If it's an AST branch, flip the operator
    if (Array.isArray(नोड)) {
        let नया_नोड = [...नोड];
        if (नया_नोड[0] === 0) नया_नोड[0] = 2;       // AND -> NAND
        else if (नया_नोड[0] === 2) नया_नोड[0] = 0;  // NAND -> AND
        else if (नया_नोड[0] === 1) नया_नोड[0] = 3;  // OR -> NOR
        else if (नया_नोड[0] === 3) नया_नोड[0] = 1;  // NOR -> OR
        return नया_नोड;
    }
    
    return नोड;
}

/**
 * लघुकरण_डीमॉर्गन_अन् (Simplification De Morgan's Law for AND: (A.B)' -> A' + B')
 * 
 * Takes an AST and a path to a NAND (or NOT-AND) node,
 * and pushes the negation down to its children, converting the node to an OR node.
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - The path to the negated AND node.
 * @returns {Array} The simplified AST.
 */
function लघुकरण_डीमॉर्गन_अन्(सूत्रम्, स्थानम्) {
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
    
    let संकारक = वर्तमान[0];
    let मूल_चिल्ड्रन = null;
    
    // Check if it's a unary NOT wrapping an AND node (more specific)
    if ((संकारक === 2 || संकारक === 3) && वर्तमान.length === 2 && Array.isArray(वर्तमान[1]) && वर्तमान[1][0] === 0) {
        मूल_चिल्ड्रन = वर्तमान[1].slice(1);
    } 
    // Check if it's a native NAND node
    else if (संकारक === 2 && वर्तमान.length > 1) {
        मूल_चिल्ड्रन = वर्तमान.slice(1);
    }
    
    if (मूल_चिल्ड्रन) {
        // Negate all children and convert parent to OR (1)
        let परिवर्तित_चिल्ड्रन = मूल_चिल्ड्रन.map(child => निषेध_करो(child));
        let new_node = [1, ...परिवर्तित_चिल्ड्रन];
        
        if (पितृ) {
            पितृ[पितृ_सूचकांक] = new_node;
        } else {
            नव_सूत्रम् = new_node;
        }
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_डीमॉर्गन_अन्
};
