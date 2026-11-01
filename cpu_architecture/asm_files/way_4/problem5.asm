; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: GPIO PASS-THROUGH (GPIO_0 -> GPIO_1)
; ==============================================================================
; Problem: Read input of GPIO_0 and share directly as output of GPIO_1
; Target File: asm_files/way_4/problem5.asm
; Compliance: Strict isa_spec.md (16 Hardware Opcodes, 16 Nibble Memory Limit)
;
; Pin Configuration:
;   GPIO_0 (Pin 0): Input  (OE bit 0 = 0)
;   GPIO_1 (Pin 1): Output (OE bit 1 = 1)
;   Configuring PIN_EN (Address 0xF or 0x5) = 0b1110 (0xE) enables GPIO_0 input!
;
; Pin Mapping:
;   GPIO_0 (Pin 0): Input
;   GPIO_1 (Pin 1): Output (Driven by PIN_OUT or SET1/SET0 1)
;
; Hardware Operation:
;   1. [0x0]: Configure PIN_EN = 0xE (Bit 0 as Input, Bits 1..3 as Output)
;   2. [0x1]: STORE to PIN_DIR/PIN_EN (Address 0xF)
;   3. [0x2]: Load immediate mask 1 into B register to test Bit 0 (GPIO_0)
;   4. Loop Entry [0x3]:
;      - Read PIN_STATE / PIN_IN (Address 0x6) into ACC
;      - Mask Bit 0: ACC = ACC & B (isolate GPIO_0)
;      - Test Zero Flag with JMPNZ:
;        * If Bit 0 is 1 (ACC != 0): Jump via JUMP_TABLE[1] -> 0x8 (SET1 1)
;        * If Bit 0 is 0 (ACC == 0): Fall-through to [0x6] (SET0 1)
;      - [0x6]: Drive GPIO_1 LOW (SET0 1)
;      - [0x7]: Jump via JUMP_TABLE[0] -> 0x3 to repeat loop
;      - [0x8]: Drive GPIO_1 HIGH (SET1 1)
;      - [0x9]: Jump via JUMP_TABLE[0] -> 0x3 to repeat loop
;
; Jump Table Mapping:
;   JUMP_TABLE[0] = 0x3 (Loop entry: sample GPIO_0)
;   JUMP_TABLE[1] = 0x8 (Drive GPIO_1 HIGH target)
; ==============================================================================

; --- INITIALIZATION ---
; [0x0]: Set PIN_EN mask = 0b1110 (14 / 0xE) so Pin 0 is Input, Pin 1..3 Output
LOADI #14

; [0x1]: Configure PIN_DIR / PIN_EN (Address 0xF)
STORE 0xF

; [0x2]: Load immediate mask 1 into B register to isolate Bit 0
LOADIB #1

; --- LOOP START: SAMPLE GPIO_0 ---
; [0x3]: Read physical PIN_STATE into ACC
LOAD 0x6

; [0x4]: Isolate GPIO_0 (Bit 0): ACC = ACC & B
AND

; [0x5]: If GPIO_0 is HIGH (Zero Flag = 0), jump to SET1 1 via JUMP_TABLE[1] -> 0x8
JMPNZ 1

; --- GPIO_0 IS LOW: DRIVE GPIO_1 LOW ---
; [0x6]: Drive GPIO_1 LOW (0)
SET0 1

; [0x7]: Repeat loop via JUMP_TABLE[0] -> 0x3
JMP 0

; --- GPIO_0 IS HIGH: DRIVE GPIO_1 HIGH ---
; [0x8]: Drive GPIO_1 HIGH (1)
SET1 1

; [0x9]: Repeat loop via JUMP_TABLE[0] -> 0x3
JMP 0
