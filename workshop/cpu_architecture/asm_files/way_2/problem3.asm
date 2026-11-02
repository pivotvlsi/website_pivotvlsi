; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: UNROLLED FIBONACCI SEQUENCE (NO LOOPS)
; ==============================================================================
; Problem: Compute Fibonacci sequence without loops: 0, 1, 1, 2, 3, 5, 8
; Target: asm_files/way_2/problem3.asm
; Compliance: Strict isa_spec.md (Purely 16 Hardware Instructions, Linear Execution)
;
; Fibonacci Memory Destination Mapping (Pure Scratch / Shared Memory):
;   - F(0) = 0   (Initial ACC)
;   - F(1) = 1   (Initial B)
;   - F(2) = 1   -> Stored into Memory 0x2 (R2 Scratchpad)
;   - F(3) = 2   -> Stored into Memory 0x3 (R3 Scratchpad)
;   - F(4) = 3   -> Stored into Memory 0x9 (SHARED_0 / Scratch)
;   - F(5) = 5   -> Stored into Memory 0xA (SHARED_1 / Scratch)
;   - F(6) = 8   -> Stored into Memory 0xB (SHARED_2 / Scratch)
;
; Instruction Layout (Fits exactly in 16 nibbles / instruction memory 0x0 to 0xF):
; ==============================================================================

; --- SEED TERMS F(0) & F(1) ---
; [0x0]: ACC = F(0) = 0
LOADI #0

; [0x1]: B = F(1) = 1
LOADIB #1

; --- TERM F(2) = 0 + 1 = 1 ---
; [0x2]: ACC = F(0) + F(1) = 0 + 1 = 1
ADD

; [0x3]: Store F(2) into Memory[0x2] (R2)
STORE 0x2

; --- TERM F(3) = 1 + 1 = 2 ---
; [0x4]: ACC = F(2) + B(F1) = 1 + 1 = 2
ADD

; [0x5]: Store F(3) into Memory[0x3] (R3)
STORE 0x3

; --- TERM F(4) = 1 + 2 = 3 ---
; [0x6]: Load F(2) from Memory[0x2] into ACC: ACC = 1
LOAD 0x2

; [0x7]: Set B = F(3) = 2
LOADIB #2

; [0x8]: ACC = F(2) + F(3) = 1 + 2 = 3
ADD

; [0x9]: Store F(4) into Memory[0x9] (SHARED_0)
STORE 0x9

; --- TERM F(5) = 3 + 2 = 5 ---
; [0xA]: ACC = F(4) + B(F3) = 3 + 2 = 5
ADD

; [0xB]: Store F(5) into Memory[0xA] (SHARED_1)
STORE 0xA

; --- TERM F(6) = 5 + 3 = 8 ---
; [0xC]: Set B = F(4) = 3
LOADIB #3

; [0xD]: ACC = F(5) + B(F4) = 5 + 3 = 8
ADD

; [0xE]: Store F(6) into Memory[0xB] (SHARED_2)
STORE 0xB

; --- TERMINATION ---
; [0xF]: Execution complete (Linear pipeline finished without any jumps)
HALT
