const assert = require('assert');
const { लघुकरण_विरोध } = require('./laghukarana_5.js');

// Note: anveshana_5.js handles the Contradiction search (A.A'=0)
// anveshana_5.js handles the Tautology search (A+A'=1)
// This seems to be a swap in the anveshana files, but we import 6 to match abijnana_5.
const { अन्वेषण_विरोधाभास } = require('../anveshana/anveshana_5.js');
const { अभिज्ञान_विरोध } = require('../samyak_parivartana_abhijnana/abijnana_5.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_विरोध (Contradiction Simplification: A.A' -> 0)");
    console.log("=====================================================================\n");

    let leafWithoutContradiction = [1, 0, 2, 2, 2]; // A.B'
    let leafWithContradiction = [3, 2, 2, 2, 2];    // A.A'
    
    // Test 1: Simple SOP equation transformed
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple SOP equation transformed (A.A' -> 0)");
    let ast1 = [1, [0, leafWithContradiction], [0, leafWithoutContradiction]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_विरोधाभास(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_विरोध(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_विरोध(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Nested POS equation leaf transformation ((A+B).(A.A'.C).(C+D) -> (A+B).(0).(C+D))
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Nested POS equation leaf transformation ((A+B).(A.A'.C).(C+D) -> (A+B).(0).(C+D))");
    let leaf_AB = [1, 1, 2, 2, 2];
    let leaf_CD = [2, 2, 1, 1, 2];
    let leaf_contradiction_C = [3, 2, 1, 2, 2]; // A.A'.C
    
    let ast2 = [0, [1, leaf_AB], [0, leaf_contradiction_C], [1, leaf_CD]];
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let path2 = अन्वेषण_विरोधाभास(ast2);
    console.log(`Path Found              : ${JSON.stringify(path2)}`);
    assert.ok(path2, "Failed to find path for Test 2");

    let ast2_simplified = लघुकरण_विरोध(ast2, path2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_विरोध(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
