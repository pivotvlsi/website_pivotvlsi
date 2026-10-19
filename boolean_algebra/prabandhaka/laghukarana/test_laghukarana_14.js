const assert = require('assert');
const { लघुकरण_सम्मति_२ } = require('./laghukarana_14.js');
const { अन्वेषण_सम्मति_२ } = require('../anveshana/anveshana_14.js');
const { अभिज्ञान_सम्मति_२ } = require('../samyak_parivartana_abhijnana/abijnana_14.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_सम्मति_२ (Consensus Theorem 2: (A+B).(A'+C).(B+C) -> (A+B).(A'+C))");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafANot = [0, 2, 2, 2, 2]; // A'
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    
    // Test 1: Simple Consensus Theorem 2
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple Consensus Theorem 2: (A+B).(A'+C).(B+C) -> (A+B).(A'+C)");
    let term1 = [1, leafA, leafB];      // A+B
    let term2 = [1, leafANot, leafC];   // A'+C
    let term3 = [1, leafB, leafC];      // B+C
    
    let ast1 = [0, term1, term2, term3]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let paths1 = अन्वेषण_सम्मति_२(ast1);
    console.log(`Paths Found             : ${JSON.stringify(paths1)}`);
    assert.ok(paths1, "Failed to find paths for Test 1");

    let ast1_simplified = लघुकरण_सम्मति_२(ast1, paths1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_सम्मति_२(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Different order (A'+C).(B+C).(A+B) -> (A'+C).(A+B)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Different order (A'+C).(B+C).(A+B) -> (A'+C).(A+B)");
    let ast2 = [0, term2, term3, term1]; 
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let paths2 = अन्वेषण_सम्मति_२(ast2);
    console.log(`Paths Found             : ${JSON.stringify(paths2)}`);
    assert.ok(paths2, "Failed to find paths for Test 2");

    let ast2_simplified = लघुकरण_सम्मति_२(ast2, paths2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_सम्मति_२(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
