const assert = require('assert');
const { अभिज्ञान_वितरण_२ } = require('./abijnana_8.js');
const { सूचितः_सूत्रम् } = require('../random_boolean_generator/yadrucchika_soochi.js');

let variables = ['A', 'B', 'C', 'D'];

try {
    console.log("=====================================================================");
    console.log("Starting tests for अभिज्ञान_वितरण_२ (A.(B+C) -> (A.B)+(A.C) Transformation Check)");
    console.log("=====================================================================\n");

    let leafA = [1, 2, 2, 2, 2]; // A
    let leafB = [2, 1, 2, 2, 2]; // B
    let leafC = [2, 2, 1, 2, 2]; // C
    let leafD = [2, 2, 2, 1, 2]; // D
    let leafANot = [0, 2, 2, 2, 2]; // A'
    let leafBNot = [2, 0, 2, 2, 2]; // B'

    // Test 1: Simple A.(B+C) -> (A.B)+(A.C)
    console.log("---------------------------------------------------------------------");
    console.log("Test 1: Simple A.(B+C) -> (A.B)+(A.C)");
    
    // A.(B+C)
    let ast1 = [0, leafA, [1, leafB, leafC]]; 
    
    // (A.B)+(A.C)
    let ast1_transformed = [1, [0, leafA, leafB], [0, leafA, leafC]]; 
    
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast1_transformed): ${ सूचितः_सूत्रम्(ast1_transformed, variables) }`);
    
    let result1 = अभिज्ञान_वितरण_२(ast1, ast1_transformed);
    assert.strictEqual(result1, true, "Failed Test 1");
    console.log(`✅ Test 1 Passed\n`);

    // Test 2: Invalid transformation
    console.log("---------------------------------------------------------------------");
    console.log("Test 2: Invalid transformation");
    
    let ast2_invalid = [1, [0, leafA, leafC], [0, leafA, leafC]]; // (A.C)+(A.C) which is wrong
    console.log(`Input (ast1)            : ${ सूचितः_सूत्रम्(ast1, variables) }`);
    console.log(`Input (ast2_invalid)    : ${ सूचितः_सूत्रम्(ast2_invalid, variables) }`);
    
    let result2 = अभिज्ञान_वितरण_२(ast1, ast2_invalid);
    assert.strictEqual(result2, false, "Failed Test 2");
    console.log(`✅ Test 2 Passed\n`);

    // Test 3: Distributive law with A'.(B'+C) -> (A'.B')+(A'.C)
    console.log("---------------------------------------------------------------------");
    console.log("Test 3: Distributive law with A'.(B'+C) -> (A'.B')+(A'.C)");
    
    let ast3 = [0, leafANot, [1, leafBNot, leafC]]; 
    let ast3_transformed = [1, [0, leafANot, leafBNot], [0, leafANot, leafC]]; 
    
    console.log(`Input (ast3)            : ${ सूचितः_सूत्रम्(ast3, variables) }`);
    console.log(`Input (ast3_transformed): ${ सूचितः_सूत्रम्(ast3_transformed, variables) }`);
    
    let result3 = अभिज्ञान_वितरण_२(ast3, ast3_transformed);
    assert.strictEqual(result3, true, "Failed Test 3");
    console.log(`✅ Test 3 Passed\n`);

    // Test 4: Transformation embedded within a larger AST (D.(A.(B+C)) -> D.((A.B)+(A.C)))
    console.log("---------------------------------------------------------------------");
    console.log("Test 4: Transformation embedded within a larger AST (D.(A.(B+C)) -> D.((A.B)+(A.C)))");
    
    // Representing D.(A.(B+C)) as an AND node with 2 children: leafD, and the AND node for A.(B+C)
    let ast4 = [0, leafD, ast1]; 
    let ast4_transformed = [0, leafD, ast1_transformed]; 
    
    console.log(`Input (ast4)            : ${ सूचितः_सूत्रम्(ast4, variables) }`);
    console.log(`Input (ast4_transformed): ${ सूचितः_सूत्रम्(ast4_transformed, variables) }`);
    
    let result4 = अभिज्ञान_वितरण_२(ast4, ast4_transformed);
    assert.strictEqual(result4, true, "Failed Test 4");
    console.log(`✅ Test 4 Passed\n`);

    // Test 5: Term in between (A.D.(B+C)) -> false
    console.log("---------------------------------------------------------------------");
    console.log("Test 5: Term in between (A.D.(B+C)) -> false");
    
    let ast5 = [0, leafA, leafD, [1, leafB, leafC]]; 
    let ast5_transformed = [0, [1, [0, leafA, leafB], [0, leafA, leafC]], leafD]; 
    
    console.log(`Input (ast5)            : ${ सूचितः_सूत्रम्(ast5, variables) }`);
    console.log(`Input (ast5_transformed): ${ सूचितः_सूत्रम्(ast5_transformed, variables) }`);
    
    let result5 = अभिज्ञान_वितरण_२(ast5, ast5_transformed);
    assert.strictEqual(result5, false, "Failed Test 5");
    console.log(`✅ Test 5 Passed\n`);

    // Test 6: A.(B+C).D -> false
    console.log("---------------------------------------------------------------------");
    console.log("Test 6: A.(B+C).D -> false");
    
    let ast6 = [0, leafA, [1, leafB, leafC], leafD]; 
    let ast6_transformed = [0, [1, [0, leafA, leafB], [0, leafA, leafC]], leafD]; 
    
    console.log(`Input (ast6)            : ${ सूचितः_सूत्रम्(ast6, variables) }`);
    console.log(`Input (ast6_transformed): ${ सूचितः_सूत्रम्(ast6_transformed, variables) }`);
    
    let result6 = अभिज्ञान_वितरण_२(ast6, ast6_transformed);
    assert.strictEqual(result6, false, "Failed Test 6");
    console.log(`✅ Test 6 Passed\n`);

    console.log("All tests passed!");
} catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
}
