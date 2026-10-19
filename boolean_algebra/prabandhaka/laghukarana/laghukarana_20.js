/**
 * लघुकरण_सम्मति_४ (Advanced Consensus Reduction POS: (X+Y) . (X'+Z) . (Y'+Z+W) -> (X+Y) . (X'+Z) . (Z+W))
 * 
 * Takes an AST and an object { मार्गम्, चर_सूचकांक } where मार्गम् points to the term T3,
 * and चर_सूचकांक is the index of the variable to delete (Y').
 */
function लघुकरण_सम्मति_४(सूत्रम्, स्थानम्) {
    if (!स्थानम् || !स्थानम्.मार्गम्) return सूत्रम्;

    let नव_सूत्रम् = JSON.parse(JSON.stringify(सूत्रम्));
    let वर्तमान = नव_सूत्रम्;
    
    for (let इ = 0; इ < स्थानम्.मार्गम्.length; इ++) {
        वर्तमान = वर्तमान[स्थानम्.मार्गम्[इ]];
    }
    
    // वर्तमान is now T3 (could be a leaf or an OR node)
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
    
    return नव_सूत्रम्;
}

module.exports = {
    लघुकरण_सम्मति_४
};
