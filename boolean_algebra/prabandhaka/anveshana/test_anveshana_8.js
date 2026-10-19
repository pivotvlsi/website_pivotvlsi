const assert = require('assert');
const { अन्वेषण_वितरण_२ } = require('./anveshana_8.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_वितरण_२ (A . (B+C))...\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    let leafD = [2, 2, 2, 1, 2]; // D

    // Test 1: Simple A . (B+C) -> root is AND [0], children are leafA and OR node [1, leafB, leafC]
    let ast1 = [0, leafA, [1, leafB, leafC]]; 
    let result1 = अन्वेषण_वितरण_२(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [[1], [2]], "Failed Test 1: Should identify paths to A and (B+C).");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${result1}]\n`);

    // Test 2: Nested D + (A . (B+C)) -> root is OR [1], child 1 is leafD, child 2 is AND node [0, leafA, [1, leafB, leafC]]
    let ast2 = [1, leafD, [0, leafA, [1, leafB, leafC]]];
    let result2 = अन्वेषण_वितरण_२(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [[2, 1], [2, 2]], "Failed Test 2: Should identify paths to nested A and (B+C).");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${result2}]\n`);

    // Test 3: Only leaves -> A . B . C -> root is AND [0], children are leafA, leafB, leafC
    let ast3 = [0, leafA, leafB, leafC];
    let result3 = अन्वेषण_वितरण_२(ast3);
    let str3 = सूचितः_सूत्रम्(ast3, variables);
    assert.strictEqual(result3, null, "Failed Test 3: Should return null because there is no OR node.");
    console.log(`✅ Test 3 Passed (Ignored pure AND product correctly)`);
    console.log(`--- Equation ---: ${str3}`);
    console.log(`--- Identified Path ---: ${result3}\n`);

    // Test 4: Only OR nodes -> (A+B) . (C+D) -> root is AND [0], children are two OR nodes
    let ast4 = [0, [1, leafA, leafB], [1, leafC, leafD]];
    let result4 = अन्वेषण_वितरण_२(ast4);
    let str4 = सूचितः_सूत्रम्(ast4, variables);
    assert.strictEqual(result4, null, "Failed Test 4: Should return null because there are no leaf nodes.");
    console.log(`✅ Test 4 Passed (Ignored pure POS correctly)`);
    console.log(`--- Equation ---: ${str4}`);
    console.log(`--- Identified Path ---: ${result4}\n`);

    // Test 5: Five variables and six terms
    // Variables: A, B, C, D, E.
    let variables5 = ['A', 'B', 'C', 'D', 'E'];
    let leafA_5 = [1, 2, 2, 2, 2, 2]; // A
    let leafB_5 = [2, 1, 2, 2, 2, 2]; // B
    let leafC_5 = [2, 2, 1, 2, 2, 2]; // C
    let leafD_5 = [2, 2, 2, 1, 2, 2]; // D
    let leafE_5 = [2, 2, 2, 2, 1, 2]; // E
    
    // Equation: A . B . C . (D+E) . (B+C) . E (6 terms under AND)
    let ast5 = [0, leafA_5, leafB_5, leafC_5, [1, leafD_5, leafE_5], [1, leafB_5, leafC_5], leafE_5];
    let result5 = अन्वेषण_वितरण_२(ast5);
    let str5 = सूचितः_सूत्रम्(ast5, variables5);
    assert.deepStrictEqual(result5, [[1], [4]], "Failed Test 5: Should identify paths to A and (D+E).");
    console.log(`✅ Test 5 Passed (5 variables, 6 terms)`);
    console.log(`--- Equation ---: ${str5}`);
    console.log(`--- Identified Path ---: [${result5}]\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
