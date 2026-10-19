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
 * Extracts the variables of an OR-term.
 * Returns an array of {सूचकांक, मूल्य} or null if it's too complex or not an OR-term.
 */
function पद_चराः_प्राप्त_करो(शाखा, पितृ_संकारक) {
    if (पत्र_अस्ति(शाखा)) {
        let चराः = [];
        for (let इ = 0; इ < शाखा.length - 1; इ++) {
            if (शाखा[इ] === 0 || शाखा[इ] === 1) {
                चराः.push({ सूचकांक: इ, मूल्य: शाखा[इ] });
            } else if (शाखा[इ] === 3) {
                return null;
            }
        }
        if ((पितृ_संकारक === 0 || पितृ_संकारक === 2) && चराः.length > 1) {
            return null;
        }
        return चराः;
    } else if (Array.isArray(शाखा) && (शाखा[0] === 1 || शाखा[0] === 3)) {
        let चराः = [];
        for (let इ = 1; इ < शाखा.length; इ++) {
            let शिशु = शाखा[इ];
            if (पत्र_अस्ति(शिशु)) {
                for (let ज = 0; ज < शिशु.length - 1; ज++) {
                    if (शिशु[ज] === 0 || शिशु[ज] === 1) {
                        चराः.push({ सूचकांक: ज, मूल्य: शिशु[ज] });
                    } else if (शिशु[ज] === 3) {
                        return null;
                    }
                }
            } else {
                return null;
            }
        }
        
        let अद्वितीय_चराः = [];
        for (let च of चराः) {
            if (!अद्वितीय_चराः.some(अच => अच.सूचकांक === च.सूचकांक && अच.मूल्य === च.मूल्य)) {
                अद्वितीय_चराः.push(च);
            }
        }
        return अद्वितीय_चराः;
    }
    return null;
}

/**
 * Finds variables that have opposite values between two terms.
 */
function विरोध_अन्वेषण(चराः१, चराः२) {
    let विरोधाः = [];
    for (let च१ of चराः१) {
        let च२ = चराः२.find(च => च.सूचकांक === च१.सूचकांक);
        if (च२ && च१.मूल्य !== च२.मूल्य) {
            विरोधाः.push(च१.सूचकांक);
        }
    }
    return विरोधाः;
}

/**
 * Recursively traverses the AST to find Consensus Theorem 2: (A+B) . (A'+C) . (B+C)
 * Returns an array of paths to the three terms: [path_A+B, path_A'+C, path_B+C]
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    if (संकारक === 0 || संकारक === 2) { // AND or NAND node
        let पदानि = [];
        for (let इ = 1; इ < शाखा.length; इ++) {
            let शिशु = शाखा[इ];
            let चराः = पद_चराः_प्राप्त_करो(शिशु, संकारक);
            if (चराः && चराः.length > 0) {
                पदानि.push({ शिशु_सूचकांक: इ, चराः: चराः });
            }
        }
        
        for (let इ = 0; इ < पदानि.length; इ++) {
            for (let ज = 0; ज < पदानि.length; ज++) {
                if (इ === ज) continue;
                for (let क = 0; क < पदानि.length; क++) {
                    if (क === इ || क === ज) continue;
                    
                    let प१ = पदानि[इ];
                    let प२ = पदानि[ज];
                    let प३ = पदानि[क];
                    
                    let विरोधाः = विरोध_अन्वेषण(प१.चराः, प२.चराः);
                    
                    // The two base terms must conflict on EXACTLY one variable (e.g. A and A')
                    if (विरोधाः.length === 1) {
                        let विरोध_सूचकांक = विरोधाः[0];
                        
                        let यज_चराः = [];
                        for (let च of प१.चराः) {
                            if (च.सूचकांक !== विरोध_सूचकांक) यज_चराः.push(च);
                        }
                        for (let च of प२.चराः) {
                            if (च.सूचकांक !== विरोध_सूचकांक) {
                                if (!यज_चराः.some(यज => यज.सूचकांक === च.सूचकांक)) {
                                    यज_चराः.push(च);
                                }
                            }
                        }
                        
                        // Check if प३ is a superset (or exact match) of यज_चराः
                        if (यज_चराः.length > 0) {
                            let उपसमुच्चय_अस्ति = true;
                            for (let यज of यज_चराः) {
                                let प्राप्तम् = प३.चराः.find(च => च.सूचकांक === यज.सूचकांक && च.मूल्य === यज.मूल्य);
                                if (!प्राप्तम्) {
                                    उपसमुच्चय_अस्ति = false;
                                    break;
                                }
                            }
                            
                            if (उपसमुच्चय_अस्ति) {
                                return [ 
                                    [...वर्तमान_मार्ग, प१.शिशु_सूचकांक], 
                                    [...वर्तमान_मार्ग, प२.शिशु_सूचकांक], 
                                    [...वर्तमान_मार्ग, प३.शिशु_सूचकांक] 
                                ];
                            }
                        }
                    }
                }
            }
        }
    }

    for (let इ = 1; इ < शाखा.length; इ++) {
        let उप_मार्ग = [...वर्तमान_मार्ग, इ];
        let परिणाम = पुनरावर्ती_अन्वेषण(शाखा[इ], उप_मार्ग);
        if (परिणाम) {
            return परिणाम; 
        }
    }
    
    return null;
}

/**
 * अन्वेषण_सम्मति_२ (Find Consensus Theorem 2: (A+B) . (A'+C) . (B+C) = (A+B) . (A'+C))
 */
function अन्वेषण_सम्मति_२(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_सम्मति_२
};
