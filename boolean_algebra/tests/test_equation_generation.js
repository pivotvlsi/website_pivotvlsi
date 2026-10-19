/**
 * Comprehensive Test Suite for Equation Generation across all formats (SOP, POS, ANY).
 * Validates:
 * 1. String syntax and structure (well-balanced parentheses, valid identifiers, valid operators).
 * 2. Character set compliance (A-H, +, ., ', (, )).
 * 3. SOP structural properties (Product terms joined by '+', or single term).
 * 4. POS structural properties (Sum terms joined by '.', or single term).
 * 5. ANY format properties (Arbitrary valid boolean expressions).
 * 6. AST Roundtrip parsability with सूत्र_विभाजन and सत्यता_सारणी_प्रारंभ.
 * 7. Variable count adherence across varied variable sets (3 to 6 variables).
 * 8. Randomized fuzz testing (100 iterations per scenario).
 */

const assert = require('assert');
const { समीकरण_जननम् } = require('../prabandhaka/prabandhaka.js');
const { सूत्र_विभाजन } = require('../prabandhaka/satyata_saarani_prarambha/sootra_vibhajana.js');
const { सत्यता_सारणी_प्रारंभ } = require('../prabandhaka/satyata_saarani_prarambha/satyata_saarani_prarambha.js');

console.log("=====================================================================");
console.log("Starting Equation Generation Test Suite across All Scenarios");
console.log("=====================================================================\n");

let totalTests = 0;
let passedTests = 0;

function runScenarioTest(name, testFn) {
    totalTests++;
    try {
        testFn();
        passedTests++;
        console.log(`[PASS] Test ${totalTests}: ${name}`);
    } catch (err) {
        console.error(`[FAIL] Test ${totalTests}: ${name}`);
        console.error(`       Error: ${err.message}`);
    }
}

function checkParenthesesBalanced(str) {
    let count = 0;
    for (let ch of str) {
        if (ch === '(') count++;
        else if (ch === ')') count--;
        if (count < 0) return false;
    }
    return count === 0;
}

