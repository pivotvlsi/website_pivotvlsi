const assert = require('assert');
const { अन्वेषण_विस्तरण_अथवा } = require('./anveshana_21.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_विस्तरण_अथवा (Distributive OR Expansion: A+(B.C) -> (A+B).(A+C))...\n");

    let leaf_A = [1, 2, 2, 2, 2]; // A
    let leaf_B = [2, 1, 2, 2, 2]; // B
    let leaf_C = [2, 2, 1, 2, 2]; // C
    let leaf_D = [2, 2, 2, 1, 2]; // D

    // Test 1: A+(B.C)
    // Root is 1 (OR). Children are A (leaf), and (B.C) (AND node)
    let ast1 = [1, leaf_A, [0, leaf_B, leaf_C]];
    let result1 = अन्वेषण_विस्तरण_अथवा(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [], "Failed Test 1: Should identify the root OR node at path [].");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${result1}]\n`);

    // Test 2: (A.B)+(C.D)
    // Root is 1 (OR). Children are (A.B) and (C.D) (AND nodes)
    let ast2 = [1, [0, leaf_A, leaf_B], [0, leaf_C, leaf_D]];
    let result2 = अन्वेषण_विस्तरण_अथवा(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [], "Failed Test 2: Should identify the root OR node at path [].");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${result2}]\n`);

    // Test 3: Deeply nested A+(B.C) inside an AND node
    // Root is 0 (AND). Child is [1, A, [0, B, C]]
    let ast3 = [0, leaf_D, [1, leaf_A, [0, leaf_B, leaf_C]]];
    let result3 = अन्वेषण_विस्तरण_अथवा(ast3);
    let str3 = सूचितः_सूत्रम्(ast3, variables);
    assert.deepStrictEqual(result3, [2], "Failed Test 3: Should identify the nested OR node at path [2].");
    console.log(`✅ Test 3 Passed`);
    console.log(`--- Equation ---: ${str3}`);
    console.log(`--- Identified Path ---: [${result3}]\n`);

    // Test 4: Pure OR node A+B (No AND child)
    // Should return null because there is no AND node to distribute into
    let ast4 = [1, leaf_A, leaf_B];
    let result4 = अन्वेषण_विस्तरण_अथवा(ast4);
    let str4 = सूचितः_सूत्रम्(ast4, variables);
    assert.strictEqual(result4, null, "Failed Test 4: Should return null for pure OR node with no AND children.");
    console.log(`✅ Test 4 Passed (Ignored pure OR term correctly)`);
    console.log(`--- Equation ---: ${str4}`);
    console.log(`--- Identified Path ---: ${result4}\n`);

    // Test 5: OR node with only one child (Invalid/degenerate AST)
    // [1, [0, leaf_A, leaf_B]]
    let ast5 = [1, [0, leaf_A, leaf_B]];
    let result5 = अन्वेषण_विस्तरण_अथवा(ast5);
    let str5 = सूचितः_सूत्रम्(ast5, variables);
    assert.strictEqual(result5, null, "Failed Test 5: Should return null because the OR node has only one child (nothing to distribute with).");
    console.log(`✅ Test 5 Passed (Ignored OR node with a single child)`);
    console.log(`--- Equation ---: ${str5}`);
    console.log(`--- Identified Path ---: ${result5}\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
