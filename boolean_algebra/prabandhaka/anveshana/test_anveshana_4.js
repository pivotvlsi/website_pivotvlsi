const assert = require('assert');
const { अन्वेषण_तत्समक_अन् } = require('./anveshana_4.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_तत्समक_अन् (A . 1 = A)...\n");

    let leafWithout1 = [1, 0, 2, 2, 2]; // A, B'
    let leafWith1 = [1, 2, 2, 2, 1];    // A, 1

    // Test 1: Simple SOP equation (A.1) + (A.B')
    // Root is 1 (OR). Children are leaves (AND-terms).
    let ast1 = [1, [0, leafWith1], [0, leafWithout1]]; 
    let result1 = अन्वेषण_तत्समक_अन्(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [1, 1], "Failed Test 1: Should identify 1 in AND term at index [1, 1].");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${result1}]\n`);

    // Test 2: Nested POS on SOP
    let ast2 = [0, 
        [1, [0, leafWithout1]], // (A.B')
        [1, [0, leafWith1]]     // (A.1)
    ];
    let result2 = अन्वेषण_तत्समक_अन्(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [2, 1, 1], "Failed Test 2: Should identify nested 1 at path [2, 1, 1].");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${result2}]\n`);

    // Test 3: POS term containing 1 [1, leafWithout1, leafWith1] (A+B') + (A+1)
    // Root is 1 (OR), making leaves OR-terms. The function should ignore them since it targets AND-terms.
    let ast3 = [1, leafWithout1, leafWith1];
    let result3 = अन्वेषण_तत्समक_अन्(ast3);
    let str3 = सूचितः_सूत्रम्(ast3, variables);
    assert.strictEqual(result3, null, "Failed Test 3: Should return null because the terms are under an OR node (POS).");
    console.log(`✅ Test 3 Passed (Ignored POS term correctly)`);
    console.log(`--- Equation ---: ${str3}`);
    console.log(`--- Identified Path ---: ${result3}\n`);

    // Test 4: Deeply nested tree with no matches
    let ast4 = [1, [0, leafWithout1], [0, leafWithout1]];
    let result4 = अन्वेषण_तत्समक_अन्(ast4);
    let str4 = सूचितः_सूत्रम्(ast4, variables);
    assert.strictEqual(result4, null, "Failed Test 4: Should return null for AST with no 1s.");
    console.log(`✅ Test 4 Passed (No match found)`);
    console.log(`--- Equation ---: ${str4}`);
    console.log(`--- Identified Path ---: ${result4}\n`);

    // Test 5: AST with TWO AND terms containing 1
    let leafWith1_A = [1, 2, 2, 2, 1]; // (A.1)
    let leafWith1_B = [2, 0, 2, 2, 1]; // (B'.1)
    let ast5 = [1, [0, leafWith1_A], [0, leafWith1_B]];
    let result5 = अन्वेषण_तत्समक_अन्(ast5);
    let str5 = सूचितः_सूत्रम्(ast5, variables);
    assert.deepStrictEqual(result5, [1, 1], "Failed Test 5: Should return the FIRST match (path [1, 1]).");
    console.log(`✅ Test 5 Passed (Returned first match among multiple)`);
    console.log(`--- Equation ---: ${str5}`);
    console.log(`--- Identified Path ---: [${result5}]\n`);

    // Test 6: Verify C.1
    // Variables: A=2, B=2, C=1, D=2, const=1
    let leaf_C_With1 = [2, 2, 1, 2, 1]; 
    let ast6 = [1, [0, leaf_C_With1]]; // root is 1 (OR) wrapping an AND node
    let result6 = अन्वेषण_तत्समक_अन्(ast6);
    let str6 = सूचितः_सूत्रम्(ast6, variables);
    assert.deepStrictEqual(result6, [1, 1], "Failed Test 6: Should identify 1 in AND term (C.1) at index [1, 1].");
    console.log(`✅ Test 6 Passed (Successfully verified C.1)`);
    console.log(`--- Equation ---: ${str6}`);
    console.log(`--- Identified Path ---: [${result6}]\n`);

    // Test 7: Verify completely empty leaf with 1 constant (pure 1)
    let emptyLeaf_1 = [2, 2, 2, 2, 1]; 
    let ast7 = [1, [0, leafWithout1], [0, emptyLeaf_1]];
    let result7 = अन्वेषण_तत्समक_अन्(ast7);
    let str7 = सूचितः_सूत्रम्(ast7, variables);
    assert.deepStrictEqual(result7, [2, 1], "Failed Test 7: Should identify pure 1 leaf at index [2, 1].");
    console.log(`✅ Test 7 Passed (Successfully verified pure 1 leaf)`);
    console.log(`--- Equation ---: ${str7}`);
    console.log(`--- Identified Path ---: [${result7}]\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
