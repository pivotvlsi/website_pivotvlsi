const assert = require('assert');
const { अन्वेषण_द्विगुण_निषेध_अन् } = require('./anveshana_12.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_द्विगुण_निषेध_अन् (Double Negation of AND-term: ((A.B)')')...\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C

    // Test 1: Unary NOR wrapping a NAND node -> ((A.B)')'
    // Root is NOR [3] with 1 child. Child is NAND [2] with 2 leaves.
    let ast1 = [3, [2, leafA, leafB]]; 
    let result1 = अन्वेषण_द्विगुण_निषेध_अन्(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [], "Failed Test 1: Should identify root node as double negation of AND.");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${result1}]\n`);

    // Test 2: Unary NAND wrapping a NAND node -> ((A.B)')'
    let ast2 = [2, [2, leafA, leafB]]; 
    let result2 = अन्वेषण_द्विगुण_निषेध_अन्(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [], "Failed Test 2: Should identify root node as double negation of AND.");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${result2}]\n`);

    // Test 3: Unary NAND wrapping a Unary NAND wrapping an AND node -> (((A.B))')'
    let ast3 = [2, [2, [0, leafA, leafB]]];
    let result3 = अन्वेषण_द्विगुण_निषेध_अन्(ast3);
    let str3 = सूचितः_सूत्रम्(ast3, variables);
    assert.deepStrictEqual(result3, [], "Failed Test 3: Should identify explicit triple-nested double negation.");
    console.log(`✅ Test 3 Passed`);
    console.log(`--- Equation ---: ${str3}`);
    console.log(`--- Identified Path ---: [${result3}]\n`);

    // Test 4: Nested double negation inside an OR node: C + ((A.B)')'
    let ast4 = [1, leafC, [3, [2, leafA, leafB]]];
    let result4 = अन्वेषण_द्विगुण_निषेध_अन्(ast4);
    let str4 = सूचितः_सूत्रम्(ast4, variables);
    assert.deepStrictEqual(result4, [2], "Failed Test 4: Should identify nested double negation at path [2].");
    console.log(`✅ Test 4 Passed`);
    console.log(`--- Equation ---: ${str4}`);
    console.log(`--- Identified Path ---: [${result4}]\n`);
    
    // Test 5: Ignored single negation (A.B)'
    let ast5 = [2, leafA, leafB];
    let result5 = अन्वेषण_द्विगुण_निषेध_अन्(ast5);
    assert.strictEqual(result5, null, "Failed Test 5: Should return null for single negation.");
    console.log(`✅ Test 5 Passed (Ignored single negation correctly)`);
    console.log(`--- Identified Path ---: ${result5}\n`);

    // Test 6: Ignored double negation of OR-term ((A+B)')'
    let ast6 = [3, [3, leafA, leafB]];
    let result6 = अन्वेषण_द्विगुण_निषेध_अन्(ast6);
    assert.strictEqual(result6, null, "Failed Test 6: Should return null for double negation of OR-term.");
    console.log(`✅ Test 6 Passed (Ignored OR-term double negation correctly)`);
    console.log(`--- Identified Path ---: ${result6}\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
