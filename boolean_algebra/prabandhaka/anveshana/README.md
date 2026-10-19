# Boolean Simplification Engine (सरलीकरणम्)

This directory contains the core logic for mathematically simplifying Boolean Algebraic Abstract Syntax Trees (AST). The simplification engine parses multi-variable logical expressions and applies established Boolean algebra theorems to reduce them to their most optimal forms.

## Architecture

The engine is structurally separated into two conceptual domains:

### 1. The Rules Engine (`anveshana_saralikarana.js` & `anveshana_[1-16].js`)
This module is responsible for defining the individual mathematical theorems used to reduce logic. For each rule, it typically provides an `अन्वेषण` (Discovery) function to detect if the rule applies to a specific term, and a `सरलीकरण` (Simplification) function to apply the reduction.

Supported theorems include:
- **Identity OR (तत्समक_अथवा)**: `A + 0 = A`
- **One Property (एक_गुण)**: `A + 1 = 1`
- **Zero Property (शून्य_गुण)**: `A . 0 = 0`
- **Identity AND (तत्समक_अन्)**: `A . 1 = A`
- **Tautology (सर्वदा_सत्य)**: `A + A' = 1`
- **Contradiction (विरोधाभास)**: `A . A' = 0`
- **Distributive Law (वितरण)**: `A + (B.C)`
- **Distributive Law 2 (वितरण_२)**: `A . (B+C)`
- **Absorption Law (अवशोषण)**: `A + A.B = A`
- **Absorption Law 2 (अवशोषण_२)**: `A . (A+B) = A`
- **Double Negation OR (द्विगुण_निषेध_अथवा)**: `((A+B)')' = A+B`
- **Double Negation AND (द्विगुण_निषेध_अन्)**: `((A.B)')' = A.B`
- **Consensus Theorem (सम्मति)**: `A.B + A'.C + B.C = A.B + A'.C`
- **Consensus Theorem 2 (सम्मति_२)**: `(A+B) . (A'+C) . (B+C) = (A+B) . (A'+C)`
- **De Morgan's NAND (नैण्ड)**: Finding `(A.B)'` for expansion to `A' + B'`
- **De Morgan's NOR (नोर)**: Finding `(A+B)'` for expansion to `A' . B'`

### 2. The Core Simplifier (`saralikarana.js`)
This is the primary execution engine. It recursively traverses the AST array structures (from the root down to the leaves), applies the logic defined in the Rules Engine, and manages the execution of complex inter-term reductions (like the Generalized Consensus Theorem and Absorption Laws). 

## AST Node Identification
Within the simplification engine, AST nodes and child terms are identified **distinctly by their array index pathway**. Because the AST utilizes raw arrays instead of objects, tracking the index is the primary method for maintaining context and isolating specific logical terms during traversal.
