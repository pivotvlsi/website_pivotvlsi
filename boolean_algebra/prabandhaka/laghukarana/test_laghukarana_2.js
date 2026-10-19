const assert = require('assert');
const { लघुकरण_एक_गुण } = require('./laghukarana_2.js');
const { अन्वेषण_एक_गुण } = require('../anveshana/anveshana_2.js');
const { अभिज्ञान_एक_गुण } = require('../samyak_parivartana_abhijnana/abijnana_2.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_एक_गुण (One Property Simplification: A+1 -> 1)");
    console.log("=====================================================================\n");

    let leafWithout1 = [1, 0, 2, 2, 2]; // A, B'
    let leafWith1 = [1, 2, 2, 2, 1];    // A, 1
    let leaf3With1 = [1, 1, 2, 2, 1];    // A, B, 1
    
    // Test 1: Simple POS equation transformed
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple POS equation transformed (A+1 -> 1)");
    let ast1 = [0, [1, leafWith1], [1, leafWithout1]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_एक_गुण(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_एक_गुण(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_एक_गुण(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: AB+BC+CD+1 -> 1 (SOP equation collapsing)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: SOP equation collapsing (AB+BC+CD+1 -> 1)");
    let leaf_AB = [1, 1, 2, 2, 2];
    let leaf_BC = [2, 1, 1, 2, 2];
    let leaf_CD = [2, 2, 1, 1, 2];
    let leaf_const1 = [2, 2, 2, 2, 1];
    
    let ast2 = [1, [0, leaf_AB], [0, leaf_BC], [0, leaf_CD], leaf_const1];
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let path2 = अन्वेषण_एक_गुण(ast2);
    console.log(`Path Found              : ${JSON.stringify(path2)}`);
    assert.ok(path2, "Failed to find path for Test 2");

    let ast2_simplified = लघुकरण_एक_गुण(ast2, path2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_एक_गुण(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Nested SOP equation collapsing ((AB+BC+CD+1).(AC+BD) -> 1.(AC+BD))
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Nested SOP equation collapsing ((AB+BC+CD+1).(AC+BD) -> 1.(AC+BD))");
    let leaf_AC = [1, 2, 1, 2, 2];
    let leaf_BD = [2, 1, 2, 1, 2];
    let node_AC_BD = [1, [0, leaf_AC], [0, leaf_BD]];
    
    let ast3 = [0, [1, [0, leaf_AB], [0, leaf_BC], [0, leaf_CD], leaf_const1], node_AC_BD];
    
    console.log(`Input (ast3)            : ${ सूचितः_सूत्रम्(ast3, variables) }`);
    
    let path3 = अन्वेषण_एक_गुण(ast3);
    console.log(`Path Found              : ${JSON.stringify(path3)}`);
    assert.ok(path3, "Failed to find path for Test 3");

    let ast3_simplified = लघुकरण_एक_गुण(ast3, path3);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast3_simplified, variables) }`);
    
    let is_valid3 = अभिज्ञान_एक_गुण(ast3, ast3_simplified);
    assert.strictEqual(is_valid3, true, "Simplification failed abijnana test for Test 3");
    console.log(`✅ Test 3 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
