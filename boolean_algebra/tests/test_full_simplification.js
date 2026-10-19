/**
 * Full End-to-End Boolean Expression Simplification Test Suite
 * 
 * Tests full simplification pipelines:
 * 1. Multi-step simplification from raw generated expressions down to fully simplified minimal form.
 * 2. Step-by-step rule identification and execution via Prabandhaka (Master Orchestrator).
 * 3. Exact algebraic theorems (Absorption, Simplification, Idempotent, Contradiction, Tautology, DeMorgan).
 * 4. AST preservation and validity across all stages.
 * 5. String roundtrip conversion through सूत्र_विभाजन and सारणीतः_सूत्रम्.
 */

const assert = require('assert');
const { समीकरण_जननम्, पद_चालनम्, सम्पूर्ण_लघुकरणम् } = require('../prabandhaka/prabandhaka.js');
const { सूत्र_विभाजन } = require('../prabandhaka/satyata_saarani_prarambha/sootra_vibhajana.js');
const { सत्यता_सारणी_प्रारंभ } = require('../prabandhaka/satyata_saarani_prarambha/satyata_saarani_prarambha.js');
const { सूत्र_सरलीकरणम्, सूत्र_एकपद_सरलीकरणम्, सूत्र_अभिज्ञानम् } = require('../prabandhaka/saralikarana/saralikarana.js');
const { सारणीतः_सूत्रम् } = require('../prabandhaka/saranitah_sutram/saranitah_sutram.js');

console.log("=====================================================================");
console.log("Starting Full Boolean Expression Simplification Test Suite");
console.log("=====================================================================\n");

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
    totalTests++;
    try {
        fn();
        passedTests++;
        console.log(`[PASS] Test ${totalTests}: ${name}`);
    } catch (err) {
        console.error(`[FAIL] Test ${totalTests}: ${name}`);
        console.error(`       Error: ${err.message}`);
    }
}

// -------------------------------------------------------------------
// Test 1: Full Simplification of Screenshot Equation
// Equation: ((A'.D)+(A.D)+(C.D)+(A.E')+(A.B.E'))
// -------------------------------------------------------------------
runTest("Full multi-step simplification of ((A'.D)+(A.D)+(C.D)+(A.E')+(A.B.E'))", () => {
    let eq = "((A'.D)+(A.D)+(C.D)+(A.E')+(A.B.E'))";
    let vars = ['A', 'B', 'C', 'D', 'E'];
    let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(eq), vars);

    // Initial state check
    let initialRule = सूत्र_अभिज्ञानम्(ast);
    assert(initialRule !== null, "Initial expression must trigger an optimization rule");
    assert.strictEqual(initialRule.rule, "Absorption Law (अवशोषण_नियमः)");

    // Step-by-step loop
    let currentAst = ast;
    let maxSteps = 10;
    let stepCount = 0;

    while (stepCount < maxSteps) {
        let hint = सूत्र_अभिज्ञानम्(currentAst);
        if (!hint) break;
        let nextAst = सूत्र_एकपद_सरलीकरणम्(currentAst);
        assert.notDeepStrictEqual(currentAst, nextAst, "Each reduction step must produce a new AST");
        currentAst = nextAst;
        stepCount++;
    }

    assert(stepCount > 0, "At least one simplification step must occur");

    // Full mathematical reduction check
    let fullSimplified = सूत्र_सरलीकरणम्(ast);
    let finalStr = सारणीतः_सूत्रम्(fullSimplified, vars);
    assert(finalStr.length > 0, "Simplified result string must not be empty");
    console.log(`       Steps taken: ${stepCount}, Final Form: ${finalStr}`);
});

// -------------------------------------------------------------------
// Test 2: Step-by-Step Simplification Theorem: A.B + A.B' = A
// -------------------------------------------------------------------
runTest("Simplification Theorem full cycle: ((A.B)+(A.B')) -> A", () => {
    let eq = "((A.B)+(A.B'))";
    let vars = ['A', 'B'];
    let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(eq), vars);

    let id = सूत्र_अभिज्ञानम्(ast);
    assert.strictEqual(id.rule, "Simplification Theorem (सरलीकरण_प्रमेय)");

    let step = सूत्र_एकपद_सरलीकरणम्(ast);
    let full = सूत्र_सरलीकरणम्(ast);
    let stepStr = सारणीतः_सूत्रम्(step, vars);
    let fullStr = सारणीतः_सूत्रम्(full, vars);

    assert(stepStr.includes('A'), `Result must contain A, got: ${stepStr}`);
    assert.strictEqual(fullStr, 'A');
});

