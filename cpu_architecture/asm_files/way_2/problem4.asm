; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: UNROLLED CLOCK PULSE GENERATOR (NO LOOPS)
; ==============================================================================
; Problem: Generate Clock Pulse Burst on Pin 0 without loops / branch tables
; Target File: asm_files/way_2/problem4.asm
; Compliance: Strict isa_spec.md (16 Hardware Opcodes, Linear Instruction Execution)
;
; Target Pin: Physical Pin 0
; Operation: Generates alternating HIGH and LOW clock transitions on Pin 0 directly
; Instruction Layout (15 transitions + HALT = exactly 16 instructions):
; ==============================================================================

; --- PULSE 1 ---
; [0x0]: Cycle 1 - Drive Pin 0 HIGH (1)
SET1 0

; [0x1]: Cycle 2 - Drive Pin 0 LOW (0)
SET0 0

; --- PULSE 2 ---
; [0x2]: Cycle 3 - Drive Pin 0 HIGH (1)
SET1 0

; [0x3]: Cycle 4 - Drive Pin 0 LOW (0)
SET0 0

; --- PULSE 3 ---
; [0x4]: Cycle 5 - Drive Pin 0 HIGH (1)
SET1 0

; [0x5]: Cycle 6 - Drive Pin 0 LOW (0)
SET0 0

; --- PULSE 4 ---
; [0x6]: Cycle 7 - Drive Pin 0 HIGH (1)
SET1 0

; [0x7]: Cycle 8 - Drive Pin 0 LOW (0)
SET0 0

; --- PULSE 5 ---
; [0x8]: Cycle 9 - Drive Pin 0 HIGH (1)
SET1 0

; [0x9]: Cycle 10 - Drive Pin 0 LOW (0)
SET0 0

; --- PULSE 6 ---
; [0xA]: Cycle 11 - Drive Pin 0 HIGH (1)
SET1 0

; [0xB]: Cycle 12 - Drive Pin 0 LOW (0)
SET0 0

; --- PULSE 7 ---
; [0xC]: Cycle 13 - Drive Pin 0 HIGH (1)
SET1 0

; [0xD]: Cycle 14 - Drive Pin 0 LOW (0)
SET0 0

; --- PULSE 8 (RISING EDGE) ---
; [0xE]: Cycle 15 - Drive Pin 0 HIGH (1)
SET1 0

; --- TERMINATION ---
; [0xF]: Execution finished cleanly (Linear pipeline terminates without jumps)
HALT

