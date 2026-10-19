const assert = require('assert');
const { अभिज्ञान_तत्समक_अन् } = require('./abijnana_4.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_तत्समक_अन् (Identity AND Transformation Check)");
    console.log("=====================================================================\n");

    let leafWithout1 = [1, 0, 2, 2, 2]; // A, B'
    let leafWith1 = [1, 2, 2, 2, 1];    // A, 1
    let leafWith1_Transformed = [1, 2, 2, 2, 2]; // A

    let leaf2With1 = [2, 1, 2, 2, 1];    // B, 1
    let leaf2With1_Transformed = [2, 1, 2, 2, 2]; // B

    let leaf3With1 = [1, 1, 2, 2, 1];    // A, B, 1
    let leaf3With1_Transformed = [1, 1, 2, 2, 2]; // A, B

    // Test 1: Simple SOP equation transformed (A.1 -> A)
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple SOP equation transformed (A.1 -> A)");
    let ast1 = [1, [0, leafWith1], [0, leafWithout1]]; 
    let ast1_transformed = [1, [0, leafWith1_Transformed], [0, leafWithout1]]; 
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    let result1 = अभिज्ञान_तत्समक_अन्(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`Actual Output           : ${result1} (Expected: true)`);
    console.log(`How it passed           : The function detects that the only difference is the leaf's constant changing from 1 to 2.`);
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Another valid A.1 Transformation (B.1 -> B)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Another valid A.1 Transformation (B.1 -> B)");
    let ast2 = [1, [0, leaf2With1], [0, leafWithout1]]; 
    let ast2_transformed = [1, [0, leaf2With1_Transformed], [0, leafWithout1]];
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    console.log(`Input (ast2_transformed): ${ सूचितः_सूत्रम्(ast2_transformed, variables) }`);
    let result2 = अभिज्ञान_तत्समक_अन्(ast2, ast2_transformed);
    assert.strictEqual(result2, true, "Failed Test 2");
    console.log(`Actual Output           : ${result2} (Expected: true)`);
    console.log(`How it passed           : The function detects that the only difference is the leaf's constant changing from 1 to 2.`);
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: No transformation applied
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: No transformation applied");
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    let result3 = अभिज्ञान_तत्समक_अन्(ast1, ast1);
    assert.strictEqual(result3, false, "Failed Test 3");
    console.log(`Actual Output           : ${result3} (Expected: false)`);
    console.log(`How it passed           : The function finds zero differences between the ASTs. Since no transformation took place, it returns false.`);
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Invalid transformation (A variable changed instead of a constant)
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Invalid transformation (A variable changed instead of a constant)");
    let leafInvalid = [1, 1, 2, 2, 2]; // changed B to 1, instead of changing trailing constant
    let ast4_invalid = [1, [0, leafInvalid], [0, leafWithout1]];
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast4_invalid)    : ${ सूचितः_सूत्रम्(ast4_invalid, variables) }`);
    let result4 = अभिज्ञान_तत्समक_अन्(ast1, ast4_invalid);
    assert.strictEqual(result4, false, "Failed Test 4");
    console.log(`Actual Output           : ${result4} (Expected: false)`);
    console.log(`How it passed           : The function detects a difference at index 1 of the leaf (a variable, not the trailing constant). It correctly identifies this as invalid and returns false.`);
    console.log(`✅ Test 4 Passed\n`);
    
    // Test 5: Multiple valid transformations applied simultaneously (Should fail)
    console.log("---------------------------------------------------------------------");
    console.log("Test 5: Multiple valid transformations applied simultaneously (Should fail)");
    let ast5 = [1, [0, leafWith1], [0, leaf2With1]];
    let ast5_transformed = [1, [0, leafWith1_Transformed], [0, leaf2With1_Transformed]];
    console.log(`Input (ast5)            : ${ सूचितः_सूत्रम्(ast5, variables) }`);
    console.log(`Input (ast5_transformed): ${ सूचितः_सूत्रम्(ast5_transformed, variables) }`);
    let result5 = अभिज्ञान_तत्समक_अन्(ast5, ast5_transformed);
    assert.strictEqual(result5, false, "Failed Test 5");
    console.log(`Actual Output           : ${result5} (Expected: false)`);
    console.log(`How it passed           : The function detects multiple transformations at once, but only exactly ONE transformation per step is allowed. Thus it returns false.`);
    console.log(`✅ Test 5 Passed\n`);

    // Test 6: 3+ terms in an AND equation (A.B.1 -> A.B)
    console.log("---------------------------------------------------------------------");
    console.log("Test 6: 3+ terms in an AND equation (A.B.1 -> A.B)");
    let ast6 = [1, [0, leaf3With1], [0, leafWithout1]];
    let ast6_transformed = [1, [0, leaf3With1_Transformed], [0, leafWithout1]];
    console.log(`Input (ast6)            : ${ सूचितः_सूत्रम्(ast6, variables) }`);
    console.log(`Input (ast6_transformed): ${ सूचितः_सूत्रम्(ast6_transformed, variables) }`);
    let result6 = अभिज्ञान_तत्समक_अन्(ast6, ast6_transformed);
    assert.strictEqual(result6, true, "Failed Test 6");
    console.log(`Actual Output           : ${result6} (Expected: true)`);
    console.log(`How it passed           : The function identifies that a 1 was correctly removed from a 3-term AND equation.`);
    console.log(`✅ Test 6 Passed\n`);

    let leaf_A_B = [1, 1, 2, 2, 2]; // (A+B) in POS
    let leaf_B_C = [2, 1, 1, 2, 2]; // (B+C)
    let leaf_C_D = [2, 2, 1, 1, 2]; // (C+D)
    let leaf_const1 = [2, 2, 2, 2, 1];
    
    // Test 7: POS equation leaf removal ((A+B).(B+C).(C+D).1 -> (A+B).(B+C).(C+D))
    console.log("---------------------------------------------------------------------");
    console.log("Test 7: POS equation leaf removal ((A+B).(B+C).(C+D).1 -> (A+B).(B+C).(C+D))");
    let ast7 = [0, [1, leaf_A_B], [1, leaf_B_C], [1, leaf_C_D], leaf_const1];
    let ast7_transformed = [0, [1, leaf_A_B], [1, leaf_B_C], [1, leaf_C_D]];
    console.log(`Input (ast7)            : ${ सूचितः_सूत्रम्(ast7, variables) }`);
    console.log(`Input (ast7_transformed): ${ सूचितः_सूत्रम्(ast7_transformed, variables) }`);
    let result7 = अभिज्ञान_तत्समक_अन्(ast7, ast7_transformed);
    assert.strictEqual(result7, true, "Failed Test 7");
    console.log(`Actual Output           : ${result7} (Expected: true)`);
    console.log(`How it passed           : The function detects that the AND equation correctly had a 1 constant leaf removed.`);
    console.log(`✅ Test 7 Passed\n`);

    // Test 8: Nested POS equation leaf removal (((A+B).(B+C).(C+D).1) + (A.C) -> ((A+B).(B+C).(C+D)) + (A.C))
    console.log("---------------------------------------------------------------------");
    console.log("Test 8: Nested POS equation leaf removal (((A+B).(B+C).(C+D).1) + (A.C) -> ((A+B).(B+C).(C+D)) + (A.C))");
    let leaf_AC = [1, 2, 1, 2, 2];
    let node_AC = [0, leaf_AC];
    
    let ast8 = [1, [0, [1, leaf_A_B], [1, leaf_B_C], [1, leaf_C_D], leaf_const1], node_AC];
    let ast8_transformed = [1, [0, [1, leaf_A_B], [1, leaf_B_C], [1, leaf_C_D]], node_AC];
    console.log(`Input (ast8)            : ${ सूचितः_सूत्रम्(ast8, variables) }`);
    console.log(`Input (ast8_transformed): ${ सूचितः_सूत्रम्(ast8_transformed, variables) }`);
    let result8 = अभिज्ञान_तत्समक_अन्(ast8, ast8_transformed);
    assert.strictEqual(result8, true, "Failed Test 8");
    console.log(`Actual Output           : ${result8} (Expected: true)`);
    console.log(`How it passed           : The function traverses the OR root and detects that exactly one of its children had a 1 constant leaf correctly removed.`);
    console.log(`✅ Test 8 Passed\n`);

    // Test 9: Nested AND-in-OR equation leaf reduction ((A.1)+(B.1) -> (A.1)+B)
    console.log("---------------------------------------------------------------------");
    console.log("Test 9: Nested AND-in-OR equation leaf reduction ((A.1)+(B.1) -> (A.1)+B)");
    let ast9 = [1, [0, leafWith1], [0, leaf2With1]];
    let ast9_transformed = [1, [0, leafWith1], [0, leaf2With1_Transformed]];
    console.log(`Input (ast9)            : ${ सूचितः_सूत्रम्(ast9, variables) }`);
    console.log(`Input (ast9_transformed): ${ सूचितः_सूत्रम्(ast9_transformed, variables) }`);
    let result9 = अभिज्ञान_तत्समक_अन्(ast9, ast9_transformed);
    assert.strictEqual(result9, true, "Failed Test 9");
    console.log(`Actual Output           : ${result9} (Expected: true)`);
    console.log(`How it passed           : The function detects that exactly one of the AND-nodes correctly removed its 1 constant leaf, while the other remained untouched.`);
    console.log(`✅ Test 9 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
