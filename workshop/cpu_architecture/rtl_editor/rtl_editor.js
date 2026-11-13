/**
 * PIVOT-IV CPU Architecture SystemVerilog & Verilog RTL Editor
 * Features: Comprehensive SystemVerilog syntax highlighting with distinct colors,
 *           module switching, indentation, line numbers, and block verification.
 * All internal variables, functions, and data structures follow Sanskrit terms in Devanagari script.
 */

// मॉड्यूलाः (Synthesizable SystemVerilog / Verilog modules)
const प्रतिरूपाः = {
  'top_cpu': {
    संचिकानाम: 'pivot_iv_cpu.sv',
    शीर्षकम्: 'Top CPU Core (SystemVerilog)',
    संहिता: `// ============================================================================
// PIVOT-IV 4-Bit CPU Processor Core (Load/Store Split-Stream Architecture)
// File: pivot_iv_cpu.sv
// Architecture: 8-Bit Datapath, 4-Bit Opcode, 7-Bit Program Counter
// Standard: IEEE 1800-2017 SystemVerilog
// ============================================================================

\`timescale 1ns / 1ps

module pivot_iv_cpu (
    input  logic        clk,
    input  logic        rst_n,
    
    // Physical GPIO Pins (4-Bit)
    inout  wire [3:0]   gpio_pins,
    
    // Status Flags (ALU & System)
    output logic [7:0]  system_flags,
    output logic [6:0]  pc_op_out,
    output logic [7:0]  acc_out,
    output logic [7:0]  b_out,
    output logic        halted_out
);

    // ------------------------------------------------------------------------
    // Program Counters (Split-Stream Pipeline)
    // ------------------------------------------------------------------------
    logic [6:0] pc_op;
    logic [4:0] pc_op1;
    logic [2:0] pc_op2;
    logic       halted;

    assign pc_op_out  = pc_op;
    assign halted_out = halted;

    // ------------------------------------------------------------------------
    // Instruction Memory Streams (ROMS / RAMS)
    // ------------------------------------------------------------------------
    logic [3:0] opcode;
    logic [3:0] op1_nibble;
    logic [3:0] op2_nibble;

    // Instantiate Instruction ROMs
    instr_op_rom  u_op_rom  (.addr(pc_op),  .data(opcode));
    instr_op1_rom u_op1_rom (.addr(pc_op1), .data(op1_nibble));
    instr_op2_rom u_op2_rom (.addr(pc_op2), .data(op2_nibble));

    // Jump Table (16 x 16-bit entries: {2'b0, pc_op, pc_op1, pc_op2})
    logic [15:0] jump_table [0:15];

    // ------------------------------------------------------------------------
    // Register File & Memory Mapped IO (16 x 8-bit)
    // ------------------------------------------------------------------------
    logic [7:0] reg_acc;      // 0x0
    logic [7:0] reg_b;        // 0x1
    logic [7:0] reg_r2;       // 0x2
    logic [7:0] reg_r3;       // 0x3
    logic [7:0] reg_shared_1; // 0xA
    logic [7:0] reg_shared_2; // 0xB
    logic [7:0] reg_shared_3; // 0xC
    logic [7:0] reg_r6;       // 0xD
    logic [7:0] reg_r7;       // 0xE
    logic [3:0] reg_pin_dir;  // 0xF (1=Output, 0=Input)
    logic [3:0] reg_pin_out;

    assign acc_out = reg_acc;
    assign b_out   = reg_b;

    // GPIO Tristate Buffer
    genvar i;
    generate
        for (i = 0; i < 4; i++) begin : gen_gpio
            assign gpio_pins[i] = reg_pin_dir[i] ? reg_pin_out[i] : 1'bz;
        end
    endgenerate

    logic [3:0] pin_state_in;
    assign pin_state_in = gpio_pins;

    // ------------------------------------------------------------------------
    // ALU Sub-Module Instantiation
    // ------------------------------------------------------------------------
    logic [7:0] alu_result;
    logic       alu_zero;
    logic       alu_carry;
    logic [3:0] alu_cmd;

    alu_core u_alu (
        .acc(reg_acc),
        .b(reg_b),
        .alu_cmd(alu_cmd),
        .result(alu_result),
        .flag_zero(alu_zero),
        .flag_carry(alu_carry)
    );

    assign system_flags = {6'b0, alu_carry, alu_zero};

    // ------------------------------------------------------------------------
    // Instruction Decode & Execution (SystemVerilog always_ff)
    // ------------------------------------------------------------------------
    always_ff @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            pc_op        <= 7'd0;
            pc_op1       <= 5'd0;
            pc_op2       <= 3'd0;
            halted       <= 1'b0;
            reg_acc      <= 8'd0;
            reg_b        <= 8'd0;
            reg_r2       <= 8'd0;
            reg_r3       <= 8'd0;
            reg_shared_1 <= 8'd0;
            reg_shared_2 <= 8'd0;
            reg_shared_3 <= 8'd0;
            reg_r6       <= 8'd0;
            reg_r7       <= 8'd0;
            reg_pin_dir  <= 4'd0;
            reg_pin_out  <= 4'd0;
            alu_cmd      <= 4'd6; // NOP
        end else if (!halted) begin
            unique case (opcode)
                // 1-Nibble Instructions (Opcode 0-6)
                4'h0: begin // ADD
                    alu_cmd <= 4'h0;
                    reg_acc <= alu_result;
                    pc_op   <= pc_op + 1'b1;
                end
                4'h1: begin // SUB
                    alu_cmd <= 4'h1;
                    reg_acc <= alu_result;
                    pc_op   <= pc_op + 1'b1;
                end
                4'h2: begin // AND
                    alu_cmd <= 4'h2;
                    reg_acc <= alu_result;
                    pc_op   <= pc_op + 1'b1;
                end
                4'h3: begin // XOR
                    alu_cmd <= 4'h3;
                    reg_acc <= alu_result;
                    pc_op   <= pc_op + 1'b1;
                end
                4'h4: begin // SHR
                    alu_cmd <= 4'h4;
                    reg_acc <= alu_result;
                    pc_op   <= pc_op + 1'b1;
                end
                4'h5: begin // SHL
                    alu_cmd <= 4'h5;
                    reg_acc <= alu_result;
                    pc_op   <= pc_op + 1'b1;
                end
                4'h6: begin // NOP
                    alu_cmd <= 4'h6;
                    pc_op   <= pc_op + 1'b1;
                end

                // 3-Nibble Instruction (LOADIB #imm8)
                4'h7: begin
                    reg_b   <= {op1_nibble, op2_nibble};
                    pc_op   <= pc_op + 1'b1;
                    pc_op1  <= pc_op1 + 1'b1;
                    pc_op2  <= pc_op2 + 1'b1;
                end

                // 2-Nibble Instructions (SET0, SET1)
                4'h8: begin // SET0 pin
                    reg_pin_dir[op1_nibble[1:0]] <= 1'b1;
                    reg_pin_out[op1_nibble[1:0]] <= 1'b0;
                    pc_op  <= pc_op + 1'b1;
                    pc_op1 <= pc_op1 + 1'b1;
                end
                4'h9: begin // SET1 pin
                    reg_pin_dir[op1_nibble[1:0]] <= 1'b1;
                    reg_pin_out[op1_nibble[1:0]] <= 1'b1;
                    pc_op  <= pc_op + 1'b1;
                    pc_op1 <= pc_op1 + 1'b1;
                end

                // 3-Nibble Instruction (LOADI #imm8)
                4'hA: begin
                    reg_acc <= {op1_nibble, op2_nibble};
                    pc_op   <= pc_op + 1'b1;
                    pc_op1  <= pc_op1 + 1'b1;
                    pc_op2  <= pc_op2 + 1'b1;
                end

                // 2-Nibble Instructions (LOAD, STORE, JMP)
                4'hB: begin // LOAD addr
                    priority case (op1_nibble)
                        4'h0: reg_acc <= reg_acc;
                        4'h1: reg_acc <= reg_b;
                        4'h2: reg_acc <= reg_r2;
                        4'h3: reg_acc <= reg_r3;
                        4'h6: reg_acc <= {4'b0, pin_state_in};
                        4'hA: reg_acc <= reg_shared_1;
                        4'hB: reg_acc <= reg_shared_2;
                        4'hC: reg_acc <= reg_shared_3;
                        4'hD: reg_acc <= reg_r6;
                        4'hE: reg_acc <= reg_r7;
                        4'hF: reg_acc <= {pin_state_in, reg_pin_dir};
                        default: reg_acc <= 8'd0;
                    endcase
                    pc_op  <= pc_op + 1'b1;
                    pc_op1 <= pc_op1 + 1'b1;
                end

                4'hC: begin // STORE addr
                    case (op1_nibble)
                        4'h0: reg_acc <= reg_acc;
                        4'h1: reg_b   <= reg_acc;
                        4'h2: reg_r2  <= reg_acc;
                        4'h3: reg_r3  <= reg_acc;
                        4'hA: reg_shared_1 <= reg_acc;
                        4'hB: reg_shared_2 <= reg_acc;
                        4'hC: reg_shared_3 <= reg_acc;
                        4'hD: reg_r6  <= reg_acc;
                        4'hE: reg_r7  <= reg_acc;
                        4'hF: reg_pin_dir  <= reg_acc[3:0];
                        default: ;
                    endcase
                    pc_op  <= pc_op + 1'b1;
                    pc_op1 <= pc_op1 + 1'b1;
                end

                4'hD: begin // JMP id
                    pc_op  <= jump_table[op1_nibble][13:7];
                    pc_op1 <= jump_table[op1_nibble][6:3];
                    pc_op2 <= jump_table[op1_nibble][2:0];
                end

                4'hE: begin // JMPNZ id
                    if (!alu_zero) begin
                        pc_op  <= jump_table[op1_nibble][13:7];
                        pc_op1 <= jump_table[op1_nibble][6:3];
                        pc_op2 <= jump_table[op1_nibble][2:0];
                    end else begin
                        pc_op  <= pc_op + 1'b1;
                        pc_op1 <= pc_op1 + 1'b1;
                    end
                end

                4'hF: begin // JMPC id
                    if (alu_carry) begin
                        pc_op  <= jump_table[op1_nibble][13:7];
                        pc_op1 <= jump_table[op1_nibble][6:3];
                        pc_op2 <= jump_table[op1_nibble][2:0];
                    end else begin
                        pc_op  <= pc_op + 1'b1;
                        pc_op1 <= pc_op1 + 1'b1;
                    end
                end
            endcase
        end
    end

endmodule
`
  },

  'alu_module': {
    संचिकानाम: 'alu_core.sv',
    शीर्षकम्: 'ALU Datapath Module (SystemVerilog)',
    संहिता: `// ============================================================================
// PIVOT-IV ALU Core Module (SystemVerilog)
// File: alu_core.sv
// Features: 8-Bit Arithmetic, Logic, Shift Operations & Flag Generation
// Standard: IEEE 1800-2017 SystemVerilog
// ============================================================================

\`timescale 1ns / 1ps

module alu_core (
    input  logic [7:0]  acc,
    input  logic [7:0]  b,
    input  logic [3:0]  alu_cmd,
    output logic [7:0]  result,
    output logic        flag_zero,
    output logic        flag_carry
);

    logic [8:0] temp_calc;

    // Combinational Logic Block using always_comb
    always_comb begin
        flag_carry = 1'b0;
        unique case (alu_cmd)
            4'h0: begin // ADD
                temp_calc  = {1'b0, acc} + {1'b0, b};
                result     = temp_calc[7:0];
                flag_carry = temp_calc[8];
            end
            4'h1: begin // SUB
                temp_calc  = {1'b0, acc} - {1'b0, b};
                result     = temp_calc[7:0];
                flag_carry = temp_calc[8]; // Borrow flag
            end
            4'h2: begin // AND
                result     = acc & b;
                flag_carry = 1'b0;
            end
            4'h3: begin // XOR
                result     = acc ^ b;
                flag_carry = 1'b0;
            end
            4'h4: begin // SHR (Shift Right 1-bit)
                result     = {1'b0, acc[7:1]};
                flag_carry = acc[0]; // Shifted out LSB
            end
            4'h5: begin // SHL (Shift Left 1-bit)
                result     = {acc[6:0], 1'b0};
                flag_carry = acc[7]; // Shifted out MSB
            end
            default: begin // NOP / Transparent Pass
                result     = acc;
                flag_carry = 1'b0;
            end
        endcase
    end

    // Zero Flag is active whenever ALU output is 0x00
    assign flag_zero = (result == 8'h00);

endmodule
`
  },

  'decoder_module': {
    संचिकानाम: 'instr_decoder.sv',
    शीर्षकम्: 'Instruction Decoder (SystemVerilog)',
    संहिता: `// ============================================================================
// PIVOT-IV Instruction Decoder & Multi-Stream Controller
// File: instr_decoder.sv
// Determines instruction size: 1-Nibble, 2-Nibble, or 3-Nibble
// Standard: IEEE 1800-2017 SystemVerilog
// ============================================================================

\`timescale 1ns / 1ps

module instr_decoder (
    input  logic [3:0] opcode,
    output logic [1:0] nibble_len,      // 2'd1, 2'd2, 2'd3
    output logic       needs_op1,
    output logic       needs_op2,
    output logic       is_branch,
    output logic       is_alu_op
);

    // Combinational Decode using always_comb
    always_comb begin
        unique case (opcode)
            // 1-Nibble Instructions: ADD, SUB, AND, XOR, SHR, SHL, NOP
            4'h0, 4'h1, 4'h2, 4'h3, 4'h4, 4'h5, 4'h6: 
                nibble_len = 2'd1;

            // 2-Nibble Instructions: SET0, SET1, LOAD, STORE, JMP, JMPNZ, JMPC
            4'h8, 4'h9, 4'hB, 4'hC, 4'hD, 4'hE, 4'hF: 
                nibble_len = 2'd2;

            // 3-Nibble Instructions: LOADIB (0x7), LOADI (0xA)
            4'h7, 4'hA: 
                nibble_len = 2'd3;

            default: 
                nibble_len = 2'd1;
        endcase
    end

    assign needs_op1 = (nibble_len >= 2'd2);
    assign needs_op2 = (nibble_len == 2'd3);
    assign is_branch = (opcode >= 4'hD);
    assign is_alu_op = (opcode <= 4'h5);

endmodule
`
  },

  'memory_streams': {
    संचिकानाम: 'memory_streams.sv',
    शीर्षकम्: 'Split-Stream Instruction Memories (SystemVerilog)',
    संहिता: `// ============================================================================
// PIVOT-IV Split-Stream Instruction ROM Blocks
// File: memory_streams.sv
// 1. OP ROM (128x4)  -> 7-bit addressing
// 2. OP1 ROM (32x4)  -> 5-bit addressing
// 3. OP2 ROM (8x4)   -> 3-bit addressing
// Standard: IEEE 1800-2017 SystemVerilog
// ============================================================================

\`timescale 1ns / 1ps

module instr_op_rom (
    input  logic [6:0] addr,
    output logic [3:0] data
);
    logic [3:0] mem [0:127];
    assign data = mem[addr];
endmodule

module instr_op1_rom (
    input  logic [4:0] addr,
    output logic [3:0] data
);
    logic [3:0] mem [0:31];
    assign data = mem[addr];
endmodule

module instr_op2_rom (
    input  logic [2:0] addr,
    output logic [3:0] data
);
    logic [3:0] mem [0:7];
    assign data = mem[addr];
endmodule
`
  }
};

