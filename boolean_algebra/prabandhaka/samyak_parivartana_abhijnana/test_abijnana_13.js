const assert = require('assert');
const { अभिज्ञान_सम्मति } = require('./abijnana_13.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_सम्मति (Consensus Theorem: A.B + A'.C + B.C = A.B + A'.C)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafNotA = [0, 2, 2, 2, 2]; // A'
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C

    // Test 1: Simple A.B + A'.C + B.C -> A.B + A'.C
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple Consensus Theorem transformation");
    let ast1 = [1, [0, leafA, leafB], [0, leafNotA, leafC], [0, leafB, leafC]]; 
    let ast1_transformed = [1, [0, leafA, leafB], [0, leafNotA, leafC]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    let result1 = अभिज्ञान_सम्मति(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`Actual Output           : ${result1} (Expected: true)`);
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: No transformation applied
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: No transformation applied");
    let result2 = अभिज्ञान_सम्मति(ast1, ast1);
    assert.strictEqual(result2, false, "Failed Test 2");
    console.log(`Actual Output           : ${result2} (Expected: false)`);
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Nested Consensus Theorem transformation
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Nested Consensus Theorem transformation");
    let outer_ast3 = [0, ast1, leafA];
    let outer_ast3_transformed = [0, ast1_transformed, leafA];
    
    console.log(`Input (outer_ast3)            : ${ सूचितः_सूत्रम्(outer_ast3, variables) }`);
    console.log(`Input (outer_ast3_transformed): ${ सूचितः_सूत्रम्(outer_ast3_transformed, variables) }`);
    let result3 = अभिज्ञान_सम्मति(outer_ast3, outer_ast3_transformed);
    assert.strictEqual(result3, true, "Failed Test 3");
    console.log(`Actual Output           : ${result3} (Expected: true)`);
    console.log(`✅ Test 3 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
