/**
 * लघुकरण_अवशोषण_४ (Advanced Absorption POS: (C+V) . (C+V'+W) -> (C+V) . (C+W))
 * 
 * Takes an AST and an object { मार्गम्, चर_सूचकांक } where मार्गम् points to the term T2,
 * and चर_सूचकांक is the index of the variable to delete (V').
 */
function लघुकरण_अवशोषण_४(सूत्रम्, स्थानम्) {
    if (!स्थानम् || !स्थानम्.मार्गम्) return सूत्रम्;

    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    let वर्तमान = नव_सूत्रम्;
    let पितृ = null;
    let पितृ_सूचकांक = null;
    
    for (let इ = 0; इ < स्थानम्.मार्गम्.length; इ++) {
        पितृ = वर्तमान;
        पितृ_सूचकांक = स्थानम्.मार्गम्[इ];
        वर्तमान = वर्तमान[पितृ_सूचकांक];
    }
    
    // वर्तमान is now T2 (could be a leaf or an OR node)
    let चर_सूचकांक = स्थानम्.चर_सूचकांक;
    
    // Helper to delete variable from a leaf
    function पत्रे_चरं_नाशय(पत्रम्) {
        if (पत्रम्[चर_सूचकांक] !== 2) {
            पत्रम्[चर_सूचकांक] = 2;
        }
    }

    if (!Array.isArray(वर्तमान)) return सूत्रम्;

    if (typeof वर्तमान[0] === 'number' && (वर्तमान[0] === 1 || वर्तमान[0] === 3) && Array.isArray(वर्तमान[1])) {
        // It's an OR node
        for (let इ = 1; इ < वर्तमान.length; इ++) {
            let शिशु = वर्तमान[इ];
            if (Array.isArray(शिशु) && typeof शिशु[0] === 'number') {
                // It's a leaf
                पत्रे_चरं_नाशय(शिशु);
            }
        }
    } else {
        // It's a leaf directly
        पत्रे_चरं_नाशय(वर्तमान);
    }
    
    function अस्ति_चर(नोड) {
        if (!Array.isArray(नोड)) return false;
        
        let isLeaf = true;
        for (let n of नोड) {
            if (typeof n !== 'number') { isLeaf = false; break; }
        }
        
        if (isLeaf) {
            for (let इ = 0; इ < नोड.length - 1; इ++) {
                if (नोड[इ] !== 2) return true;
            }
            return false;
        }
        
        if (typeof नोड[0] === 'number') {
            for (let इ = 1; इ < नोड.length; इ++) {
                if (अस्ति_चर(नोड[इ])) return true;
            }
        }
        
        return false;
    }
    
    function प्रथम_पत्र_आयाम(नोड) {
        if (!Array.isArray(नोड)) return 0;
        let isLeaf = true;
        for(let n of नोड) {
            if(typeof n !== 'number') { isLeaf = false; break; }
        }
        if(isLeaf) return नोड.length;
        if(नोड.length > 1) return प्रथम_पत्र_आयाम(नोड[1]);
        return 0;
    }
    
    if (!अस्ति_चर(वर्तमान) && पितृ) {
        let आयाम = प्रथम_पत्र_आयाम(वर्तमान);
        let leaf0 = new Array(आयाम).fill(2);
        leaf0[आयाम - 1] = 0; // Empty SUM evaluates to 0
        पितृ[पितृ_सूचकांक] = leaf0;
    }
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_अवशोषण_४
};