// सम्पादक स्थिति (Editor State)
let वर्तमान_मॉड्यूल = null;
const उद्घाटित_मॉड्यूलाः = [];

const टैब_पट्टिका = document.getElementById('टैब-पट्टिका');
const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
const वर्ण_प्रदीप्त_संहिता = document.getElementById('वर्ण-प्रदीप्त-संहिता');
const वर्ण_प्रदीप्त_फलक = document.getElementById('वर्ण-प्रदीप्त-फलक');
const पंक्ति_क्रमांक_फलक = document.getElementById('पंक्ति-क्रमांक-स्तम्भ');
const स्थिति_पंक्ति_फलक = document.getElementById('स्थिति-पंक्ति-संख्या');
const स्थिति_वर्ण_फलक = document.getElementById('स्थिति-वर्ण-संख्या');
const सत्यापन_फलक = document.getElementById('सत्यापन-फलक');
const संचिका_नाम_निवेश = document.getElementById('संचिका-नाम-निवेश');

// प्रारम्भिक भारणम् (Initial Load: Start clean with a new file, no pre-opened files)
window.addEventListener('DOMContentLoaded', () => {
  सम्पादक_श्रवण_स्थापना();
  नूतन_संचिका_निर्माणम्();
});

// टैब अंकनम् (Render Tab Bar with Close Buttons)
function टैब_अंकनम्() {
  टैब_पट्टिका.innerHTML = '';

  const चिह्न_मानचित्र = {
    'top_cpu': 'fa-microchip',
    'alu_module': 'fa-calculator',
    'decoder_module': 'fa-network-wired',
    'memory_streams': 'fa-memory'
  };

  उद्घाटित_मॉड्यूलाः.forEach(कुञ्जी => {
    const रूप = प्रतिरूपाः[कुञ्जी];
    if (!रूप) return;

    const कुञ्जीका = document.createElement('button');
    कुञ्जीका.className = `टैब-कुञ्जी ${कुञ्जी === वर्तमान_मॉड्यूल ? 'सक्रिय' : ''}`;
    कुञ्जीका.setAttribute('data-module', कुञ्जी);
    कुञ्जीका.title = रूप.शीर्षकम्;
    कुञ्जीका.onclick = () => मॉड्यूल_परिवर्तनम्(कुञ्जी);

    const चिह्न = चिह्न_मानचित्र[कुञ्जी] || 'fa-file-code';
    कुञ्जीका.innerHTML = `
      <i class="fas ${चिह्न}"></i>
      <span>${रूप.संचिकानाम}</span>
      <span class="टैब-पिधान-कुञ्जी" onclick="टैब_पिधानम्(event, '${कुञ्जी}')" title="Close tab">
        <i class="fas fa-times"></i>
      </span>
    `;

    टैब_पट्टिका.appendChild(कुञ्जीका);
  });


}

