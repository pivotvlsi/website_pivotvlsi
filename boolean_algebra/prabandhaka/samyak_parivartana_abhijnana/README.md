# Samyak Parivartana Abhijnana (Proper Transformation Recognition)

This module is responsible for recognizing valid Boolean algebra transformations in the Abstract Syntax Tree (AST) representing logic equations. The term **Abhijnana (अभिज्ञान)** refers to "recognition", meaning these scripts detect whether a specific boolean rule has been validly applied between two AST states (`सूत्र१` and `सूत्र२`).

## Implemented Boolean Rules

Below is the list of currently implemented Boolean rules and their corresponding script files:

| File | Rule Name | Transformation |
|---|---|---|
| `abijnana_1.js` | Identity OR | `A + 0 = A` |
| `abijnana_2.js` | One Property | `A + 1 = 1` |
| `abijnana_3.js` | Zero Property | `A . 0 = 0` |
| `abijnana_4.js` | Identity AND | `A . 1 = A` |
| `abijnana_5.js` | Contradiction (विरोधः) | `A . A' = 0` |
| `abijnana_6.js` | Tautology (सर्वदा सत्य) | `A + A' = 1` |
| `abijnana_7.js` | Distribution 1 | `A + (B . C) = (A + B) . (A + C)` |
| `abijnana_8.js` | Distribution 2 | `A . (B + C) = (A . B) + (A . C)` |
| `abijnana_9.js` | Absorption 1 | `A + (A . B) = A` |
| `abijnana_10.js` | Absorption 2 | `A . (A + B) = A` |
| `abijnana_11.js` | Double Negation (OR-term) | `((A + B)')' = A + B` |
| `abijnana_12.js` | Double Negation (AND-term) | `((A . B)')' = A . B` |
| `abijnana_13.js` | Consensus Theorem | `(A . B) + (A' . C) + (B . C) = (A . B) + (A' . C)` |
| `abijnana_14.js` | Consensus Theorem 2 (Dual) | `(A + B) . (A' + C) . (B + C) = (A + B) . (A' + C)` |
| `abijnana_15.js` | De Morgan's Law (OR) | `(A + B)' = A' . B'` |
| `abijnana_16.js` | De Morgan's Law (AND) | `(A . B)' = A' + B'` |

## Testing
Each `abijnana_*.js` script has a corresponding `test_abijnana_*.js` file located in the same directory. You can run individual test files via Node.js:
```sh
node test_abijnana_1.js
```
