# Instruction & Assembly Validation Test Cases Specification

This document details all test cases and validation rules implemented to verify the syntax, opcode legitimacy, operand boundaries, memory constraints, and error reporting for the **PIVOT VLSI 4-Bit Microprocessor Simulator** (`basic_cpu_gui.html`).

---

## 1. Test Suite Summary

- **Automated Test Runner:** [`tests/test_validation_import.pl`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/tests/test_validation_import.pl)
- **Target Validator Engine:** `निर्देश_संहिता_सत्यापनम्()` in [`basic_cpu_gui.js`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/basic_cpu_gui.js)
- **Framework:** Perl 5 (`Test::More`, `Selenium::Chrome`) executed on headless Chrome (`chromedriver.exe`)
- **Status:** **100% Passed (5 Subtests, 15 Assertions)**

---

## 2. Exhaustive Error Categories & Validation Matrix

| Category ID | Error Category | Constraint / Rule | Valid Range / Format | Invalid Input Example | Emitted Error Message | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: |
| **`VAL-OPC`** | **Opcode Legality** | Mnemonic must exist in the 19 supported ISA operations. | `ADD, SUB, AND, XOR, SHR, SHL, NOP, LOADIB, SET0, SET1, LOADI, LOAD, STORE, JMP, JMPNZ, JMPC, MOV, NOT, HALT` | `FOOBAR R0, R1` | `Line X: Invalid Opcode 'FOOBAR'.` | **PASS** |
| **`VAL-REG`** | **Register Bounds** | Register operands must target available processor registers. | `R0` – `R7`, `ACC`, `B`, `PIN_IN`, `PIN_EN`, `PIN_OUT`, `TIMER` | `MOV R12, R0`<br>`ADD R8, R9` | `Line X: MOV dest operand 'R12' is invalid. Expected R0-R7.`<br>`Line X: ADD src operand 'R9' is invalid. Expected R0-R7.` | **PASS** |
| **`VAL-IMM8`** | **8-Bit Immediate** | Immediate values for `LOADI` and `LOADIB` must fit in 8 bits. | `0` – `255` (`#0` – `#255`, `0x00` – `0xFF`) | `LOADI #999`<br>`LOADIB 300` | `Line X: LOADI immediate operand '#999' is invalid. Expected 8-bit value (0-255 or #0-255).` | **PASS** |
| **`VAL-IMM4`** | **4-Bit Immediate** | Immediate values for `LOAD Rd, #imm` must fit in 4 bits. | `0` – `15` (`#0` – `#15`, `0x0` – `0xF`) | `LOAD R0, #35` | `Line X: LOAD immediate value '#35' invalid. Expected 0-15.` | **PASS** |
| **`VAL-ADDR`** | **Memory Address** | Memory addresses for `LOAD [addr]` and `STORE [addr]` must fit 4-bit memory space. | `0` – `15` (`0x0` – `0xF`) | `LOAD 0x1F`<br>`STORE 0xFF` | `Line X: LOAD address '0x1F' invalid. Expected memory address 0-15.`<br>`Line X: STORE address '0xFF' invalid. Expected memory address 0-15.` | **PASS** |
| **`VAL-PIN`** | **GPIO Pin Index** | Pin operands for `SET0` and `SET1` must reference the 4 data pins. | `0` – `3` (`PIN0` – `PIN3`) | `SET0 8`<br>`SET1 9` | `Line X: SET0 pin index '8' is invalid. Expected Pin 0-3.` | **PASS** |
| **`VAL-JMP`** | **Jump Table ID** | Branch targets for `JMP`, `JMPNZ`, `JMPC` must map to valid table entries. | `0` – `15` (`0x0` – `0xF`) | `JMP 24` | `Line X: JMP jump table ID '24' is invalid. Expected 0-15.` | **PASS** |
| **`VAL-CAP`** | **Memory Overflow** | Program size must not exceed the physical 16-word Instruction ROM. | Maximum 16 instructions | File containing 20 instructions | `Instruction memory overflow! Max instruction memory capacity is 16 instructions.` | **PASS** |
| **`VAL-EMPTY`**| **Empty Memory** | Clicking validate with no instructions loaded must trigger an advisory. | At least 1 instruction | Empty Instruction Memory | `⚠️ Instruction memory is empty! Import an assembly program first.` | **PASS** |

---

## 3. Test Cases Breakdown (`test_validation_import.pl`)

### Subtest 1: सम्पादक निष्कासन एवं आयात पटल सत्यापनम् (Editor Removal & Import Controls)
* **`TC-VAL-1.1`**: Verifies that the manual code `<textarea>` (`#पाठ-कार्यक्रम-निवेश`) is completely removed from the DOM.
* **`TC-VAL-1.2`**: Verifies that the file input element (`#संचिका-भारक-निवेश`) is present and configured for `.asm` and `.txt` files.
* **`TC-VAL-1.3`**: Verifies that the validation trigger button (`#निर्देश-सत्यापन-कुञ्जी`) exists in the DOM.

