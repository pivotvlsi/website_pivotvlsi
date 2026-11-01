; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: 10 CLOCK CYCLES (10 INSTRUCTION CYCLES)
; ==============================================================================
; Target: Pin 0
; Specification: Executes for exactly 10 machine cycles, toggling Pin 0 every cycle
; Total Instructions: Exactly 10 (from address 0x0 to 0x9)
; ==============================================================================

; Cycle 1: High
SET1 0

; Cycle 2: Low
SET0 0

; Cycle 3: High
SET1 0

; Cycle 4: Low
SET0 0

; Cycle 5: High
SET1 0

; Cycle 6: Low
SET0 0

; Cycle 7: High
SET1 0

; Cycle 8: Low
SET0 0

; Cycle 9: High
SET1 0

; Cycle 10: Low & Finished
SET0 0

; Stop execution
HALT

