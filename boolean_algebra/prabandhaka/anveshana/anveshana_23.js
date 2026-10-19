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
 * Recursively traverses the AST to find Idempotent patterns (A.A=A, A+A=A) or unmerged leaves.
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    // AND / NAND node: check for 2 or more leaf children to merge
    if (संकारक === 0 || संकारक === 2) {
        let leaf_count = 0;
        for (let इ = 1; इ < शाखा.length; इ++) {
            let child = शाखा[इ];
            let is_mergeable_leaf = पत्र_अस्ति(child) || (Array.isArray(child) && child.length === 2 && (child[0] === 0 || child[0] === 2) && पत्र_अस्ति(child[1]));
            if (is_mergeable_leaf) leaf_count++;
        }
        if (leaf_count > 1) {
            return { op: संकारक, path: वर्तमान_मार्ग, type: 'AND_MERGE' };
        }
    }
    
    // OR / NOR node: check for identical children (A + A = A)
    if (संकारक === 1 || संकारक === 3) {
        for (let इ = 1; इ < शाखा.length; इ++) {
            for (let ज = इ + 1; ज < शाखा.length; ज++) {
                if (JSON.stringify(शाखा[इ]) === JSON.stringify(शाखा[ज])) {
                    return { op: संकारक, path: वर्तमान_मार्ग, indices: [इ, ज], type: 'OR_IDEMPOTENT' };
                }
            }
        }
    }

    for (let इ = 1; इ < शाखा.length; इ++) {
        let परिणाम = पुनरावर्ती_अन्वेषण(शाखा[इ], [...वर्तमान_मार्ग, इ]);
        if (परिणाम) return परिणाम;
    }
    
    return null;
}

/**
 * अन्वेषण_वर्गसम_गुण (Find Idempotent Law / Leaf Merge: A.A=A, A+A=A)
 */
function अन्वेषण_वर्गसम_गुण(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_वर्गसम_गुण
};
