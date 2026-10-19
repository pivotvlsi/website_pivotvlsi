const assert = require('assert');
const { लघुकरण_अवशोषण_४ } = require('./laghukarana_18.js');
const { अन्वेषण_अवशोषण_४ } = require('../anveshana/anveshana_18.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_अवशोषण_४ (Advanced Absorption POS: (C+V) . (C+V'+W) -> (C+V) . (C+W))");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2]; // A
    let leafA_prime = [0, 2, 2, 2]; // A'
    let leafB = [2, 1, 2, 2]; // B
    let termAprime_plus_B = [1, leafA_prime, leafB]; // A'+B
    // Wait, POS means we have an AND node (0) of OR nodes (1) or leaves? 
    // In POS, leaves are sums. leafA is A. leafA_prime_B is A' + B.
    
    // Test 1: A . (A'+B) -> A . B
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple Advanced Absorption POS: A . (A'+B) -> A . B");
    
    let ast1 = [0, leafA, termAprime_plus_B];  
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_अवशोषण_४(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_अवशोषण_४(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    assert.strictEqual(ast1_simplified[2][1][0], 2, "A' should be removed, leaving 1 (variable A index becomes 2)");
    console.log(`✅ Test 1 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
