; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: ARITHMETIC & LOGICAL SHIFT EVALUATION
; ==============================================================================
; Problem: Execute LSH(2 + 3 - 5)
; Target File: problem 2.asm
; Compliance: Strict isa_spec.md (4-bit Opcode Accumulator Architecture)
;
; Evaluation Breakdown:
;   1. Load 2 into ACC:           ACC = 2
;   2. Load 3 into B:             B = 3
;   3. Add B to ACC:              ACC = 2 + 3 = 5
;   4. Load 5 into B:             B = 5
;   5. Subtract B from ACC:       ACC = 5 - 5 = 0  (Zero Flag = 1)
;   6. Logical Shift Left (SHL):  ACC = SHL(0) = 0 << 1 = 0
;   7. Result stored & halted:    Final ACC = 0
; ==============================================================================

; [0x0]: Step 1 - Load first term (2) into Accumulator
LOADI #2

; [0x1]: Step 2 - Load second term (3) into Register B
LOADIB #3

; [0x2]: Step 3 - Add B to ACC: ACC = 2 + 3 = 5
ADD

; [0x3]: Step 4 - Load third term (5) into Register B
LOADIB #5

; [0x4]: Step 5 - Subtract B from ACC: ACC = 5 - 5 = 0
SUB

; [0x5]: Step 6 - Left Shift ACC: ACC = SHL(0) = 0
SHL

; [0x6]: Step 7 - Terminate program execution
HALT

