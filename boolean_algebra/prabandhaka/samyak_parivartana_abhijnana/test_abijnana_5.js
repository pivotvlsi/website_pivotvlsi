const assert = require('assert');
const { अभिज्ञान_विरोध } = require('./abijnana_5.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_विरोध (A.A' = 0 Contradiction Transformation Check)");
    console.log("=====================================================================\n");

    let leafWithoutContradiction = [1, 0, 2, 2, 2]; // A, B'
    let leafWithContradiction = [3, 2, 2, 2, 2];    // A, A'
    let leafWithContradiction_Transformed = [2, 2, 2, 2, 0]; // 0

    let leaf2WithContradiction = [2, 3, 2, 2, 2];    // B, B'
    let leaf2WithContradiction_Transformed = [2, 2, 2, 2, 0]; // 0

    let leaf3WithContradiction = [3, 1, 2, 2, 2];    // A, A', B
    let leaf3WithContradiction_Transformed = [2, 2, 2, 2, 0]; // 0

    // Test 1: Simple SOP equation transformed (A.A' -> 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple SOP equation transformed (A.A' -> 0)");
    let ast1 = [1, [0, leafWithContradiction], [0, leafWithoutContradiction]]; 
    let ast1_transformed = [1, [0, leafWithContradiction_Transformed], [0, leafWithoutContradiction]]; 
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    let result1 = अभिज्ञान_विरोध(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`Actual Output           : ${result1} (Expected: true)`);
    console.log(`How it passed           : The function detects that the leaf containing A.A' (state 3) was correctly transformed into the constant 0.`);
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Another valid A.A' Transformation (B.B' -> 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Another valid B.B' Transformation (B.B' -> 0)");
    let ast2 = [1, [0, leaf2WithContradiction], [0, leafWithoutContradiction]]; 
    let ast2_transformed = [1, [0, leaf2WithContradiction_Transformed], [0, leafWithoutContradiction]];
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    console.log(`Input (ast2_transformed): ${ सूचितः_सूत्रम्(ast2_transformed, variables) }`);
    let result2 = अभिज्ञान_विरोध(ast2, ast2_transformed);
    assert.strictEqual(result2, true, "Failed Test 2");
    console.log(`Actual Output           : ${result2} (Expected: true)`);
    console.log(`How it passed           : The function detects that the leaf containing B.B' (state 3) was correctly transformed into the constant 0.`);
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: No transformation applied
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: No transformation applied");
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    let result3 = अभिज्ञान_विरोध(ast1, ast1);
    assert.strictEqual(result3, false, "Failed Test 3");
    console.log(`Actual Output           : ${result3} (Expected: false)`);
    console.log(`How it passed           : The function finds zero differences between the ASTs. Since no transformation took place, it returns false.`);
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Invalid transformation (A variable changed instead of becoming constant 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Invalid transformation (A variable changed instead of becoming constant 0)");
    let leafInvalid = [1, 2, 2, 2, 2]; // changed A.A' to just A
    let ast4_invalid = [1, [0, leafInvalid], [0, leafWithoutContradiction]];
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast4_invalid)    : ${ सूचितः_सूत्रम्(ast4_invalid, variables) }`);
    let result4 = अभिज्ञान_विरोध(ast1, ast4_invalid);
    assert.strictEqual(result4, false, "Failed Test 4");
    console.log(`Actual Output           : ${result4} (Expected: false)`);
    console.log(`How it passed           : The function detects that the leaf did not become exactly [2,2,2,2,0]. It correctly identifies this as invalid and returns false.`);
    console.log(`✅ Test 4 Passed\n`);
    
    // Test 5: Multiple valid transformations applied simultaneously (Should fail)
    console.log("---------------------------------------------------------------------");
    console.log("Test 5: Multiple valid transformations applied simultaneously (Should fail)");
    let ast5 = [1, [0, leafWithContradiction], [0, leaf2WithContradiction]];
    let ast5_transformed = [1, [0, leafWithContradiction_Transformed], [0, leaf2WithContradiction_Transformed]];
    console.log(`Input (ast5)            : ${ सूचितः_सूत्रम्(ast5, variables) }`);
    console.log(`Input (ast5_transformed): ${ सूचितः_सूत्रम्(ast5_transformed, variables) }`);
    let result5 = अभिज्ञान_विरोध(ast5, ast5_transformed);
    assert.strictEqual(result5, false, "Failed Test 5");
    console.log(`Actual Output           : ${result5} (Expected: false)`);
    console.log(`How it passed           : The function detects multiple transformations at once, but only exactly ONE transformation per step is allowed. Thus it returns false.`);
    console.log(`✅ Test 5 Passed\n`);

    // Test 6: 3+ terms in an AND equation (A.A'.B -> 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 6: 3+ terms in an AND equation (A.A'.B -> 0)");
    let ast6 = [1, [0, leaf3WithContradiction], [0, leafWithoutContradiction]];
    let ast6_transformed = [1, [0, leaf3WithContradiction_Transformed], [0, leafWithoutContradiction]];
    console.log(`Input (ast6)            : ${ सूचितः_सूत्रम्(ast6, variables) }`);
    console.log(`Input (ast6_transformed): ${ सूचितः_सूत्रम्(ast6_transformed, variables) }`);
    let result6 = अभिज्ञान_विरोध(ast6, ast6_transformed);
    assert.strictEqual(result6, true, "Failed Test 6");
    console.log(`Actual Output           : ${result6} (Expected: true)`);
    console.log(`How it passed           : The function identifies that a 3-term AND equation containing A.A' was correctly transformed into the constant 0.`);
    console.log(`✅ Test 6 Passed\n`);

    // Test 7: Nested AND-in-OR equation leaf reduction ((A.A')+(B.B') -> 0+(B.B'))
    console.log("---------------------------------------------------------------------");
    console.log("Test 7: Nested AND-in-OR equation leaf reduction ((A.A')+(B.B') -> 0+(B.B'))");
    let ast7 = [1, [0, leafWithContradiction], [0, leaf2WithContradiction]];
    let ast7_transformed = [1, [0, leafWithContradiction_Transformed], [0, leaf2WithContradiction]];
    console.log(`Input (ast7)            : ${ सूचितः_सूत्रम्(ast7, variables) }`);
    console.log(`Input (ast7_transformed): ${ सूचितः_सूत्रम्(ast7_transformed, variables) }`);
    let result7 = अभिज्ञान_विरोध(ast7, ast7_transformed);
    assert.strictEqual(result7, true, "Failed Test 7");
    console.log(`Actual Output           : ${result7} (Expected: true)`);
    console.log(`How it passed           : The function detects that exactly one of the AND-nodes containing a contradiction collapsed to 0 in the OR equation.`);
    console.log(`✅ Test 7 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
