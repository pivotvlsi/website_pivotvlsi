/**
 * Validates that the same letter does not appear in both upper and lower case,
 * and returns the string converted entirely to uppercase.
 */
function वैधीकरण_तथा_अपरकेस(सूत्रम्) {
    let वर्णाः = सूत्रम्.match(/[A-Za-z]/g);
    if (वर्णाः) {
        let अद्वितीयाः = Array.from(new Set(वर्णाः));
        let लोअरकेस_सेट = new Set();
        for (let वर्णः of अद्वितीयाः) {
            let लघुः = वर्णः.toLowerCase();
            if (लोअरकेस_सेट.has(लघुः)) {
                throw new Error(`Invalid expression: Both uppercase and lowercase forms of letter '${लघुः}' are present.`);
            }
            लोअरकेस_सेट.add(लघुः);
        }
    }
    return सूत्रम्.toUpperCase();
}

/**
 * सूत्र_विभाजन: Converts a string to tokens.
 */
function सूत्र_विभाजन(सूत्र) {
    सूत्र = वैधीकरण_तथा_अपरकेस(सूत्र);
    let तात्कालिक_परिणाम = [];
    let वर्तमान_पद = "";

    for (let अक्षर of सूत्र) {
        if (अक्षर === ' ') {
            if (वर्तमान_पद !== "") {
                तात्कालिक_परिणाम.push(वर्तमान_पद);
                वर्तमान_पद = "";
            }
            continue;
        }
        if (['+', '.', "'", '(', ')'].includes(अक्षर)) {
            if (वर्तमान_पद !== "") {
                तात्कालिक_परिणाम.push(वर्तमान_पद);
                वर्तमान_पद = "";
            }
            तात्कालिक_परिणाम.push(अक्षर);
        } else {
            वर्तमान_पद += अक्षर;
        }
    }
    if (वर्तमान_पद !== "") तात्कालिक_परिणाम.push(वर्तमान_पद);

    // Implicit AND (अव्यक्त संकारक) insertion
    let परिणाम = [];
    for (let i = 0; i < तात्कालिक_परिणाम.length; i++) {
        let पद = तात्कालिक_परिणाम[i];
        if (i > 0) {
            let पूर्व_पद = तात्कालिक_परिणाम[i - 1];
            let पूर्व_संकार्य = /[A-Z01]/.test(पूर्व_पद) || पूर्व_पद === ')' || पूर्व_पद === "'";
            let वर्तमान_संकार्य = /[A-Z01]/.test(पद) || पद === '(';

            if (पूर्व_संकार्य && वर्तमान_संकार्य) {
                परिणाम.push('.');
            }
        }
        परिणाम.push(पद);
    }

    // 1. Convert to Postfix (Shunting-yard)
    let संकारक_प्राथमिकता = { "'": 3, '.': 2, '+': 1, '(': 0, ')': 0 };
    let निर्गम = [];
    let संचय = [];

    for (let पद of परिणाम) {
        if (/[A-Z01]/.test(पद)) {
            निर्गम.push({ प्रकार: 'अक्षर', मूल्य: पद });
        } else if (पद === '(') {
            संचय.push(पद);
        } else if (पद === ')') {
            while (संचय.length > 0 && संचय[संचय.length - 1] !== '(') {
                निर्गम.push({ प्रकार: 'संकारक', मूल्य: संचय.pop() });
            }
            संचय.pop(); // Remove '('
        } else { // Operator
            while (
                संचय.length > 0 &&
                संचय[संचय.length - 1] !== '(' &&
                संकारक_प्राथमिकता[संचय[संचय.length - 1]] >= संकारक_प्राथमिकता[पद]
            ) {
                निर्गम.push({ प्रकार: 'संकारक', मूल्य: संचय.pop() });
            }
            संचय.push(पद);
        }
    }
    while (संचय.length > 0) {
        निर्गम.push({ प्रकार: 'संकारक', मूल्य: संचय.pop() });
    }
    // 2. Build Tree from Postfix and format string with brackets
    let वृक्ष_संचय = [];
    for (let अंश of निर्गम) {
        if (अंश.प्रकार === 'अक्षर') {
            वृक्ष_संचय.push({ सूत्रम्: अंश.मूल्य, संकारकः: null });
        } else {
            if (अंश.मूल्य === "'") {
                let वाम = वृक्ष_संचय.pop();
                if (वाम.सूत्रम्.endsWith("'")) {
                    वृक्ष_संचय.push({ सूत्रम्: `(${वाम.सूत्रम्})'`, संकारकः: "'" }); // Wrap double inversions in brackets
                } else {
                    वृक्ष_संचय.push({ सूत्रम्: `${वाम.सूत्रम्}'`, संकारकः: "'" });
                }
            } else {
                let दक्षिण = वृक्ष_संचय.pop();
                let वाम = वृक्ष_संचय.pop();
                
                let वामसूत्रम् = वाम.सूत्रम्;
                let दक्षिणसूत्रम् = दक्षिण.सूत्रम्;
                
                // Flatten consecutive identical operators by stripping their outer parentheses
                if (वाम.संकारकः === अंश.मूल्य) {
                    वामसूत्रम् = वामसूत्रम्.slice(1, -1);
                }
                if (दक्षिण.संकारकः === अंश.मूल्य) {
                    दक्षिणसूत्रम् = दक्षिणसूत्रम्.slice(1, -1);
                }
                
                वृक्ष_संचय.push({ सूत्रम्: `(${वामसूत्रम्}${अंश.मूल्य}${दक्षिणसूत्रम्})`, संकारकः: अंश.मूल्य });
            }
        }
    }

    return वृक्ष_संचय[0].सूत्रम्;
}

module.exports = {
    सूत्र_विभाजन,
    वैधीकरण_तथा_अपरकेस
};
