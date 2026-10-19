# Parsing Architecture: `sootra_vibhajana` vs `satyata_saarani_prarambha`

Although both files deal with parsing boolean expressions, they serve two distinct sequential roles in the processing pipeline. 

Think of `sootra_vibhajana.js` as the **Spell-Checker/Pre-processor**, and `satyata_saarani_prarambha.js` as the **Compiler**.

## 1. `sootra_vibhajana.js` (String Standardizer)
The purpose of this file is to take messy, informal human input and turn it into a perfectly formatted, unambiguous string.
- **Implicit AND Insertion:** It finds adjacent variables like `AB` or `A(B)` and inserts explicit dots to make them `A.B` and `A.(B)`.
- **Shunting Yard Algorithm:** It evaluates standard order of operations (NOT > AND > OR).
- **Explicit Bracketing:** It wraps operations in parentheses so that there is no ambiguity about what happens first. For example, it turns `A+B.C` into `(A+(B.C))`.
- **Output:** Returns a plain text `string`.

## 2. `satyata_saarani_prarambha.js` (AST Generator)
The purpose of this file is to take a standardized string and convert it into the internal mathematical array structure (the Abstract Syntax Tree) that the rest of the application uses to solve logic equations.
- **Recursive Splitting:** It splits the string around operators, walking down the parentheses to understand the hierarchy of the formula.
- **Numerical Mapping:** It translates variables (A, B, C) into positional numerical arrays (e.g., `[1, 2, 2]` where `1` = True, `0` = False, `2` = Don't Care).
- **Operator Mapping:** It replaces string operators with numerical IDs (`0` for AND, `1` for OR).
- **Output:** Returns a nested `array` tree (e.g., `[1, [0, [1, 2, 2]], [2, 1, 2]]`).

## How they work together
If a user types `"A B + C"`, the data flow looks like this:
1. `सूत्र_विभाजन("A B + C")` cleans the input and returns the string `"(A.B)+C"`.
2. `सत्यता_सारणी_प्रारंभ("(A.B)+C")` reads that clean string and compiles it into the internal nested array structure.
