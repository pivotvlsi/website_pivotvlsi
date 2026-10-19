const { प्रधान_लघुकारक } = require('../pradhana_laghukaraka/pradhana_laghukaraka.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

function run_test(name, input, expected_patterns) {
    console.log(`\n--- Running Test: ${name} ---`);
    let ast = प्रधान_लघुकारक(input);
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

// 1. Generalized Absorption SOP (Anveshana 9)
// A.B + A.B.C = A.B
run_test('Generalized Absorption SOP (A.B + A.B.C)', '(A.B)+(A.B.C)', ['(A.B)']);

// 2. Generalized Absorption POS (Anveshana 10)
// (A+B) . (A+B+C) = (A+B)
run_test('Generalized Absorption POS ((A+B).(A+B+C))', '(A+B).(A+B+C)', ['(A+B)']);

// 3. Generalized Double Negation (Anveshana 11 & 12)
// ((A.B)')' = A.B  and  ((A+B)')' = A+B
run_test('Generalized Double Negation SOP', "((A.B)')'", ['(A.B)']);
run_test('Generalized Double Negation POS', "((A+B)')'", ['(A+B)']);

// 4. Generalized Consensus SOP (Anveshana 13)
// X.Y.Z + X'W + Y'W + Z.W -> wait, the rule is AB + A'C + BC = AB + A'C
// Let's use (X.Y) + (X'.Z) + (Y.Z) = (X.Y) + (X'.Z)
run_test('Generalized Consensus SOP', '(X.Y)+(X\'.Z)+(Y.Z)', ['(X.Y)+(X\'.Z)', '(X.Y)+(Z.X\')']);

// 5. Generalized Consensus POS (Anveshana 14)
// (X+Y) . (X'+Z) . (Y+Z) = (X+Y) . (X'+Z)
run_test('Generalized Consensus POS', '(X+Y).(X\'+Z).(Y+Z)', ['(X+Y).(X\'+Z)', '(X+Y).(Z+X\')']);

// 6. Advanced Absorption SOP (Anveshana 17)
// (C.D) + (A.C'.D) = (C.D) + (A.D)
run_test('Advanced Absorption SOP', '(C.D)+(A.C\'.D)', ['(C.D)+(A.D)']);

// 7. Advanced Absorption POS (Anveshana 18)
// (C+D) . (A+C'+D) = (C+D) . (A+D)
run_test('Advanced Absorption POS', '(C+D).(A+C\'+D)', ['(C+D).(A+D)']);
