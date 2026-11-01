; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: CLOCK-TRIGGERED DATA LATCH (GPIO_0 CLK, GPIO_1 DATA -> GPIO_2)
; ==============================================================================
; Problem:
;   Sample GPIO_0 as clock and GPIO_1 as data.
;   Whenever the clock (GPIO_0) rises from LOW to HIGH (rising edge),
;   sample data input pin (GPIO_1) and show it in the output of GPIO_2.
;
; Target File: asm_files/way_4/problem6.asm
; Compliance: Strict isa_spec.md (16 Hardware Opcodes, Exactly 16 Instructions)
;
; Pin Role Mapping:
;   GPIO_0 (Pin 0): Input Clock (Rising edge detector: wait LOW -> wait HIGH)
;   GPIO_1 (Pin 1): Input Data  (Sampled on GPIO_0 rising edge)
;   GPIO_2 (Pin 2): Output Latched Data (Driven by SET0 2 / SET1 2)
;
; Hardware Direction Configuration:
;   OE mask = 0b1100 (12 / 0xC): Pin 0 and Pin 1 are Inputs (OE=0), Pin 2 and 3 are Outputs (OE=1).
;
; Instruction Layout (Occupies exactly 16 instructions, 0x0 to 0xF):
;   [0x0]: LOADI #12  - Output enable mask (0b1100)
;   [0x1]: STORE 0xF  - Configure PIN_EN / PIN_DIR
;   [0x2]: LOADIB #1  - Load mask 1 into B
;
;   --- PHASE 1: WAIT FOR CLOCK (GPIO_0) TO BE LOW ---
;   [0x3]: LOAD 0x6   - Read PIN_STATE into ACC
;   [0x4]: AND        - ACC = ACC & B (Test GPIO_0)
;   [0x5]: JMPNZ 0    - If GPIO_0 is still 1, branch to [0x3] via JUMP_TABLE[0] -> 0x3
;
;   --- PHASE 2: WAIT FOR CLOCK (GPIO_0) RISING EDGE (LOW -> HIGH) ---
;   [0x6]: LOAD 0x6   - Read PIN_STATE into ACC
;   [0x7]: SHR        - ACC >> 1: Pin 0 shifts to Carry, Pin 1 shifts to Bit 0!
;   [0x8]: JMPC 1     - If Carry == 1 (Rising edge detected), branch to [0xA] via JUMP_TABLE[1] -> 0xA
;   [0x9]: JMP 0      - Else clock is still LOW, repeat sampling via JUMP_TABLE[0] -> 0x3
;
;   --- PHASE 3: SAMPLE GPIO_1 (NOW IN BIT 0 OF ACC) AND DRIVE GPIO_2 ---
;   [0xA]: AND        - ACC = ACC & B (isolate GPIO_1 data bit)
;   [0xB]: JMPNZ 2    - If GPIO_1 == 1, branch to SET1 2 via JUMP_TABLE[2] -> 0xE
;   [0xC]: SET0 2     - GPIO_1 == 0: Drive GPIO_2 LOW
;   [0xD]: JMP 0      - Return to wait for next clock cycle via JUMP_TABLE[0] -> 0x3
;   [0xE]: SET1 2     - GPIO_1 == 1: Drive GPIO_2 HIGH
;   [0xF]: JMP 0      - Return to wait for next clock cycle via JUMP_TABLE[0] -> 0x3
;
; Jump Table Mapping:
;   JUMP_TABLE[0] = 0x3 (Wait for clock LOW entry)
;   JUMP_TABLE[1] = 0xA (Clock rising edge detected -> evaluate GPIO_1)
;   JUMP_TABLE[2] = 0xE (GPIO_1 is HIGH -> drive GPIO_2 HIGH)
; ==============================================================================

; --- INITIALIZATION (HARDWARE PIN_EN & BITMASK CONFIGURATION) ---
; [0x0]: Configure PIN_EN mask = 0b1100 (12) so Pin 0 (CLK) & Pin 1 (DATA) are inputs
LOADI #12

; [0x1]: Write mask into PIN_DIR / PIN_EN (Address 0xF)
STORE 0xF

; [0x2]: Load bitmask 1 into B register
LOADIB #1

; --- PHASE 1: WAIT FOR CLOCK (GPIO_0) TO BE LOW ---
; [0x3]: Read physical PIN_STATE into ACC
LOAD 0x6

; [0x4]: Test Bit 0 (GPIO_0): ACC = ACC & B
AND

; [0x5]: If Clock is still HIGH (ACC != 0), keep polling via JUMP_TABLE[0] -> 0x3
JMPNZ 0

; --- PHASE 2: WAIT FOR CLOCK RISING EDGE (LOW -> HIGH) ---
; [0x6]: Read physical PIN_STATE into ACC
LOAD 0x6

; [0x7]: Shift right: Bit 0 (CLK) shifts into Carry, Bit 1 (DATA) shifts to Bit 0
SHR

; [0x8]: If Carry == 1 (Clock transitioned to HIGH), jump to data latch via JUMP_TABLE[1] -> 0xA
JMPC 1

; [0x9]: If Carry == 0 (Clock still LOW), loop back to poll clock via JUMP_TABLE[0] -> 0x3
JMP 0

; --- PHASE 3: SAMPLE GPIO_1 DATA (AT BIT 0 OF ACC) AND LATCH TO GPIO_2 ---
; [0xA]: Isolate DATA bit (GPIO_1): ACC = ACC & B
AND

; [0xB]: If DATA bit == 1 (Zero Flag == 0), jump to SET1 2 via JUMP_TABLE[2] -> 0xE
JMPNZ 2

; --- DATA IS 0: DRIVE GPIO_2 LOW ---
; [0xC]: Latch LOW (0) to GPIO_2
SET0 2

; [0xD]: Loop back to wait for next clock cycle via JUMP_TABLE[0] -> 0x3
JMP 0

; --- DATA IS 1: DRIVE GPIO_2 HIGH ---
; [0xE]: Latch HIGH (1) to GPIO_2
SET1 2

; [0xF]: Loop back to wait for next clock cycle via JUMP_TABLE[0] -> 0x3
JMP 0