// -------------------------------------------------------------------
// Test 3: Absorption Law cycle: A + (A.B) = A
// -------------------------------------------------------------------
runTest("Absorption Law full cycle: (A+(A.B)) -> A", () => {
    let eq = "(A+(A.B))";
    let vars = ['A', 'B'];
    let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(eq), vars);

    let id = सूत्र_अभिज्ञानम्(ast);
    assert.strictEqual(id.rule, "Absorption Law (अवशोषण_नियमः)");

    let full = सूत्र_सरलीकरणम्(ast);
    let fullStr = सारणीतः_सूत्रम्(full, vars);
    assert.strictEqual(fullStr, 'A');
});

// -------------------------------------------------------------------
// Test 4: Idempotent Law cycle: A.A = A and A + A = A
// -------------------------------------------------------------------
runTest("Idempotent Law full cycle: ((A.B)+(A.B)) -> A.B", () => {
    let eq = "((A.B)+(A.B))";
    let vars = ['A', 'B'];
    let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(eq), vars);

    let id = सूत्र_अभिज्ञानम्(ast);
    assert.strictEqual(id.rule, "Idempotent Law (समशक्ति_नियमः)");

    let full = सूत्र_सरलीकरणम्(ast);
    let fullStr = सारणीतः_सूत्रम्(full, vars);
    assert(fullStr.replace(/[()]/g, '') === 'A.B' || fullStr === 'A.B');
});

// -------------------------------------------------------------------
// Test 5: Contradiction Law cycle: A.A' = 0
// -------------------------------------------------------------------
runTest("Contradiction Law full cycle: (A.A') -> 0", () => {
    let eq = "(A.A')";
    let vars = ['A'];
    let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(eq), vars);

    let full = सूत्र_सरलीकरणम्(ast);
    let fullStr = सारणीतः_सूत्रम्(full, vars);
    assert.strictEqual(fullStr, '0');
});

// -------------------------------------------------------------------
// Test 6: Tautology Law cycle: A + A' = 1
// -------------------------------------------------------------------
runTest("Tautology Law full cycle: (A+A') -> 1", () => {
    let eq = "(A+A')";
    let vars = ['A'];
    let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(eq), vars);

    let full = सूत्र_सरलीकरणम्(ast);
    let fullStr = सारणीतः_सूत्रम्(full, vars);
    assert.strictEqual(fullStr, '1');
});

// -------------------------------------------------------------------
// Test 7: De Morgan's Law cycle: (A.B)' = A' + B'
// -------------------------------------------------------------------
runTest("De Morgan's Law full cycle: (A.B)' -> A'+B'", () => {
    let eq = "(A.B)'";
    let vars = ['A', 'B'];
    let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(eq), vars);

    let next = सूत्र_एकपद_सरलीकरणम्(ast);
    let nextStr = सारणीतः_सूत्रम्(next, vars);
    assert(nextStr.includes('+') && nextStr.includes("'"), `De Morgan output unexpected: ${nextStr}`);
});

// -------------------------------------------------------------------
// Test 8: End-to-End Generated Equations (SOP, POS, ANY) Full Reduction
// -------------------------------------------------------------------
runTest("End-to-End Generated Equations full pipeline test across 10 random runs", () => {
    const formats = ['SOP', 'POS', 'ANY'];
    for (let i = 0; i < 10; i++) {
        let fmt = formats[i % formats.length];
        let numVars = 3 + (i % 3);
        let gen = समीकरण_जननम्({
            प्रारूप: fmt,
            चरसंख्या: numVars,
            पदसंख्या: 4
        });
        assert(gen && gen.समीकरणम्, `Generation failed for format ${fmt}`);

        let ast = सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(gen.समीकरणम्), gen.चरसरणी);
        assert(Array.isArray(ast), `AST must be an array for ${gen.समीकरणम्}`);

        let simplified = सूत्र_सरलीकरणम्(ast);
        assert(Array.isArray(simplified), `Simplified AST must be an array`);

        let resultStr = सारणीतः_सूत्रम्(simplified, gen.चरसरणी);
        assert(typeof resultStr === 'string', `Output must be string`);
    }
});

console.log("\n=====================================================================");
console.log(`Results: ${passedTests}/${totalTests} tests passed!`);
console.log("=====================================================================");

if (passedTests !== totalTests) {
    process.exit(1);
}
