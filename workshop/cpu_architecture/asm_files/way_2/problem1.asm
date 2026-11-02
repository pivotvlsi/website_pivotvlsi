; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: REGISTER INITIALIZATION (ISA SPEC LOAD/STORE)
; ==============================================================================
; Task: Store 1 in R1, 2 in R2, and 4 in R4
; Compliance: Strict isa_spec.md (No MOV instruction; purely LOADI, LOADIB, STORE)
; Registers:
;   - R1 (B)  = 1
;   - R2      = 2
;   - R4      = 4
; ==============================================================================

; [0x0]: Load 1 directly into Register B (R1)
LOADIB #1

; [0x1]: Load 2 into Accumulator (ACC)
LOADI #2

; [0x2]: Store ACC into Register R2 (address 0x2)
STORE 0x2

; [0x3]: Load 4 into Accumulator (ACC)
LOADI #4

; [0x4]: Store ACC into Register R4 (address 0x4)
STORE 0x4

; [0x5]: Stop execution
HALT
