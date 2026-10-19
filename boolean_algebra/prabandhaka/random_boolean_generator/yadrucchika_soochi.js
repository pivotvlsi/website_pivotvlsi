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
/**
 * Generates a single row/leaf node for the AST, representing a Boolean term.
 * It may recursively call यादृच्छिक_सूचि_निर्माण to create nested sub-expressions if depth allows.
 * 
 * @param {number} आयाम - Dimension (number of variables).
 * @param {number} गहनता - Current recursion depth (used to limit nesting).
 * @param {number} शुद्ध_रूपम् - If 1, generates 'pure' logic without contradictions (3) or constants (0, 1).
 * @returns {Array} A leaf array of length (आयाम + 1) OR a nested sub-expression.
 */
function एक_पंक्ति_निर्माण(आयाम, गहनता, शुद्ध_रूपम्, प्रकार = null) {
    
    let उप_सूचि = [];
    let अधिकतम_मूल्य = शुद्ध_रूपम् === 1 ? 3 : 4; // If pure, Math.random() * 3 gives 0, 1, 2. Else 0, 1, 2, 3.
    
    for (let ज = 0; ज < आयाम; ज++) {
        if (ज === 0 && शुद्ध_रूपम् !== 1) {
            उप_सूचि.push(Math.random() >= 0.5 ? 1 : 0);
        } else {
            उप_सूचि.push(Math.floor(Math.random() * अधिकतम_मूल्य));
        }
    }
    
    // Trailing constant value
    if (शुद्ध_रूपम् === 1) {
        उप_सूचि.push(2); // Only 2 allowed
    } else {
        उप_सूचि.push(Math.floor(Math.random() * 4)); // 0, 1, 2, 3
    }
    
    let उपस्थित_चराः = 0;
    for (let ज = 0; ज < आयाम; ज++) {
        if (उप_सूचि[ज] !== 2) {
            उपस्थित_चराः++;
        }
    }
    
    let न्यूनतम_चराः = Math.min((प्रकार === 'SOP' || प्रकार === 'POS') ? 2 : 1, आयाम);
    
    while (उपस्थित_चराः < न्यूनतम_चराः) {
        let यादृच्छिक_सूचकांक = Math.floor(Math.random() * आयाम);
        if (उप_सूचि[यादृच्छिक_सूचकांक] === 2) {
            उप_सूचि[यादृच्छिक_सूचकांक] = Math.random() >= 0.5 ? 1 : 0;
            उपस्थित_चराः++;
        }
    }
    return उप_सूचि;
}

/**
 * Generates a full random Abstract Syntax Tree (AST) for boolean algebraic equations.
 * 
 * @param {number} आयाम - Dimension (number of variables in the equation).
 * @param {number} [गहनता=0] - Current depth of the AST generation to prevent infinite recursion.
 * @param {number} [शुद्ध_रूपम्=0] - Purity flag (1 avoids generating contradictions or constants).
 * @param {string|null} [प्रकार=null] - Desired form: 'SOP' (Sum of Products) or 'POS' (Product of Sums). If null, generates a mixed expression.
 * @param {number|null} [पद_संख्या=null] - Number of terms/branches to generate at this node. If null, generates random (2 to 5).
 * @returns {Array} The randomly generated nested AST.
 */