// टैब पिधानम् (Close Tab Handler)
function टैब_पिधानम्(घटना, मॉड्यूल_कुञ्जी) {
  घटना.stopPropagation(); // Prevent tab selection on close click

  // Save current text before closing
  if (प्रतिरूपाः[वर्तमान_मॉड्यूल]) {
    प्रतिरूपाः[वर्तमान_मॉड्यूल].संहिता = पाठ_क्षेत्र.value;
  }

  const सूचकाङ्क = उद्घाटित_मॉड्यूलाः.indexOf(मॉड्यूल_कुञ्जी);
  if (सूचकाङ्क !== -1) {
    उद्घाटित_मॉड्यूलाः.splice(सूचकाङ्क, 1);
  }

  // If the currently active tab was closed, switch to another tab or clear
  if (वर्तमान_मॉड्यूल === मॉड्यूल_कुञ्जी) {
    if (उद्घाटित_मॉड्यूलाः.length > 0) {
      // Pick adjacent tab
      const नूतन_कुञ्जी = उद्घाटित_मॉड्यूलाः[Math.max(0, सूचकाङ्क - 1)];
      मॉड्यूल_परिवर्तनम्(नूतन_कुञ्जी);
    } else {
      वर्तमान_मॉड्यूल = null;
      पाठ_क्षेत्र.value = '';
      संचिका_नाम_निवेश.value = 'untitled.sv';
      पंक्ति_क्रमांक_अद्यतनम्();
      वर्ण_प्रदीप्त_अद्यतनम्();
    }
  }

  टैब_अंकनम्();
}



