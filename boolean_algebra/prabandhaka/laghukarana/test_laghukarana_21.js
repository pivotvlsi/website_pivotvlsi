const assert = require('assert');
const { लघुकरण_विस्तरण_अथवा } = require('./laghukarana_21.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for लघुकरण_विस्तरण_अथवा (Distributive OR: A+(B.C) -> (A+B).(A+C))...\n");

    let leaf_A = [1, 2, 2, 2, 2]; // A
    let leaf_B = [2, 1, 2, 2, 2]; // B
    let leaf_C = [2, 2, 1, 2, 2]; // C

    // Test 1: A + (B.C)
    let ast1 = [1, leaf_A, [0, leaf_B, leaf_C]];
    let result1 = लघुकरण_विस्तरण_अथवा(ast1, []);
    let str_orig1 = सूचितः_सूत्रम्(ast1, variables);
    let str_res1 = सूचितः_सूत्रम्(result1, variables);
    
    console.log(`Original : ${str_orig1}`);
    console.log(`Expanded : ${str_res1}`);
    assert.deepStrictEqual(result1, [0, [1, leaf_A, leaf_B], [1, leaf_A, leaf_C]], "Failed Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Dense Leaf Expansion A + (B.C)
    // B.C is represented as a single dense SOP leaf [2, 1, 1, 2, 2]
    let leaf_BC = [2, 1, 1, 2, 2]; 
    let ast2 = [1, leaf_A, [0, leaf_BC]];
    let result2 = लघुकरण_विस्तरण_अथवा(ast2, []);
    let str_orig2 = सूचितः_सूत्रम्(ast2, variables);
    let str_res2 = सूचितः_सूत्रम्(result2, variables);

    console.log(`Original : ${str_orig2}`);
    console.log(`Expanded : ${str_res2}`);
    // Should split into A+B and A+C
    assert.deepStrictEqual(result2, [0, [1, leaf_A, leaf_B], [1, leaf_A, leaf_C]], "Failed Test 2 (Dense Leaf)");
    console.log(`✅ Test 2 Passed\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
