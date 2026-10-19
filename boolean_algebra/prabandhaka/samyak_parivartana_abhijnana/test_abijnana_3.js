const assert = require('assert');
const { अभिज्ञान_शून्य_गुण } = require('./abijnana_3.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_शून्य_गुण (A.0 = 0 Transformation Check)");
    console.log("=====================================================================\n");

    let leafWithout0 = [1, 0, 2, 2, 2]; // A, B'
    let leafWith0 = [1, 2, 2, 2, 0];    // A, 0
    let leafWith0_Transformed = [2, 2, 2, 2, 0]; // 0

    let leaf2With0 = [2, 1, 2, 2, 0];    // B, 0
    let leaf2With0_Transformed = [2, 2, 2, 2, 0]; // 0

    let leaf3With0 = [1, 1, 2, 2, 0];    // A, B, 0
    let leaf3With0_Transformed = [2, 2, 2, 2, 0]; // 0

    // Test 1: Simple SOP equation transformed (A.0 -> 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple SOP equation transformed (A.0 -> 0)");
    let ast1 = [1, [0, leafWith0], [0, leafWithout0]]; 
    let ast1_transformed = [1, [0, leafWith0_Transformed], [0, leafWithout0]]; 
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    let result1 = अभिज्ञान_शून्य_गुण(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`Actual Output           : ${result1} (Expected: true)`);
    console.log(`How it passed           : The function detects that the leaf A.0 was correctly transformed into the constant 0.`);
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Another valid A.0 Transformation (B.0 -> 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Another valid A.0 Transformation (B.0 -> 0)");
    let ast2 = [1, [0, leaf2With0], [0, leafWithout0]]; 
    let ast2_transformed = [1, [0, leaf2With0_Transformed], [0, leafWithout0]];
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    console.log(`Input (ast2_transformed): ${ सूचितः_सूत्रम्(ast2_transformed, variables) }`);
    let result2 = अभिज्ञान_शून्य_गुण(ast2, ast2_transformed);
    assert.strictEqual(result2, true, "Failed Test 2");
    console.log(`Actual Output           : ${result2} (Expected: true)`);
    console.log(`How it passed           : The function detects that the leaf B.0 was correctly transformed into the constant 0.`);
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: No transformation applied
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: No transformation applied");
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    let result3 = अभिज्ञान_शून्य_गुण(ast1, ast1);
    assert.strictEqual(result3, false, "Failed Test 3");
    console.log(`Actual Output           : ${result3} (Expected: false)`);
    console.log(`How it passed           : The function finds zero differences between the ASTs. Since no transformation took place, it returns false.`);
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Invalid transformation (A variable changed instead of becoming constant 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Invalid transformation (A variable changed instead of becoming constant 0)");
    let leafInvalid = [1, 1, 2, 2, 0]; // changed variable A.0 to A.B.0, not a reduction
    let ast4_invalid = [1, [0, leafInvalid], [0, leafWithout0]];
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast4_invalid)    : ${ सूचितः_सूत्रम्(ast4_invalid, variables) }`);
    let result4 = अभिज्ञान_शून्य_गुण(ast1, ast4_invalid);
    assert.strictEqual(result4, false, "Failed Test 4");
    console.log(`Actual Output           : ${result4} (Expected: false)`);
    console.log(`How it passed           : The function detects that the leaf did not become exactly [2,2,2,2,0]. It correctly identifies this as invalid and returns false.`);
    console.log(`✅ Test 4 Passed\n`);
    
    // Test 5: Multiple valid transformations applied simultaneously (Should fail)
    console.log("---------------------------------------------------------------------");
    console.log("Test 5: Multiple valid transformations applied simultaneously (Should fail)");
    let ast5 = [1, [0, leafWith0], [0, leaf2With0]];
    let ast5_transformed = [1, [0, leafWith0_Transformed], [0, leaf2With0_Transformed]];
    console.log(`Input (ast5)            : ${ सूचितः_सूत्रम्(ast5, variables) }`);
    console.log(`Input (ast5_transformed): ${ सूचितः_सूत्रम्(ast5_transformed, variables) }`);
    let result5 = अभिज्ञान_शून्य_गुण(ast5, ast5_transformed);
    assert.strictEqual(result5, false, "Failed Test 5");
    console.log(`Actual Output           : ${result5} (Expected: false)`);
    console.log(`How it passed           : The function detects multiple transformations at once, but only exactly ONE transformation per step is allowed. Thus it returns false.`);
    console.log(`✅ Test 5 Passed\n`);

    // Test 6: 3+ terms in an AND equation (A.B.0 -> 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 6: 3+ terms in an AND equation (A.B.0 -> 0)");
    let ast6 = [1, [0, leaf3With0], [0, leafWithout0]];
    let ast6_transformed = [1, [0, leaf3With0_Transformed], [0, leafWithout0]];
    console.log(`Input (ast6)            : ${ सूचितः_सूत्रम्(ast6, variables) }`);
    console.log(`Input (ast6_transformed): ${ सूचितः_सूत्रम्(ast6_transformed, variables) }`);
    let result6 = अभिज्ञान_शून्य_गुण(ast6, ast6_transformed);
    assert.strictEqual(result6, true, "Failed Test 6");
    console.log(`Actual Output           : ${result6} (Expected: true)`);
    console.log(`How it passed           : The function identifies that a 3-term AND equation with a 0 was correctly transformed into the constant 0.`);
    console.log(`✅ Test 6 Passed\n`);

    let leaf_A_B = [1, 1, 2, 2, 2]; // (A+B) in POS
    let leaf_B_C = [2, 1, 1, 2, 2]; // (B+C)
    let leaf_C_D = [2, 2, 1, 1, 2]; // (C+D)
    let leaf_const0_POS = [2, 2, 2, 2, 0];
    
    // Test 7: POS equation collapsing ((A+B).(B+C).(C+D).0 -> 0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 7: POS equation collapsing ((A+B).(B+C).(C+D).0 -> 0)");
    let ast7 = [0, [1, leaf_A_B], [1, leaf_B_C], [1, leaf_C_D], leaf_const0_POS];
    let ast7_transformed = leaf_const0_POS;
    console.log(`Input (ast7)            : ${ सूचितः_सूत्रम्(ast7, variables) }`);
    console.log(`Input (ast7_transformed): ${ सूचितः_सूत्रम्(ast7_transformed, variables) }`);
    let result7 = अभिज्ञान_शून्य_गुण(ast7, ast7_transformed);
    assert.strictEqual(result7, true, "Failed Test 7");
    console.log(`Actual Output           : ${result7} (Expected: true)`);
    console.log(`How it passed           : The function detects that the entire AND equation collapses to 0 because it contains a constant 0 leaf.`);
    console.log(`✅ Test 7 Passed\n`);

    // Test 8: Nested POS equation collapsing (((A+B).(B+C).(C+D).0) + (A.C) -> 0 + (A.C))
    console.log("---------------------------------------------------------------------");
    console.log("Test 8: Nested POS equation collapsing (((A+B).(B+C).(C+D).0) + (A.C) -> 0 + (A.C))");
    let leaf_AC = [1, 2, 1, 2, 2];
    let node_AC = [0, leaf_AC];
    
    let ast8 = [1, [0, [1, leaf_A_B], [1, leaf_B_C], [1, leaf_C_D], leaf_const0_POS], node_AC];
    let ast8_transformed = [1, leaf_const0_POS, node_AC];
    console.log(`Input (ast8)            : ${ सूचितः_सूत्रम्(ast8, variables) }`);
    console.log(`Input (ast8_transformed): ${ सूचितः_सूत्रम्(ast8_transformed, variables) }`);
    let result8 = अभिज्ञान_शून्य_गुण(ast8, ast8_transformed);
    assert.strictEqual(result8, true, "Failed Test 8");
    console.log(`Actual Output           : ${result8} (Expected: true)`);
    console.log(`How it passed           : The function traverses the OR root and detects that exactly one of its children collapsed to the constant 0.`);
    console.log(`✅ Test 8 Passed\n`);

    // Test 9: Nested AND-in-OR equation leaf reduction ((A.0)+(B.0) -> (A.0)+0)
    console.log("---------------------------------------------------------------------");
    console.log("Test 9: Nested AND-in-OR equation leaf reduction ((A.0)+(B.0) -> (A.0)+0)");
    let leaf_A_0 = [1, 2, 2, 2, 0]; // (A.0) when in AND node
    let leaf_B_0 = [2, 1, 2, 2, 0]; // (B.0) when in AND node
    let leaf_const0_SOP = [2, 2, 2, 2, 0]; // 0

    let ast9 = [1, [0, leaf_A_0], [0, leaf_B_0]];
    let ast9_transformed = [1, [0, leaf_A_0], leaf_const0_SOP];
    console.log(`Input (ast9)            : ${ सूचितः_सूत्रम्(ast9, variables) }`);
    console.log(`Input (ast9_transformed): ${ सूचितः_सूत्रम्(ast9_transformed, variables) }`);
    let result9 = अभिज्ञान_शून्य_गुण(ast9, ast9_transformed);
    assert.strictEqual(result9, true, "Failed Test 9");
    console.log(`Actual Output           : ${result9} (Expected: true)`);
    console.log(`How it passed           : The function detects that exactly one of the (B.0) AND-nodes collapsed to 0 in the OR equation.`);
    console.log(`✅ Test 9 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
