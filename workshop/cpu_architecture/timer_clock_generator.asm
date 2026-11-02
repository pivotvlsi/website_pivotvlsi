; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: PRECISION TIMER-BASED CLOCK GENERATOR
; ==============================================================================
; Target: Pin 0 Clock Out using Hardware Countdown Timer (0x7 / R7)
; Stalls CPU execution accurately for N cycles during each phase.
;
; Phase Delay: Configured via immediate loaded into Timer (e.g. 2 cycles stall)
; ==============================================================================

; --- HIGH PHASE ---
; Drive Pin 0 HIGH
SET1 0

; Load countdown delay count (#2 cycles stall) into ACC
LOADI #2

; Transfer ACC to TIMER (R7 / 0x7)
MOV R7, R0

; Read TIMER (0x7 / R7): Hardware stalls execution until timer reaches 0
MOV R0, R7

; --- LOW PHASE ---
; Drive Pin 0 LOW
SET0 0

; Load countdown delay count (#2 cycles stall) into ACC
LOADI #2

; Transfer ACC to TIMER (R7 / 0x7)
MOV R7, R0

; Read TIMER (0x7 / R7): Hardware stalls execution until timer reaches 0
MOV R0, R7

; Loop continuously to start next clock cycle
JMP 0

