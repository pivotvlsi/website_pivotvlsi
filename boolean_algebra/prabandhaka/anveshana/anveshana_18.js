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
 * Finds Advanced Absorption 2 (POS): (C+V) . (C+V'+W) = (C+V) . (C+W)
 * Returns [path_to_T2, index_of_V_prime_in_T2]
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    if (संकारक === 0 || संकारक === 2) { // AND node
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
                
                let C = [];
                let R1 = [];
                for (let च१ of प१.चराः) {
                    let च२ = प२.चराः.find(च => च.सूचकांक === च१.सूचकांक && च.मूल्य === च१.मूल्य);
                    if (च२) {
                        C.push(च१);
                    } else {
                        R1.push(च१);
                    }
                }
                
                if (R1.length === 1) {
                    let V = R1[0];
                    let V_prime_val = V.मूल्य === 1 ? 0 : 1;
                    let V_prime_in_T2 = प२.चराः.find(च => च.सूचकांक === V.सूचकांक && च.मूल्य === V_prime_val);
                    
                    if (V_prime_in_T2) {
                        return { 
                            मार्गम्: [...वर्तमान_मार्ग, प२.शिशु_सूचकांक],
                            चर_सूचकांक: V.सूचकांक
                        };
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

function अन्वेषण_अवशोषण_४(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_अवशोषण_४
};
