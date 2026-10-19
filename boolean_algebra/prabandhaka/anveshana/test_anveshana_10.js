const assert = require('assert');
const { अन्वेषण_अवशोषण_२ } = require('./anveshana_10.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_अवशोषण_२ (A . (A+B))...\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C

    // Test 1: Simple A . (A+B) -> root is AND [0], children are leafA and OR node [1, leafA, leafB]
    let ast1 = [0, leafA, [1, leafA, leafB]]; 
    let result1 = अन्वेषण_अवशोषण_२(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [[1], [2]], "Failed Test 1: Should identify paths to A and A+B.");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result1)}]\n`);

    // Test 2: Nested C + (A . (A+B))
    let ast2 = [1, leafC, [0, leafA, [1, leafA, leafB]]];
    let result2 = अन्वेषण_अवशोषण_२(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [[2, 1], [2, 2]], "Failed Test 2: Should identify paths to nested A and A+B.");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result2)}]\n`);

    // Test 3: Ignored A . B (no subset)
    let ast3 = [0, leafA, leafB];
    let result3 = अन्वेषण_अवशोषण_२(ast3);
    assert.strictEqual(result3, null, "Failed Test 3: Should return null.");
    console.log(`✅ Test 3 Passed (Ignored pure AND correctly)`);
    console.log(`--- Identified Path ---: ${result3}\n`);

    // Test 4: POS format where A is represented as an OR node A and A+B
    let ast4 = [0, [1, leafA], [1, leafA, leafB]];
    let result4 = अन्वेषण_अवशोषण_२(ast4);
    let str4 = सूचितः_सूत्रम्(ast4, variables);
    assert.deepStrictEqual(result4, [[1], [2]], "Failed Test 4: Should identify POS format A and A+B.");
    console.log(`✅ Test 4 Passed`);
    console.log(`--- Equation ---: ${str4}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result4)}]\n`);
    
    // Test 5: (A.C) . (A.B.C) (Absorption on multi-variable subset? No, A.C under AND is an AND-term)
    // We want (A+C) . (A+B+C)
    let leafAC = [1, 2, 1, 2, 2]; // A.C, but under AND it evaluates to A.C
    let ast5 = [0, leafAC, [1, leafA, leafB, leafC]];
    let result5 = अन्वेषण_अवशोषण_२(ast5);
    assert.strictEqual(result5, null, "Failed Test 5: Should return null because A.C is not an OR term under AND.");
    console.log(`✅ Test 5 Passed (Ignored A.C under AND correctly)`);
    console.log(`--- Identified Path ---: ${result5}\n`);

    // Test 6: (A+C) . (A+B+C) using OR nodes under AND
    let ast6 = [0, [1, leafA, leafC], [1, leafA, leafB, leafC]];
    let result6 = अन्वेषण_अवशोषण_२(ast6);
    let str6 = सूचितः_सूत्रम्(ast6, variables);
    assert.deepStrictEqual(result6, [[1], [2]], "Failed Test 6: Should identify subset OR-terms.");
    console.log(`✅ Test 6 Passed`);
    console.log(`--- Equation ---: ${str6}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result6)}]\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
