# Test Specifications & Verification Suites

This document provides complete documentation of the test suites designed to verify the **PIVOT VLSI 4-Bit Microprocessor Simulator** GUI, file importer, instruction validator, and digital logic analyzer waveform engine.

---

## 1. Test Suite Summary

| Test Suite File | Focus Area | Framework | Status |
| :--- | :--- | :--- | :---: |
| [`tests/test_timer_and_registers.pl`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/tests/test_timer_and_registers.pl) | Registers R4-R7 (`PIN_IN`, `PIN_EN`, `PIN_OUT`, `TIMER`), Hardware Timer Read Countdown Stall | Perl 5 / Selenium | **100% PASS** (3 Subtests, 17 assertions) |
| [`tests/test_validation_import.pl`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/tests/test_validation_import.pl) | Assembly Import, Textarea Removal, Instruction & Operand Validation | Perl 5 / Selenium | **100% PASS** (5 Subtests, 15 assertions) |
| [`tests/test_cpu_waveform.pl`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/tests/test_cpu_waveform.pl) | GPIO Rules, Physical Bubbles, Future Waveform Toggles, Cycles | Perl 5 / Selenium | **100% PASS** (5 Subtests, 20 assertions) |

---

## 2. Test Suite Details: `test_validation_import.pl`

### Subtest 1: सम्पादक निष्कासन एवं आयात पटल सत्यापनम् (Editor Removal & Import Verification)
- **Objective:** Ensure the textarea code editor has been completely removed from the DOM and replaced by a pure File Import mechanism.
- **Assertions:**
  1. `#पाठ-कार्यक्रम-निवेश` (textarea) does not exist in DOM.
  2. `#संचिका-भारक-निवेश` (file input) is present for `.asm` / `.txt` files.
  3. `#निर्देश-सत्यापन-कुञ्जी` (Validate button) is present.

### Subtest 2: रिक्त स्मृति सत्यापन परीक्षणम् (Empty Memory Validation)
- **Objective:** Verify that clicking the Validate button on uninitialized memory alerts the user.
- **Assertion:** Emits warning banner: `"⚠️ Instruction memory is empty! Import an assembly program first."`

### Subtest 3: मान्य निर्देश समुच्चय सत्यापनम् (Exhaustive Valid Instructions Test)
- **Test Asset:** [`tests/valid_program.asm`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/tests/valid_program.asm)
- **Instructions Tested:** `LOADI`, `LOADIB`, `ADD`, `SUB`, `AND`, `XOR`, `SHL`, `SHR`, `SET1`, `SET0`, `STORE`, `LOAD`, `MOV`, `NOT`, `NOP`, `HALT` (16 total).
- **Assertions:**
  1. Validation passes: `"✅ All 16 instruction(s) in memory are valid!"`
  2. Single-step execution executes `LOADI #12`, verifying accumulator receives `12`.

### Subtest 4: अमान्य ऑपकोड एवं ऑपरैण्ड सीमा परीक्षणम् (Invalid Instructions & Out-of-Bounds Operands Test)
- **Test Asset:** [`tests/invalid_program.asm`](file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/tests/invalid_program.asm)
- **Errors Exhaustively Tested & Caught:**
  1. `BADOPCODE R0, R1`: Invalid opcode rejected.
  2. `LOADI #999`: 8-bit immediate overflow (>255) caught.
  3. `SET0 8`: Pin index out of range (>3) caught.
  4. `LOAD 0x1F`: Memory address out of range (>15) caught.
  5. `STORE 0xFF`: Store address out of range (>15) caught.
  6. `MOV R5, R0`: Destination register `R5` out of range (`R0-R3`) caught.
  7. `ADD R8, R9`: Source and destination registers out of range caught.

### Subtest 5: स्मृति अतिप्रवाह परीक्षणम् (Instruction Memory Overflow Test)
- **Objective:** Reject programs exceeding the 16-word instruction memory limit.
- **Assertion:** 20-instruction program rejected with: `"Instruction memory overflow! Max instruction memory capacity is 16 instructions."`

---

## 3. Running the Test Suites

To execute both test suites:

```powershell
# 1. Validation & Import Suite
perl tests/test_validation_import.pl

# 2. Waveform & GPIO Suite
perl tests/test_cpu_waveform.pl
```
