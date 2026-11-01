/*
 * पीवॉट वीएलएसआई असेंबली सम्पादक लिपि (Assembly Editor Script)
 * All variable names, function names, class names, and div IDs adhere strictly to Sanskrit terms in Devanagari script.
 */

// सम्पादक स्थिति (Editor State)
let वर्तमान_संचिका_नाम = "program.asm";
let सम्पादित_स्थिति = false;

// आरम्भिक विन्यास (Initialization)
window.addEventListener('DOMContentLoaded', () => {
  पंक्ति_क्रमांक_अद्यतनम्();
  गणना_अद्यतनम्();

  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  if (पाठ_क्षेत्र) {
    पाठ_क्षेत्र.addEventListener('input', () => {
      सम्पादित_स्थिति = true;
      पंक्ति_क्रमांक_अद्यतनम्();
      गणना_अद्यतनम्();
    });

    पाठ_क्षेत्र.addEventListener('scroll', () => {
      const पंक्ति_स्तम्भ = document.getElementById('पंक्ति-क्रमांक-स्तम्भ');
      if (पंक्ति_स्तम्भ) {
        पंक्ति_स्तम्भ.scrollTop = पाठ_क्षेत्र.scrollTop;
      }
    });

    // Tab key support in textarea
    पाठ_क्षेत्र.addEventListener('keydown', (घटना) => {
      if (घटना.key === 'Tab') {
        घटना.preventDefault();
        const प्रारम्भ = पाठ_क्षेत्र.selectionStart;
        const अन्त्य = पाठ_क्षेत्र.selectionEnd;
        पाठ_क्षेत्र.value = पाठ_क्षेत्र.value.substring(0, प्रारम्भ) + "    " + पाठ_क्षेत्र.value.substring(अन्त्य);
        पाठ_क्षेत्र.selectionStart = पाठ_क्षेत्र.selectionEnd = प्रारम्भ + 4;
        पंक्ति_क्रमांक_अद्यतनम्();
      }
    });
  }

  // Window beforeunload warning if modified
  window.addEventListener('beforeunload', (घटना) => {
    if (सम्पादित_स्थिति) {
      घटना.preventDefault();
      घटना.returnValue = '';
    }
  });

  // Default load clock generator sample if empty
  if (पाठ_क्षेत्र && !पाठ_क्षेत्र.value.trim()) {
    नमूना_भारणम्('क्लॉक_१०');
  }
});

// पंक्ति क्रमांक अद्यतनम् (Update line numbers column)
function पंक्ति_क्रमांक_अद्यतनम्() {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const पंक्ति_स्तम्भ = document.getElementById('पंक्ति-क्रमांक-स्तम्भ');
  if (!पाठ_क्षेत्र || !पंक्ति_स्तम्भ) return;

  const पंक्तयः = पाठ_क्षेत्र.value.split('\n');
  const संख्या = Math.max(1, पंक्तयः.length);

  let पाठ = '';
  for (let इ = 1; इ <= संख्या; इ++) {
    पाठ += इ + '\n';
  }
  पंक्ति_स्तम्भ.textContent = पाठ;
}

// गणना अद्यतनम् (Update line, word, instruction counters)
function गणना_अद्यतनम्() {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const स्थिति_पंक्ति = document.getElementById('स्थिति-पंक्ति-संख्या');
  const स्थिति_निर्देश = document.getElementById('स्थिति-निर्देश-संख्या');
  if (!पाठ_क्षेत्र) return;

  const पाठ = पाठ_क्षेत्र.value;
  const पंक्तयः = पाठ.split('\n');
  let निर्देश_संख्या = 0;

  for (let इ = 0; इ < पंक्तयः.length; इ++) {
    let पंक्ति = पंक्तयः[इ].trim();
    if (!पंक्ति || पंक्ति.startsWith(';') || पंक्ति.startsWith('//')) continue;
    const अर्धविराम = पंक्ति.search(/;|(\/\/)/);
    if (अर्धविराम !== -1) {
      पंक्ति = पंक्ति.substring(0, अर्धविराम).trim();
    }
    if (पंक्ति) निर्देश_संख्या++;
  }

  if (स्थिति_पंक्ति) स्थिति_पंक्ति.textContent = `Lines: ${पंक्तयः.length}`;
  if (स्थिति_निर्देश) {
    स्थिति_निर्देश.textContent = `Instructions: ${निर्देश_संख्या} / 16`;
    if (निर्देश_संख्या > 16) {
      स्थिति_निर्देश.style.color = '#ef4444';
      स्थिति_निर्देश.textContent += ' (Overflow!)';
    } else {
      स्थिति_निर्देश.style.color = '#38bdf8';
    }
  }
}

