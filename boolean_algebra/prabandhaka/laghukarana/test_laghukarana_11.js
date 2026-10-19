const assert = require('assert');
const { लघुकरण_द्विगुण_निषेध_अथवा } = require('./laghukarana_11.js');
const { अन्वेषण_द्विगुण_निषेध_अथवा } = require('../anveshana/anveshana_11.js');
const { अभिज्ञान_द्विगुण_निषेध_अथवा } = require('../samyak_parivartana_abhijnana/abijnana_11.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_द्विगुण_निषेध_अथवा (((A+B)')' -> A+B)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafD = [2, 2, 2, 1, 2]; // D
    
    // Test 1: Simple NOR wrapped in NOT: ((A+B)')' -> A+B
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple NOR wrapped in NOT: ((A+B)')' -> A+B");
    let ast1 = [2, [3, leafA, leafB]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_द्विगुण_निषेध_अथवा(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_द्विगुण_निषेध_अथवा(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_द्विगुण_निषेध_अथवा(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Two NOTs wrapping an OR: ((A+B)')' -> A+B
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Two NOTs wrapping an OR: ((A+B)')' -> A+B");
    let ast2 = [2, [2, [1, leafA, leafB]]]; 
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    let path2 = अन्वेषण_द्विगुण_निषेध_अथवा(ast2);
    console.log(`Path Found              : ${JSON.stringify(path2)}`);
    assert.ok(path2, "Failed to find path for Test 2");

    let ast2_simplified = लघुकरण_द्विगुण_निषेध_अथवा(ast2, path2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_द्विगुण_निषेध_अथवा(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Transformation embedded within a larger AST
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Transformation embedded within a larger AST: D + ((A+B)')' -> D + (A+B)");
    let ast3 = [1, leafD, ast1]; 
    
    console.log(`Input (ast3)            : ${ सूचितः_सूत्रम्(ast3, variables) }`);
    
    let path3 = अन्वेषण_द्विगुण_निषेध_अथवा(ast3);
    console.log(`Path Found              : ${JSON.stringify(path3)}`);
    assert.ok(path3, "Failed to find path for Test 3");

    let ast3_simplified = लघुकरण_द्विगुण_निषेध_अथवा(ast3, path3);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast3_simplified, variables) }`);
    
    let is_valid3 = अभिज्ञान_द्विगुण_निषेध_अथवा(ast3, ast3_simplified);
    assert.strictEqual(is_valid3, true, "Simplification failed abijnana test for Test 3");
    console.log(`✅ Test 3 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
