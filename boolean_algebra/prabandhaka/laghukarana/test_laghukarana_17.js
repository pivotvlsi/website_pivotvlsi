const assert = require('assert');
const { लघुकरण_अवशोषण_३ } = require('./laghukarana_17.js');
const { अन्वेषण_अवशोषण_३ } = require('../anveshana/anveshana_17.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_अवशोषण_३ (Advanced Absorption SOP: C.V + C.V'.W -> C.V + C.W)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2]; // A
    let leafA_prime = [0, 2, 2, 2]; // A'
    let leafB = [2, 1, 2, 2]; // B
    let termAprimeB = [0, leafA_prime, leafB]; // A'.B
    
    // Test 1: A + A'.B -> A + B
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple Advanced Absorption: A + A'.B -> A + B");
    
    let ast1 = [1, leafA, termAprimeB];  
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_अवशोषण_३(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_अवशोषण_३(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    // Check if the A' was removed (so it becomes A + B)
    assert.strictEqual(ast1_simplified[2][1][0], 2, "A' should be removed, leaving 1 (variable A index becomes 2)");
    console.log(`✅ Test 1 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