// मॉड्यूल परिवर्तनम् (Switch Module Tab)
function मॉड्यूल_परिवर्तनम्(मॉड्यूल_कुञ्जी) {
  if (प्रतिरूपाः[वर्तमान_मॉड्यूल]) {
    प्रतिरूपाः[वर्तमान_मॉड्यूल].संहिता = पाठ_क्षेत्र.value;
  }

  वर्तमान_मॉड्यूल = मॉड्यूल_कुञ्जी;
  const रूप = प्रतिरूपाः[मॉड्यूल_कुञ्जी];

  if (रूप) {
    पाठ_क्षेत्र.value = रूप.संहिता;
    संचिका_नाम_निवेश.value = रूप.संचिकानाम;
  }

  टैब_अंकनम्();
  पंक्ति_क्रमांक_अद्यतनम्();
  वर्ण_प्रदीप्त_अद्यतनम्();
  सत्यापन_निगूहनम्();
}

// पंक्ति क्रमांक अद्यतनम् (Update Line Numbers)
function पंक्ति_क्रमांक_अद्यतनम्() {
  const पंक्तयः = पाठ_क्षेत्र.value.split('\n');
  const संख्या = पंक्तयः.length;
  
  let क्रमांक_पाठ = '';
  for (let i = 1; i <= संख्या; i++) {
    क्रमांक_पाठ += i + '\n';
  }
  पंक्ति_क्रमांक_फलक.textContent = क्रमांक_पाठ;
  स्थिति_पंक्ति_फलक.textContent = `Lines: ${संख्या}`;
  स्थिति_वर्ण_फलक.textContent = `Length: ${पाठ_क्षेत्र.value.length} chars`;
}

