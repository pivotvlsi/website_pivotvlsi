; Program testing R4 (PIN_IN), R5 (PIN_EN), R6 (PIN_OUT), and R7 (TIMER)
LOADI #3
MOV R7, R0      ; Initialize TIMER (R7) to 3 cycles
LOADI #0
MOV R0, R7      ; Read TIMER (R7) -> starts countdown stall of 3 cycles
LOADI #15
MOV R6, R0      ; Write R6 (PIN_OUT) = 15
MOV R0, R4      ; Read R4 (PIN_IN) into ACC
HALT

