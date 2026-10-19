const { प्रधान_लघुकारक } = require('../pradhana_laghukaraka/pradhana_laghukaraka.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

function run_test(name, input, expected_patterns) {
    console.log(`\n--- Running Test: ${name} ---`);
    let ast = require('../satyata_saarani_prarambha/satyata_saarani_prarambha.js').सत्यता_सारणी_प्रारंभ(input);
    console.log(`AST Initial: ${JSON.stringify(ast)}`);
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

// 1. Basic Rule 19:
// X.Y + X'.Z + Y'.Z.W = X.Y + X'.Z + Z.W
// (D.B) + (D'.A.C') + (B'.A.C'.E.F) = (B.D) + (A.C'.D') + (A.C'.E.F)
run_test('Advanced Consensus Reduction SOP', '(B.D)+(A.C\'.D\')+(A.B\'.C\'.E.F)', ['(B.D)+(A.C\'.D\')+(A.C\'.E.F)']);

// 2. Full specific equation from user that triggered this:
run_test('User Massive Equation', "((B'.D')+(A.B'.C'.E.F)+(A.B'.C'.D'.E)+(A'.B'.C.D'.F')+(A'.B'.C'.F')+(A'.B'.C'.D'.E'.F)+(B'.C'.D'.E'.F)+(A'.B'.C'.D.E.F')+(B.D)+(B.D'.E')+(B.C'.D.E')+(A.B.C'.D')+(A.B.C'.D'.E.F')+(A'.C.E)+(A.C'.D'.E.F'))", ["(A.C'.E.F)"]);
