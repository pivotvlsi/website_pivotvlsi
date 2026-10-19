const assert = require('assert');
const { लघुकरण_तत्समक_अथवा } = require('./laghukarana_1.js');
const { अन्वेषण_तत्समक_अथवा } = require('../anveshana/anveshana_1.js');
const { अभिज्ञान_तत्समक_अथवा } = require('../samyak_parivartana_abhijnana/abijnana_1.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_तत्समक_अथवा (Identity OR Simplification: A+0 -> A)");
    console.log("=====================================================================\n");

    let leafWithout0 = [1, 0, 2, 2, 2]; // A, B'
    let leafWith0 = [1, 2, 2, 2, 0];    // A, 0
    let leaf2With0 = [2, 1, 2, 2, 0];    // B, 0
    let leaf3With0 = [1, 1, 2, 2, 0];    // A, B, 0
    
    // Test 1: Simple POS equation transformed
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple POS equation transformed (A+0 -> A)");
    let ast1 = [0, [1, leafWith0], [1, leafWithout0]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_तत्समक_अथवा(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_तत्समक_अथवा(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_तत्समक_अथवा(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: AB+BC+CD+0 -> AB+BC+CD (SOP leaf removal)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: SOP equation leaf removal (AB+BC+CD+0 -> AB+BC+CD)");
    let leaf_AB = [1, 1, 2, 2, 2];
    let leaf_BC = [2, 1, 1, 2, 2];
    let leaf_CD = [2, 2, 1, 1, 2];
    let leaf_const0 = [2, 2, 2, 2, 0];
    
    let ast2 = [1, [0, leaf_AB], [0, leaf_BC], [0, leaf_CD], leaf_const0];
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let path2 = अन्वेषण_तत्समक_अथवा(ast2);
    console.log(`Path Found              : ${JSON.stringify(path2)}`);
    assert.ok(path2, "Failed to find path for Test 2");

    let ast2_simplified = लघुकरण_तत्समक_अथवा(ast2, path2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_तत्समक_अथवा(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
