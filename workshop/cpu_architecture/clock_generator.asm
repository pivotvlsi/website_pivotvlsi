; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: 10 CLOCK CYCLES PULSE GENERATOR
; ==============================================================================
; Target: Physical Pin 0 (Square Wave Clock Output)
; Cycles: Generates exactly 10 full clock pulses, then terminates (HALT)
; Loop Counter: Register R2 initialized to 10
; Jump Table: JUMP_TABLE[0] = 0x3 (Points to loop body at 0x3)
; ==============================================================================

; --- INITIALIZATION ---
; [0x0]: Set B register to 1 (decrement step)
LOADIB #1

; [0x1]: Load initial count 10 into ACC
LOADI #10

; [0x2]: Initialize loop counter R2 = 10
STORE 0x2

; --- LOOP BODY (STARTS AT ADDRESS 0x3) ---
; [0x3]: Drive Pin 0 HIGH (Clock Rising Edge)
SET1 0

; [0x4]: High Phase Delay (NOP)
NOP

; [0x5]: Drive Pin 0 LOW (Clock Falling Edge)
SET0 0

; [0x6]: Copy counter R2 into ACC
LOAD 0x2

; [0x7]: Decrement counter: ACC = ACC - B (R2 - 1)
SUB

; [0x8]: Store decremented value back into R2
STORE 0x2

; [0x9]: If counter != 0 (Zero Flag == 0), repeat loop via JUMP_TABLE[0] -> 0x3
JMPNZ 0

; --- TERMINATION ---
; [0xA]: After 10 completed cycles, stop execution
HALT
