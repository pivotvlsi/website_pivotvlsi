const assert = require('assert');
const { लघुकरण_सम्मति_३ } = require('./laghukarana_19.js');
const { अन्वेषण_सम्मति_३ } = require('../anveshana/anveshana_19.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_सम्मति_३ (Consensus SOP: C.V.W + C.V'.X + C.W.X -> C.V.W + C.V'.X)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2]; // A
    let leafAprime = [0, 2, 2, 2]; // A'
    let leafB = [2, 1, 2, 2]; // B
    let leafBprime = [2, 0, 2, 2]; // B'
    let leafC = [2, 2, 1, 2]; // C
    
    let termAB = [0, leafA, leafB]; // A.B
    let termAprimeC = [0, leafAprime, leafC]; // A'.C
    let termBprimeC = [0, leafBprime, leafC]; // B'.C
    
    // Test 1: A.B + A'.C + B'.C -> A.B + A'.C + C
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Advanced Consensus: A.B + A'.C + B'.C -> A.B + A'.C + C");
    
    let ast1 = [1, termAB, termAprimeC, termBprimeC]; 
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_सम्मति_३(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_सम्मति_३(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    assert.strictEqual(ast1_simplified[3][1][1], 2, "B' should be removed, leaving C (variable B index becomes 2)");
    console.log(`✅ Test 1 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
