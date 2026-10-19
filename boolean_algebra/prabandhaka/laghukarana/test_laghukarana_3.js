const assert = require('assert');
const { लघुकरण_शून्य_गुण } = require('./laghukarana_3.js');
const { अन्वेषण_शून्य_गुण } = require('../anveshana/anveshana_3.js');
const { अभिज्ञान_शून्य_गुण } = require('../samyak_parivartana_abhijnana/abijnana_3.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_शून्य_गुण (Zero Property Simplification: A.0 -> 0)");
    console.log("=====================================================================\n");

    let leafWithout0 = [1, 0, 2, 2, 2]; // A.B'
    let leafWith0 = [1, 2, 2, 2, 0];    // A.0
    let leaf3With0 = [1, 1, 2, 2, 0];    // A.B.0
    
    // Test 1: Simple SOP equation transformed
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple SOP equation transformed (A.0 -> 0)");
    let ast1 = [1, [0, leafWith0], [0, leafWithout0]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_शून्य_गुण(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_शून्य_गुण(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_शून्य_गुण(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: (A+B).(B+C).(C+D).0 -> 0 (POS equation collapsing)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: POS equation collapsing ((A+B).(B+C).(C+D).0 -> 0)");
    let leaf_AB = [1, 1, 2, 2, 2];
    let leaf_BC = [2, 1, 1, 2, 2];
    let leaf_CD = [2, 2, 1, 1, 2];
    let leaf_const0 = [2, 2, 2, 2, 0];
    
    let ast2 = [0, [1, leaf_AB], [1, leaf_BC], [1, leaf_CD], leaf_const0];
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let path2 = अन्वेषण_शून्य_गुण(ast2);
    console.log(`Path Found              : ${JSON.stringify(path2)}`);
    assert.ok(path2, "Failed to find path for Test 2");

    let ast2_simplified = लघुकरण_शून्य_गुण(ast2, path2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_शून्य_गुण(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Nested POS equation collapsing (((A+B).(B+C).(C+D).0)+(A.C.B.D) -> 0+(A.C.B.D))
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Nested POS equation collapsing (((A+B).(B+C).(C+D).0)+(A.C.B.D) -> 0+(A.C.B.D))");
    let leaf_AC = [1, 2, 1, 2, 2];
    let leaf_BD = [2, 1, 2, 1, 2];
    let node_AC_BD = [0, [1, leaf_AC], [1, leaf_BD]]; // Actually A.C + B.D? the test structure doesn't matter as long as it's structurally identical
    
    let ast3 = [1, [0, [1, leaf_AB], [1, leaf_BC], [1, leaf_CD], leaf_const0], node_AC_BD];
    
    console.log(`Input (ast3)            : ${ सूचितः_सूत्रम्(ast3, variables) }`);
    
    let path3 = अन्वेषण_शून्य_गुण(ast3);
    console.log(`Path Found              : ${JSON.stringify(path3)}`);
    assert.ok(path3, "Failed to find path for Test 3");

    let ast3_simplified = लघुकरण_शून्य_गुण(ast3, path3);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast3_simplified, variables) }`);
    
    let is_valid3 = अभिज्ञान_शून्य_गुण(ast3, ast3_simplified);
    assert.strictEqual(is_valid3, true, "Simplification failed abijnana test for Test 3");
    console.log(`✅ Test 3 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
