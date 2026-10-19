const assert = require('assert');
const { अन्वेषण_विरोधाभास } = require('./anveshana_5.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_विरोधाभास (A . A' = 0)...\n");

    let leafWithoutContradiction = [1, 0, 2, 2, 2]; // A, B'
    let leafWithContradiction = [3, 2, 2, 2, 2];    // A . A'

    // Test 1: Simple SOP equation (A.A') + (A.B')
    // Root is 1 (OR). Children are AND nodes (0) wrapping leaves.
    let ast1 = [1, [0, leafWithContradiction], [0, leafWithoutContradiction]]; 
    let result1 = अन्वेषण_विरोधाभास(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [1], "Failed Test 1: Should identify A.A' AND term at index [1].");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${result1}]\n`);

    // Test 2: Nested POS on SOP 
    let ast2 = [0, 
        [1, [0, leafWithoutContradiction]], // (A.B')
        [1, [0, leafWithContradiction]]     // (A.A')
    ];
    let result2 = अन्वेषण_विरोधाभास(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [2, 1], "Failed Test 2: Should identify nested A.A' at path [2, 1].");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${result2}]\n`);

    // Test 3: POS term containing A+A' [1, leafWithoutContradiction, leafWithContradiction] (A+B') + (A+A')
    // The root is 1 (OR), so the leaves act as OR-terms. The function should ignore them.
    let ast3 = [1, leafWithoutContradiction, leafWithContradiction];
    let result3 = अन्वेषण_विरोधाभास(ast3);
    let str3 = सूचितः_सूत्रम्(ast3, variables);
    assert.strictEqual(result3, null, "Failed Test 3: Should return null because the terms are under an OR node (POS).");
    console.log(`✅ Test 3 Passed (Ignored POS term correctly)`);
    console.log(`--- Equation ---: ${str3}`);
    console.log(`--- Identified Path ---: ${result3}\n`);

    // Test 4: Deeply nested tree with no matches
    let ast4 = [1, [0, leafWithoutContradiction], [0, leafWithoutContradiction]];
    let result4 = अन्वेषण_विरोधाभास(ast4);
    let str4 = सूचितः_सूत्रम्(ast4, variables);
    assert.strictEqual(result4, null, "Failed Test 4: Should return null for AST with no contradiction.");
    console.log(`✅ Test 4 Passed (No match found)`);
    console.log(`--- Equation ---: ${str4}`);
    console.log(`--- Identified Path ---: ${result4}\n`);

    // Test 5: AST with TWO AND terms containing A.A'
    let leafWithContradiction_A = [3, 2, 2, 2, 2]; // (A.A')
    let leafWithContradiction_B = [2, 3, 2, 2, 2]; // (B.B')
    let ast5 = [1, [0, leafWithContradiction_A], [0, leafWithContradiction_B]];
    let result5 = अन्वेषण_विरोधाभास(ast5);
    let str5 = सूचितः_सूत्रम्(ast5, variables);
    assert.deepStrictEqual(result5, [1], "Failed Test 5: Should return the FIRST match (path [1]).");
    console.log(`✅ Test 5 Passed (Returned first match among multiple)`);
    console.log(`--- Equation ---: ${str5}`);
    console.log(`--- Identified Path ---: [${result5}]\n`);

    // Test 6: Verify C.C'
    // Variables: A=2, B=2, C=3, D=2, const=2
    let leaf_C_WithContradiction = [2, 2, 3, 2, 2]; 
    let ast6 = [1, [0, leaf_C_WithContradiction]]; // root is 1 (OR) wrapping an AND node
    let result6 = अन्वेषण_विरोधाभास(ast6);
    let str6 = सूचितः_सूत्रम्(ast6, variables);
    assert.deepStrictEqual(result6, [1], "Failed Test 6: Should identify C.C' in AND term at index [1].");
    console.log(`✅ Test 6 Passed (Successfully verified C.C')`);
    console.log(`--- Equation ---: ${str6}`);
    console.log(`--- Identified Path ---: [${result6}]\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
