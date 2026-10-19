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
 * Extracts the variables of an AND-term.
 * Returns an array of {index, val} or null if it's too complex or not an AND-term.
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
        // If under OR, it's only an AND-term if it has exactly 1 variable (e.g., A)
        if ((पितृ_संकारक === 1 || पितृ_संकारक === 3) && चराः.length > 1) {
            return null;
        }
        return चराः;
    } else if (Array.isArray(शाखा) && (शाखा[0] === 0 || शाखा[0] === 2)) {
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
                return null; // Complex nested
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
 * Recursively traverses the AST to find the first occurrence of Absorption: A + A.B
 * This is identified by an OR node containing an AND-term (A) that is a strict subset of another AND-term (A.B).
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    if (संकारक === 1 || संकारक === 3) {
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
                let प१ = पदानि[इ];
                let प२ = पदानि[ज];
                
                if (प१.चराः.length < प२.चराः.length) {
                    let उपसमुच्चय_अस्ति = true;
                    for (let च१ of प१.चराः) {
                        if (!प२.चराः.some(च२ => च१.सूचकांक === च२.सूचकांक && च१.मूल्य === च२.मूल्य)) {
                            उपसमुच्चय_अस्ति = false;
                            break;
                        }
                    }
                    if (उपसमुच्चय_अस्ति) {
                        return [ [...वर्तमान_मार्ग, प१.शिशु_सूचकांक], [...वर्तमान_मार्ग, प२.शिशु_सूचकांक] ];
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
 * अन्वेषण_अवशोषण (Find Absorption Law: A + A.B = A)
 */
function अन्वेषण_अवशोषण(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_अवशोषण
};
