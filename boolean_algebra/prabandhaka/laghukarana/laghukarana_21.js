/**
 * Checks if a given AST node is a leaf (a plain logic term array).
 */
function पत्र_अस्ति(शाखा) {
    if (!Array.isArray(शाखा)) return false;
    for (let इ = 0; इ < शाखा.length; इ++) {
        if (typeof शाखा[इ] !== 'number') return false;
    }
    return true;
}

/**
 * लघुकरण_विस्तरण_अथवा (Simplification Distributive OR: A + (B.C) -> (A+B).(A+C))
 * 
 * @param {Array} सूत्रम् - The original AST.
 * @param {Array} स्थानम् - The array of indices to the target OR node.
 * @returns {Array} The expanded AST.
 */
function लघुकरण_विस्तरण_अथवा(सूत्रम्, स्थानम्) {
    if (!स्थानम्) return सूत्रम्;

    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    let वर्तमान = नव_सूत्रम्;
    
    for (let इ = 0; इ < स्थानम्.length; इ++) {
        वर्तमान = वर्तमान[स्थानम्[इ]];
    }
    
    let outer_op = वर्तमान[0];
    let new_outer_op = (outer_op === 3) ? 2 : 0; // NOR -> NAND, OR -> AND
    
    let and_child_idx = -1;
    for (let इ = 1; इ < वर्तमान.length; इ++) {
        let शिशु = वर्तमान[इ];
        if (!पत्र_अस्ति(शिशु) && Array.isArray(शिशु) && (शिशु[0] === 0 || शिशु[0] === 2)) {
            and_child_idx = इ;
            break;
        }
    }
    
    if (and_child_idx === -1) return नव_सूत्रम्; 
    
    let and_child = वर्तमान[and_child_idx];
    let X = [];
    for (let इ = 1; इ < वर्तमान.length; इ++) {
        if (इ !== and_child_idx) {
            X.push(JSON.parse(JSON.stringify(वर्तमान[इ])));
        }
    }
    
    // Convert वर्तमान into an AND node
    वर्तमान.length = 0;
    वर्तमान.push(new_outer_op);
    
    // Helper to split a multi-variable leaf into individual single-variable leaves
    function split_leaf(leaf) {
        let single_leaves = [];
        let dim = leaf.length - 1;
        for (let j = 0; j < dim; j++) {
            if (leaf[j] !== 2) {
                let sl = new Array(dim + 1).fill(2);
                sl[j] = leaf[j];
                single_leaves.push(sl);
            }
        }
        if (leaf[dim] !== 2) {
            let sl = new Array(dim + 1).fill(2);
            sl[dim] = leaf[dim];
            single_leaves.push(sl);
        }
        return single_leaves.length > 0 ? single_leaves : [leaf];
    }

    // For each child in the AND node, create a new OR node
    for (let इ = 1; इ < and_child.length; इ++) {
        let Y_i = and_child[इ];
        
        let items_to_add = पत्र_अस्ति(Y_i) ? split_leaf(Y_i) : [Y_i];
        
        for (let item of items_to_add) {
            let new_or_node = [ 1 ]; 
            for(let x of X) {
                new_or_node.push(JSON.parse(JSON.stringify(x)));
            }
            new_or_node.push(JSON.parse(JSON.stringify(item)));
            वर्तमान.push(new_or_node);
        }
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_विस्तरण_अथवा
};