// HTML एस्केपिंग (Escape HTML Special Characters)
function एचटीएमएल_रक्षणम्(पाठ) {
  return पाठ
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// वर्ण प्रदीप्त अद्यतनम् (Comprehensive SystemVerilog Syntax Highlighting Engine)
function वर्ण_प्रदीप्त_अद्यतनम्() {
  const पाठ = पाठ_क्षेत्र.value;

  // Complete SystemVerilog & Verilog Tokenizer Regex
  const संयुक्त_नियम = new RegExp(
    [
      '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1: Comments (single & multi-line)
      '(`[a-zA-Z_0-9]+)',                       // 2: Compiler Directives (\`timescale, \`define, etc.)
      '(\\$[a-zA-Z_0-9]+)',                     // 3: System Tasks / Functions ($display, $finish, $time, etc.)
      '("[^"\\n]*")',                           // 4: Strings ("...")
      '\\b(module|endmodule|package|endpackage|interface|endinterface|program|endprogram|class|endclass|modport|import|export|typedef|struct|union|enum|extern|virtual)\\b', // 5: Major Block Keywords
      '\\b(logic|bit|byte|int|longint|shortint|integer|time|real|string|void|wire|reg|inout|input|output|genvar|parameter|localparam|ref|const)\\b', // 6: Data Types & Ports
      '\\b(always_ff|always_comb|always_latch|always|posedge|negedge|if|else|case|casex|casez|endcase|unique|priority|default|for|foreach|while|do|repeat|forever|return|break|continue|inside)\\b', // 7: Control Flow
      '\\b(begin|end|generate|endgenerate|function|endfunction|task|endtask|fork|join|join_any|join_none|assign|deassign|new|super|this)\\b', // 8: Blocks & Structures
      '\\b(assert|assume|cover|property|endproperty|sequence|endsequence|covergroup|endgroup|bins|clocking|endclocking|rand|randc|constraint)\\b', // 9: Verification & Assertions
      '(\\d+\'[bBoOdDhH][0-9a-fA-F_xzXZ]+|\\b\\d+(\\.\\d+)?(ns|ps|us|ms|s)?\\b)', // 10: Numbers, Base Literals & Time Units
      '(<=|===|!==|==|!=|>=|<=|&&|\\|\\||<<|>>|\\+\\+|--|\\+:|-:|\\|->|\\|=>|[+\\-*\\/&|^~=?:])' // 11: Operators & SystemVerilog Slicing
    ].join('|'),
    'g'
  );

  let प्रदीप्त_परिणाम = '';
  let अन्तिम_सूचकाङ्क = 0;
  let मिलान;

  while ((मिलान = संयुक्त_नियम.exec(पाठ)) !== null) {
    if (मिलान.index > अन्तिम_सूचकाङ्क) {
      प्रदीप्त_परिणाम += एचटीएमएल_रक्षणम्(पाठ.substring(अन्तिम_सूचकाङ्क, मिलान.index));
    }

    const पाठ_खण्ड = एचटीएमएल_रक्षणम्(मिलान[0]);

    if (मिलान[1]) {
      // Comments
      प्रदीप्त_परिणाम += `<span class="पद-पादटिप्पणी">${पाठ_खण्ड}</span>`;
    } else if (मिलान[2]) {
      // Directives
      प्रदीप्त_परिणाम += `<span class="पद-निर्देशिका">${पाठ_खण्ड}</span>`;
    } else if (मिलान[3]) {
      // System Tasks ($display, $finish, etc.)
      प्रदीप्त_परिणाम += `<span class="पद-प्रणाली">${पाठ_खण्ड}</span>`;
    } else if (मिलान[4]) {
      // Strings
      प्रदीप्त_परिणाम += `<span class="पद-शलाका">${पाठ_खण्ड}</span>`;
    } else if (मिलान[5]) {
      // Major Keywords (module, package, interface, class)
      प्रदीप्त_परिणाम += `<span class="पद-कीवर्ड">${पाठ_खण्ड}</span>`;
    } else if (मिलान[6]) {
      // Data Types (logic, bit, byte, int, reg, wire, etc.)
      प्रदीप्त_परिणाम += `<span class="पद-प्रकार">${पाठ_खण्ड}</span>`;
    } else if (मिलान[7]) {
      // Control Flow (always_ff, always_comb, if, case, unique, priority)
      प्रदीप्त_परिणाम += `<span class="पद-नियन्त्रण">${पाठ_खण्ड}</span>`;
    } else if (मिलान[8]) {
      // Structural (begin, end, function, task, assign, generate)
      प्रदीप्त_परिणाम += `<span class="पद-संरचना">${पाठ_खण्ड}</span>`;
    } else if (मिलान[9]) {
      // Verification & Assertions (assert, property, covergroup, sequence)
      प्रदीप्त_परिणाम += `<span class="पद-सत्यापन">${पाठ_खण्ड}</span>`;
    } else if (मिलान[10]) {
      // Numbers, Base Literals & Time Units
      प्रदीप्त_परिणाम += `<span class="पद-संख्या">${पाठ_खण्ड}</span>`;
    } else if (मिलान[11]) {
      // Operators
      प्रदीप्त_परिणाम += `<span class="पद-तार्किक">${पाठ_खण्ड}</span>`;
    } else {
      प्रदीप्त_परिणाम += पाठ_खण्ड;
    }

    अन्तिम_सूचकाङ्क = संयुक्त_नियम.lastIndex;
  }

  if (अन्तिम_सूचकाङ्क < पाठ.length) {
    प्रदीप्त_परिणाम += एचटीएमएल_रक्षणम्(पाठ.substring(अन्तिम_सूचकाङ्क));
  }

  if (पाठ.endsWith('\n')) {
    प्रदीप्त_परिणाम += '\n ';
  }

  वर्ण_प्रदीप्त_संहिता.innerHTML = प्रदीप्त_परिणाम;
}

// सम्पादक श्रवण स्थापना (Setup Textarea & Scroll Sync)
function सम्पादक_श्रवण_स्थापना() {
  पाठ_क्षेत्र.addEventListener('input', () => {
    पंक्ति_क्रमांक_अद्यतनम्();
    वर्ण_प्रदीप्त_अद्यतनम्();
    सत्यापन_निगूहनम्();
  });

  // Perfectly sync scroll between textarea, highlight pre, and line numbers
  पाठ_क्षेत्र.addEventListener('scroll', () => {
    वर्ण_प्रदीप्त_फलक.scrollTop = पाठ_क्षेत्र.scrollTop;
    वर्ण_प्रदीप्त_फलक.scrollLeft = पाठ_क्षेत्र.scrollLeft;
    पंक्ति_क्रमांक_फलक.scrollTop = पाठ_क्षेत्र.scrollTop;
  });

  // Handle Tab key indenting (2 spaces)
  पाठ_क्षेत्र.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const आरम्भ = पाठ_क्षेत्र.selectionStart;
      const अन्तः = पाठ_क्षेत्र.selectionEnd;
      पाठ_क्षेत्र.value = पाठ_क्षेत्र.value.substring(0, आरम्भ) + '  ' + पाठ_क्षेत्र.value.substring(अन्तः);
      पाठ_क्षेत्र.selectionStart = पाठ_क्षेत्र.selectionEnd = आरम्भ + 2;
      पंक्ति_क्रमांक_अद्यतनम्();
      वर्ण_प्रदीप्त_अद्यतनम्();
    }
  });
}

