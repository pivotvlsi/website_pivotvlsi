; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: FIBONACCI SEQUENCE GENERATOR
; ==============================================================================
; Problem: Compute Fibonacci Sequence: 0, 1, 1, 2, 3, 5, 8, 13 (0xD)
; Target File: problem3.asm
; Compliance: Strict isa_spec.md (16 Hardware Opcodes, Load/Store Architecture)
;
; Register Usage:
;   - ACC (R0): Working accumulator (holds previous term, computes F(n+1))
;   - B   (R1): Current Fibonacci term F(n)
;   - R2      : Intermediate storage for new term F(n+1)
;   - R3      : Storage for preceding term F(n-1)
;
; Jump Table Configuration:
;   - JUMP_TABLE[0] = 0x3  (Loop body start address)
;   - JUMP_TABLE[1] = 0xC  (Exit loop to HALT address)
;
; Fibonacci Progression (4-bit Architecture):
;   F(0) = 0, F(1) = 1
;   Iter 1: 0 + 1 = 1   (F2)
;   Iter 2: 1 + 1 = 2   (F3)
;   Iter 3: 1 + 2 = 3   (F4)
;   Iter 4: 2 + 3 = 5   (F5)
;   Iter 5: 3 + 5 = 8   (F6)
;   Iter 6: 5 + 8 = 13  (F7, Hex 0xD)
;   Iter 7: 8 + 13 = 21 -> Carry set (Overflow > 15) -> JMPC branches to HALT
; ==============================================================================

; --- INITIALIZATION ---
; [0x0]: Initialize B = 1 (F1 = 1)
LOADIB #1

; [0x1]: Initialize ACC = 0 (F0 = 0)
LOADI #0

; [0x2]: Store F0 (0) into R3
STORE 0x3

; --- FIBONACCI LOOP BODY (STARTS AT 0x3) ---
; [0x3]: Compute next Fibonacci number: ACC = F(n-1) + F(n)
ADD

; [0x4]: If addition overflows 4 bits (> 15), exit loop to HALT
JMPC 1

; [0x5]: Save new Fibonacci term F(n+1) into R2
STORE 0x2

; [0x6]: Load old F(n) from B into ACC
LOAD 0x1

; [0x7]: Save old F(n) into R3 as preceding term
STORE 0x3

; [0x8]: Load new term F(n+1) from R2 into ACC
LOAD 0x2

; [0x9]: Update register B with new term F(n+1)
STORE 0x1

; [0xA]: Load preceding term from R3 into ACC ready for next ADD
LOAD 0x3

; [0xB]: Repeat loop for next Fibonacci term via JUMP_TABLE[0] -> 0x3
JMP 0

; --- TERMINATION ---
; [0xC]: Execution completed safely (Target of JUMP_TABLE[1])
HALT

