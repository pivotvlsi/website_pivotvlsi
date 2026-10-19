/**
 * Array Structure Reference:
 * 
 * 1. Operator Nodes (First element of array):
 *    0 : AND (.)
 *    1 : OR (+)
 *    2 : NAND (.')
 *    3 : NOR (+')
 * 
 * 2. Leaf Nodes (Variable arrays like [1, 0, 2, 3]):
 *    a) Variable Elements (Indices 0 to L-1):
 *       0 : Inverted variable (e.g., A')
 *       1 : Normal variable (e.g., A)
 *       2 : Variable is absent
 *       3 : Both normal and inverted present (e.g., A and A')
 *    b) Constant Trailing Element (Index L):
 *       0 : Contains constant 0
 *       1 : Contains constant 1
 *       2 : Constant is absent
 *       3 : Contains both constant 0 and 1
 */

const संकारकमानचित्रम् = { '.': 0, '+': 1, ".'": 2, "+'": 3 };

function पदनिर्माणम्(आयामः) {
    let पदम् = new Array(आयामः + 1).fill(2);
    return पदम्; // default is 2
}

/**
 * Recursive function to parse the expression into nodes.
 */
function ग्रन्थिविश्लेषणम्(सूत्रम्, आयामः, चरसूची) {
    // Strip redundant outer parentheses (e.g., "((A))" -> "A")
    while (सूत्रम्.startsWith('(') && सूत्रम्.endsWith(')')) {
        let आभ्यन्तरम् = सूत्रम्.slice(1, -1);
        let कोष्ठकगणना = 0;
        let वैधबाह्यम् = true;
        for (let i = 0; i < आभ्यन्तरम्.length; i++) {
            if (आभ्यन्तरम्[i] === '(') कोष्ठकगणना++;
            else if (आभ्यन्तरम्[i] === ')') कोष्ठकगणना--;
            if (कोष्ठकगणना < 0) { वैधबाह्यम् = false; break; }
        }
        if (वैधबाह्यम् && कोष्ठकगणना === 0) सूत्रम् = आभ्यन्तरम्;
        else break;
    }

    // Base Case: Single variable or constant (e.g., A, B', 0, 1')
    if (/^[A-Z01]'?$/.test(सूत्रम्)) {
        let पदम् = पदनिर्माणम्(आयामः);
        let वर्णः = सूत्रम्.replace(/[()]/g, '');
        let विपरीतम् = वर्णः.endsWith("'");
        let मूलचरः = वर्णः[0];

        if (मूलचरः === '0' || मूलचरः === '1') {
            let मानम् = मूलचरः === '1' ? 1 : 0;
            if (विपरीतम्) मानम् = 1 - मानम्;
            पदम्[आयामः] = मानम्;
        } else {
            पदम्[चरसूची.indexOf(मूलचरः)] = विपरीतम् ? 0 : 1;
        }
        return [0, पदम्];
    }

    // Find the lowest precedence operator outside of parentheses to split on.
    // Precedence: OR (+, +') is 1 (lowest), AND (., .') is 2.
    let न्यूनतमप्राथमिकता = 3, विभाजनसूचकाङ्कः = -1, विभाजनसंकारकः = '';
    let कोष्ठकगणना = 0;

    for (let i = 0; i < सूत्रम्.length; i++) {
        let अक्षरम् = सूत्रम्[i];
        if (अक्षरम् === '(') कोष्ठकगणना++;
        else if (अक्षरम् === ')') कोष्ठकगणना--;
        else if (कोष्ठकगणना === 0) {
            if (अक्षरम् === '+') {
                if (सूत्रम्[i + 1] === "'") {
                    विभाजनसूचकाङ्कः = i; विभाजनसंकारकः = "+'"; न्यूनतमप्राथमिकता = 1;
                } else if (न्यूनतमप्राथमिकता >= 1) {
                    विभाजनसूचकाङ्कः = i; विभाजनसंकारकः = '+'; न्यूनतमप्राथमिकता = 1;
                }
            } else if (अक्षरम् === '.') {
                if (सूत्रम्[i + 1] === "'") {
                    if (न्यूनतमप्राथमिकता >= 2) { विभाजनसूचकाङ्कः = i; विभाजनसंकारकः = ".'"; न्यूनतमप्राथमिकता = 2; }
                } else if (न्यूनतमप्राथमिकता >= 2) {
                    विभाजनसूचकाङ्कः = i; विभाजनसंकारकः = '.'; न्यूनतमप्राथमिकता = 2;
                }
            }
        }
    }

    // If an operator was found, split the string and build the tree node
    if (विभाजनसूचकाङ्कः !== -1) {
        let संकारककूटम् = संकारकमानचित्रम्[विभाजनसंकारकः];
        let भागाः = [];
        let अन्तिमसूचकाङ्कः = 0;
        कोष्ठकगणना = 0;
        for (let i = 0; i < सूत्रम्.length; i++) {
            let अक्षरम् = सूत्रम्[i];
            if (अक्षरम् === '(') कोष्ठकगणना++;
            else if (अक्षरम् === ')') कोष्ठकगणना--;
            else if (कोष्ठकगणना === 0) {
                let मेलनम् = false;
                if (विभाजनसंकारकः === '+' && अक्षरम् === '+' && सूत्रम्[i + 1] !== "'") मेलनम् = true;
                if (विभाजनसंकारकः === "+'" && अक्षरम् === '+' && सूत्रम्[i + 1] === "'") मेलनम् = true;
                if (विभाजनसंकारकः === '.' && अक्षरम् === '.' && सूत्रम्[i + 1] !== "'") मेलनम् = true;
                if (विभाजनसंकारकः === ".'" && अक्षरम् === '.' && सूत्रम्[i + 1] === "'") मेलनम् = true;

                if (मेलनम्) {
                    भागाः.push(सूत्रम्.slice(अन्तिमसूचकाङ्कः, i));
                    अन्तिमसूचकाङ्कः = i + विभाजनसंकारकः.length;
                    i += विभाजनसंकारकः.length - 1;
                }
            }
        }
        भागाः.push(सूत्रम्.slice(अन्तिमसूचकाङ्कः));

        let सर्वेचराः = true;
        for (let खण्डः of भागाः) {
            if (!/^[A-Za-z01]'?$/.test(खण्डः.replace(/[()]/g, ''))) {
                सर्वेचराः = false;
                break;
            }
        }

        // If all parts are simple leaf nodes, create a single combined term array
        if (सर्वेचराः) {
            let पदम् = पदनिर्माणम्(आयामः);
            for (let खण्डः of भागाः) {
                let वर्णः = खण्डः.replace(/[()]/g, '');
                let विपरीतम् = वर्णः.endsWith("'");
                let मूलचरः = वर्णः[0];

                if (मूलचरः === '0' || मूलचरः === '1') {
                    let मानम् = मूलचरः === '1' ? 1 : 0;
                    if (विपरीतम्) मानम् = 1 - मानम्;

                    if (पदम्[आयामः] === 2) पदम्[आयामः] = मानम्;
                    else if (पदम्[आयामः] !== मानम्) पदम्[आयामः] = 3;
                } else {
                    let सूचकाङ्कः = चरसूची.indexOf(मूलचरः);
                    let मानम् = विपरीतम् ? 0 : 1;
                    if (पदम्[सूचकाङ्कः] === 2) पदम्[सूचकाङ्कः] = मानम्;
                    else if (पदम्[सूचकाङ्कः] !== मानम्) पदम्[सूचकाङ्कः] = 3;
                }
            }
            return [संकारककूटम्, पदम्];
        } else {
            // Otherwise, it's a complex node, recursively parse each part
            let परिणामः = [संकारककूटम्];
            for (let खण्डः of भागाः) {
                परिणामः.push(ग्रन्थिविश्लेषणम्(खण्डः, आयामः, चरसूची));
            }
            return परिणामः;
        }
    }

    // Handle global inversions (NAND/NOR), e.g., "(A+B)'"
    if (सूत्रम्.endsWith("'")) {
        let आभ्यन्तरम् = सूत्रम्.slice(0, -1);
        if (आभ्यन्तरम्.startsWith('(') && आभ्यन्तरम्.endsWith(')')) {
            let कोष्ठकगणना = 0, वैधबाह्यम् = true;
            let आभ्यन्तरम्_अन्तः = आभ्यन्तरम्.slice(1, -1);
            for (let i = 0; i < आभ्यन्तरम्_अन्तः.length; i++) {
                if (आभ्यन्तरम्_अन्तः[i] === '(') कोष्ठकगणना++;
                else if (आभ्यन्तरम्_अन्तः[i] === ')') कोष्ठकगणना--;
                if (कोष्ठकगणना < 0) { वैधबाह्यम् = false; break; }
            }
            if (वैधबाह्यम् && कोष्ठकगणना === 0) {
                let विश्लेषिताभ्यन्तरम् = ग्रन्थिविश्लेषणम्(आभ्यन्तरम्, आयामः, चरसूची);
                if (Array.isArray(विश्लेषिताभ्यन्तरम्) && typeof विश्लेषिताभ्यन्तरम्[0] === 'number') {
                    if (विश्लेषिताभ्यन्तरम्[0] === 0) विश्लेषिताभ्यन्तरम्[0] = 2;
                    else if (विश्लेषिताभ्यन्तरम्[0] === 1) विश्लेषिताभ्यन्तरम्[0] = 3;
                    return विश्लेषिताभ्यन्तरम्;
                }
            }
        }
    }

    return पदनिर्माणम्(आयामः);
}

/**
 * Parses a boolean algebraic expression string into a structured AST-like array.
 * @param {string} सूत्रनिर्गमः - The boolean expression string (e.g., "(A+B).C'")
 * @returns {Array} Nested array representing the AST.
 */
function सत्यता_सारणी_प्रारंभ(सूत्रनिर्गमः, customVars = null) {
    // Remove all whitespace to prevent parsing errors
    सूत्रनिर्गमः = सूत्रनिर्गमः.replace(/\s+/g, '');
    // Extract unique variables and count them
    let वर्णाः = सूत्रनिर्गमः.match(/[A-Z]/g);
    let चरसूची = (Array.isArray(customVars) && customVars.length > 0)
        ? customVars
        : (वर्णाः ? Array.from(new Set(वर्णाः)).sort() : []);
    let आयामः = चरसूची.length;

    return ग्रन्थिविश्लेषणम्(सूत्रनिर्गमः, आयामः, चरसूची);
}

module.exports = { सत्यता_सारणी_प्रारंभ };
