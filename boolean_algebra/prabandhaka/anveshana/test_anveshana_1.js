const assert = require('assert');
const { अन्वेषण_तत्समक_अथवा } = require('./anveshana_1.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_तत्समक_अथवा (Full AST Traversal)...\n");

    let leafWithout0 = [1, 0, 2, 2, 2]; // A, B'
    let leafWith0 = [1, 2, 2, 2, 0];    // A, 0

    // Test 1: Simple POS equation (A+0) . (A+B')
    // Root is 0 (AND). Children are OR nodes (1) wrapping leaves.
    // However, our stringifier evaluates a leaf directly under an OR node as an OR-term!
    // So the tree is: [0, [1, leafWith0], [1, leafWithout0]] 
    // Wait, the stringifier doesn't need an OR wrapper if the leaf is directly under 1. 
    // Let's just put leaves under a 1 node to make them OR-terms:
    // [1, leafWith0, leafWithout0] will evaluate as (A+0) + (A+B') = (A+0+A+B')
    // Wait! POS is Product of Sums. Root should be 0 (AND). Children are leaves? No, if children are leaves under 0, they evaluate as AND-terms!
    // So POS must be [0, [1, leafWith0], [1, leafWithout0]].
    let ast1 = [0, [1, leafWith0], [1, leafWithout0]]; 
    let result1 = अन्वेषण_तत्समक_अथवा(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [1, 1], "Failed Test 1: Should identify 0 in POS term at index [1, 1].");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${result1}]\n`);

    // Test 2: Nested SOP on POS 
    // SOP is sum (1) of products (0). POS is product (0) of sums (1).
    let ast2 = [1, 
        [0, [1, leafWithout0]], // (A+B')
        [0, [1, leafWith0]]     // (A+0)
    ];
    let result2 = अन्वेषण_तत्समक_अथवा(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [2, 1, 1], "Failed Test 2: Should identify nested 0 at path [2, 1, 1].");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${result2}]\n`);

    // Test 3: SOP term containing 0 [0, leafWithout0, leafWith0]
    // The root is 0 (AND), so the leaves act as AND-terms (A.B') . (A.0). 
    // The function should ignore them.
    let ast3 = [0, leafWithout0, leafWith0];
    let result3 = अन्वेषण_तत्समक_अथवा(ast3);
    let str3 = सूचितः_सूत्रम्(ast3, variables);
    assert.strictEqual(result3, null, "Failed Test 3: Should return null because the terms are under an AND node (SOP).");
    console.log(`✅ Test 3 Passed (Ignored SOP term correctly)`);
    console.log(`--- Equation ---: ${str3}`);
    console.log(`--- Identified Path ---: ${result3}\n`);

    // Test 4: Deeply nested tree with no matches
    let ast4 = [0, [1, leafWithout0], [1, leafWithout0]];
    let result4 = अन्वेषण_तत्समक_अथवा(ast4);
    let str4 = सूचितः_सूत्रम्(ast4, variables);
    assert.strictEqual(result4, null, "Failed Test 4: Should return null for AST with no POS 0s.");
    console.log(`✅ Test 4 Passed (No match found)`);
    console.log(`--- Equation ---: ${str4}`);
    console.log(`--- Identified Path ---: ${result4}\n`);

    // Test 5: AST with TWO OR terms containing 0
    // e.g. (A+0) . (B'+0). The function should return the FIRST one it finds!
    let leafWith0_A = [1, 2, 2, 2, 0]; // (A+0)
    let leafWith0_B = [2, 0, 2, 2, 0]; // (B'+0)
    let ast5 = [0, [1, leafWith0_A], [1, leafWith0_B]];
    let result5 = अन्वेषण_तत्समक_अथवा(ast5);
    let str5 = सूचितः_सूत्रम्(ast5, variables);
    // The first match is at child 1 -> child 1
    assert.deepStrictEqual(result5, [1, 1], "Failed Test 5: Should return the FIRST match (path [1, 1]).");
    console.log(`✅ Test 5 Passed (Returned first match among multiple)`);
    console.log(`--- Equation ---: ${str5}`);
    console.log(`--- Identified Path ---: [${result5}]\n`);

    // Test 6: Verify C+0
    // Variables: A=2(ignore), B=2(ignore), C=1(present), D=2(ignore), const=0(present)
    let leaf_C_With0 = [2, 2, 1, 2, 0]; 
    let ast6 = [0, [1, leaf_C_With0]]; // root is 0 (AND) wrapping an OR node
    let result6 = अन्वेषण_तत्समक_अथवा(ast6);
    let str6 = सूचितः_सूत्रम्(ast6, variables);
    assert.deepStrictEqual(result6, [1, 1], "Failed Test 6: Should identify 0 in POS term (C+0) at index [1, 1].");
    console.log(`✅ Test 6 Passed (Successfully verified C+0)`);
    console.log(`--- Equation ---: ${str6}`);
    console.log(`--- Identified Path ---: [${result6}]\n`);

    // Test 7: Verify completely empty leaf with 0 constant (pure 0)
    // Represents the output of a fully absorbed sum term.
    let emptyLeaf_0 = [2, 2, 2, 2, 0]; 
    let ast7 = [0, [1, leafWithout0], [1, emptyLeaf_0]];
    let result7 = अन्वेषण_तत्समक_अथवा(ast7);
    let str7 = सूचितः_सूत्रम्(ast7, variables);
    assert.deepStrictEqual(result7, [2, 1], "Failed Test 7: Should identify pure 0 leaf at index [2, 1].");
    console.log(`✅ Test 7 Passed (Successfully verified pure 0 leaf)`);
    console.log(`--- Equation ---: ${str7}`);
    console.log(`--- Identified Path ---: [${result7}]\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
