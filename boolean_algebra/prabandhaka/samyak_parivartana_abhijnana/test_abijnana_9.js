const assert = require('assert');
const { अभिज्ञान_अवशोषण_१ } = require('./abijnana_9.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_अवशोषण_१ (A + A.B -> A Transformation Check)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    let leafD = [2, 2, 2, 1, 2]; // D

    // Test 1: Simple A + A.B -> A
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple A + A.B -> A");
    
    // A + (A.B)
    let ast1 = [1, leafA, [0, leafA, leafB]]; 
    
    // A
    let ast1_transformed = leafA; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    
    let result1 = अभिज्ञान_अवशोषण_१(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Invalid transformation A + B.C -> A
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Invalid transformation A + B.C -> A");
    
    let ast2_invalid_src = [1, leafA, [0, leafB, leafC]]; 
    console.log(`Input (ast2_invalid)    : ${ सूचितः_सूत्रम्(ast2_invalid_src, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    
    let result2 = अभिज्ञान_अवशोषण_१(ast2_invalid_src, ast1_transformed);
    assert.strictEqual(result2, false, "Failed Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Commutativity inside the AND node: A + B.A -> A
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Commutativity inside the AND node: A + B.A -> A");
    
    let ast3 = [1, leafA, [0, leafB, leafA]]; 
    
    console.log(`Input (ast3)            : ${ सूचितः_सूत्रम्(ast3, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    
    let result3 = अभिज्ञान_अवशोषण_१(ast3, ast1_transformed);
    assert.strictEqual(result3, true, "Failed Test 3");
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Commutativity in the OR node: A.B + A -> A
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Commutativity in the OR node: A.B + A -> A");
    
    let ast4 = [1, [0, leafA, leafB], leafA]; 
    
    console.log(`Input (ast4)            : ${ सूचितः_सूत्रम्(ast4, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    
    let result4 = अभिज्ञान_अवशोषण_१(ast4, ast1_transformed);
    assert.strictEqual(result4, true, "Failed Test 4");
    console.log(`✅ Test 4 Passed\n`);

    // Test 5: Transformation embedded within a larger AST: D + (A + A.B) -> D + A
    console.log("---------------------------------------------------------------------");
    console.log("Test 5: Transformation embedded within a larger AST: D + (A + A.B) -> D + A");
    
    let ast5 = [1, leafD, ast1]; 
    let ast5_transformed = [1, leafD, leafA]; 
    
    console.log(`Input (ast5)            : ${ सूचितः_सूत्रम्(ast5, variables) }`);
    console.log(`Input (ast5_transformed): ${ सूचितः_सूत्रम्(ast5_transformed, variables) }`);
    
    let result5 = अभिज्ञान_अवशोषण_१(ast5, ast5_transformed);
    assert.strictEqual(result5, true, "Failed Test 5");
    console.log(`✅ Test 5 Passed\n`);

    console.log("All tests passed!");
} catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
}
