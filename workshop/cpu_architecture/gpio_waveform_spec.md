# GPIO & Waveform Signal Toggle Specification

This document details the exact rules, conditions, and register interactions governing signal toggling across the GPIO interface and digital logic waveform analyzer in the **PIVOT VLSI 4-Bit CPU Simulator**.

---

## 1. Register Architecture Summary

The CPU provides dedicated memory-mapped registers for external GPIO communication matching the 4-bit data bus (`PIN 3` down to `PIN 0`):

| Register | Memory Address | Access | Description |
| :--- | :---: | :---: | :--- |
| **`PIN_IN`** | `0x6` | **Read** | Reads real-time voltage levels of the 4 physical pins into `ACC`. |
| **`PIN_OUT`** | `0x6` | **Write** | Writes 4-bit output data from `ACC` to drive physical pins. |
| **`PIN_EN`** | `0xF` | **Read/Write** | Output-Enable / Direction mask: `1 = Driven Output`, `0 = High-Z / Input`. |

---

## 2. Signal Toggle Rules & Conditions

Signal toggles are evaluated under **three control points**:

```
                       User Interaction
                              │
     ┌────────────────────────┼────────────────────────┐
     ▼                        ▼                        ▼
[ Waveform Canvas ]   [ Pin Bubbles ]        [ Register Cards ]
  (at Clock Tn)         (Live State)          (PIN_IN / OUT / EN)
     │                        │                        │
     ▼                        ▼                        ▼
Check Lock & OE[n]      Check Active OE         Check Register Mode
```

---

### Condition 1: Waveform Canvas (Clicking Signal at Clock $T_n$)

When a user clicks on the logic analyzer canvas to toggle a pin signal ($1 \leftrightarrow 0$) at clock cycle $T_n$, the following conditions apply:

1. **Waveform Lock State:**
   - The waveform analyzer must be **Unlocked** (`तरंगरूप_कीलित === false`, UI button shows `🔓 Unlocked`).
   - If locked (`🔒 Locked`), all waveform click events are blocked.
2. **Channel Selection:**
   - Click must fall inside one of the data signal lanes: `PIN 3`, `PIN 2`, `PIN 1`, or `PIN 0`.
   - The **`CLK [T]`** channel (row 0) is read-only and cannot be toggled.
3. **Valid Cycle Index ($T \ge \text{current} + 1$, i.e. $T > \text{current}$):**
   - **All 4 data pins are allowed to toggle on future clock cycles ($T \ge \text{current} + 1$) irrespective of `PIN_EN`**.
   - **Reasoning:** Direction (`PIN_EN`) can be dynamically updated via instructions (e.g. `STORE [0xF]` or register toggles) prior to or at that cycle.
   - **Execution Behavior:** 
     - When execution reaches that future cycle, if the pin is configured as an **Input** (`PIN_EN = 0`), the value configured on the waveform timeline at that clock period is sampled into `PIN_IN` (`0x6 [R]`).
     - If the pin is configured as an **Output** (`PIN_EN = 1`), the processor output drives the physical pin according to `PIN_OUT`.
4. **Past & Current Timeline Protection:**
   - Any clock cycle prior to or equal to the current execution cycle ($T \le \text{current}$) is **locked by default** to preserve simulated execution history.

### Condition 2: Physical Pin Bubbles (Bottom GPIO Bar)

When clicking individual pin bubbles (`Pin 3` down to `Pin 0`) in the bottom panel:

* **Allowed:**
  - $\text{PIN\_EN}[\text{pin}] == 0$: Pin is configured as an input. External voltage state toggles and is recorded into the waveform timeline.
  Only PIN_EN and PIN_OUT toggle is allowed. PIN_IN register toggle blocked.

---

### Condition 3: Register Cards (`PIN_IN`, `PIN_OUT`, `PIN_EN`)

Direct bit toggling via register cards in the right-hand panel operates as follows:

* **`PIN_EN` (Address `0xF` [OE]):**
  - **Always Allowed.** Clicking any bit toggles that pin between Output (`1`) and Input/High-Z (`0`).
* **`PIN_OUT` (Address `0x6` [W]):**
  - **Always Allowed.** Clicking updates the processor output buffer. If that bit's `PIN_EN == 1`, the voltage change immediately drives the physical pin and appears on the timeline.
* **`PIN_IN` (Address `0x6` [R]):**
  - **Blocked:** Direct manual bit toggling of `PIN_IN` is completely blocked because it is a read-only register reflecting the physical pin voltages.

---

## 3. Waveform Color Coding Reference

| Signal / Mode | Color | Hex Code | Behavior |
| :--- | :--- | :---: | :--- |
| **`CLK [T]`** | Amber | `#f59e0b` | Displays clock period transitions ($T_1, T_2, \dots$). |
| **`Driven Output` (`OE = 1`)** | Emerald Green | `#10b981` | Driven by processor output. User toggle blocked. |
| **`External Input` (`OE = 0`)** | Sky Blue | `#38bdf8` | High-Z input line. User toggle allowed. |
| **`Locked Timeline`** | Rose Red | `#ef4444` | Protects timeline from accidental changes. Timeline before/during current execution time ($T \le \text{current}$) is locked by default. |

