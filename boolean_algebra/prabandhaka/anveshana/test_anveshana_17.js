const { प्रधान_लघुकारक } = require('../pradhana_laghukaraka/pradhana_laghukaraka.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

function run_test(name, input, expected_patterns) {
    console.log(`\n--- Running Test: ${name} ---`);
    let ast = require('../satyata_saarani_prarambha/satyata_saarani_prarambha.js').सत्यता_सारणी_प्रारंभ(input);
    ast = प्रधान_लघुकारक(input);
    let result_str = सूचितः_सूत्रम्(ast, input.match(/[A-Z]/g).sort().filter((v,i,a)=>a.indexOf(v)===i));
    console.log(`Result: ${result_str}`);
    
    let passed = false;
    for (let expected of expected_patterns) {
        if (result_str.includes(expected) || expected === result_str) {
            passed = true;
            console.log(`✅ Passed (found expected structure: ${expected})`);
            break;
        }
    }
    if (!passed) {
        console.error(`❌ Failed: Could not find any expected patterns in ${result_str}`);
    }
}

// Basic Rule 17:
// A + A'B = A + B
run_test('Advanced Absorption Reduction SOP (Basic)', '(A)+(A\'.B)', ['(A)+(B)']);

// Generalized Rule 17:
// C.D + A.C'.D = C.D + A.D
run_test('Advanced Absorption Reduction SOP (Generalized)', '(C.D)+(A.C\'.D)', ['(C.D)+(A.D)', '(A.D)+(C.D)']);
