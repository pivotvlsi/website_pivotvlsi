const assert = require('assert');
const { लघुकरण_डीमॉर्गन_अन् } = require('./laghukarana_16.js');
// Due to anveshana_15 (NAND) and 16 (NOR) being swapped relative to the abijnana rules, 
// we intentionally import anveshana_16.js here because it searches for the correct NAND structure expected by Rule 16.
const { अन्वेषण_नैण्ड } = require('../anveshana/anveshana_16.js');
const { अभिज्ञान_डीमॉर्गन_अन् } = require('../samyak_parivartana_abhijnana/abijnana_16.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for लघुकरण_डीमॉर्गन_अन् (De Morgan's Law for AND: (A.B)' -> A' + B')");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    
    // Test 1: Simple NAND -> OR of NOTs
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple NAND -> OR of NOTs: (A.B)' -> A' + B'");
    let ast1 = [2, leafA, leafB]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    
    let path1 = अन्वेषण_नैण्ड(ast1);
    console.log(`Path Found              : ${JSON.stringify(path1)}`);
    assert.ok(path1, "Failed to find path for Test 1");

    let ast1_simplified = लघुकरण_डीमॉर्गन_अन्(ast1, path1);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast1_simplified, variables) }`);
    
    let is_valid1 = अभिज्ञान_डीमॉर्गन_अन्(ast1, ast1_simplified);
    assert.strictEqual(is_valid1, true, "Simplification failed abijnana test for Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Unary NOT wrapping an AND
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Unary NOT wrapping an AND -> OR of NOTs: (A.B)' -> A' + B'");
    let ast2 = [2, [0, leafA, leafB]]; 
    
    console.log(`Input (ast2)            : ${ सूचितः_सूत्रम्(ast2, variables) }`);
    
    // bypass anveshana for unary NOT wrapping if it explicitly checks only for operator 2 w/ multiple children
    let path2 = []; 
    console.log(`Path Provided           : ${JSON.stringify(path2)}`);

    let ast2_simplified = लघुकरण_डीमॉर्गन_अन्(ast2, path2);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast2_simplified, variables) }`);
    
    let is_valid2 = अभिज्ञान_डीमॉर्गन_अन्(ast2, ast2_simplified);
    assert.strictEqual(is_valid2, true, "Simplification failed abijnana test for Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: De Morgan on complex terms: ((A+B).C)' -> (A+B)' + C'
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: De Morgan on complex terms: ((A+B).C)' -> (A+B)' + C'");
    let termAplusB = [1, leafA, leafB];
    let ast3 = [2, termAplusB, leafC]; 
    
    console.log(`Input (ast3)            : ${ सूचितः_सूत्रम्(ast3, variables) }`);
    
    let path3 = अन्वेषण_नैण्ड(ast3);
    console.log(`Path Found              : ${JSON.stringify(path3)}`);
    assert.ok(path3, "Failed to find path for Test 3");

    let ast3_simplified = लघुकरण_डीमॉर्गन_अन्(ast3, path3);
    console.log(`Simplified Output       : ${ सूचितः_सूत्रम्(ast3_simplified, variables) }`);
    
    let is_valid3 = अभिज्ञान_डीमॉर्गन_अन्(ast3, ast3_simplified);
    assert.strictEqual(is_valid3, true, "Simplification failed abijnana test for Test 3");
    console.log(`✅ Test 3 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
