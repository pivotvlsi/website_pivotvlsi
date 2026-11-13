/*
 * पीवॉट वीएलएसआई Intel 8085 असेंबली सम्पादक लिपि (8085 Assembly Editor Script)
 * All variable names, function names, class names, and div IDs adhere strictly to Sanskrit terms in Devanagari script.
 */

// सम्पादक स्थिति (Editor State)
let वर्तमान_संचिका_नाम = "program_8085.asm";
let सम्पादित_स्थिति = false;

// आरम्भिक विन्यास (Initialization)
window.addEventListener('DOMContentLoaded', () => {
  // Global functions exposed to window
  window.नूतन_संचिका_निर्माणम् = नूतन_संचिका_निर्माणम्;
  window.संचिका_उद्घाटनम् = संचिका_उद्घाटनम्;
  window.संचिका_सञ्चयम् = संचिका_सञ्चयम्;
  window.कार्यक्रम_सत्यापनम् = कार्यक्रम_सत्यापनम्;
  window.पाठ_स्वच्छीकरणम् = पाठ_स्वच्छीकरणम्;
  window.ऑपकोड_प्रविष्टि = ऑपकोड_प्रविष्टि;

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

  // Load current program from sessionStorage if present, or leave empty
  try {
    const वर्तमान_संहिता = sessionStorage.getItem('अष्टशून्यपञ्चाशीति_वर्तमान_संहिता');
    if (पाठ_क्षेत्र) {
      if (वर्तमान_संहिता && वर्तमान_संहिता.trim()) {
        पाठ_क्षेत्र.value = वर्तमान_संहिता;
        कार्यक्रम_सत्यापनम्();
      } else {
        पाठ_क्षेत्र.value = '';
      }
      सम्पादित_स्थिति = false;
      पंक्ति_क्रमांक_अद्यतनम्();
      गणना_अद्यतनम्();
    }
  } catch (इ) {
    if (पाठ_क्षेत्र) {
      पाठ_क्षेत्र.value = '';
      सम्पादित_स्थिति = false;
      पंक्ति_क्रमांक_अद्यतनम्();
      गणना_अद्यतनम्();
    }
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

// गणना अद्यतनम् (Update line and byte counters)
function गणना_अद्यतनम्() {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const स्थिति_पंक्ति = document.getElementById('स्थिति-पंक्ति-संख्या');
  const स्थिति_बाइट = document.getElementById('स्थिति-बाइट-गणना');
  if (!पाठ_क्षेत्र) return;

  const पाठ = पाठ_क्षेत्र.value;
  const पंक्तयः = पाठ.split('\n');

  if (स्थिति_पंक्ति) स्थिति_पंक्ति.textContent = `Lines: ${पंक्तयः.length}`;
  if (स्थिति_बाइट) स्थिति_बाइट.textContent = `Size: ${new Blob([पाठ]).size} Bytes`;
}

// नूतन संचिका निर्माणम् (New File)
function नूतन_संचिका_निर्माणम्() {
  if (सम्पादित_स्थिति && !confirm("Current file has unsaved changes. Clear editor and create new file?")) {
    return;
  }

  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const नाम_निवेश = document.getElementById('संचिका-नाम-निवेश');
  const सत्यापन_फलक = document.getElementById('सत्यापन-फलक');

  if (पाठ_क्षेत्र) पाठ_क्षेत्र.value = "; Intel 8085 Assembly Code\nORG 0800H\n\nHLT\n";
  if (नाम_निवेश) नाम_निवेश.value = "untitled_8085.asm";
  if (सत्यापन_फलक) सत्यापन_फलक.style.display = 'none';

  वर्तमान_संचिका_नाम = "untitled_8085.asm";
  सम्पादित_स्थिति = false;
  पंक्ति_क्रमांक_अद्यतनम्();
  गणना_अद्यतनम्();
}

// संचिका उद्घाटनम् (Open file from disk)
function संचिका_उद्घाटनम्(घटना) {
  const संचिका = घटना.target.files && घटना.target.files[0];
  if (!संचिका) return;

  const पाठक = new FileReader();
  पाठक.onload = (इ) => {
    const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
    const नाम_निवेश = document.getElementById('संचिका-नाम-निवेश');

    if (पाठ_क्षेत्र) पाठ_क्षेत्र.value = इ.target.result;
    if (नाम_निवेश) नाम_निवेश.value = संचिका.name;

    वर्तमान_संचिका_नाम = संचिका.name;
    सम्पादित_स्थिति = false;
    पंक्ति_क्रमांक_अद्यतनम्();
    गणना_अद्यतनम्();
    कार्यक्रम_सत्यापनम्();
  };
  पाठक.readAsText(संचिका);
}

// संचिका सञ्चयम् (Save file to computer)
function संचिका_सञ्चयम्() {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  const नाम_निवेश = document.getElementById('संचिका-नाम-निवेश');
  if (!पाठ_क्षेत्र) return;

  let संचिका_नाम = नाम_निवेश ? नाम_निवेश.value.trim() : वर्तमान_संचिका_नाम;
  if (!संचिका_नाम) संचिका_नाम = "program_8085.asm";
  if (!संचिका_नाम.endsWith('.asm') && !संचिका_नाम.endsWith('.txt')) {
    संचिका_नाम += '.asm';
  }

  const ब्लॉब = new Blob([पाठ_क्षेत्र.value], { type: 'text/plain;charset=utf-8' });
  const क = document.createElement('a');
  क.href = URL.createObjectURL(ब्लॉब);
  क.download = संचिका_नाम;
  document.body.appendChild(क);
  क.click();
  document.body.removeChild(क);

  सम्पादित_स्थिति = false;
  सत्यापन_संदेश_प्रदर्शनम्(`File saved successfully as '${संचिका_नाम}'.`, 'सफलता');
}

// पाठ स्वच्छीकरणम् (Clear editor)
function पाठ_स्वच्छीकरणम्() {
  if (confirm("Are you sure you want to clear the editor?")) {
    const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
    if (पाठ_क्षेत्र) पाठ_क्षेत्र.value = '';
    सम्पादित_स्थिति = false;
    पंक्ति_क्रमांक_अद्यतनम्();
    गणना_अद्यतनम्();
    const सत्यापन_फलक = document.getElementById('सत्यापन-फलक');
    if (सत्यापन_फलक) सत्यापन_फलक.style.display = 'none';
  }
}

// ऑपकोड प्रविष्टि (Insert opcode snippet at cursor)
function ऑपकोड_प्रविष्टि(संकेत) {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  if (!पाठ_क्षेत्र) return;

  const प्रारम्भ = पाठ_क्षेत्र.selectionStart;
  const अन्त्य = पाठ_क्षेत्र.selectionEnd;
  const पूर्व_पाठ = पाठ_क्षेत्र.value;

  पाठ_क्षेत्र.value = पूर्व_पाठ.substring(0, प्रारम्भ) + संकेत + "\n" + पूर्व_पाठ.substring(अन्त्य);
  पाठ_क्षेत्र.selectionStart = पाठ_क्षेत्र.selectionEnd = प्रारम्भ + संकेत.length + 1;
  पाठ_क्षेत्र.focus();

  सम्पादित_स्थिति = true;
  पंक्ति_क्रमांक_अद्यतनम्();
  गणना_अद्यतनम्();
}

// 8085 कार्यक्रम सत्यापनम् (Validate 8085 opcodes, registers, and operands)
function कार्यक्रम_सत्यापनम्() {
  const पाठ_क्षेत्र = document.getElementById('संहिता-पाठ-क्षेत्र');
  if (!पाठ_क्षेत्र) return;

  const पंक्तयः = पाठ_क्षेत्र.value.split('\n');
  const मान्य_पञ्जिका = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M'];
  const मान्य_युग्म = ['B', 'D', 'H', 'SP', 'PSW'];
  const मान्य_शून्य_ओपकोड = [
    'NOP', 'HLT', 'RLC', 'RRC', 'RAL', 'RAR', 'DAA', 'CMA', 'STC', 'CMC',
    'XCHG', 'XTHL', 'SPHL', 'PCHL', 'RET', 'RC', 'RNC', 'RZ', 'RNZ', 'RP', 'RM', 'RPE', 'RPO', 'EI', 'DI', 'RIM', 'SIM'
  ];

  let दोष_सूची = [];
  let कुल_निर्देश = 0;

  for (let सूचकाङ्क = 0; सूचकाङ्क < पंक्तयः.length; सूचकाङ्क++) {
    let पंक्ति = पंक्तयः[सूचकाङ्क].split(';')[0].split('//')[0].trim();
    if (!पंक्ति) continue;

    // Check for label
    const लेबल_मेल = पंक्ति.match(/^([a-zA-Z0-9_?@]+):\s*(.*)$/);
    if (लेबल_मेल) {
      पंक्ति = लेबल_मेल[2].trim();
      if (!पंक्ति) continue;
    }

    कुल_निर्देश++;
    const खण्ड = पंक्ति.split(/\s+/);
    const ओपकोड = खण्ड[0].toUpperCase();
    const अवशिष्ट = पंक्ति.substring(ओपकोड.length).trim();

    if (ओपकोड === 'ORG' || ओपकोड === 'END' || ओपकोड === 'EQU' || ओपकोड === 'DB' || ओपकोड === 'DW') {
      continue;
    }

    if (मान्य_शून्य_ओपकोड.includes(ओपकोड)) {
      continue;
    }

    // MOV r1, r2
    if (ओपकोड === 'MOV') {
      const मेल = अवशिष्ट.match(/^([A-EHLM]),\s*([A-EHLM])$/i);
      if (!मेल) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Invalid MOV syntax. Expected 'MOV r1, r2' with A, B, C, D, E, H, L, or M.`);
      }
      continue;
    }

    // MVI r, d8
    if (ओपकोड === 'MVI') {
      const मेल = अवशिष्ट.match(/^([A-EHLM]),\s*(.+)$/i);
      if (!मेल) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Invalid MVI syntax. Expected 'MVI r, data8'.`);
      }
      continue;
    }

    // LXI rp, d16
    if (ओपकोड === 'LXI') {
      const मेल = अवशिष्ट.match(/^(B|D|H|SP),\s*(.+)$/i);
      if (!मेल) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Invalid LXI syntax. Expected 'LXI rp, data16' (rp = B, D, H, or SP).`);
      }
      continue;
    }

    // Single register ALU: ADD, ADC, SUB, SBB, ANA, XRA, ORA, CMP, INR, DCR
    if (['ADD', 'ADC', 'SUB', 'SBB', 'ANA', 'XRA', 'ORA', 'CMP', 'INR', 'DCR'].includes(ओपकोड)) {
      if (!मान्य_पञ्जिका.includes(अवशिष्ट.toUpperCase())) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Invalid operand '${अवशिष्ट}' for ${ओपकोड}. Expected A, B, C, D, E, H, L, or M.`);
      }
      continue;
    }

    // Immediate ALU: ADI, ACI, SUI, SBI, ANI, XRI, ORI, CPI
    if (['ADI', 'ACI', 'SUI', 'SBI', 'ANI', 'XRI', 'ORI', 'CPI'].includes(ओपकोड)) {
      if (!अवशिष्ट) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Missing 8-bit immediate operand for ${ओपकोड}.`);
      }
      continue;
    }

    // Register pair operations: INX, DCX, DAD, PUSH, POP
    if (['INX', 'DCX', 'DAD', 'PUSH', 'POP'].includes(ओपकोड)) {
      if (!मान्य_युग्म.includes(अवशिष्ट.toUpperCase())) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Invalid register pair '${अवशिष्ट}' for ${ओपकोड}. Expected B, D, H, SP (or PSW for PUSH/POP).`);
      }
      continue;
    }

    // Memory / 16-bit address instructions: LDA, STA, LHLD, SHLD, JMP, JZ, JNZ, JC, JNC, JM, JP, JPE, JPO, CALL, CC, CNC, CZ, CNZ, CM, CP, CPE, CPO
    if ([
      'LDA', 'STA', 'LHLD', 'SHLD', 'LDAX', 'STAX',
      'JMP', 'JZ', 'JNZ', 'JC', 'JNC', 'JM', 'JP', 'JPE', 'JPO',
      'CALL', 'CC', 'CNC', 'CZ', 'CNZ', 'CM', 'CP', 'CPE', 'CPO'
    ].includes(ओपकोड)) {
      if (!अवशिष्ट) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Missing memory address or label for ${ओपकोड}.`);
      }
      continue;
    }

    // I/O Instructions: IN port, OUT port
    if (['IN', 'OUT'].includes(ओपकोड)) {
      if (!अवशिष्ट) {
        दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Missing 8-bit port address for ${ओपकोड}.`);
      }
      continue;
    }

    // Unknown instruction
    दोष_सूची.push(`Line ${सूचकाङ्क + 1}: Unrecognized Intel 8085 instruction '${ओपकोड}'.`);
  }

  if (दोष_सूची.length > 0) {
    सत्यापन_संदेश_प्रदर्शनम्(`Validation Found ${दोष_सूची.length} Issue(s):<br>• ` + दोष_सूची.slice(0, 5).join('<br>• ') + (दोष_सूची.length > 5 ? `<br>...and ${दोष_सूची.length - 5} more.` : ''), 'संकट');
  } else {
    सत्यापन_संदेश_प्रदर्शनम्(`✓ All ${कुल_निर्देश} Intel 8085 instructions validated cleanly with zero syntax or operand errors.`, 'सफलता');
  }
}

// सत्यापन संदेश प्रदर्शनम् (Validation status alert presenter)
function सत्यापन_संदेश_प्रदर्शनम्(संदेश, प्रकार) {
  const फलक = document.getElementById('सत्यापन-फलक');
  if (!फलक) return;

  फलक.style.display = 'block';
  if (प्रकार === 'सफलता') {
    फलक.style.background = 'rgba(16, 185, 129, 0.15)';
    फलक.style.border = '1px solid rgba(16, 185, 129, 0.4)';
    फलक.style.color = '#34d399';
  } else {
    फलक.style.background = 'rgba(239, 68, 68, 0.15)';
    फलक.style.border = '1px solid rgba(239, 68, 68, 0.4)';
    फलक.style.color = '#f87171';
  }
  फलक.innerHTML = संदेश;
}
