# Random Boolean Generator (यादृच्छिक सूत्र निर्माणम्)

This directory contains utilities to procedurally generate random Boolean Algebraic Abstract Syntax Tree (AST) structures and convert them into readable string equations. It is designed to rigorously stress-test boolean simplification engines with mathematically sound, multi-variable logic structures in both Sum-of-Products (SOP) and Product-of-Sums (POS) forms.

## Features

- **AST Array Generation (`यादृच्छिक_सूचि_निर्माण`)**: Generates deeply nested or flat Boolean expression arrays.
  - Supports structural constraints such as defining exact terms or restricting specific forms.
  - Mathematically robust generation for complex `SOP` (Sum-of-Products) and `POS` (Product-of-Sums) structures, ensuring accurate operator nesting.
- **AST to Equation Stringifier (`सूचितः_सूत्रम्`)**: Recursively converts generated boolean arrays into standard human-readable algebraic notation. Correctly handles context-sensitive operators based on parent relationships.
- **Single Term Generator (`एक_पंक्ति_निर्माण`)**: Generates randomized leaf logic terms (variables and constants) conforming to exact dimensions.
- **Sanskrit / Devanagari Localization**: Core variables, logic structures, test logging, and parameters use Sanskrit terminology for programmatic integrity within the context of the larger project.

## Files

- `yadrucchika_soochi.js`: The core generation and stringification utility exporting `यादृच्छिक_सूचि_निर्माण` and `सूचितः_सूत्रम्`.
- `test_yadrucchika_soochi.js`: Extensive fuzz-testing suite executing structural logic tests, pure-form validation, and heavy logic scenarios up to 6 variables and 21 terms, including nested `POS on SOP` and `SOP on POS` forms.

## Usage

You can generate a random array, and output it as a mathematical equation:

```javascript
const { यादृच्छिक_सूचि_निर्माण, सूचितः_सूत्रम् } = require('./yadrucchika_soochi');

let variables = ['A', 'B', 'C', 'D'];

// Generate an SOP array with 4 variables and up to 3 terms
let randomArray = यादृच्छिक_सूचि_निर्माण(4, 0, 1, 'SOP', 3);

// Output the array as a string
let expressionString = सूचितः_सूत्रम्(randomArray, variables);

console.log(expressionString); 
// Example Output: ((A.B'.C)+(A'.C.D)+(B.C'.D))
```
