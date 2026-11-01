# `.tr` (Timing Diagram Waveform Trace) File Specification

**Version:** 1.0  
**Extension:** `.tr` (MIME type: `application/json` / `text/plain`)  
**Encoding:** UTF-8  
**Applicability:** PIVOT VLSI Digital Timing Diagram Tool, CPU Architecture Simulator, and Hardware Logic Analyzers.

---

## 1. Overview & Purpose

The `.tr` format is a lightweight, human-readable JSON-based digital timing trace file format developed for **PIVOT VLSI**. It defines signal transitions, multi-bit buses, radix representations, timescale units, and piece-wise constant waveform segments.

It enables seamless interoperability between:
1. **Hardware Emulators & CPU Simulators** (e.g. 4-bit CPU processor, protocol emulators, SPI/I2C/UART engines).
2. **Interactive Timing Diagram Tools** (SVG/Canvas based waveform viewers and editors).
3. **Automated Verification Harnesses** (Perl / Python test suites checking waveform transitions).

---

## 2. File Structure

A `.tr` file contains a top-level JSON object with metadata, timescale settings, and an array of signal definitions (`सङ्केताः` / `signals`).

### Top-Level Schema

```json
{
  "version": "1.0",
  "source": "cpu_architecture",
  "waveform_length": 10,
  "timescale_value": 1,
  "timescale_unit": "ns",
  "signals": [
    ...
  ],
  "timestamp": 1730433000000
}
```

### Top-Level Fields

| Field Name (English) | Field Name (Devanagari Alias) | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `version` | `संस्करणम्` | `string` | No | `"1.0"` | Specification version. |
| `source` | `स्रोत` | `string` | No | `"custom"` | Originating tool or environment (`"cpu_architecture"`, `"logic_analyzer"`). |
| `waveform_length` | `तरंगदैर्घ्यम्` | `integer` | **Yes** | `10` | Total duration / clock cycles of the timeline. Minimum value is `1`. |
| `timescale_value` | `समयमापकः` | `integer` | No | `1` | Grid step duration multiplier (`1`, `10`, `100`, `1000`). |
| `timescale_unit` | `समयैकम्` | `string` | No | `"ns"` | Time unit: `"s"`, `"ms"`, `"us"`, `"ns"`, `"ps"`, `"fs"`. |
| `signals` | `सङ्केताः` / `संकेताः` | `array` | **Yes** | `[]` | Array of signal objects defining the waveform lanes. |
| `timestamp` | `कालचिह्नम्` | `integer` | No | Current Epoch | Epoch timestamp in milliseconds when the trace was generated. |

---

## 3. Signal Object Schema

Each entry in the `signals` array represents an individual waveform channel (e.g. 1-bit clock, 1-bit GPIO pin, or multi-bit bus).

```json
{
  "id": "sig_clk",
  "name": "CLK",
  "width": 1,
  "radix": "binary",
  "pieces": [
    { "start": 0, "end": 0.5, "value": "1" },
    { "start": 0.5, "end": 1, "value": "0" }
  ]
}
```

### Signal Fields

| Field Name | Type | Required | Values / Options | Description |
| :--- | :---: | :---: | :--- | :--- |
| `id` | `string` | No | e.g. `"sig_0"`, `"sig_clk"` | Unique identifier within the trace. |
| `name` | `string` | **Yes** | e.g. `"CLK"`, `"GPIO[3:0]"` | Display label shown in the signal header column. |
| `width` | `integer` | **Yes** | $\ge 1$ (`1` for single-bit, $>1$ for bus) | Bit width of the signal. |
| `radix` | `string` | No | `"binary"`, `"hex"`, `"decimal"`, `"octal"` | Base used to format multi-bit bus values. |
| `pieces` | `array` | **Yes** | Array of Piece Objects | Contiguous or piece-wise constant segments along the timeline. |

---

## 4. Piece (Waveform Segment) Object Schema

Waveforms are represented as piecewise-constant segments.

```json
{
  "start": 0,
  "end": 2,
  "value": "1"
}
```

### Piece Fields

| Field Name | Type | Description |
| :--- | :---: | :--- |
| `start` | `number` | Start time index on the timeline ($\ge 0$). Can be a fraction (e.g. `0.5` for clock edge). |
| `end` | `number` | End time index on the timeline ($> \text{start}$). |
| `value` | `string` | Value state maintained from `start` up to `end`. |

### Value Semantics

* **For 1-Bit Signals (`width: 1`):**
  * `"1"` / `"HIGH"`: Digital High voltage level.
  * `"0"` / `"LOW"`: Digital Low voltage level.
  * `"Z"` / `"z"`: High-Impedance / Tri-state / Float.
  * `"X"` / `"x"`: Unknown / Don't care state.
* **For Multi-Bit Buses (`width > 1`):**
  * Hexadecimal strings (e.g. `"0x0"`, `"0xF"`, `"0x3A"`).
  * Binary strings (e.g. `"0000"`, `"1010"`).
  * Decimal strings (e.g. `"15"`, `"255"`).
  * `"X"` / `"x"`: Bus in unknown/uninitialized state.
  * `"Z"` / `"z"`: High-Impedance bus.

---

## 5. Comprehensive Example

```json
{
  "version": "1.0",
  "source": "cpu_architecture",
  "waveform_length": 4,
  "timescale_value": 1,
  "timescale_unit": "ns",
  "signals": [
    {
      "id": "sig_clk",
      "name": "CLK",
      "width": 1,
      "radix": "binary",
      "pieces": [
        { "start": 0, "end": 0.5, "value": "1" },
        { "start": 0.5, "end": 1, "value": "0" },
        { "start": 1, "end": 1.5, "value": "1" },
        { "start": 1.5, "end": 2, "value": "0" },
        { "start": 2, "end": 2.5, "value": "1" },
        { "start": 2.5, "end": 3, "value": "0" },
        { "start": 3, "end": 3.5, "value": "1" },
        { "start": 3.5, "end": 4, "value": "0" }
      ]
    },
    {
      "id": "sig_gpio_bus",
      "name": "GPIO[3:0]",
      "width": 4,
      "radix": "hex",
      "pieces": [
        { "start": 0, "end": 1, "value": "0x0" },
        { "start": 1, "end": 3, "value": "0x5" },
        { "start": 3, "end": 4, "value": "0x9" }
      ]
    },
    {
      "id": "sig_pin_0",
      "name": "PIN_0",
      "width": 1,
      "radix": "binary",
      "pieces": [
        { "start": 0, "end": 1, "value": "0" },
        { "start": 1, "end": 4, "value": "1" }
      ]
    }
  ],
  "timestamp": 1730433000000
}
```

---

## 6. Rendering & Display Rules

1. **Ordering:** Signals are rendered from top to bottom matching the array sequence in `signals`.
2. **Step Transitions:** Between consecutive pieces of different values, a vertical transition line is rendered at `piece[i].end`.
3. **Bus Polygons:** For multi-bit buses (`width > 1`), pieces are styled as diamond/hexagonal polygons enclosing the value label text.
4. **Zoom & Scaling:** The viewer calculates `pixels_per_unit = (container_width - margin) / waveform_length` to automatically fit the trace upon loading.

