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
 * Checks if two leaves are exactly identical.
 */
function पत्राणि_समानानि(पत्र१, पत्र२) {
    if (!पत्र_अस्ति(पत्र१) || !पत्र_अस्ति(पत्र२)) return false;
    if (पत्र१.length !== पत्र२.length) return false;
    for (let इ = 0; इ < पत्र१.length; इ++) {
        if (पत्र१[इ] !== पत्र२[इ]) return false;
    }
    return true;
}

/**
 * Checks if two nodes are identical recursively.
 */
function ग्रन्थयः_समानाः(ग्रन्थि१, ग्रन्थि२) {
    if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
        return पत्राणि_समानानि(ग्रन्थि१, ग्रन्थि२);
    }
    if (Array.isArray(ग्रन्थि१) && Array.isArray(ग्रन्थि२)) {
        if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
        if (ग्रन्थि१[0] !== ग्रन्थि२[0]) return false;
        for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
            if (!ग्रन्थयः_समानाः(ग्रन्थि१[इ], ग्रन्थि२[इ])) return false;
        }
        return true;
    }
    return false;
}

/**
 * Checks if 'परिवर्तित' is the logical NOT of 'मूल'.
 */
function अस्ति_निषेध(मूल, परिवर्तित) {
    if (पत्र_अस्ति(मूल) && पत्र_अस्ति(परिवर्तित)) {
        if (मूल.length !== परिवर्तित.length) return false;
        for (let इ = 0; इ < मूल.length - 1; इ++) {
            if (मूल[इ] === 2 && परिवर्तित[इ] !== 2) return false;
            if (मूल[इ] !== 2 && परिवर्तित[इ] === 2) return false;
            if (मूल[इ] === 1 && परिवर्तित[इ] !== 0) return false;
            if (मूल[इ] === 0 && परिवर्तित[इ] !== 1) return false;
        }
        return true;
    }
    
    // If मूल is NOT(X), then परिवर्तित should be X
    if (Array.isArray(मूल) && (मूल[0] === 2 || मूल[0] === 3) && मूल.length === 2) {
        if (ग्रन्थयः_समानाः(मूल[1], परिवर्तित)) return true;
    }
    
    // If परिवर्तित is NOT(मूल)
    if (Array.isArray(परिवर्तित) && (परिवर्तित[0] === 2 || परिवर्तित[0] === 3) && परिवर्तित.length === 2) {
        if (ग्रन्थयः_समानाः(मूल, परिवर्तित[1])) return true;
    }

    // Direct complements (AND <-> NAND, OR <-> NOR)
    if (Array.isArray(मूल) && Array.isArray(परिवर्तित)) {
        if (मूल.length === परिवर्तित.length) {
            if ((मूल[0] === 0 && परिवर्तित[0] === 2) || (मूल[0] === 2 && परिवर्तित[0] === 0) ||
                (मूल[0] === 1 && परिवर्तित[0] === 3) || (मूल[0] === 3 && परिवर्तित[0] === 1)) {
                let match = true;
                for (let इ = 1; इ < मूल.length; इ++) {
                    if (!ग्रन्थयः_समानाः(मूल[इ], परिवर्तित[इ])) {
                        match = false;
                        break;
                    }
                }
                if (match) return true;
            }
        }
    }
    
    return false;
}

function डीमॉर्गन_समानम्(चिल्ड्रन१, चिल्ड्रन२) {
    if (चिल्ड्रन१.length !== चिल्ड्रन२.length) return false;
    let used = new Array(चिल्ड्रन२.length).fill(false);
    for (let इ = 0; इ < चिल्ड्रन१.length; इ++) {
        let found = false;
        for (let ज = 0; ज < चिल्ड्रन२.length; ज++) {
            if (!used[ज] && अस्ति_निषेध(चिल्ड्रन१[इ], चिल्ड्रन२[ज])) {
                used[ज] = true;
                found = true;
                break;
            }
        }
        if (!found) return false;
    }
    return true;
}

/**
 * Checks if सूत्र२ is the result of applying (A+B)' = A'.B' (De Morgan's Law for OR) on सूत्र१.
 */
function अभिज्ञान_डीमॉर्गन_अथवा(सूत्र१, सूत्र२) {
    let प्राप्त_परिवर्तनम् = 0;

    function अन्वेषणम्(ग्रन्थि१, ग्रन्थि२) {
        if (पत्र_अस्ति(ग्रन्थि१) && पत्र_अस्ति(ग्रन्थि२)) {
            return पत्राणि_समानानि(ग्रन्थि१, ग्रन्थि२);
        }

        if (Array.isArray(ग्रन्थि१)) {
            let संकारक१ = ग्रन्थि१[0];
            let मूल_चिल्ड्रन = null;

            // Case 1: NOR node
            if (संकारक१ === 3 && ग्रन्थि१.length > 1) {
                मूल_चिल्ड्रन = ग्रन्थि१.slice(1);
            } 
            // Case 2: Unary NOT wrapped around OR
            else if ((संकारक१ === 2 || संकारक१ === 3) && ग्रन्थि१.length === 2) {
                let शिशु = ग्रन्थि१[1];
                if (Array.isArray(शिशु) && शिशु[0] === 1) {
                    मूल_चिल्ड्रन = शिशु.slice(1);
                }
            }

            if (मूल_चिल्ड्रन !== null) {
                // We have an (A+B+...)'. The transformed node must be an AND node (0) with negated children.
                if (Array.isArray(ग्रन्थि२) && (ग्रन्थि२[0] === 0 || ग्रन्थि२[0] === 2)) {
                    // Note: it should technically result in AND node (0), but keeping 2 just in case. Let's assume 0.
                    if (ग्रन्थि२[0] === 0) {
                        let परिवर्तित_चिल्ड्रन = ग्रन्थि२.slice(1);
                        if (डीमॉर्गन_समानम्(मूल_चिल्ड्रन, परिवर्तित_चिल्ड्रन)) {
                            प्राप्त_परिवर्तनम्++;
                            return true;
                        }
                    }
                }
            }

            // Normal recursive check if no transformation at this level
            if (Array.isArray(ग्रन्थि२)) {
                if (ग्रन्थि१.length !== ग्रन्थि२.length) return false;
                if (ग्रन्थि१[0] !== ग्रन्थि२[0]) return false;

                for (let इ = 1; इ < ग्रन्थि१.length; इ++) {
                    if (!अन्वेषणम्(ग्रन्थि१[इ], ग्रन्थि२[इ])) {
                        return false;
                    }
                }
                return true;
            }
        }

        return false;
    }

    let समान_अस्ति = अन्वेषणम्(सूत्र१, सूत्र२);
    return समान_अस्ति && प्राप्त_परिवर्तनम् === 1;
}

module.exports = {
    अभिज्ञान_डीमॉर्गन_अथवा
};
