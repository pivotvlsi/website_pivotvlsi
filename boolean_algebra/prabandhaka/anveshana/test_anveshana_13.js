const assert = require('assert');
const { अन्वेषण_सम्मति } = require('./anveshana_13.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("Starting tests for अन्वेषण_सम्मति (Consensus Theorem: (A.B) + (A'.C) + (B.C))...\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafNotA = [0, 2, 2, 2, 2]; // A'
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    let leafD = [2, 2, 2, 1, 2]; // D

    // Test 1: Simple (A.B) + (A'.C) + (B.C) -> root is OR [1]
    let ast1 = [1, [0, leafA, leafB], [0, leafNotA, leafC], [0, leafB, leafC]]; 
    let result1 = अन्वेषण_सम्मति(ast1);
    let str1 = सूचितः_सूत्रम्(ast1, variables);
    assert.deepStrictEqual(result1, [[1], [2], [3]], "Failed Test 1: Should identify paths to AB, A'C, BC.");
    console.log(`✅ Test 1 Passed`);
    console.log(`--- Equation ---: ${str1}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result1)}]\n`);

    // Test 2: Redundant term is a superset (A.B) + (A'.C) + (B.C.D)
    let ast2 = [1, [0, leafA, leafB], [0, leafNotA, leafC], [0, leafB, leafC, leafD]];
    let result2 = अन्वेषण_सम्मति(ast2);
    let str2 = सूचितः_सूत्रम्(ast2, variables);
    assert.deepStrictEqual(result2, [[1], [2], [3]], "Failed Test 2: Should identify B.C.D as redundant due to consensus of A.B and A'.C.");
    console.log(`✅ Test 2 Passed`);
    console.log(`--- Equation ---: ${str2}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result2)}]\n`);

    // Test 3: Mixed terms with single-variable leaves A + A'.C + C
    let ast3 = [1, leafA, [0, leafNotA, leafC], leafC];
    let result3 = अन्वेषण_सम्मति(ast3);
    let str3 = सूचितः_सूत्रम्(ast3, variables);
    assert.deepStrictEqual(result3, [[1], [2], [3]], "Failed Test 3: Should identify C as redundant due to A and A'.C.");
    console.log(`✅ Test 3 Passed`);
    console.log(`--- Equation ---: ${str3}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result3)}]\n`);

    // Test 4: False positive check (A.B) + (A.C) + (B.C) - No conflict
    let ast4 = [1, [0, leafA, leafB], [0, leafA, leafC], [0, leafB, leafC]];
    let result4 = अन्वेषण_सम्मति(ast4);
    assert.strictEqual(result4, null, "Failed Test 4: Should return null because there is no opposing variable.");
    console.log(`✅ Test 4 Passed (Ignored non-conflicting terms correctly)`);
    console.log(`--- Identified Path ---: ${result4}\n`);

    // Test 5: 6 Variables, 12 terms
    let v6 = ['A', 'B', 'C', 'D', 'E', 'F'];
    let vA = [1, 2, 2, 2, 2, 2, 2];
    let vNotA = [0, 2, 2, 2, 2, 2, 2];
    let vB = [2, 1, 2, 2, 2, 2, 2];
    let vC = [2, 2, 1, 2, 2, 2, 2];
    let vD = [2, 2, 2, 1, 2, 2, 2];
    let vE = [2, 2, 2, 2, 1, 2, 2];
    let vF = [2, 2, 2, 2, 2, 1, 2];

    let ast5 = [1, 
        [0, vA, vD],          // 1: A.D
        [0, vC, vE],          // 2: C.E
        [0, vA, vB],          // 3: A.B (T1)
        vF,                   // 4: F
        [0, vB, vD, vF],      // 5: B.D.F
        [0, vNotA, vC],       // 6: A'.C (T2)
        vE,                   // 7: E
        [0, vA, vC, vE],      // 8: A.C.E
        [0, vB, vC],          // 9: B.C (T3 - Redundant)
        [0, vD, vE, vF],      // 10: D.E.F
        [0, vB, vE],          // 11: B.E
        [0, vNotA, vF]        // 12: A'.F
    ];
    let result5 = अन्वेषण_सम्मति(ast5);
    let str5 = सूचितः_सूत्रम्(ast5, v6);
    assert.deepStrictEqual(result5, [[1], [12], [5]], "Failed Test 5: Should find consensus among 12 terms.");
    console.log(`✅ Test 5 Passed (6 variables, 12 terms)`);
    console.log(`--- Equation ---: ${str5}`);
    console.log(`--- Identified Path ---: [${JSON.stringify(result5)}]\n`);

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