function यादृच्छिक_सूचि_निर्माण(आयाम, गहनता = 0, शुद्ध_रूपम् = 0, प्रकार = null, पद_संख्या = null, forcedOp = null) {
    let N = पद_संख्या !== null ? पद_संख्या : (Math.floor(Math.random() * 6) + 10);
    let अधिकतम_संकारक = शुद्ध_रूपम् === 1 ? 3 : 4;
    let प्रथम_मूल्य = forcedOp !== null ? forcedOp : Math.floor(Math.random() * अधिकतम_संकारक);
    if (शुद्ध_रूपम् === 1 && forcedOp === null) {
        प्रथम_मूल्य = Math.floor(Math.random() * 2);
    }
    if (प्रकार === 'SOP') प्रथम_मूल्य = 1;
    if (प्रकार === 'POS') प्रथम_मूल्य = 0;

    let मुख्य_सूचि = [प्रथम_मूल्य];
    
    let k = N === 1 ? 1 : Math.min(N, Math.floor(Math.random() * 4) + 2);
    if (प्रकार === 'SOP' || प्रकार === 'POS') k = N;
    
    let parts = new Array(k).fill(1);
    let remaining = N - k;
    for (let i=0; i<remaining; i++) {
        parts[Math.floor(Math.random() * k)]++;
    }

    for (let इ = 0; इ < k; इ++) {
        let child_N = parts[इ];
        if (child_N === 1 || गहनता >= 3 || प्रकार === 'SOP' || प्रकार === 'POS') {
            let leaf = एक_पंक्ति_निर्माण(आयाम, 3, शुद्ध_रूपम्, प्रकार);
            if (प्रकार === 'SOP' || (प्रकार === null && (प्रथम_मूल्य === 1 || प्रथम_मूल्य === 3))) {
                let op = (Math.random() > 0.5 && शुद्ध_रूपम् !== 1 && प्रकार === null) ? 2 : 0;
                मुख्य_सूचि.push([op, leaf]);
            } else if (प्रकार === 'POS' || (प्रकार === null && (प्रथम_मूल्य === 0 || प्रथम_मूल्य === 2))) {
                let op = (Math.random() > 0.5 && शुद्ध_रूपम् !== 1 && प्रकार === null) ? 3 : 1;
                मुख्य_सूचि.push([op, leaf]);
            } else {
                मुख्य_सूचि.push(leaf);
            }
        } else {
            let childOp = null;
            if (प्रथम_मूल्य === 0 || प्रथम_मूल्य === 2) {
                childOp = (Math.random() > 0.5 && शुद्ध_रूपम् !== 1) ? 3 : 1;
            } else if (प्रथम_मूल्य === 1 || प्रथम_मूल्य === 3) {
                childOp = (Math.random() > 0.5 && शुद्ध_रूपम् !== 1) ? 2 : 0;
            }
            मुख्य_सूचि.push(यादृच्छिक_सूचि_निर्माण(आयाम, गहनता + 1, शुद्ध_रूपम्, प्रकार, child_N, childOp));
        }
    }
    return मुख्य_सूचि;
}

/**
 * Helper to convert AST back to Boolean Expression String
 * 
 * @param {Array} सूचि - The AST array to convert
 * @param {Array} चरसरणी - Array of variable names (e.g. ['A', 'B'])
 * @param {number} [parentOp=0] - The operator code of the parent node
 * @returns {string} The Boolean Expression string
 */
function सूचितः_सूत्रम्(सूचि, चरसरणी, parentOp = 0) {
    if (Array.isArray(सूचि) && typeof सूचि[0] === 'number') {
        let पत्रम्_अस्ति = true;
        for (let इ = 1; इ < सूचि.length; इ++) {
            if (Array.isArray(सूचि[इ])) {
                पत्रम्_अस्ति = false;
                break;
            }
        }
        
        if (पत्रम्_अस्ति) {
            let पदानि = [];
            let आयाम = सूचि.length - 1;
            
            // If parent is 1 (OR) or 3 (NOR), this is a sum term (used in POS leaves). Join with '+'
            // If parent is 0 (AND) or 2 (NAND), this is a product term (used in SOP leaves). Join with '.'
            let योजक = (parentOp === 1 || parentOp === 3) ? "+" : ".";
            
            for (let इ = 0; इ < आयाम; इ++) {
                if (सूचि[इ] === 0) पदानि.push(चरसरणी[इ] + "'");
                if (सूचि[इ] === 1) पदानि.push(चरसरणी[इ]);
                if (सूचि[इ] === 3) पदानि.push(चरसरणी[इ] + योजक + चरसरणी[इ] + "'");
            }
            if (सूचि[आयाम] === 0) पदानि.push("0");
            if (सूचि[आयाम] === 1) पदानि.push("1");
            return पदानि.length > 0 ? पदानि.join(योजक) : "1";
        } else {
            let संकारक_सङ्केत = सूचि[0];
            let संकारक_सूत्र = (संकारक_सङ्केत === 0 || संकारक_सङ्केत === 2) ? "." : (संकारक_सङ्केत === 1 || संकारक_सङ्केत === 3) ? "+" : "?";
            let बाल_सूत्राणि = [];
            for (let इ = 1; इ < सूचि.length; इ++) {
                बाल_सूत्राणि.push(सूचितः_सूत्रम्(सूचि[इ], चरसरणी, संकारक_सङ्केत));
            }
            let परिणाम = "(" + बाल_सूत्राणि.join(संकारक_सूत्र) + ")";
            if (संकारक_सङ्केत === 2 || संकारक_सङ्केत === 3) परिणाम += "'"; // NAND/NOR
            return परिणाम;
        }
    }
    return "";
}

module.exports = {
    एक_पंक्ति_निर्माण,
    यादृच्छिक_सूचि_निर्माण,
    सूचितः_सूत्रम्
};