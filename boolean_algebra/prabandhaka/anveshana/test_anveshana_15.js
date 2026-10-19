const assert = require('assert');
const { अन्वेषण_नोर } = require('./anveshana_15.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_नोर (NOR Operations: (A+B)')...\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C

    // Test 1: Simple NOR -> (A+B)'
    let ast1 = [3, leafA, leafB]; 
    let result1 = अन्वेषण_नोर(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [], "Failed Test 1: Should identify root node as NOR.");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${result1}]\n`);

    // Test 2: Nested NOR inside an AND node -> C . (A+B)'
    let ast2 = [0, leafC, [3, leafA, leafB]]; 
    let result2 = अन्वेषण_नोर(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [2], "Failed Test 2: Should identify nested NOR at path [2].");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${result2}]\n`);
    
    // Test 3: Ignored unary NOT (NOR with 1 child) -> (A)'
    let ast3 = [3, leafA];
    let result3 = अन्वेषण_नोर(ast3);
    assert.strictEqual(result3, null, "Failed Test 3: Should return null for unary NOT.");
    console.log(`✅ Test 3 Passed (Ignored unary NOT correctly)`);
    console.log(`--- Identified Path ---: ${result3}\n`);

    // Test 4: Ignored NAND operations -> (A.B)'
    let ast4 = [2, leafA, leafB];
    let result4 = अन्वेषण_नोर(ast4);
    assert.strictEqual(result4, null, "Failed Test 4: Should return null for NAND operation.");
    console.log(`✅ Test 4 Passed (Ignored NAND operation correctly)`);
    console.log(`--- Identified Path ---: ${result4}\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
