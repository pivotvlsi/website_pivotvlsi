# Test Execution Guide (`test_run.md`)

This guide explains how to run the automated unit tests, integration tests, and Selenium browser UI tests for the **Boolean Algebra** project.

---

## 1. Prerequisites

- **Node.js**: v18+ (tested on Node.js v22)
- **Perl**: Strawberry Perl or standard Perl with `Selenium::Chrome` module installed
- **Google Chrome**: Matching the installed `chromedriver.exe` located at `c:\Users\rnish\vscode\Pasupathi\pivotvlsi\truth_table\chromedriver.exe` (Chrome 155+).

---

## 2. Running HTML & UI Tests with Selenium (Perl)

Make sure you are in the project root:
```powershell
cd c:\Users\rnish\vscode\Pasupathi\pivotvlsi\truth_table\boolean_algebra
```

### A. Equation Generation Scenarios UI Test
Validates dynamic equation generation directly in `boolean_algebra.html` across **SOP**, **POS**, and **ANY** forms via Chrome automation:

```powershell
perl tests/test_generation_ui.pl
```

### B. Full Boolean Algebra UI Test Suite
Runs the end-to-end Selenium test suite across format selection, result checking, hints, and step-by-step simplification:

- **Run all testcases:**
  ```powershell
  perl tests/test_boolean_algebra.pl all
  ```

### C. Complete Browser UI Simplification Pipelines (Separate Testcases)
Runs the full interactive workflow in real Chrome browser: Setting format -> Inputting/Generating equation -> Locking -> Querying Hint -> Multi-step Reduction & Verification -> Final Answer -> Check Result:

- **1. SOP to SOP Testcase:**
  ```powershell
  perl tests/test_ui_sop_to_sop.pl
  ```
- **2. POS to POS Testcase:**
  ```powershell
  perl tests/test_ui_pos_to_pos.pl
  ```
- **3. POS to SOP Testcase:**
  ```powershell
  perl tests/test_ui_pos_to_sop.pl
  ```
- **4. SOP to POS Testcase:**
  ```powershell
  perl tests/test_ui_sop_to_pos.pl
  ```

---

## 3. Running Engine & Orchestrator Tests (Node.js)

### A. Equation Generation Comprehensive Test Suite
Validates AST creation, parenthesis balancing, operator syntax, variable boundaries (3–6 variables), and runs 150 randomized fuzz stress iterations across SOP, POS, and ANY:

```powershell
node tests/test_equation_generation.js
```

### B. Full Simplification Engine & Reduction Pipeline Test
Runs full end-to-end multi-step reduction cycles on complex expressions (e.g. Absorption, Simplification Theorem, Idempotent, Contradiction, Tautology, De Morgan's Law, and 10 random generated equations):

```powershell
node tests/test_full_simplification.js
```

### C. Prabandhaka Master Orchestrator Test
Verifies coordination between the 3 core pillars: **अन्वेषण (Anveshana)**, **लघुकरण (Laghukarana)**, and **अभिज्ञान (Abhijnana)**:

```powershell
node prabandhaka/test_prabandhaka.js
```

### C. Master Optimizer Tests (Pradhana Laghukaraka)
Runs multi-variable optimization and simplification tests on random Boolean expressions:

```powershell
node pradhana_laghukaraka/test_pradhana_laghukaraka.js
```

---

## 4. Running Individual Module Tests

### A. Abhijnana (Rule Recognition) Tests
Test whether specific Boolean rules are recognized between AST states:
```powershell
node samyak_parivartana_abhijnana/test_abijnana_1.js
node samyak_parivartana_abhijnana/test_abijnana_13.js
```

### B. Laghukarana (Rule Simplification) Tests
Test step-by-step tree reduction for specific Boolean identities:
```powershell
node laghukarana/test_laghukarana_1.js
node laghukarana/test_laghukarana_17.js
```

### C. Anveshana (Rule Search) Tests
Test pattern matching against multi-term logic expressions:
```powershell
node anveshana/test_anveshana.js
```

---

## 5. Troubleshooting

- **ChromeDriver version mismatch error**:
  Ensure `chromedriver.exe` in `../` matches the installed Chrome browser version (`chrome.exe --version`).
- **Missing Perl modules**:
  Install `Selenium::Chrome` via CPAN:
  ```powershell
  cpan Selenium::Chrome
  ```
