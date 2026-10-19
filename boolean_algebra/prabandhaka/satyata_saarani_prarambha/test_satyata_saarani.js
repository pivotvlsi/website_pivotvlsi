const assert = require('assert');
const { सत्यता_सारणी_प्रारंभ: old_सत्यता_सारणी_प्रारंभ } = require('./satyata_saarani_prarambha.js');
const { सूत्र_विभाजन } = require('./sootra_vibhajana.js');

function सत्यता_सारणी_प्रारंभ(expr) {
    return old_सत्यता_सारणी_प्रारंभ(सूत्र_विभाजन(expr));
}

console.log("Starting tests for satyata_saarani_prarambha.js...");

try {
    // Test 1: Basic uppercase conversion
    let ast1 = सत्यता_सारणी_प्रारंभ("a+b");
    // variables will be ['A', 'B']
    assert.deepStrictEqual(ast1[0], 1); // 1 is OR
    console.log("✅ Test 1 Passed: 'a+b' converted and parsed successfully.");

    // Test 2: Case mixing validation
    try {
        सत्यता_सारणी_प्रारंभ("A+a");
        assert.fail("Should have thrown an error for case mixing.");
    } catch (e) {
        if (e.message.includes("Both uppercase and lowercase")) {
            console.log("✅ Test 2 Passed: Caught case mixing error correctly.");
        } else {
            throw e; // rethrow if it's a different error
        }
    }

    // Test 3: Standard uppercase parsing
    let ast3 = सत्यता_सारणी_प्रारंभ("(A+B).C'");
    assert.deepStrictEqual(ast3[0], 0); // 0 is AND (.) at the root
    console.log("✅ Test 3 Passed: Standard complex parsing successful.");

    // Test 4: Constant parsing
    let ast4 = सत्यता_सारणी_प्रारंभ("A+0");
    assert.deepStrictEqual(ast4[0], 1); // 1 is OR
    console.log("✅ Test 4 Passed: Constant parsed successfully.");

    // Test 5: 6 Variables, 21 Terms
    let bigExpr = "A.B.C + D.E.F + A'.B'.C' + D'.E'.F' + A.D + B.E + C.F + A'.E + B'.F + C'.D + A.B.D.E + B.C.E.F + A.C.D.F + A.F' + B.D' + C.E' + A'.B.C + D.E'.F + A.B'.C' + D'.E.F' + A.B.C.D.E.F";
    let ast5 = सत्यता_सारणी_प्रारंभ(bigExpr);
    assert.deepStrictEqual(ast5[0], 1); // Root is OR (+)
    assert.deepStrictEqual(ast5.length - 1, 21); // Should have 21 terms

    // Fully assert the structure of the AST based on expected parsing
    const expectedAst5 = [
      1,
      [ 0, [ 1, 1, 1, 2, 2, 2, 2 ] ],
      [ 0, [ 2, 2, 2, 1, 1, 1, 2 ] ],
      [ 0, [ 0, 0, 0, 2, 2, 2, 2 ] ],
      [ 0, [ 2, 2, 2, 0, 0, 0, 2 ] ],
      [ 0, [ 1, 2, 2, 1, 2, 2, 2 ] ],
      [ 0, [ 2, 1, 2, 2, 1, 2, 2 ] ],
      [ 0, [ 2, 2, 1, 2, 2, 1, 2 ] ],
      [ 0, [ 0, 2, 2, 2, 1, 2, 2 ] ],
      [ 0, [ 2, 0, 2, 2, 2, 1, 2 ] ],
      [ 0, [ 2, 2, 0, 1, 2, 2, 2 ] ],
      [ 0, [ 1, 1, 2, 1, 1, 2, 2 ] ],
      [ 0, [ 2, 1, 1, 2, 1, 1, 2 ] ],
      [ 0, [ 1, 2, 1, 1, 2, 1, 2 ] ],
      [ 0, [ 1, 2, 2, 2, 2, 0, 2 ] ],
      [ 0, [ 2, 1, 2, 0, 2, 2, 2 ] ],
      [ 0, [ 2, 2, 1, 2, 0, 2, 2 ] ],
      [ 0, [ 0, 1, 1, 2, 2, 2, 2 ] ],
      [ 0, [ 2, 2, 2, 1, 0, 1, 2 ] ],
      [ 0, [ 1, 0, 0, 2, 2, 2, 2 ] ],
      [ 0, [ 2, 2, 2, 0, 1, 0, 2 ] ],
      [ 0, [ 1, 1, 1, 1, 1, 1, 2 ] ]
    ];
    assert.deepStrictEqual(ast5, expectedAst5);
    console.log("✅ Test 5 Passed: 6-variable, 21-term expression parsed successfully.");

    // Test 6: Another 6-Variable, 21-Term SOP Expression with a POS term embedded
    let sopExpr2 = "U.V + W.X + Y.Z + U'.V' + W'.X' + Y'.Z' + (U+V).(W+X) + V.X + U.Y + V.Z + W.Y + X.Z + U'.W' + V'.X' + U'.Y' + V'.Z' + W'.Y' + X'.Z' + U.V.W + X.Y.Z + U'.V'.W'.X'.Y'.Z'";
    let ast6 = सत्यता_सारणी_प्रारंभ(sopExpr2);
    assert.deepStrictEqual(ast6[0], 1); // Root is OR (+)
    assert.deepStrictEqual(ast6.length - 1, 21); // Should have 21 terms
    const expectedAst6 = [
  1,
  [ 0, [ 1, 1, 2, 2, 2, 2, 2 ] ],
  [ 0, [ 2, 2, 1, 1, 2, 2, 2 ] ],
  [ 0, [ 2, 2, 2, 2, 1, 1, 2 ] ],
  [ 0, [ 0, 0, 2, 2, 2, 2, 2 ] ],
  [ 0, [ 2, 2, 0, 0, 2, 2, 2 ] ],
  [ 0, [ 2, 2, 2, 2, 0, 0, 2 ] ],
  [ 0, [ 1, [ 1, 1, 2, 2, 2, 2, 2 ] ], [ 1, [ 2, 2, 1, 1, 2, 2, 2 ] ] ],
  [ 0, [ 2, 1, 2, 1, 2, 2, 2 ] ],
  [ 0, [ 1, 2, 2, 2, 1, 2, 2 ] ],
  [ 0, [ 2, 1, 2, 2, 2, 1, 2 ] ],
  [ 0, [ 2, 2, 1, 2, 1, 2, 2 ] ],
  [ 0, [ 2, 2, 2, 1, 2, 1, 2 ] ],
  [ 0, [ 0, 2, 0, 2, 2, 2, 2 ] ],
  [ 0, [ 2, 0, 2, 0, 2, 2, 2 ] ],
  [ 0, [ 0, 2, 2, 2, 0, 2, 2 ] ],
  [ 0, [ 2, 0, 2, 2, 2, 0, 2 ] ],
  [ 0, [ 2, 2, 0, 2, 0, 2, 2 ] ],
  [ 0, [ 2, 2, 2, 0, 2, 0, 2 ] ],
  [ 0, [ 1, 1, 1, 2, 2, 2, 2 ] ],
  [ 0, [ 2, 2, 2, 1, 1, 1, 2 ] ],
  [ 0, [ 0, 0, 0, 0, 0, 0, 2 ] ]
];
    assert.deepStrictEqual(ast6, expectedAst6);
    console.log("✅ Test 6 Passed: Second 6-variable, 21-term SOP (with embedded POS) parsed successfully.");

    // Test 7: 6-Variable, 21-Term Fully POS Expression
    let posExpr1 = "(A+B).(C+D).(E+F).(A'+B').(C'+D').(E'+F').(A+C).(B+D).(A+E).(B+F).(C+E).(D+F).(A'+C').(B'+D').(A'+E').(B'+F').(C'+E').(D'+F').(A+B+C).(D+E+F).(A'+B'+C'+D'+E'+F')";
    let ast7 = सत्यता_सारणी_प्रारंभ(posExpr1);
    assert.deepStrictEqual(ast7[0], 0); // Root is AND (.)
    assert.deepStrictEqual(ast7.length - 1, 21); // Should have 21 terms
    const expectedAst7 = [
  0,
  [ 1, [ 1, 1, 2, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 1, 1, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 2, 1, 1, 2 ] ],
  [ 1, [ 0, 0, 2, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 0, 0, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 2, 0, 0, 2 ] ],
  [ 1, [ 1, 2, 1, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 1, 2, 1, 2, 2, 2 ] ],
  [ 1, [ 1, 2, 2, 2, 1, 2, 2 ] ],
  [ 1, [ 2, 1, 2, 2, 2, 1, 2 ] ],
  [ 1, [ 2, 2, 1, 2, 1, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 1, 2, 1, 2 ] ],
  [ 1, [ 0, 2, 0, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 0, 2, 0, 2, 2, 2 ] ],
  [ 1, [ 0, 2, 2, 2, 0, 2, 2 ] ],
  [ 1, [ 2, 0, 2, 2, 2, 0, 2 ] ],
  [ 1, [ 2, 2, 0, 2, 0, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 0, 2, 0, 2 ] ],
  [ 1, [ 1, 1, 1, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 1, 1, 1, 2 ] ],
  [ 1, [ 0, 0, 0, 0, 0, 0, 2 ] ]
];
    assert.deepStrictEqual(ast7, expectedAst7);
    console.log("✅ Test 7 Passed: 6-variable, 21-term fully POS parsed successfully.");

    // Test 8: 6-Variable, 21-Term POS Expression with an embedded SOP term
    let posExpr2 = "(A+B).(C+D).(E+F).(A'+B').(C'+D').(E'+F').(A.C + B.D).(B+D).(A+E).(B+F).(C+E).(D+F).(A'+C').(B'+D').(A'+E').(B'+F').(C'+E').(D'+F').(A+B+C).(D+E+F).(A'+B'+C'+D'+E'+F')";
    let ast8 = सत्यता_सारणी_प्रारंभ(posExpr2);
    assert.deepStrictEqual(ast8[0], 0); // Root is AND (.)
    assert.deepStrictEqual(ast8.length - 1, 21); // Should have 21 terms
    const expectedAst8 = [
  0,
  [ 1, [ 1, 1, 2, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 1, 1, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 2, 1, 1, 2 ] ],
  [ 1, [ 0, 0, 2, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 0, 0, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 2, 0, 0, 2 ] ],
  [ 1, [ 0, [ 1, 2, 1, 2, 2, 2, 2 ] ], [ 0, [ 2, 1, 2, 1, 2, 2, 2 ] ] ],
  [ 1, [ 2, 1, 2, 1, 2, 2, 2 ] ],
  [ 1, [ 1, 2, 2, 2, 1, 2, 2 ] ],
  [ 1, [ 2, 1, 2, 2, 2, 1, 2 ] ],
  [ 1, [ 2, 2, 1, 2, 1, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 1, 2, 1, 2 ] ],
  [ 1, [ 0, 2, 0, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 0, 2, 0, 2, 2, 2 ] ],
  [ 1, [ 0, 2, 2, 2, 0, 2, 2 ] ],
  [ 1, [ 2, 0, 2, 2, 2, 0, 2 ] ],
  [ 1, [ 2, 2, 0, 2, 0, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 0, 2, 0, 2 ] ],
  [ 1, [ 1, 1, 1, 2, 2, 2, 2 ] ],
  [ 1, [ 2, 2, 2, 1, 1, 1, 2 ] ],
  [ 1, [ 0, 0, 0, 0, 0, 0, 2 ] ]
];
    assert.deepStrictEqual(ast8, expectedAst8);
    console.log("✅ Test 8 Passed: 6-variable, 21-term POS (with embedded SOP) parsed successfully.");

    console.log("\n🎉 All tests passed successfully!");
} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