// पंजिका परीक्षण सहाय्यक (Check register operand format R0..R7 or aliases)
function पंजिका_परीक्षण(शब्द) {
  if (!शब्द) return false;
  const शुद्ध = शब्द.toUpperCase().trim();
  if (शुद्ध === 'PIN_IN' || शुद्ध === 'PIN_EN' || शुद्ध === 'PIN_OUT' || शुद्ध === 'TIMER' || शुद्ध === 'ACC' || शुद्ध === 'B') {
    return true;
  }
  const संख्या_पाठ = शुद्ध.replace('R', '');
  const संख्या = parseInt(संख्या_पाठ, 10);
  return !isNaN(संख्या) && संख्या >= 0 && संख्या <= 7;
}

// स्थिर परीक्षण सहाय्यक (Check immediate/address operand range)
function स्थिर_परीक्षण(शब्द, न्यूनतम, अधिकतम) {
  if (!शब्द) return false;
  let शुद्ध = शब्द.trim().replace(/^#/, '').replace(/^\[/, '').replace(/\]$/, '');
  let आधार = 10;
  if (शुद्ध.startsWith('0x') || शुद्ध.startsWith('0X')) {
    शुद्ध = शुद्ध.substring(2);
    आधार = 16;
  }
  const संख्या = parseInt(शुद्ध, आधार);
  return !isNaN(संख्या) && संख्या >= न्यूनतम && संख्या <= अधिकतम;
}

// पिन क्रमांक परीक्षण सहाय्यक (Check pin index 0..3)
function पिन_क्रमांक_परीक्षण(शब्द) {
  if (!शब्द) return false;
  let शुद्ध = शब्द.trim().toUpperCase().replace(/^PIN/, '').replace(/^#/, '');
  const संख्या = parseInt(शुद्ध, 10);
  return !isNaN(संख्या) && संख्या >= 0 && संख्या <= 3;
}

// निर्देश संहिता सत्यापनम् (Validate entire assembly program)
function निर्देश_संहिता_सत्यापनम्(कोड_पाठ) {
  const पंक्तयः = कोड_पाठ.split('\n');
  const त्रुटयः = [];
  let मान्य_निर्देश_संख्या = 0;

  for (let इ = 0; इ < पंक्तयः.length; इ++) {
    let पंक्ति = पंक्तयः[इ].trim();
    if (!पंक्ति || पंक्ति.startsWith(';') || पंक्ति.startsWith('//')) {
      continue;
    }
    const अर्धविराम_सूचक = पंक्ति.search(/;|(\/\/)/);
    if (अर्धविराम_सूचक !== -1) {
      पंक्ति = पंक्ति.substring(0, अर्धविराम_सूचक).trim();
    }
    if (!पंक्ति) continue;

    const पंक्ति_क्रमांक = इ + 1;
    const पदम् = पंक्ति.replace(/,/g, ' ').split(/\s+/);
    const ऑपकोड = पदम्[0].toUpperCase();

    const मान्य_ऑपकोड_सूची = [
      'ADD', 'SUB', 'AND', 'XOR', 'SHR', 'SHL', 'NOP', 'LOADIB',
      'SET0', 'SET1', 'LOADI', 'LOAD', 'STORE', 'JMP', 'JMPNZ',
      'JMPC', 'MOV', 'NOT', 'HALT'
    ];

    if (!मान्य_ऑपकोड_सूची.includes(ऑपकोड)) {
      त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: Invalid Opcode '${ऑपकोड}'.`);
      continue;
    }

    switch (ऑपकोड) {
      case 'ADD':
      case 'SUB':
      case 'AND':
      case 'XOR':
        if (पदम्[1] !== undefined || पदम्[2] !== undefined) {
          if (!पंजिका_परीक्षण(पदम्[1])) त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: ${ऑपकोड} dest operand '${पदम्[1]}' is invalid. Expected R0-R7.`);
          if (!पंजिका_परीक्षण(पदम्[2])) त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: ${ऑपकोड} src operand '${पदम्[2]}' is invalid. Expected R0-R7.`);
        }
        break;

      case 'MOV':
        if (!पंजिका_परीक्षण(पदम्[1])) त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: MOV dest operand '${पदम्[1]}' is invalid. Expected R0-R7.`);
        if (!पंजिका_परीक्षण(पदम्[2])) त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: MOV src operand '${पदम्[2]}' is invalid. Expected R0-R7.`);
        break;

      case 'NOT':
      case 'SHL':
      case 'SHR':
        if (पदम्[1] !== undefined && !पंजिका_परीक्षण(पदम्[1])) {
          त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: ${ऑपकोड} operand '${पदम्[1]}' is invalid. Expected R0-R7.`);
        }
        break;

      case 'LOADI':
      case 'LOADIB':
        if (पदम्[1] === undefined || !स्थिर_परीक्षण(पदम्[1], 0, 255)) {
          त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: ${ऑपकोड} immediate operand '${पदम्[1]}' is invalid. Expected 8-bit value (0-255 or #0-255).`);
        }
        break;

      case 'LOAD':
        if (पदम्[1] && पदम्[1].toUpperCase().startsWith('R') && पदम्[2] !== undefined) {
          if (!पंजिका_परीक्षण(पदम्[1])) त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: LOAD dest register '${पदम्[1]}' invalid.`);
          if (!स्थिर_परीक्षण(पदम्[2], 0, 15)) त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: LOAD immediate value '${पदम्[2]}' invalid. Expected 0-15.`);
        } else {
          if (पदम्[1] === undefined || !स्थिर_परीक्षण(पदम्[1], 0, 15)) {
            त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: LOAD address '${पदम्[1]}' invalid. Expected memory address 0-15.`);
          }
        }
        break;

      case 'STORE':
        if (पदम्[1] === undefined || !स्थिर_परीक्षण(पदम्[1], 0, 15)) {
          त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: STORE address '${पदम्[1]}' invalid. Expected memory address 0-15.`);
        }
        break;

      case 'SET0':
      case 'SET1':
        if (पदम्[1] === undefined || !पिन_क्रमांक_परीक्षण(पदम्[1])) {
          त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: ${ऑपकोड} pin index '${पदम्[1]}' is invalid. Expected Pin 0-3.`);
        }
        break;

      case 'JMP':
      case 'JMPNZ':
      case 'JMPC':
        if (पदम्[1] === undefined || !स्थिर_परीक्षण(पदम्[1], 0, 15)) {
          त्रुटयः.push(`Line ${पंक्ति_क्रमांक}: ${ऑपकोड} jump table ID '${पदम्[1]}' is invalid. Expected 0-15.`);
        }
        break;

      case 'NOP':
      case 'HALT':
        break;
    }

    मान्य_निर्देश_संख्या++;
    if (मान्य_निर्देश_संख्या > 16) {
      त्रुटयः.push(`Instruction memory overflow! Max instruction memory capacity is 16 instructions.`);
      break;
    }
  }

  return {
    सफलम्: त्रुटयः.length === 0,
    त्रुटयः: त्रुटयः,
    निर्देश_संख्या: मान्य_निर्देश_संख्या
  };
}

// कार्यक्रम सत्यापन क्रिया (Run validation button action)
function कार्यक्रम_सत्यापनम्() {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const फलक = document.getElementById('सत्यापन-फलक');
  if (!पाठ_क्षेत्र || !फलक) return;

  const पाठ = पाठ_क्षेत्र.value;
  if (!पाठ.trim()) {
    फलक.className = 'सत्यापन-फलक सत्यापन-फलक-त्रुटि';
    फलक.innerHTML = "⚠️ Editor is empty! Please write or load some assembly instructions first.";
    return;
  }

  const परिणाम = निर्देश_संहिता_सत्यापनम्(पाठ);
  if (परिणाम.सफलम्) {
    फलक.className = 'सत्यापन-फलक सत्यापन-फलक-सफल';
    फलक.innerHTML = `✅ Program Validated Successfully! (${परिणाम.निर्देश_संख्या} instructions). Ready to run in CPU simulator.`;
  } else {
    फलक.className = 'सत्यापन-फलक सत्यापन-फलक-त्रुटि';
    फलक.innerHTML = `❌ Validation Failed (${परिणाम.त्रुटयः.length} issue(s)):<br>${परिणाम.त्रुटयः.join('<br>')}`;
  }
}

// संचिका सञ्चयम् (Save/Download .asm to computer)
function संचिका_सञ्चयम्() {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const संचिका_निवेश = document.getElementById('संचिका-नाम-निवेश');
  if (!पाठ_क्षेत्र) return;

  let नाम = संचिका_निवेश ? संचिका_निवेश.value.trim() : वर्तमान_संचिका_नाम;
  if (!नाम) नाम = "program.asm";
  if (!नाम.endsWith('.asm') && !नाम.endsWith('.txt')) {
    नाम += '.asm';
  }

  const पाठ = पाठ_क्षेत्र.value;
  const संचिका_पिण्ड = new Blob([पाठ], { type: 'text/plain;charset=utf-8' });
  const कल्पित_सम्बन्ध = document.createElement('a');
  कल्पित_सम्बन्ध.href = URL.createObjectURL(संचिका_पिण्ड);
  कल्पित_सम्बन्ध.download = नाम;
  document.body.appendChild(कल्पित_सम्बन्ध);
  कल्पित_सम्बन्ध.click();
  document.body.removeChild(कल्पित_सम्बन्ध);
  URL.revokeObjectURL(कल्पित_सम्बन्ध.href);

  सम्पादित_स्थिति = false;
  const फलक = document.getElementById('सत्यापन-फलक');
  if (फलक) {
    फलक.className = 'सत्यापन-फलक सत्यापन-फलक-सफल';
    फलक.innerHTML = `💾 Saved '<strong>${नाम}</strong>' to your computer successfully!`;
  }
}

// संचिका उद्घाटने (Open .asm/.txt file from computer)
function संचिका_उद्घाटनम्(घटना) {
  const संचिका = घटना.target.files[0];
  if (!संचिका) return;

  const पाठक = new FileReader();
  पाठक.onload = function (प्र) {
    const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
    const संचिका_निवेश = document.getElementById('संचिका-नाम-निवेश');
    if (पाठ_क्षेत्र) पाठ_क्षेत्र.value = प्र.target.result;
    if (संचिका_निवेश) संचिका_निवेश.value = संचिका.name;

    वर्तमान_संचिका_नाम = संचिका.name;
    सम्पादित_स्थिति = false;
    पंक्ति_क्रमांक_अद्यतनम्();
    गणना_अद्यतनम्();
    कार्यक्रम_सत्यापनम्();
  };
  पाठक.readAsText(संचिका);
}

// नूतन संचिका निर्माणम् (Create new blank file with custom name)
function नूतन_संचिका_निर्माणम्(प्रत्यक्ष_नाम) {
  if (सम्पादित_स्थिति) {
    if (!confirm("Create a new file? Any unsaved changes in the current file will be lost.")) {
      return;
    }
  }

  let प्रविष्ट_नाम = प्रत्यक्ष_नाम;
  if (!प्रविष्ट_नाम && typeof prompt === 'function') {
    प्रविष्ट_नाम = prompt("Enter name for new assembly file:", "new_program.asm");
  }
  if (प्रविष्ट_नाम === null) return; // user cancelled

  let शुद्ध_नाम = (प्रविष्ट_नाम || "new_program.asm").trim();
  if (!शुद्ध_नाम) शुद्ध_नाम = "new_program.asm";
  if (!शुद्ध_नाम.endsWith('.asm') && !शुद्ध_नाम.endsWith('.txt')) {
    शुद्ध_नाम += '.asm';
  }

  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const संचिका_निवेश = document.getElementById('संचिका-नाम-निवेश');
  const फलक = document.getElementById('सत्यापन-फलक');

  const प्रारम्भिक_ढांचा = `; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: ${शुद्ध_नाम.toUpperCase()}
; ==============================================================================
; Instructions: Max 16 Instructions (Opcodes: ADD, SUB, LOADI, SET1, JMP, etc.)
; ==============================================================================

LOADI #0
HALT
`;

  if (पाठ_क्षेत्र) पाठ_क्षेत्र.value = प्रारम्भिक_ढांचा;
  if (संचिका_निवेश) संचिका_निवेश.value = शुद्ध_नाम;

  वर्तमान_संचिका_नाम = शुद्ध_नाम;
  सम्पादित_स्थिति = false;
  पंक्ति_क्रमांक_अद्यतनम्();
  गणना_अद्यतनम्();

  if (फलक) {
    फलक.className = 'सत्यापन-फलक सत्यापन-फलक-सफल';
    फलक.innerHTML = `📄 Created new assembly file '<strong>${शुद्ध_नाम}</strong>'.`;
  }
}

// पाठ स्वच्छीकरणम् (Clear Editor)
function पाठ_स्वच्छीकरणम्() {
  if (सम्पादित_स्थिति && !confirm("Clear all code in editor? Any unsaved changes will be lost.")) {
    return;
  }
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  if (पाठ_क्षेत्र) पाठ_क्षेत्र.value = '';
  सम्पादित_स्थिति = false;
  पंक्ति_क्रमांक_अद्यतनम्();
  गणना_अद्यतनम्();

  const फलक = document.getElementById('सत्यापन-फलक');
  if (फलक) फलक.style.display = 'none';
}

// नमूना भारणम् (Load Template Assembly)
function नमूना_भारणम्(प्रकार) {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const संचिका_निवेश = document.getElementById('संचिका-नाम-निवेश');
  if (!पाठ_क्षेत्र) return;

  let कोड = '';
  let नाम = 'program.asm';

  if (प्रकार === 'क्लॉक_१०' || प्रकार === 'clock_10') {
    नाम = 'clock_generator_10cycles.asm';
    कोड = `; ==============================================================================
; PIVOT-IV CPU ARCHITECTURE: 10 CLOCK CYCLES PULSE GENERATOR
; ==============================================================================
; Target: Physical Pin 0 (Square Wave Clock Output)
; Cycles: Generates exactly 10 full clock pulses, then terminates (HALT)
; Loop Counter: Register R2 initialized to 10
; Jump Table: JUMP_TABLE[0] = 0x3 (Points to loop body at 0x3)
; ==============================================================================

; --- INITIALIZATION ---
; [0x0]: Set B register to 1 (decrement step)
LOADIB #1

; [0x1]: Load initial count 10 into ACC
LOADI #10

; [0x2]: Initialize loop counter R2 = 10
MOV R2, R0

; --- LOOP BODY (STARTS AT ADDRESS 0x3) ---
; [0x3]: Drive Pin 0 HIGH (Clock Rising Edge)
SET1 0

; [0x4]: High Phase Delay (NOP)
NOP

; [0x5]: Drive Pin 0 LOW (Clock Falling Edge)
SET0 0

; [0x6]: Copy counter R2 into ACC
MOV R0, R2

; [0x7]: Decrement counter: ACC = ACC - B (R2 - 1)
SUB

; [0x8]: Store decremented value back into R2
MOV R2, R0

; [0x9]: If counter != 0 (Zero Flag == 0), repeat loop via JUMP_TABLE[0] -> 0x3
JMPNZ 0

; --- TERMINATION ---
; [0xA]: After 10 completed cycles, stop execution
HALT
`;
  } else if (प्रकार === 'अंकगणित' || प्रकार === 'alu') {
    नाम = 'alu_math_demo.asm';
    कोड = `; Arithmetic & Logic Unit (ALU) Verification Program
LOADI #5      ; ACC = 5
LOADIB #3     ; B = 3
ADD           ; ACC = 5 + 3 = 8
SUB           ; ACC = 8 - 3 = 5
AND           ; ACC = 5 & 3 = 1
XOR           ; ACC = 1 ^ 3 = 2
SHL           ; ACC = 2 << 1 = 4
SHR           ; ACC = 4 >> 1 = 2
HALT
`;
  } else if (प्रकार === 'पिन_नियन्त्रण' || प्रकार === 'gpio') {
    नाम = 'gpio_walking_ones.asm';
    कोड = `; GPIO Walking Ones Output Pattern
SET1 0        ; Pin 0 HIGH
NOP
SET1 1        ; Pin 1 HIGH
NOP
SET1 2        ; Pin 2 HIGH
NOP
SET1 3        ; Pin 3 HIGH
NOP
SET0 0        ; Pin 0 LOW
SET0 1        ; Pin 1 LOW
SET0 2        ; Pin 2 LOW
SET0 3        ; Pin 3 LOW
HALT
`;
  }

  पाठ_क्षेत्र.value = कोड;
  if (संचिका_निवेश) संचिका_निवेश.value = नाम;
  वर्तमान_संचिका_नाम = नाम;
  सम्पादित_स्थिति = false;
  पंक्ति_क्रमांक_अद्यतनम्();
  गणना_अद्यतनम्();
  कार्यक्रम_सत्यापनम्();
}

// ऑपकोड प्रविष्टि सहाय्यक (Insert opcode at cursor position)
function ऑपकोड_प्रविष्टि(ऑपकोड_पाठ) {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  if (!पाठ_क्षेत्र) return;

  const प्रारम्भ = पाठ_क्षेत्र.selectionStart;
  const अन्त्य = पाठ_क्षेत्र.selectionEnd;
  const योजनम् = ऑपकोड_पाठ + '\n';
  पाठ_क्षेत्र.value = पाठ_क्षेत्र.value.substring(0, प्रारम्भ) + योजनम् + पाठ_क्षेत्र.value.substring(अन्त्य);
  पाठ_क्षेत्र.selectionStart = पाठ_क्षेत्र.selectionEnd = प्रारम्भ + योजनम्.length;
  पाठ_क्षेत्र.focus();
  सम्पादित_स्थिति = true;
  पंक्ति_क्रमांक_अद्यतनम्();
  गणना_अद्यतनम्();
}
