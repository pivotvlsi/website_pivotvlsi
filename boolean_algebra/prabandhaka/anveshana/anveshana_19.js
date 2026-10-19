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
 * Advanced Consensus Reduction (SOP): X.Y + X'.Z + Y'.Z.W = X.Y + X'.Z + Z.W
 * Returns [path_to_T3, index_of_Y_prime_in_T3]
 */
function पुनरावर्ती_अन्वेषण(शाखा, वर्तमान_मार्ग) {
    if (पत्र_अस्ति(शाखा)) return null;

    let संकारक = शाखा[0];
    
    if (संकारक === 1 || संकारक === 3) { // OR node
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
                
                let विरोधाः = विरोध_अन्वेषण(प१.चराः, प२.चराः);
                
                if (विरोधाः.length === 1) {
                    let विरोध_सूचकांक = विरोधाः[0];
                    
                    let Y = प१.चराः.filter(च => च.सूचकांक !== विरोध_सूचकांक);
                    let Z = प२.चराः.filter(च => च.सूचकांक !== विरोध_सूचकांक);
                    
                    if (Y.length === 1) {
                        let V = Y[0];
                        let V_prime_val = V.मूल्य === 1 ? 0 : 1;
                        
                        for (let क = 0; क < पदानि.length; क++) {
                            if (क === इ || क === ज) continue;
                            let प३ = पदानि[क];
                            
                            // Check if प3 is a superset of Z
                            let is_superset_of_Z = true;
                            for (let z_var of Z) {
                                let found = प३.चराः.find(च => च.सूचकांक === z_var.सूचकांक && च.मूल्य === z_var.मूल्य);
                                if (!found) {
                                    is_superset_of_Z = false;
                                    break;
                                }
                            }
                            
                            if (is_superset_of_Z) {
                                // Does प3 contain Y' (V')?
                                let V_prime_in_T3 = प३.चराः.find(च => च.सूचकांक === V.सूचकांक && च.मूल्य === V_prime_val);
                                if (V_prime_in_T3) {
                                    return { 
                                        मार्गम्: [...वर्तमान_मार्ग, प३.शिशु_सूचकांक],
                                        चर_सूचकांक: V.सूचकांक
                                    };
                                }
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

function अन्वेषण_सम्मति_३(पूर्ण_सूत्रम्) {
    return पुनरावर्ती_अन्वेषण(पूर्ण_सूत्रम्, []);
}

module.exports = {
    अन्वेषण_सम्मति_३
};
