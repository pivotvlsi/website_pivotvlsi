const { प्रधान_लघुकारक } = require('./pradhana_laghukaraka.js');
const { यादृच्छिक_सूचि_निर्माण, सूचितः_सूत्रम् } = require('../../random_boolean_generator/yadrucchika_soochi.js');

console.log("=====================================================================");
console.log("Testing Pradhana Laghukaraka (Master Optimizer) with Random Equations");
console.log("=====================================================================\n");

let all_vars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let आयाम = Math.floor(Math.random() * 4) + 5; // 5 to 8 variables
let चरसूची = all_vars.slice(0, आयाम);

// Test 1: Random Standard SOP
console.log("---------------------------------------------------------------------");
console.log("Test 1: Random SOP Optimization (Shuddh Roopam)");
let ast1 = यादृच्छिक_सूचि_निर्माण(आयाम, 0, 1, 'SOP');
let str1 = सूचितः_सूत्रम्(ast1, चरसूची);
console.log(`Generated String: ${str1}`);
let result1 = प्रधान_लघुकारक(str1);
console.log("Test 1 Complete.\n");

// Test 2: Random Standard POS
console.log("---------------------------------------------------------------------");
console.log("Test 2: Random POS Optimization (Shuddh Roopam)");
let ast2 = यादृच्छिक_सूचि_निर्माण(आयाम, 0, 1, 'POS');
let str2 = सूचितः_सूत्रम्(ast2, चरसूची);
console.log(`Generated String: ${str2}`);
let result2 = प्रधान_लघुकारक(str2, "POS");
console.log("Test 2 Complete.\n");

// Test 3: Completely Random Deeply Nested Structure
console.log("---------------------------------------------------------------------");
console.log("Test 3: Deeply Nested Mixed Structure Optimization (Shuddh Roopam)");
// Generate a deeply nested AST (null type means mixed)
let ast3 = यादृच्छिक_सूचि_निर्माण(आयाम, 0, 1, null);
let str3 = सूचितः_सूत्रम्(ast3, चरसूची);
console.log(`Generated String: ${str3}`);
let result3 = प्रधान_लघुकारक(str3);
console.log("Test 3 Complete.\n");

console.log("=====================================================================");
console.log("All randomized tests completed! 🎉");
console.log("=====================================================================");