// नूतन संचिका निर्माणम् (New File)
let नूतन_संचिका_क्रमांकः = 1;

function नूतन_संचिका_निर्माणम्() {
  // Save current active tab content if any
  if (वर्तमान_मॉड्यूल && प्रतिरूपाः[वर्तमान_मॉड्यूल]) {
    प्रतिरूपाः[वर्तमान_मॉड्यूल].संहिता = पाठ_क्षेत्र.value;
  }

  const संचिकानाम = `module_${नूतन_संचिका_क्रमांकः}.sv`;
  const मोड्यूल_कुञ्जी = `custom_${नूतन_संचिका_क्रमांकः}`;
  नूतन_संचिका_क्रमांकः++;

  प्रतिरूपाः[मोड्यूल_कुञ्जी] = {
    संचिकानाम: संचिकानाम,
    शीर्षकम्: संचिकानाम,
    संहिता: `// SystemVerilog Module Template
\`timescale 1ns / 1ps

module ${संचिकानाम.replace('.sv', '')} (
    input  logic        clk,
    input  logic        rst_n,
    input  logic [7:0]  data_in,
    output logic [7:0]  data_out
);

    always_ff @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            data_out <= '0;
        end else begin
            data_out <= data_in;
        end
    end

endmodule
`
  };

  उद्घाटित_मॉड्यूलाः.push(मोड्यूल_कुञ्जी);
  वर्तमान_मॉड्यूल = मोड्यूल_कुञ्जी;

  पाठ_क्षेत्र.value = प्रतिरूपाः[मोड्यूल_कुञ्जी].संहिता;
  संचिका_नाम_निवेश.value = संचिकानाम;

  टैब_अंकनम्();
  पंक्ति_क्रमांक_अद्यतनम्();
  वर्ण_प्रदीप्त_अद्यतनम्();
  सत्यापन_निगूहनम्();
}

