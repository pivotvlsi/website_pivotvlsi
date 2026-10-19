const assert = require('assert');
const { एक_पंक्ति_निर्माण, यादृच्छिक_सूचि_निर्माण, सूचितः_सूत्रम् } = require('./yadrucchika_soochi.js');

console.log("Starting tests for yadrucchika_soochi.js...\n");

// Helper function to recursively check leaf dimensions
function checkDimension(node, expectedDim) {
    if (Array.isArray(node) && typeof node[0] === 'number') {
        if (node[0] >= 0 && node[0] <= 3 && node.length > 2 && !Array.isArray(node[1])) {
            // It's a leaf node. Note: Leaf arrays in this app are sometimes just the variable array, 
            // but according to the comments they are length (dim + 1)
            assert.strictEqual(node.length, expectedDim + 1, `Leaf should have length ${expectedDim + 1}`);
        } else {
            // It's an operator node
            for (let i = 1; i < node.length; i++) {
                if (Array.isArray(node[i])) {
                    if (typeof node[i][0] === 'number' && node[i].length > 2 && !Array.isArray(node[i][1])) {
                        assert.strictEqual(node[i].length, expectedDim + 1, `Leaf should have length ${expectedDim + 1}`);
                    } else {
                        checkDimension(node[i], expectedDim);
                    }
                }
            }
        }
    } else {
        assert.strictEqual(node.length, expectedDim + 1, `Leaf should have length ${expectedDim + 1}`);
    }
}

// Helper to check for purity (no 3s in variables, and trailing element is 2)
function checkPurity(node) {
    if (Array.isArray(node) && typeof node[0] === 'number') {
        if (node[0] >= 0 && node[0] <= 3 && node.length > 2 && !Array.isArray(node[1])) {
            let dim = node.length - 1;
            for (let i = 0; i < dim; i++) {
                assert.ok(node[i] !== 3, "Pure form should not have contradiction (3) in variables.");
            }
            assert.strictEqual(node[dim], 2, "Pure form should have trailing constant as 2.");
        } else {
            // It's an operator node
            assert.ok(node[0] !== 3, "Pure form should not have NOR (3) operator at root.");
            for (let i = 1; i < node.length; i++) {
                if (Array.isArray(node[i])) {
                    if (typeof node[i][0] === 'number' && node[i].length > 2 && !Array.isArray(node[i][1])) {
                        let dim = node[i].length - 1;
                        for (let j = 0; j < dim; j++) {
                            assert.ok(node[i][j] !== 3, "Pure form should not have contradiction (3) in variables.");
                        }
                        assert.strictEqual(node[i][dim], 2, "Pure form should have trailing constant as 2.");
                    } else {
                        checkPurity(node[i]);
                    }
                }
            }
        }
    } else {
        let dim = node.length - 1;
        for (let i = 0; i < dim; i++) {
            assert.ok(node[i] !== 3, "Pure form should not have contradiction (3) in variables.");
        }
        assert.strictEqual(node[dim], 2, "Pure form should have trailing constant as 2.");
    }
}

// Helper to check that leaves have at least minVars variables present
function checkMinimumVariables(node, minVars) {
    if (Array.isArray(node) && typeof node[0] === 'number') {
        if (node[0] >= 0 && node[0] <= 3 && node.length > 2 && !Array.isArray(node[1])) {
            let presentCount = 0;
            let dim = node.length - 1;
            for (let i = 0; i < dim; i++) {
                if (node[i] !== 2) presentCount++;
            }
            assert.ok(presentCount >= minVars, `Leaf should have at least ${minVars} variables, found ${presentCount}.`);
        } else {
            for (let i = 1; i < node.length; i++) {
                if (Array.isArray(node[i])) {
                    if (typeof node[i][0] === 'number' && node[i].length > 2 && !Array.isArray(node[i][1])) {
                        let presentCount = 0;
                        let dim = node[i].length - 1;
                        for (let j = 0; j < dim; j++) {
                            if (node[i][j] !== 2) presentCount++;
                        }
                        assert.ok(presentCount >= minVars, `Leaf should have at least ${minVars} variables, found ${presentCount}.`);
                    } else {
                        checkMinimumVariables(node[i], minVars);
                    }
                }
            }
        }
    }
}