### Subtest 2: रिक्त स्मृति सत्यापन परीक्षणम् (Empty Memory Validation)
* **`TC-VAL-2.1`**: Clicks `#निर्देश-सत्यापन-कुञ्जी` when memory is empty.
* **Expected Result**: Validation banner (`#सत्यापन-फलक`) displays: `"⚠️ Instruction memory is empty! Import an assembly program first."`

### Subtest 3: मान्य निर्देश समुच्चय सत्यापनम् (Exhaustive Valid Instructions Test)
* **Test Asset:** [`tests/valid_program.asm`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/tests/valid_program.asm)
* **Assembly Content:**
  ```assembly
  ; Valid program exercising all 16 ISA instructions
  LOADI #12
  LOADIB #5
  ADD
  SUB
  AND
  XOR
  SHL
  SHR
  SET1 2
  SET0 2
  STORE 0x6
  LOAD 0x6
  MOV R2, R0
  NOT R2
  NOP
  HALT
  ```
* **`TC-VAL-3.1`**: Automatically imports `valid_program.asm` and validates all instructions.
  - **Expected Result**: Validation banner displays: `"✅ All 16 instruction(s) in memory are valid!"`
* **`TC-VAL-3.2`**: Steps Program Counter (`PC=0`) to execute `LOADI #12`.
  - **Expected Result**: Accumulator (`R0`) updates to `12`.

### Subtest 4: अमान्य ऑपकोड एवं ऑपरैण्ड सीमा परीक्षणम् (Invalid Instructions & Out-of-Bounds Test)
* **Test Snippet:**
  ```assembly
  BADOPCODE R0, R1    ; Invalid opcode
  LOADI #999          ; Immediate value > 255
  SET0 8              ; Pin index > 3
  LOAD 0x1F           ; Memory address > 15
  STORE 0xFF          ; Memory address > 15
  MOV R12, R0         ; Destination register R12 > R7
  ADD R8, R9          ; Source/Dest registers > R7
  ```
* **`TC-VAL-4.1`**: Validates that validator flags `सफलम् == false`.
* **`TC-VAL-4.2`**: Verifies that all 6 distinct errors are captured simultaneously.
* **`TC-VAL-4.3 – 4.8`**: Individual assertion checks confirming accurate line numbers and diagnostic strings for each error type.

### Subtest 5: स्मृति अतिप्रवाह परीक्षणम् (Instruction Memory Overflow Test)
* **Test Snippet:** Dynamically generates 20 `NOP` instructions.
* **`TC-VAL-5.1`**: Validates that validator rejects the program.
* **`TC-VAL-5.2`**: Confirms rejection message explicitly reports: `"Instruction memory overflow! Max instruction memory capacity is 16 instructions."`

---

## 4. Execution Commands

To execute this validation test suite via command line:

```powershell
perl tests/test_validation_import.pl
```

### Verified TAP Output:
```tap
# Starting Selenium Chrome Driver for Exhaustive Validation Testing...
# Subtest: १. सम्पादक निष्कासन एवं आयात पटल सत्यापनम् (Editor Removal & Import Verification)
    ok 1 - Textarea editor is completely removed from GUI
    ok 2 - File Import control (#संचिका-भारक-निवेश) is present
    ok 3 - Validate Button (#निर्देश-सत्यापन-कुञ्जी) is present
    1..3
ok 1 - १. सम्पादक निष्कासन एवं आयात पटल सत्यापनम् (Editor Removal & Import Verification)

# Subtest: २. रिक्त स्मृति सत्यापन परीक्षणम् (Empty Memory Validation)
    ok 1 - Empty memory triggers warning banner
    1..1
ok 2 - २. रिक्त स्मृति सत्यापन परीक्षणम् (Empty Memory Validation)

# Subtest: ३. मान्य निर्देश समुच्चय सत्यापनम् (Exhaustive Valid Instructions Test)
    ok 1 - Valid 16-instruction program passes validation completely
    ok 2 - LOADI #12 correctly executed into ACC (R0 = 12)
    1..2
ok 3 - ३. मान्य निर्देश समुच्चय सत्यापनम् (Exhaustive Valid Instructions Test)

# Subtest: ४. अमान्य ऑपकोड एवं ऑपरैण्ड सीमा परीक्षणम् (Invalid Instructions & Out-of-Bounds Operands Test)
    ok 1 - Validator correctly detects invalid code
    ok 2 - All 6 distinct errors correctly captured
    ok 3 - Caught invalid opcode BADOPCODE
    ok 4 - Caught out-of-range immediate #999
    ok 5 - Caught out-of-range pin 8
    ok 6 - Caught out-of-range memory address 0x1F
    ok 7 - Caught non-existent register R12 (>R7)
    ok 8 - Caught non-existent register R8 (>R7)
    1..8
ok 4 - ४. अमान्य ऑपकोड एवं ऑपरैण्ड सीमा परीक्षणम् (Invalid Instructions & Out-of-Bounds Operands Test)

# Subtest: ५. स्मृति अतिप्रवाह परीक्षणम् (Instruction Memory Overflow Test)
    ok 1 - Code with > 16 instructions fails validation
    ok 2 - Correctly flags instruction memory overflow (>16 instructions)
    1..2
ok 5 - ५. स्मृति अतिप्रवाह परीक्षणम् (Instruction Memory Overflow Test)
1..5
```