// संचिका उद्घाटनम् (Open file from disk)
function संचिका_उद्घाटनम्(घटना) {
  const संचिका = घटना.target.files[0];
  if (!संचिका) return;

  const पाठक = new FileReader();
  पाठक.onload = (e) => {
    const कुञ्जी = `opened_${Date.now()}`;
    प्रतिरूपाः[कुञ्जी] = {
      संचिकानाम: संचिका.name,
      शीर्षकम्: संचिका.name,
      संहिता: e.target.result
    };
    उद्घाटित_मॉड्यूलाः.push(कुञ्जी);
    मॉड्यूल_परिवर्तनम्(कुञ्जी);
  };
  पाठक.readAsText(संचिका);
  घटना.target.value = '';
}

// संचिका सञ्चयम् (Download / Save File)
function संचिका_सञ्चयम्() {
  const सामग्री = पाठ_क्षेत्र.value;
  const संचिका_नाम = संचिका_नाम_निवेश.value.trim() || 'module.sv';

  const बिन्दु = new Blob([सामग्री], { type: 'text/plain;charset=utf-8' });
  const कडी = document.createElement('a');
  कडी.href = URL.createObjectURL(बिन्दु);
  कडी.download = संचिका_नाम;
  document.body.appendChild(कडी);
  कडी.click();
  document.body.removeChild(कडी);
  URL.revokeObjectURL(कडी.href);
}

