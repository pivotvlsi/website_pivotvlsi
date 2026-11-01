; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: 10 CLOCK CYCLES PULSE GENERATOR
; ==============================================================================
; Target: Pin 0 (Square Wave Clock Output)
; Specification: Exactly 10 Clock Cycles (10 Full High-to-Low Periods)
; Loop Control: Register R2 used as iteration counter (initialized to 10)
; Jump Table: JUMP_TABLE[0] points to address 0x3 (the loop body start)
; ==============================================================================

; --- INITIALIZATION ---
; [0x0]: Load immediate 1 into B register (subtraction decrement step)
LOADIB #1

; [0x1]: Load count 10 into ACC
LOADI #10

; [0x2]: Initialize loop counter R2 = 10
MOV R2, R0

; --- LOOP BODY (START: ADDRESS 0x3) ---
; [0x3]: Drive Pin 0 HIGH (Rising Edge)
SET1 0

; [0x4]: High Phase Delay
NOP

; [0x5]: Drive Pin 0 LOW (Falling Edge)
SET0 0

; [0x6]: Copy counter R2 into ACC for decrement
MOV R0, R2

; [0x7]: Decrement counter: ACC = ACC - B (ACC = R2 - 1)
SUB

; [0x8]: Save updated count back to R2
MOV R2, R0

; [0x9]: If ACC != 0 (ZF == 0), jump back to 0x3 via JUMP_TABLE[0]
; JUMP_TABLE[0] must be configured to target 0x3
JMPNZ 0

; --- FINISH ---
; [0xA]: After exactly 10 cycles, halt the processor
HALT

