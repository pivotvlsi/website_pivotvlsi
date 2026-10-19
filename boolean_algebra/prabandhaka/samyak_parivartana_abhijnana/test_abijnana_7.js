const assert = require('assert');
// Assuming the function in abijnana_7.js will be named अभिज्ञान_वितरण_१ (Identification of Distribution 1)
// We will use a mock function if the file doesn't exist, or just import it if it does.
let अभिज्ञान_वितरण_१;
try {
    const abijnana7 = require('./abijnana_7.js');
    अभिज्ञान_वितरण_१ = abijnana7.अभिज्ञान_वितरण_१ || abijnana7.अभिज्ञान_वितरण;
} catch (e) {
    // Mocking it just in case abijnana_7.js isn't created yet so the test can run and fail properly
    अभिज्ञान_वितरण_१ = () => { throw new Error("abijnana_7.js or the function is not yet implemented"); };
}

const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_वितरण_१ (A + B.C -> (A+B).(A+C) Transformation Check)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    let leafD = [2, 2, 2, 1, 2]; // D
    let leafANot = [0, 2, 2, 2, 2]; // A'
    let leafBNot = [2, 0, 2, 2, 2]; // B'

    // Test 1: Simple A + B.C -> (A+B).(A+C)
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple A + (B.C) -> (A+B).(A+C)");
    
    let ast1 = [1, leafA, [0, leafB, leafC]]; 
    let ast1_transformed = [0, [1, leafA, leafB], [1, leafA, leafC]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    
    let result1 = अभिज्ञान_वितरण_१(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Invalid transformation
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Invalid transformation");
    
    let ast2_invalid = [0, [1, leafA, leafC], [1, leafA, leafC]]; // (A+C).(A+C) which is wrong
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast2_invalid)    : ${ सूचितः_सूत्रम्(ast2_invalid, variables) }`);
    
    let result2 = अभिज्ञान_वितरण_१(ast1, ast2_invalid);
    assert.strictEqual(result2, false, "Failed Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Distributive law with A' + B'.C -> (A'+B').(A'+C)
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Distributive law with A' + B'.C -> (A'+B').(A'+C)");
    
    let ast3 = [1, leafANot, [0, leafBNot, leafC]]; 
    let ast3_transformed = [0, [1, leafANot, leafBNot], [1, leafANot, leafC]]; 
    
    console.log(`Input (ast3)            : ${ सूचितः_सूत्रम्(ast3, variables) }`);
    console.log(`Input (ast3_transformed): ${ सूचितः_सूत्रम्(ast3_transformed, variables) }`);
    
    let result3 = अभिज्ञान_वितरण_१(ast3, ast3_transformed);
    assert.strictEqual(result3, true, "Failed Test 3");
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Transformation embedded within a larger AST (D + A + B.C -> D + (A+B).(A+C))
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Transformation embedded within a larger AST (D + (A + B.C) -> D + (A+B).(A+C))");
    
    // Representing D + (A + B.C) as an OR node with 2 children: leafD, and the OR node for (A + B.C)
    let ast4 = [1, leafD, ast1]; 
    let ast4_transformed = [1, leafD, ast1_transformed]; 
    
    console.log(`Input (ast4)            : ${ सूचितः_सूत्रम्(ast4, variables) }`);
    console.log(`Input (ast4_transformed): ${ सूचितः_सूत्रम्(ast4_transformed, variables) }`);
    
    let result4 = अभिज्ञान_वितरण_१(ast4, ast4_transformed);
    assert.strictEqual(result4, true, "Failed Test 4");
    console.log(`✅ Test 4 Passed\n`);

    // Test 5: Term in between (A + D + B.C) should not be validly transformed directly without associativity/commutativity steps
    console.log("---------------------------------------------------------------------");
    console.log("Test 5: Term in between (A + D + B.C) -> false");
    
    let ast5 = [1, leafA, leafD, [0, leafB, leafC]]; 
    let ast5_transformed = [1, [0, [1, leafA, leafB], [1, leafA, leafC]], leafD]; 
    
    console.log(`Input (ast5)            : ${ सूचितः_सूत्रम्(ast5, variables) }`);
    console.log(`Input (ast5_transformed): ${ सूचितः_सूत्रम्(ast5_transformed, variables) }`);
    
    let result5 = अभिज्ञान_वितरण_१(ast5, ast5_transformed);
    assert.strictEqual(result5, false, "Failed Test 5");
    console.log(`✅ Test 5 Passed\n`);

    // Test 6: A + (B.C) + D -> false
    console.log("---------------------------------------------------------------------");
    console.log("Test 6: A + (B.C) + D -> false (Direct inline length change is not natively supported by exact node matching)");
    
    let ast6 = [1, leafA, [0, leafB, leafC], leafD]; 
    let ast6_transformed = [1, [0, [1, leafA, leafB], [1, leafA, leafC]], leafD]; 
    
    console.log(`Input (ast6)            : ${ सूचितः_सूत्रम्(ast6, variables) }`);
    console.log(`Input (ast6_transformed): ${ सूचितः_सूत्रम्(ast6_transformed, variables) }`);
    
    let result6 = अभिज्ञान_वितरण_१(ast6, ast6_transformed);
    assert.strictEqual(result6, false, "Failed Test 6");
    console.log(`✅ Test 6 Passed\n`);

    console.log("All tests passed!");
} catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
}