// संहिता स्वच्छता (Clear Text)
function पाठ_स्वच्छीकरणम्() {
  if (confirm('Are you sure you want to clear the editor?')) {
    पाठ_क्षेत्र.value = '';
    पंक्ति_क्रमांक_अद्यतनम्();
    वर्ण_प्रदीप्त_अद्यतनम्();
    सत्यापन_निगूहनम्();
  }
}

// वाक्यरचना सत्यापनम् (SystemVerilog / Verilog Syntax Checker)
function वाक्यरचना_सत्यापनम्() {
  const पाठ = पाठ_क्षेत्र.value;
  const पंक्तयः = पाठ.split('\n');

  let मॉड्यूल_गणक = 0;
  let अन्त्य_मॉड्यूल_गणक = 0;
  let आरम्भ_गणक = 0;
  let अन्त्य_गणक = 0;
  let पैकेज_गणक = 0;
  let अन्त्य_पैकेज_गणक = 0;
  let इंटरफेस_गणक = 0;
  let अन्त्य_इंटरफेस_गणक = 0;
  let दोष_सन्देश = null;

  for (let i = 0; i < पंक्तयः.length; i++) {
    const पंक्ति = पंक्तयः[i].trim();
    if (पंक्ति.startsWith('//') || पंक्ति.startsWith('/*') || पंक्ति.startsWith('*')) continue;

    if (/\bmodule\b/.test(पंक्ति) && !/\bendmodule\b/.test(पंक्ति)) मॉड्यूल_गणक++;
    if (/\bendmodule\b/.test(पंक्ति)) अन्त्य_मॉड्यूल_गणक++;
    if (/\bpackage\b/.test(पंक्ति) && !/\bendpackage\b/.test(पंक्ति)) पैकेज_गणक++;
    if (/\bendpackage\b/.test(पंक्ति)) अन्त्य_पैकेज_गणक++;
    if (/\binterface\b/.test(पंक्ति) && !/\bendinterface\b/.test(पंक्ति)) इंटरफेस_गणक++;
    if (/\bendinterface\b/.test(पंक्ति)) अन्त्य_इंटरफेस_गणक++;
    if (/\bbegin\b/.test(पंक्ति)) आरम्भ_गणक++;
    if (/\bend\b/.test(पंक्ति) && !/\bendmodule\b/.test(पंक्ति) && !/\bendpackage\b/.test(पंक्ति) && !/\bendinterface\b/.test(पंक्ति) && !/\bendcase\b/.test(पंक्ति)) अन्त्य_गणक++;
  }

  if (मॉड्यूल_गणक === 0 && पैकेज_गणक === 0 && इंटरफेस_गणक === 0) {
    दोष_सन्देश = 'Warning: No "module", "package", or "interface" declaration found in code.';
  } else if (मॉड्यूल_गणक !== अन्त्य_मॉड्यूल_गणक) {
    दोष_सन्देश = `Syntax Error: Mismatched module/endmodule count (${मॉड्यूल_गणक} module vs ${अन्त्य_मॉड्यूल_गणक} endmodule).`;
  } else if (पैकेज_गणक !== अन्त्य_पैकेज_गणक) {
    दोष_सन्देश = `Syntax Error: Mismatched package/endpackage count (${पैकेज_गणक} package vs ${अन्त्य_पैकेज_गणक} endpackage).`;
  } else if (इंटरफेस_गणक !== अन्त्य_इंटरफेस_गणक) {
    दोष_सन्देश = `Syntax Error: Mismatched interface/endinterface count (${इंटरफेस_गणक} interface vs ${अन्त्य_इंटरफेस_गणक} endinterface).`;
  } else if (आरम्भ_गणक !== अन्त्य_गणक) {
    दोष_सन्देश = `Syntax Warning: Mismatched begin/end block count (${आरम्भ_गणक} begin vs ${अन्त्य_गणक} end).`;
  }

  सत्यापन_फलक.style.display = 'block';
  if (दोष_सन्देश) {
    सत्यापन_फलक.className = 'सत्यापन-फलक सत्यापन-दोष';
    सत्यापन_फलक.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>${दोष_सन्देश}</span>`;
  } else {
    सत्यापन_फलक.className = 'सत्यापन-फलक सत्यापन-सफलता';
    सत्यापन_फलक.innerHTML = `<i class="fas fa-check-circle"></i> <span>SystemVerilog syntax check passed! Block structures and begin-end declarations are balanced.</span>`;
  }
}

function सत्यापन_निगूहनम्() {
  सत्यापन_फलक.style.display = 'none';
}
