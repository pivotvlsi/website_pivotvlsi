const assert = require('assert');
const { अभिज्ञान_द्विगुण_निषेध_अथवा } = require('./abijnana_11.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_द्विगुण_निषेध_अथवा (((A+B)')' -> A+B Transformation Check)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    let leafD = [2, 2, 2, 1, 2]; // D

    // Test 1: Simple NOR wrapped in NOT: ((A+B)')' -> A+B
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple NOR wrapped in NOT: ((A+B)')' -> A+B");
    
    // ((A+B)')' -> represented as NAND [2] with 1 child which is NOR [3]
    let ast1 = [2, [3, leafA, leafB]]; 
    let ast1_transformed = [1, leafA, leafB]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    
    let result1 = अभिज्ञान_द्विगुण_निषेध_अथवा(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Two NOTs wrapping an OR: ((A+B)')' -> A+B
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Two NOTs wrapping an OR: ((A+B)')' -> A+B");
    
    // NOT(NOT(A+B)) -> [2, [2, [1, leafA, leafB]]]
    let ast2 = [2, [2, [1, leafA, leafB]]]; 
    let ast2_transformed = [1, leafA, leafB];
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    console.log(`Input (ast2_transformed): ${ सूचितः_सूत्रम्(ast2_transformed, variables) }`);
    
    let result2 = अभिज्ञान_द्विगुण_निषेध_अथवा(ast2, ast2_transformed);
    assert.strictEqual(result2, true, "Failed Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Invalid transformation ((A+B)')' -> A.B
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Invalid transformation ((A+B)')' -> A.B");
    
    let ast3_invalid = [0, leafA, leafB]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast3_invalid)    : ${ सूचितः_सूत्रम्(ast3_invalid, variables) }`);
    
    let result3 = अभिज्ञान_द्विगुण_निषेध_अथवा(ast1, ast3_invalid);
    assert.strictEqual(result3, false, "Failed Test 3");
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Transformation embedded within a larger AST: D + ((A+B)')' -> D + (A+B)
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Transformation embedded within a larger AST: D + ((A+B)')' -> D + (A+B)");
    
    let ast4 = [1, leafD, ast1]; 
    let ast4_transformed = [1, leafD, ast1_transformed]; 
    
    console.log(`Input (ast4)            : ${ सूचितः_सूत्रम्(ast4, variables) }`);
    console.log(`Input (ast4_transformed): ${ सूचितः_सूत्रम्(ast4_transformed, variables) }`);
    
    let result4 = अभिज्ञान_द्विगुण_निषेध_अथवा(ast4, ast4_transformed);
    assert.strictEqual(result4, true, "Failed Test 4");
    console.log(`✅ Test 4 Passed\n`);

    console.log("All tests passed!");
} catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
}
