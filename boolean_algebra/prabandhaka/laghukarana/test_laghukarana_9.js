const assert = require('assert');
const { लघुकरण_अवशोषण_१ } = require('./laghukarana_9.js');
const { अन्वेषण_अवशोषण } = require('../anveshana/anveshana_9.js');
const { अभिज्ञान_अवशोषण_१ } = require('../samyak_parivartana_abhijnana/abijnana_9.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_अवशोषण_१ (Absorption 1: A + A.B -> A)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    
    // Test 1: Simple A + A.B -> A
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple A + A.B -> A");
    let ast1 = [1, leafA, [0, leafA, leafB]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let paths1 = अन्वेषण_अवशोषण(ast1);
    console.log(`Paths Found             : ${JSON.stringify(paths1)}`);
    assert.ok(paths1, "Failed to find paths for Test 1");

    let ast1_simplified = लघुकरण_अवशोषण_१(ast1, paths1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_अवशोषण_१(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Nested A.B + A -> A
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Reverse order A.B + A -> A");
    let ast2 = [1, [0, leafA, leafB], leafA]; 
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let paths2 = अन्वेषण_अवशोषण(ast2);
    console.log(`Paths Found             : ${JSON.stringify(paths2)}`);
    assert.ok(paths2, "Failed to find paths for Test 2");

    let ast2_simplified = लघुकरण_अवशोषण_१(ast2, paths2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_अवशोषण_१(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