function checkSyntaxValid(str) {
    if (!str || typeof str !== 'string' || str.trim().length === 0) return false;
    if (!checkParenthesesBalanced(str)) return false;
    // Allowed characters: A-H, +, ., ', (, ), 0, 1
    if (!/^[A-H01\+\.\'\(\)]+$/.test(str)) return false;
    // Disallow consecutive operators like ++, .., +., .+
    if (/[\+\.]{2,}/.test(str)) return false;
    // Disallow empty parentheses ()
    if (/\(\)/.test(str)) return false;
    return true;
}

// -------------------------------------------------------------
// Scenario 1: SOP Generation Tests
// -------------------------------------------------------------
console.log("--- Scenario 1: SOP (Sum-of-Products) Generation ---");

runScenarioTest("SOP Generation produces valid non-empty equation", () => {
    let res = समीकरण_जननम्({ प्रारूप: "SOP", चरसंख्या: 4 });
    assert.ok(res.समीकरणम्, "Equation string should be non-empty");
    assert.strictEqual(res.प्रारूप, "SOP");
    assert.ok(checkSyntaxValid(res.समीकरणम्), `Syntax should be valid: ${res.समीकरणम्}`);
});

runScenarioTest("SOP Generation contains product terms summed with '+'", () => {
    for (let i = 0; i < 20; i++) {
        let res = समीकरण_जननम्({ प्रारूप: "SOP", चरसंख्या: 4, पदसंख्या: 4 });
        assert.ok(checkSyntaxValid(res.समीकरणम्));
        assert.ok(res.समीकरणम्.includes('+'), `SOP with 4 terms must contain '+': ${res.समीकरणम्}`);
    }
});

runScenarioTest("SOP AST is correctly parsed by parser without error", () => {
    for (let i = 0; i < 20; i++) {
        let res = समीकरण_जननम्({ प्रारूप: "SOP", चरसंख्या: 4 });
        let segmented = सूत्र_विभाजन(res.समीकरणम्);
        let ast = सत्यता_सारणी_प्रारंभ(segmented, res.चरसरणी);
        assert.ok(Array.isArray(ast), "AST must be an array");
    }
});

// -------------------------------------------------------------
// Scenario 2: POS Generation Tests
// -------------------------------------------------------------
console.log("\n--- Scenario 2: POS (Product-of-Sums) Generation ---");

runScenarioTest("POS Generation produces valid non-empty equation", () => {
    let res = समीकरण_जननम्({ प्रारूप: "POS", चरसंख्या: 4 });
    assert.ok(res.समीकरणम्, "Equation string should be non-empty");
    assert.strictEqual(res.प्रारूप, "POS");
    assert.ok(checkSyntaxValid(res.समीकरणम्), `Syntax should be valid: ${res.समीकरणम्}`);
});

runScenarioTest("POS Generation contains sum terms multiplied together", () => {
    for (let i = 0; i < 20; i++) {
        let res = समीकरण_जननम्({ प्रारूप: "POS", चरसंख्या: 4, पदसंख्या: 4 });
        assert.ok(checkSyntaxValid(res.समीकरणम्));
        // POS has sum terms joined with '.' or adjacent parentheses
        let hasMultiplication = res.समीकरणम्.includes('.') || /\)\(/.test(res.समीकरणम्);
        assert.ok(hasMultiplication, `POS must contain '.' or adjacent parentheses: ${res.समीकरणम्}`);
    }
});

runScenarioTest("POS AST is correctly parsed by parser without error", () => {
    for (let i = 0; i < 20; i++) {
        let res = समीकरण_जननम्({ प्रारूप: "POS", चरसंख्या: 4 });
        let segmented = सूत्र_विभाजन(res.समीकरणम्);
        let ast = सत्यता_सारणी_प्रारंभ(segmented, res.चरसरणी);
        assert.ok(Array.isArray(ast), "AST must be an array");
    }
});

// -------------------------------------------------------------
// Scenario 3: ANY (Mixed Format) Generation Tests
// -------------------------------------------------------------
console.log("\n--- Scenario 3: ANY (Mixed Form) Generation ---");

runScenarioTest("ANY Generation produces valid non-empty equation", () => {
    let res = समीकरण_जननम्({ प्रारूप: "ANY", चरसंख्या: 4 });
    assert.ok(res.समीकरणम्, "Equation string should be non-empty");
    assert.strictEqual(res.प्रारूप, "ANY");
    assert.ok(checkSyntaxValid(res.समीकरणम्), `Syntax should be valid: ${res.समीकरणम्}`);
});

runScenarioTest("ANY AST parses successfully", () => {
    for (let i = 0; i < 20; i++) {
        let res = समीकरण_जननम्({ प्रारूप: "ANY", चरसंख्या: 4 });
        assert.ok(checkSyntaxValid(res.समीकरणम्));
        let segmented = सूत्र_विभाजन(res.समीकरणम्);
        let ast = सत्यता_सारणी_प्रारंभ(segmented, res.चरसरणी);
        assert.ok(Array.isArray(ast), "AST must be an array");
    }
});

// -------------------------------------------------------------
// Scenario 4: Variable Count Configurations (3, 4, 5, 6 variables)
// -------------------------------------------------------------
console.log("\n--- Scenario 4: Variable Range Testing (3, 4, 5, 6 variables) ---");

[3, 4, 5, 6].forEach(numVars => {
    runScenarioTest(`Generation with ${numVars} variables adheres to variable count`, () => {
        let res = समीकरण_जननम्({ प्रारूप: "SOP", चरसंख्या: numVars });
        assert.strictEqual(res.चरसंख्या, numVars);
        assert.strictEqual(res.चरसरणी.length, numVars);
        assert.ok(checkSyntaxValid(res.समीकरणम्));

        // Ensure variables outside the expected set are not present
        let maxAllowedChar = String.fromCharCode(65 + numVars - 1);
        let regexDisallowed = new RegExp(`[${String.fromCharCode(65 + numVars)}-Z]`);
        assert.ok(!regexDisallowed.test(res.समीकरणम्), `Equation contains unexpected variables beyond ${maxAllowedChar}`);
    });
});

// -------------------------------------------------------------
// Scenario 5: Random Fuzz Stress Test (150 Iterations)
// -------------------------------------------------------------
console.log("\n--- Scenario 5: Fuzz Stress Testing (150 Random Iterations) ---");

runScenarioTest("150 random stress iterations across SOP, POS, ANY", () => {
    let formats = ["SOP", "POS", "ANY"];
    for (let i = 0; i < 150; i++) {
        let fmt = formats[i % formats.length];
        let numVars = Math.floor(Math.random() * 3) + 4; // 4 to 6
        let res = समीकरण_जननम्({ प्रारूप: fmt, चरसंख्या: numVars });
        
        assert.ok(checkSyntaxValid(res.समीकरणम्), `Fuzz failed on iteration ${i} (${fmt}): ${res.समीकरणम्}`);
        let segmented = सूत्र_विभाजन(res.समीकरणम्);
        let ast = सत्यता_सारणी_प्रारंभ(segmented, res.चरसरणी);
        assert.ok(Array.isArray(ast), `AST parsing failed on iteration ${i}`);
    }
});

console.log("\n=====================================================================");
console.log(`Results: ${passedTests}/${totalTests} tests passed!`);
console.log("=====================================================================");

if (passedTests !== totalTests) {
    process.exit(1);
}
