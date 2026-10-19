const assert = require('assert');
const { सूत्र_विभाजन } = require('./sootra_vibhajana.js');

console.log("Starting tests for sootra_vibhajana.js...\n");

try {
    // Test 1: Implicit ANDs and lowercase to uppercase conversion
    assert.strictEqual(सूत्र_विभाजन("a b"), "(A.B)");
    console.log("✅ Test 1 Passed: 'a b' -> '(A.B)'");

    // Test 2: Standard Operator Precedence (AND before OR)
    assert.strictEqual(सूत्र_विभाजन("A+B.C"), "(A+(B.C))");
    console.log("✅ Test 2 Passed: 'A+B.C' -> '(A+(B.C))'");

    // Test 3: Implicit ANDs with Brackets
    assert.strictEqual(सूत्र_विभाजन("A(B+C)"), "(A.(B+C))");
    console.log("✅ Test 3 Passed: 'A(B+C)' -> '(A.(B+C))'");

    // Test 4: Basic Inversions
    assert.strictEqual(सूत्र_विभाजन("A'+B"), "(A'+B)");
    console.log("✅ Test 4 Passed: 'A'+B' -> '(A'+B)'");

    // Test 5: Bracketed Inversions
    assert.strictEqual(सूत्र_विभाजन("(A+B)'"), "(A+B)'");
    console.log("✅ Test 5 Passed: '(A+B)'' -> '(A+B)''");
    
    // Test 6: Double Inversions (Wrapped properly)
    assert.strictEqual(सूत्र_विभाजन("A''"), "(A')'");
    console.log("✅ Test 6 Passed: 'A''' -> '(A')''");

    // Test 7: Complex Expression with messy whitespace and implicit ANDs
    assert.strictEqual(सूत्र_विभाजन("A B +   C (D + E)'"), "((A.B)+(C.(D+E)'))");
    console.log("✅ Test 7 Passed: 'A B +   C (D + E)'' -> '((A.B)+(C.(D+E)'))'");

    // Test 8: Case mixing validation
    try {
        सूत्र_विभाजन("A+a");
        assert.fail("Should have thrown an error for case mixing.");
    } catch (e) {
        if (e.message.includes("Both uppercase and lowercase")) {
            console.log("✅ Test 8 Passed: Caught case mixing error correctly.");
        } else {
            throw e; // rethrow if it's a different error
        }
    }

    console.log("\n🎉 All tests passed successfully!");

} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