try {
    const DIMENSION = 4;

    // Test 1: SOP Generation Structure
    let sopAst = यादृच्छिक_सूचि_निर्माण(DIMENSION, 0, 0, 'SOP', 3);
    assert.strictEqual(sopAst[0], 1, "SOP root must be OR (1)");
    assert.strictEqual(sopAst.length, 4, "SOP should have exactly 3 terms plus the operator");
    assert.strictEqual(sopAst[1][0], 0, "SOP children must be AND (0)");
    console.log("✅ Test 1 Passed: SOP generation creates correct structural root and branches.");

    // Test 2: POS Generation Structure
    let posAst = यादृच्छिक_सूचि_निर्माण(DIMENSION, 0, 0, 'POS', 4);
    assert.strictEqual(posAst[0], 0, "POS root must be AND (0)");
    assert.strictEqual(posAst.length, 5, "POS should have exactly 4 terms plus the operator");
    assert.strictEqual(posAst[1][0], 1, "POS children must be OR (1)");
    console.log("✅ Test 2 Passed: POS generation creates correct structural root and branches.");

    // Test 3: Dimension Verification
    let randomAst = यादृच्छिक_सूचि_निर्माण(DIMENSION);
    checkDimension(randomAst, DIMENSION);
    console.log(`✅ Test 3 Passed: All generated leaf nodes strictly adhere to dimension ${DIMENSION}.`);

    // Test 4: Pure Form constraints (शुद्ध_रूपम् = 1)
    let pureAst = यादृच्छिक_सूचि_निर्माण(DIMENSION, 0, 1, null, 5);
    checkPurity(pureAst);
    console.log("✅ Test 4 Passed: Pure form strictly avoids contradictions (3) and constants (0,1).");

    // Test 5: Single Leaf Generation (एक_पंक्ति_निर्माण) directly
    let singleLeaf = एक_पंक्ति_निर्माण(DIMENSION, 3, 1); // Depth 3 prevents recursion
    assert.ok(Array.isArray(singleLeaf), "Should return an array.");
    assert.strictEqual(singleLeaf.length, DIMENSION + 1, "Leaf length should match dimension + 1.");
    console.log("✅ Test 5 Passed: Single leaf generation creates arrays of correct size.");

    // Test 6: Check minimum variables for SOP and POS
    let sopMinTest = यादृच्छिक_सूचि_निर्माण(DIMENSION, 0, 1, 'SOP', 5);
    checkMinimumVariables(sopMinTest, 2);
    let posMinTest = यादृच्छिक_सूचि_निर्माण(DIMENSION, 0, 1, 'POS', 5);
    checkMinimumVariables(posMinTest, 2);
    console.log("✅ Test 6 Passed: SOP and POS leaves enforce a minimum of 2 variables.");

    // Test 7: Array to Boolean Expression String test
    // Giving a predefined array (AST) and creating a boolean expression
    let predefinedArray = [1, 
        [0, [1, 0, 2, 2, 2]], // A.B' (Wrapped in 0 for SOP term)
        [0, [2, 1, 0, 2, 2]]  // B.C' (Wrapped in 0 for SOP term)
    ];
    let variables = ['A', 'B', 'C', 'D'];
    let expressionString = सूचितः_सूत्रम्(predefinedArray, variables);
    assert.strictEqual(expressionString, "((A.B')+(B.C'))");
    console.log(`✅ Test 7 Passed: Successfully generated boolean expression from array: ${expressionString}`);

    // Test 8: Generating Boolean Expression from यादृच्छिक_सूचि_निर्माण array
    let randomGeneratedArray = यादृच्छिक_सूचि_निर्माण(4, 0, 1, 'SOP', 2);
    let randomExpressionString = सूचितः_सूत्रम्(randomGeneratedArray, variables);
    assert.ok(randomExpressionString.length > 0, "Should generate a valid string");
    console.log(`✅ Test 8 Passed: Converted random AST array to boolean expression: ${randomExpressionString}`);

    // Test 9: 6 Variables, 21 Terms SOP
    let variables6 = ['A', 'B', 'C', 'D', 'E', 'F'];
    let largeSOPArray = यादृच्छिक_सूचि_निर्माण(6, 0, 1, 'SOP', 21);
    assert.strictEqual(largeSOPArray.length - 1, 21, "Should have exactly 21 terms");
    assert.strictEqual(largeSOPArray[0], 1, "Root should be OR for SOP");
    let largeSOPString = सूचितः_सूत्रम्(largeSOPArray, variables6);
    assert.ok(largeSOPString.length > 0, "Should generate a valid string");
    console.log(`✅ Test 9 Passed: Successfully generated 6-variable 21-term SOP expression.`);
    console.log(`--- AST Array (SOP) ---\n${JSON.stringify(largeSOPArray)}\n`);
    console.log(`--- Equation (SOP) ---\n${largeSOPString}\n`);

    // Test 10: 6 Variables, 21 Terms POS
    let largePOSArray = यादृच्छिक_सूचि_निर्माण(6, 0, 1, 'POS', 21);
    assert.strictEqual(largePOSArray.length - 1, 21, "Should have exactly 21 terms");
    assert.strictEqual(largePOSArray[0], 0, "Root should be AND for POS");
    let largePOSString = सूचितः_सूत्रम्(largePOSArray, variables6);
    assert.ok(largePOSString.length > 0, "Should generate a valid string");
    console.log(`✅ Test 10 Passed: Successfully generated 6-variable 21-term POS expression.`);
    console.log(`--- AST Array (POS) ---\n${JSON.stringify(largePOSArray)}\n`);
    console.log(`--- Equation (POS) ---\n${largePOSString}\n`);

    // Test 11: POS on SOP (Root is AND, children are SOPs)
    let posOnSopArray = [0]; // Root AND
    for (let i = 0; i < 3; i++) {
        // Add 3 SOP children
        posOnSopArray.push(यादृच्छिक_सूचि_निर्माण(6, 0, 1, 'SOP', 3));
    }
    let posOnSopString = सूचितः_सूत्रम्(posOnSopArray, variables6);
    assert.ok(posOnSopString.length > 0, "Should generate a valid string");
    console.log(`✅ Test 11 Passed: Successfully generated POS on SOP expression.`);
    console.log(`--- Equation (POS on SOP) ---\n${posOnSopString}\n`);

    // Test 12: SOP on POS (Root is OR, children are POSs)
    let sopOnPosArray = [1]; // Root OR
    for (let i = 0; i < 3; i++) {
        // Add 3 POS children
        sopOnPosArray.push(यादृच्छिक_सूचि_निर्माण(6, 0, 1, 'POS', 3));
    }
    let sopOnPosString = सूचितः_सूत्रम्(sopOnPosArray, variables6);
    assert.ok(sopOnPosString.length > 0, "Should generate a valid string");
    console.log(`✅ Test 12 Passed: Successfully generated SOP on POS expression.`);
    console.log(`--- Equation (SOP on POS) ---\n${sopOnPosString}\n`);

    console.log("🎉 All tests passed successfully!");

} catch (e) {
    console.error("\n❌ Test failed:");
    console.error(e);
}
