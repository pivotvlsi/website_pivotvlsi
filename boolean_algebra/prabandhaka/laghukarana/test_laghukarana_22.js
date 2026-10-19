const assert = require('assert');
const { लघुकरण_विस्तरण_अन् } = require('./laghukarana_22.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for लघुकरण_विस्तरण_अन् (Distributive AND: A.(B+C) -> A.B + A.C)...\n");

    let leaf_A = [1, 2, 2, 2, 2]; // A
    let leaf_B = [2, 1, 2, 2, 2]; // B
    let leaf_C = [2, 2, 1, 2, 2]; // C

    // Test 1: A . (B+C)
    let ast1 = [0, leaf_A, [1, leaf_B, leaf_C]];
    let result1 = लघुकरण_विस्तरण_अन्(ast1, []);
    let str_orig1 = सूचितः_सूत्रम्(ast1, variables);
    let str_res1 = सूचितः_सूत्रम्(result1, variables);
    
    console.log(`Original : ${str_orig1}`);
    console.log(`Expanded : ${str_res1}`);
    assert.deepStrictEqual(result1, [1, [0, leaf_A, leaf_B], [0, leaf_A, leaf_C]], "Failed Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Dense Leaf Expansion A . (B+C)
    // B+C is represented as a single dense POS leaf [2, 1, 1, 2, 2]
    let leaf_BC = [2, 1, 1, 2, 2]; 
    let ast2 = [0, leaf_A, [1, leaf_BC]];
    let result2 = लघुकरण_विस्तरण_अन्(ast2, []);
    let str_orig2 = सूचितः_सूत्रम्(ast2, variables);
    let str_res2 = सूचितः_सूत्रम्(result2, variables);

    console.log(`Original : ${str_orig2}`);
    console.log(`Expanded : ${str_res2}`);
    // Should split into A.B + A.C
    assert.deepStrictEqual(result2, [1, [0, leaf_A, leaf_B], [0, leaf_A, leaf_C]], "Failed Test 2 (Dense Leaf)");
    console.log(`✅ Test 2 Passed\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
