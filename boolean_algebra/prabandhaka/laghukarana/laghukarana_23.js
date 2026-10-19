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
 * लघुकरण_वर्गसम_गुण (Apply Idempotent Law / Leaf Merge: A.A=A, A+A=A)
 */
function लघुकरण_वर्गसम_गुण(पूर्ण_सूत्रम्, सन्दर्भः) {
    let { path, type, indices } = सन्दर्भः;
    
    function अद्यतन_नोड(वर्तमान_नोड, वर्तमान_मार्ग, लक्ष्य_मार्ग) {
        if (वर्तमान_मार्ग.length === लक्ष्य_मार्ग.length) {
            let match = true;
            for (let i = 0; i < लक्ष्य_मार्ग.length; i++) {
                if (वर्तमान_मार्ग[i] !== लक्ष्य_मार्ग[i]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                if (type === 'AND_MERGE') {
                    let new_children = [];
                    let leaf_children = [];
                    for (let i = 1; i < वर्तमान_नोड.length; i++) {
                        let child = वर्तमान_नोड[i];
                        if (पत्र_अस्ति(child)) {
                            leaf_children.push(child);
                        } else if (Array.isArray(child) && child.length === 2 && (child[0] === 0 || child[0] === 2) && पत्र_अस्ति(child[1])) {
                            leaf_children.push(child[1]); // extract the inner leaf
                        } else {
                            new_children.push(child);
                        }
                    }
                    
                    // Merge leaves
                    let merged_leaf = [...leaf_children[0]];
                    for (let i = 1; i < leaf_children.length; i++) {
                        let sibling = leaf_children[i];
                        for (let j = 0; j < merged_leaf.length; j++) {
                            if (merged_leaf[j] === 2) merged_leaf[j] = sibling[j];
                            else if (sibling[j] !== 2 && merged_leaf[j] !== sibling[j]) merged_leaf[j] = 3;
                        }
                    }
                    
                    let navya_node = [वर्तमान_नोड[0], merged_leaf, ...new_children];
                    // If it's the only child, we still keep the operator node, unless we want to flatten. Let's just keep the operator node for safety. pradhana_laghukaraka will handle any subsequent unnesting if needed.
                    if (navya_node.length === 2 && !पत्र_अस्ति(navya_node[1])) {
                        return navya_node[1];
                    }
                    return navya_node;
                } else if (type === 'OR_IDEMPOTENT') {
                    let navya_node = [वर्तमान_नोड[0]];
                    for (let i = 1; i < वर्तमान_नोड.length; i++) {
                        // Skip the second identical child
                        if (i !== indices[1]) {
                            navya_node.push(वर्तमान_नोड[i]);
                        }
                    }
                    // If only one child remains, unnest it
                    if (navya_node.length === 2) {
                         if (!पत्र_अस्ति(navya_node[1])) return navya_node[1];
                    }
                    return navya_node;
                }
            }
        }
        
        if (!Array.isArray(वर्तमान_नोड) || पत्र_अस्ति(वर्तमान_नोड)) return वर्तमान_नोड;
        
        let navya_node = [वर्तमान_नोड[0]];
        for (let i = 1; i < वर्तमान_नोड.length; i++) {
            navya_node.push(अद्यतन_नोड(वर्तमान_नोड[i], [...वर्तमान_मार्ग, i], लक्ष्य_मार्ग));
        }
        return navya_node;
    }
    
    return अद्यतन_नोड(पूर्ण_सूत्रम्, [], path);
}

module.exports = {
    लघुकरण_वर्गसम_गुण
};
