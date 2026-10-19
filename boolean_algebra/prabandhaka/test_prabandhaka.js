const assert = require('assert');
const प्रबन्धक = require('./prabandhaka.js');
const { सूचितः_सूत्रम् } = require('./random_boolean_generator/yadrucchika_soochi.js');

console.log("=====================================================================");
console.log("Testing Prabandhaka (Master Orchestrator)");
console.log("=====================================================================\n");

let variables = ['A', 'B', 'C', 'D'];

// Test 1: Rule table completeness
console.log("Test 1: Rule Table Integrity");
assert.strictEqual(प्रबन्धक.नियम_तालिका.length, 23, "Should have 23 rules");
assert.strictEqual(Object.keys(प्रबन्धक.अन्वेषण_मॉड्यूल्).length, 23, "Should have 23 anveshana modules");
assert.strictEqual(Object.keys(प्रबन्धक.लघुकरण_मॉड्यूल्).length, 23, "Should have 23 laghukarana modules");
assert.strictEqual(Object.keys(प्रबन्धक.अभिज्ञान_मॉड्यूल्).length, 16, "Should have 16 abhijnana modules");
console.log("✅ Test 1 Passed: 23 rules verified\n");

// Test 2: Anveshana + Laghukarana + Abhijnana coordination on Rule 1 (A + 0 = A)
console.log("Test 2: Coordinated Step on Rule 1 (A + 0 = A)");
let leafWith0 = [1, 2, 2, 2, 0];    // A, 0
let leafWithout0 = [1, 0, 2, 2, 2]; // A, B'
let ast1 = [0, [1, leafWith0], [1, leafWithout0]]; 

console.log(`Original AST: ${सूचितः_सूत्रम्(ast1, variables)}`);

// Find with anveshana via master
let applicable = प्रबन्धक.अन्वेषण_सर्व(ast1);
console.log(`Applicable rules found:`, applicable.map(r => `${r.संख्या}. ${r.नाम}`));
assert.ok(applicable.some(r => r.संख्या === 1), "Rule 1 should be applicable");

// Step execution via master
let step = प्रबन्धक.पद_चालनम्(ast1);
assert.ok(step, "Step should execute successfully");
console.log(`Step applied rule: ${step.नियम.संख्या} (${step.नियम.नाम})`);
console.log(`Transformed AST: ${सूचितः_सूत्रम्(step.नव_ast, variables)}`);
console.log(`Abhijnana verified: ${step.अभिज्ञान_सत्यापितम्}`);
assert.strictEqual(step.अभिज्ञान_सत्यापितम्, true, "Abhijnana should verify the transformation");
console.log("✅ Test 2 Passed: Anveshana -> Laghukarana -> Abhijnana coordinated successfully\n");

// Test 3: Abhijnana verification check directly
console.log("Test 3: Direct Abhijnana Rule Recognition");
let recognized = प्रबन्धक.अभिज्ञान_परीक्षणम्(ast1, step.नव_ast);
assert.ok(recognized, "Should recognize the transition");
assert.strictEqual(recognized.संख्या, 1, "Should recognize Rule 1");
console.log(`Recognized rule: ${recognized.संख्या} - ${recognized.नाम} (${recognized.समीकरण})`);
console.log("✅ Test 3 Passed: Direct recognition successful\n");

console.log("=====================================================================");
console.log("All Prabandhaka master tests passed! 🎉");
console.log("=====================================================================");
