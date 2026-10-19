const assert = require('assert');
const { लघुकरण_तत्समक_अन् } = require('./laghukarana_4.js');
const { अन्वेषण_तत्समक_अन् } = require('../anveshana/anveshana_4.js');
const { अभिज्ञान_तत्समक_अन् } = require('../samyak_parivartana_abhijnana/abijnana_4.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_तत्समक_अन् (Identity AND Simplification: A.1 -> A)");
    console.log("=====================================================================\n");

    let leafWithout1 = [1, 0, 2, 2, 2]; // A.B'
    let leafWith1 = [1, 2, 2, 2, 1];    // A.1
    let leaf3With1 = [1, 1, 2, 2, 1];    // A.B.1
    
    // Test 1: Simple SOP equation transformed
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple SOP equation transformed (A.1 -> A)");
    let ast1 = [1, [0, leafWith1], [0, leafWithout1]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_तत्समक_अन्(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_तत्समक_अन्(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_तत्समक_अन्(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: (A+B).(B+C).(C+D).1 -> (A+B).(B+C).(C+D) (POS leaf removal)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: POS equation leaf removal ((A+B).(B+C).(C+D).1 -> (A+B).(B+C).(C+D))");
    let leaf_AB = [1, 1, 2, 2, 2];
    let leaf_BC = [2, 1, 1, 2, 2];
    let leaf_CD = [2, 2, 1, 1, 2];
    let leaf_const1 = [2, 2, 2, 2, 1];
    
    let ast2 = [0, [1, leaf_AB], [1, leaf_BC], [1, leaf_CD], leaf_const1];
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let path2 = अन्वेषण_तत्समक_अन्(ast2);
    console.log(`Path Found              : ${JSON.stringify(path2)}`);
    assert.ok(path2, "Failed to find path for Test 2");

    let ast2_simplified = लघुकरण_तत्समक_अन्(ast2, path2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_तत्समक_अन्(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
