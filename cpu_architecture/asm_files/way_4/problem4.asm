; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: TIMER-BASED CLOCK WAVEFORM GENERATOR
; ==============================================================================
; Problem: Generate Clock Pulse Waveform with Adjustable Frequency using TIMER
; Target File: asm_files/way_4/problem4.asm
; Compliance: Strict isa_spec.md (16 Hardware Opcodes, Hardware Timer 0x7/0x8)
;
; Frequency Control Mechanism:
;   Writing delay cycle count to TIMER (Address 0x7 or 0x8) sets countdown.
;   Reading TIMER (LOAD 0x7) initiates hardware countdown stall for N cycles,
;   stretching both the HIGH phase and LOW phase of the clock pulse on Pin 0.
;   Changing the immediate operand in LOADI sets the clock frequency/period!
;
; Pin Output: Physical Pin 0
; Jump Table Mapping: JUMP_TABLE[0] = 0x2 (points to loop start at 0x2)
; ==============================================================================

; --- INITIALIZATION (FREQUENCY / HALF-PERIOD CONFIGURATION) ---
; [0x0]: Configure Timer Delay Duration (e.g., 4 cycles stall per half-period)
; Change this value to adjust the output clock frequency:
;   Higher value -> Longer half-period -> Lower clock frequency
;   Lower value  -> Shorter half-period -> Higher clock frequency
LOADI #4

; [0x1]: Store configured half-period delay duration into R2 (Address 0x2)
STORE 0x2

; --- CLOCK GENERATOR LOOP (STARTS AT ADDRESS 0x2) ---
; [0x2]: Drive Pin 0 HIGH (Rising Edge)
SET1 0

; [0x3]: Reload half-period delay count from R2 into ACC
LOAD 0x2

; [0x4]: Initialize Hardware Timer countdown (0x7)
STORE 0x7

; [0x5]: Read TIMER (0x7) - Stalls CPU for countdown cycles (extends HIGH phase)
LOAD 0x7

; [0x6]: Drive Pin 0 LOW (Falling Edge)
SET0 0

; [0x7]: Reload half-period delay count from R2 into ACC
LOAD 0x2

; [0x8]: Initialize Hardware Timer countdown (0x7)
STORE 0x7

; [0x9]: Read TIMER (0x7) - Stalls CPU for countdown cycles (extends LOW phase)
LOAD 0x7

; [0xA]: Unconditional Jump back to start of clock pulse loop via JUMP_TABLE[0] -> 0x2
JMP 0

