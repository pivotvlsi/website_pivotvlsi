const assert = require('assert');
const { अभिज्ञान_सर्वदा_सत्य } = require('./abijnana_6.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let चराः = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_सर्वदा_सत्य (A+A' = 1 Tautology Transformation Check)");
    console.log("=====================================================================\n");

    let पत्र_सर्वदा_सत्य_विना = [1, 0, 2, 2, 2]; // A, B'
    let पत्र_सर्वदा_सत्य_सहितम् = [3, 2, 2, 2, 2];    // A, A'
    let पत्र_सर्वदा_सत्य_सहितम्_परिवर्तितम् = [2, 2, 2, 2, 1]; // 1

    let पत्र२_सर्वदा_सत्य_सहितम् = [2, 3, 2, 2, 2];    // B, B'
    let पत्र२_सर्वदा_सत्य_सहितम्_परिवर्तितम् = [2, 2, 2, 2, 1]; // 1

    let पत्र३_सर्वदा_सत्य_सहितम् = [3, 1, 2, 2, 2];    // A, A', B
    let पत्र३_सर्वदा_सत्य_सहितम्_परिवर्तितम् = [2, 2, 2, 2, 1]; // 1

    // Test 1: Simple POS equation transformed (A+A' -> 1)
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple POS equation transformed (A+A' -> 1)");
    let सूत्र१ = [0, [1, पत्र_सर्वदा_सत्य_सहितम्], [1, पत्र_सर्वदा_सत्य_विना]]; 
    let परिवर्तित_सूत्र१ = [0, [1, पत्र_सर्वदा_सत्य_सहितम्_परिवर्तितम्], [1, पत्र_सर्वदा_सत्य_विना]]; 
    console.log(`Input (सूत्र१)            : ${ सूचितः_सूत्रम्(सूत्र१, चराः) }`);
    console.log(`Input (परिवर्तित_सूत्र१): ${ सूचितः_सूत्रम्(परिवर्तित_सूत्र१, चराः) }`);
    let परिणाम१ = अभिज्ञान_सर्वदा_सत्य(सूत्र१, परिवर्तित_सूत्र१);
    assert.strictEqual(परिणाम१, true, "Failed Test 1");
    console.log(`Actual Output           : ${परिणाम१} (Expected: true)`);
    console.log(`How it passed           : The function detects that the leaf containing A+A' (state 3) was correctly transformed into the constant 1.`);
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Another valid B+B' Transformation (B+B' -> 1)
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Another valid B+B' Transformation (B+B' -> 1)");
    let सूत्र२ = [0, [1, पत्र२_सर्वदा_सत्य_सहितम्], [1, पत्र_सर्वदा_सत्य_विना]]; 
    let परिवर्तित_सूत्र२ = [0, [1, पत्र२_सर्वदा_सत्य_सहितम्_परिवर्तितम्], [1, पत्र_सर्वदा_सत्य_विना]];
    console.log(`Input (सूत्र२)            : ${ सूचितः_सूत्रम्(सूत्र२, चराः) }`);
    console.log(`Input (परिवर्तित_सूत्र२): ${ सूचितः_सूत्रम्(परिवर्तित_सूत्र२, चराः) }`);
    let परिणाम२ = अभिज्ञान_सर्वदा_सत्य(सूत्र२, परिवर्तित_सूत्र२);
    assert.strictEqual(परिणाम२, true, "Failed Test 2");
    console.log(`Actual Output           : ${परिणाम२} (Expected: true)`);
    console.log(`How it passed           : The function detects that the leaf containing B+B' (state 3) was correctly transformed into the constant 1.`);
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: No transformation applied
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: No transformation applied");
    console.log(`Input (सूत्र१)            : ${ सूचितः_सूत्रम्(सूत्र१, चराः) }`);
    console.log(`Input (सूत्र१)            : ${ सूचितः_सूत्रम्(सूत्र१, चराः) }`);
    let परिणाम३ = अभिज्ञान_सर्वदा_सत्य(सूत्र१, सूत्र१);
    assert.strictEqual(परिणाम३, false, "Failed Test 3");
    console.log(`Actual Output           : ${परिणाम३} (Expected: false)`);
    console.log(`How it passed           : The function finds zero differences between the ASTs. Since no transformation took place, it returns false.`);
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Invalid transformation (A variable changed instead of becoming constant 1)
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Invalid transformation (A variable changed instead of becoming constant 1)");
    let अमान्य_पत्रम् = [1, 2, 2, 2, 2]; // changed A+A' to just A
    let सूत्र४_अमान्यम् = [0, [1, अमान्य_पत्रम्], [1, पत्र_सर्वदा_सत्य_विना]];
    console.log(`Input (सूत्र१)            : ${ सूचितः_सूत्रम्(सूत्र१, चराः) }`);
    console.log(`Input (सूत्र४_अमान्यम्)    : ${ सूचितः_सूत्रम्(सूत्र४_अमान्यम्, चराः) }`);
    let परिणाम४ = अभिज्ञान_सर्वदा_सत्य(सूत्र१, सूत्र४_अमान्यम्);
    assert.strictEqual(परिणाम४, false, "Failed Test 4");
    console.log(`Actual Output           : ${परिणाम४} (Expected: false)`);
    console.log(`How it passed           : The function detects that the leaf did not become exactly [2,2,2,2,1]. It correctly identifies this as invalid and returns false.`);
    console.log(`✅ Test 4 Passed\n`);
    
    // Test 5: Multiple valid transformations applied simultaneously (Should fail)
    console.log("---------------------------------------------------------------------");
    console.log("Test 5: Multiple valid transformations applied simultaneously (Should fail)");
    let सूत्र५ = [0, [1, पत्र_सर्वदा_सत्य_सहितम्], [1, पत्र२_सर्वदा_सत्य_सहितम्]];
    let परिवर्तित_सूत्र५ = [0, [1, पत्र_सर्वदा_सत्य_सहितम्_परिवर्तितम्], [1, पत्र२_सर्वदा_सत्य_सहितम्_परिवर्तितम्]];
    console.log(`Input (सूत्र५)            : ${ सूचितः_सूत्रम्(सूत्र५, चराः) }`);
    console.log(`Input (परिवर्तित_सूत्र५): ${ सूचितः_सूत्रम्(परिवर्तित_सूत्र५, चराः) }`);
    let परिणाम५ = अभिज्ञान_सर्वदा_सत्य(सूत्र५, परिवर्तित_सूत्र५);
    assert.strictEqual(परिणाम५, false, "Failed Test 5");
    console.log(`Actual Output           : ${परिणाम५} (Expected: false)`);
    console.log(`How it passed           : The function detects multiple transformations at once, but only exactly ONE transformation per step is allowed. Thus it returns false.`);
    console.log(`✅ Test 5 Passed\n`);

    // Test 6: 3+ terms in an OR equation (A+A'+B -> 1)
    console.log("---------------------------------------------------------------------");
    console.log("Test 6: 3+ terms in an OR equation (A+A'+B -> 1)");
    let सूत्र६ = [0, [1, पत्र३_सर्वदा_सत्य_सहितम्], [1, पत्र_सर्वदा_सत्य_विना]];
    let परिवर्तित_सूत्र६ = [0, [1, पत्र३_सर्वदा_सत्य_सहितम्_परिवर्तितम्], [1, पत्र_सर्वदा_सत्य_विना]];
    console.log(`Input (सूत्र६)            : ${ सूचितः_सूत्रम्(सूत्र६, चराः) }`);
    console.log(`Input (परिवर्तित_सूत्र६): ${ सूचितः_सूत्रम्(परिवर्तित_सूत्र६, चराः) }`);
    let परिणाम६ = अभिज्ञान_सर्वदा_सत्य(सूत्र६, परिवर्तित_सूत्र६);
    assert.strictEqual(परिणाम६, true, "Failed Test 6");
    console.log(`Actual Output           : ${परिणाम६} (Expected: true)`);
    console.log(`How it passed           : The function identifies that a 3-term OR equation containing A+A' was correctly transformed into the constant 1.`);
    console.log(`✅ Test 6 Passed\n`);

    // Test 7: Nested OR-in-AND equation leaf reduction ((A+A').(B+B') -> 1.(B+B'))
    console.log("---------------------------------------------------------------------");
    console.log("Test 7: Nested OR-in-AND equation leaf reduction ((A+A').(B+B') -> 1.(B+B'))");
    let सूत्र७ = [0, [1, पत्र_सर्वदा_सत्य_सहितम्], [1, पत्र२_सर्वदा_सत्य_सहितम्]];
    let परिवर्तित_सूत्र७ = [0, [1, पत्र_सर्वदा_सत्य_सहितम्_परिवर्तितम्], [1, पत्र२_सर्वदा_सत्य_सहितम्]];
    console.log(`Input (सूत्र७)            : ${ सूचितः_सूत्रम्(सूत्र७, चराः) }`);
    console.log(`Input (परिवर्तित_सूत्र७): ${ सूचितः_सूत्रम्(परिवर्तित_सूत्र७, चराः) }`);
    let परिणाम७ = अभिज्ञान_सर्वदा_सत्य(सूत्र७, परिवर्तित_सूत्र७);
    assert.strictEqual(परिणाम७, true, "Failed Test 7");
    console.log(`Actual Output           : ${परिणाम७} (Expected: true)`);
    console.log(`How it passed           : The function detects that exactly one of the OR-nodes containing a tautology collapsed to 1 in the AND equation.`);
    console.log(`✅ Test 7 Passed\n`);

    console.log("=====================================================================");
    console.log("All tests passed successfully! 🎉");
    console.log("=====================================================================");
} catch (error) {
    console.error(`❌ Test Failed: ${error.message}`);
}
