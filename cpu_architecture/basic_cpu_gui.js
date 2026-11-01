/*
 * प्रक्रमक कार्यप्रणाली लिपि (Processor Javascript Logic)
 * All variable names, function names, class names, and div IDs adhere strictly to Sanskrit terms in Devanagari script.
 */

// ४ दत्त पंजिका एवं ४ विशेष संक्रिया पंजिका (8 Registers: R0..R3 Data, R4=PIN_IN, R5=PIN_EN, R6=PIN_OUT, R7=TIMER)
let पंजिका_दत्त = [0, 0, 0, 0, 0, 15, 0, 0];

// समयगणक पंजिका (Hardware Timer R7 / 0x7 countdown value & stall status)
let समयगणक_पंजिका = 0;
let समयगणक_अवरोध_सक्रिय = false;

// द्वितीयक गणित पंजिका B (Secondary Math Register B: 8-bit [0..255])
let गणित_पंजिका_ख = 0;

// पिन स्थिति एवं दिशा पंजिका (Pin State and Pin Direction registers [0..255])
let पिन_स्थिति_पंजिका = 0;
let पिन_दिशा_पंजिका = 0;

// पिन पठन पंजिका, पिन लेखन पंजिका एवं सक्रियता पंजिका (Pin Read [PIN_IN], Pin Write [PIN_OUT], and Enable [PIN_EN] registers: 4 bits [0..15])
let पिन_पठन_पंजिका = 0;
let पिन_लेखन_पंजिका = 0;
let पिन_सक्रियता_पंजिका = 0b1111; // 4-bit default enabled (0xF)

// तरंगरूप इतिहास (Waveform History: records pin samples for plotting, minimum 10 clock periods initialized)
let तरंगरूप_इतिहास = new Array(10).fill(0);

// तरंगरूप सक्रियता इतिहास (Waveform Enable History: stores PIN_EN mask for each clock period)
let तरंगरूप_सक्रियता_इतिहास = new Array(10).fill(0b1111);
const अधिकतम_तरंगरूप_नमूना = 64;

// तरंगरूप कीलन स्थिति (Waveform Lock State: if locked, clicking waveform won't toggle pins)
let तरंगरूप_कीलित = false;

// घटिका काल (Clock Period in milliseconds, default 1000ms = 1.0Hz)
let घटिका_काल_मिलीसेकंड = 1000;

// निर्देश स्मृति (16 words of 8 bits each)
let स्मृति_दत्त = new Array(16).fill(null);

// आंकड़ा स्मृति (Data Memory: 16 addresses [0..15] x 8-bit)
let आंकड़ा_स्मृति_दत्त = new Array(16).fill(0);

// कूर्दन सारणी (Jump Table: 16 entries pointing to instruction addresses [0..15])
let कूर्दन_सारणी_दत्त = new Array(16).fill(0);

// कार्यक्रम गणक (Program Counter: PC) [0..15]
let कार्यक्रम_गणक = 0;

// कुल निष्पादित घटिका चक्र गणक (Total Executed Clock Cycles Counter: starts at 0, advances with each step)
let वर्तमान_घटिका_चक्र = 0;

// निर्देश पंजिका (Instruction Register: IR)
let निर्देश_पंजिका = null;

// ध्वजा (ALU Flags: शून्य = Zero, हासिल = Carry)
let शून्य_ध्वजा = false;
let हासिल_ध्वजा = false;

// स्वचालित चक्र अन्तराल (Interval for auto run)
let स्वचालित_चक्र = null;

/*
 * निर्देश संरचना विवरण:
 * प्रत्येक निर्देश: { प्रकार: 'ADD', गन्तव्य: 0, स्रोत: 1, स्थिर: null }
 */

// आरम्भिक विन्यास (Initialization)
window.addEventListener('DOMContentLoaded', () => {
  window.कूर्दन_सारणी_दत्त = कूर्दन_सारणी_दत्त;
  window.स्मृति_दत्त = स्मृति_दत्त;
  window.पंजिका_दत्त = पंजिका_दत्त;
  window.तात्कालिक_निर्देश_निष्पादनम् = तात्कालिक_निर्देश_निष्पादनम्;
  window.तरंगरूप_छवि_अवरोहणम् = तरंगरूप_छवि_अवरोहणम्;
  window.समयचित्रे_तरंगरूप_प्रेषणम् = समयचित्रे_तरंगरूप_प्रेषणम्;
  window.तरंगरूप_संचिका_अवरोहणम् = तरंगरूप_संचिका_अवरोहणम्;
  window.तरंगरूप_दत्तांश_निर्माणम् = तरंगरूप_दत्तांश_निर्माणम्;
  window.पिन_परिवर्तनम् = पिन_परिवर्तनम्;
  window.घटिका_चक्र_योजनम् = घटिका_चक्र_योजनम्;
  स्मृति_दत्त = new Array(16).fill(null);
  कार्यक्रम_गणक = 0;
  निर्देश_पंजिका = null;
  चित्रफलक_घटना_संयोजनम्();
  पटल_अद्यतनम्();
  लॉग_योजनम्("Microprocessor Ready. Instruction Memory is empty.");
});

// चित्रफलक क्लिक घटना संयोजनम् (Setup Click listener on Waveform Canvas)
function चित्रफलक_घटना_संयोजनम्() {
  const चित्रफलक = document.getElementById('तरंगरूप-चित्रफलक');
  if (!चित्रफलक) return;

  चित्रफलक.addEventListener('click', (घटना) => {
    if (तरंगरूप_कीलित) {
      लॉग_योजनम्("Waveform is LOCKED 🔒. Unlock it to toggle pins via waveform.");
      return;
    }

    const सीमा = चित्रफलक.getBoundingClientRect();
    const सापेक्ष_क्ष = (घटना.clientX - सीमा.left) * (चित्रफलक.width / सीमा.width);
    const सापेक्ष_य = (घटना.clientY - सीमा.top) * (चित्रफलक.height / सीमा.height);

    // Channels: Clock (ch 0), Pin 3 (ch 1), Pin 2 (ch 2), Pin 1 (ch 3), Pin 0 (ch 4)
    const पंक्ति_उच्चता = Math.floor(चित्रफलक.height / 5);
    const चैनल_सूचकांक = Math.floor(सापेक्ष_य / पंक्ति_उच्चता);

    if (चैनल_सूचकांक === 0) {
      लॉग_योजनम्("CLK channel is read-only. Click on PIN 3, PIN 2, PIN 1, or PIN 0 rows below.");
      return;
    }

    const पिन = 4 - चैनल_सूचकांक; // ch 1->Pin 3, ch 2->Pin 2, ch 3->Pin 1, ch 4->Pin 0
    if (पिन < 0 || पिन > 3) return;

    // Timeline configuration
    const प्रारम्भ_क्ष = 100;
    const कदम_विस्तार = 80;
    const प्रदर्शन_नमूना_संख्या = Math.max(10, तरंगरूप_इतिहास.length);

    // Ensure click is within clock waveform area or header
    let क्लिक_नमूना = Math.floor((सापेक्ष_क्ष - प्रारम्भ_क्ष) / कदम_विस्तार);

    // If clicked on left label area (x < 100), toggle the current/latest cycle
    if (सापेक्ष_क्ष < प्रारम्भ_क्ष) {
      क्लिक_नमूना = Math.max(0, तरंगरूप_इतिहास.length - 1);
    }

    // Rule: Timeline before and including the current running execution cycle is locked by default.
    // Toggling is allowed in future cycles (at least 1 cycle next to the current running cycle).
    if (क्लिक_नमूना <= वर्तमान_घटिका_चक्र) {
      लॉग_योजनम्(`🔒 Clock Cycle T${क्लिक_नमूना + 1} is in the past / current execution time. Only future cycles (T${वर्तमान_घटिका_चक्र + 2}+) can be configured.`);
      return;
    }

    // Ensure array is populated up to clicked index
    while (तरंगरूप_इतिहास.length <= क्लिक_नमूना) {
      तरंगरूप_इतिहास.push(पिन_स्थिति_पंजिका & 0x0F);
      तरंगरूप_सक्रियता_इतिहास.push(पिन_सक्रियता_पंजिका & 0x0F);
    }

    // Toggle that specific pin for this future clock cycle (allowed irrespective of PIN_EN,
    // since PIN_EN can be configured dynamically by instructions prior to or during that cycle)
    तरंगरूप_इतिहास[क्लिक_नमूना] ^= (1 << पिन);
    const नूतन_मूल्य = (तरंगरूप_इतिहास[क्लिक_नमूना] >> पिन) & 1;

    लॉग_योजनम्(`Clock Cycle T${क्लिक_नमूना + 1}: PIN ${पिन} toggled to ${नूतन_मूल्य}.`);
    पटल_अद्यतनम्();
  });
}

// घटिका काल परिवर्तनम् (Calculate and change clock period from input and unit)
function घटिका_काल_परिवर्तनम्() {
  const निवेश = document.getElementById('घटिका-काल-निवेश');
  const इकाई = document.getElementById('घटिका-इकाई-चयन');
  if (!निवेश || !इकाई) return;

  const संख्या = parseFloat(निवेश.value);
  if (isNaN(संख्या) || संख्या <= 0) return;

  const चयनित_इकाई = इकाई.value;
  let काल_सेकंड = 0.001;
  let आवृत्ति_हर्ट्ज_पाठ = "";

  if (चयनित_इकाई === 'MHz') {
    const आवृत्ति = संख्या * 1e6;
    काल_सेकंड = 1 / आवृत्ति;
    आवृत्ति_हर्ट्ज_पाठ = `${संख्या} MHz`;
  } else {
    // Default: KHz
    const आवृत्ति = संख्या * 1e3;
    काल_सेकंड = 1 / आवृत्ति;
    आवृत्ति_हर्ट्ज_पाठ = `${संख्या} KHz`;
  }

  // Minimum browser timer clamped to 15ms for smooth visual animation without freezing UI
  const वास्तविक_मिलीसेकंड = काल_सेकंड * 1000;
  घटिका_काल_मिलीसेकंड = Math.max(15, Math.round(वास्तविक_मिलीसेकंड));

  लॉग_योजनम्(`Clock set: ${संख्या} ${चयनित_इकाई} (Effective Period: ${वास्तविक_मिलीसेकंड >= 1 ? वास्तविक_मिलीसेकंड.toFixed(2) + ' ms' : (वास्तविक_मिलीसेकंड * 1000).toFixed(2) + ' µs'}, Freq: ${आवृत्ति_हर्ट्ज_पाठ}).`);

  if (स्वचालित_चक्र) {
    clearInterval(स्वचालित_चक्र);
    स्वचालित_चक्र = setInterval(() => {
      पद_चालनम्();
    }, घटिका_काल_मिलीसेकंड);
    const स्थिति_संकेतक = document.getElementById('घटिका-स्थिति');
    if (स्थिति_संकेतक) स्थिति_संकेतक.textContent = `CLOCK: ${आवृत्ति_हर्ट्ज_पाठ} RUNNING`;
  }
}

// तरंगरूप कीलनम् (Toggle Waveform lock state)
function तरंगरूप_कीलनम्() {
  तरंगरूप_कीलित = !तरंगरूप_कीलित;
  const कुञ्जी = document.getElementById('तरंगरूप-कील-कुञ्जी');
  if (कुञ्जी) {
    if (तरंगरूप_कीलित) {
      कुञ्जी.textContent = "🔒 Locked (Waveform Protected)";
      कुञ्जी.classList.add('क्रिया-कुञ्जी-संकट');
      लॉग_योजनम्("Waveform locked. Clicks on waveform will not toggle pins.");
    } else {
      कुञ्जी.textContent = "🔓 Unlocked (Click Waveform to Toggle)";
      कुञ्जी.classList.remove('क्रिया-कुञ्जी-संकट');
      लॉग_योजनम्("Waveform unlocked. Clicks on waveform can toggle pins.");
    }
  }
}

  // स्मृति स्वच्छीकरणम् (Clear all instructions from memory)
  function स्मृति_स्वच्छीकरणम्() {
    स्मृति_दत्त = new Array(16).fill(null);
    कार्यक्रम_गणक = 0;
    निर्देश_पंजिका = null;
    लॉग_योजनम्("All programs deleted. Instruction Memory cleared.");
    पटल_अद्यतनम्();
  }

  // नमूना पाठ स्थापनम् (Populate editor with assembly template)
  function नमूना_पाठ_स्थापनम्() {
    const पाठ = `LOADI #5\nLOADIB #3\nADD\nHALT`;
    const पाठ_निवेश = document.getElementById('पाठ-कार्यक्रम-निवेश');
    if (पाठ_निवेश) पाठ_निवेश.value = पाठ;
  }

  // पाठ्य कार्यक्रम भारणम् (Assemble and Load from Text Area)
  function पाठ्य_कार्यक्रम_भारणम्() {
    const पाठ = document.getElementById('पाठ-कार्यक्रम-निवेश').value;
    if (!पाठ || !पाठ.trim()) {
      alert("Please enter assembly instructions to load.");
      return;
    }
    संयोजन_व_भारणम्(पाठ);
  }

  // संचिकातः कार्यक्रम भारणम् (Load program directly from imported file)
  function संचिकातः_कार्यक्रम_भारणम्(घटना) {
    const संचिका = घटना.target.files[0];
    if (!संचिका) return;
    const पाठक = new FileReader();
    पाठक.onload = function (प्र) {
      const पाठ = प्र.target.result;
      const सत्यापन_परिणाम = निर्देश_संहिता_सत्यापनम्(पाठ);
      if (!सत्यापन_परिणाम.सफलम्) {
        सत्यापन_प्रदर्शनम्(false, `❌ Validation Failed in '${संचिका.name}':<br>${सत्यापन_परिणाम.त्रुटयः.join('<br>')}`);
        alert(`Assembly file '${संचिका.name}' contains validation errors!\n\n` + सत्यापन_परिणाम.त्रुटयः.join('\n'));
        return;
      }
      संयोजन_व_भारणम्(पाठ);
      सत्यापन_प्रदर्शनम्(true, `✅ Successfully loaded & verified '${संचिका.name}' (${सत्यापन_परिणाम.निर्देश_संख्या} instructions).`);
    };
    पाठक.readAsText(संचिका);
  }

  // निर्देश संहिता सत्यापनम् (Validate entire assembly text for valid opcodes, operand types & ranges)
  function निर्देश_संहिता_सत्यापनम्(कोड_पाठ) {
    const पंक्तयः = कोड_पाठ.split('\n');
    const त्रुटयः = [];
    let मान्य_निर्देश_संख्या = 0;

    for (let इ = 0; इ < पंक्तयः.length; इ++) {
      let पंक्ति = पंक्तयः[इ].trim();
      if (!पंक्ति || पंक्ति.startsWith(';') || पंक्ति.startsWith('//')) {
        continue;
      }
      // Remove inline comments (semicolon or //)
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

      // Check operand count and ranges
      switch (ऑपकोड) {
        case 'ADD':
        case 'SUB':
        case 'AND':
        case 'XOR':
          // Can be 0 operands (ACC, B) or 2 register operands (Rd, Rs: R0-R7, PIN_IN, PIN_EN, PIN_OUT, TIMER)
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
          // 0 operands (ACC) or 1 register operand (Rd: R0-R7)
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
          // Either LOAD Rd, #imm or LOAD addr
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

  // पंजिका परीक्षण सहाय्यक (Check register operand format R0..R7 or aliases PIN_IN, PIN_EN, PIN_OUT, TIMER)
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

  // निर्देश स्मृति सत्यापनम् (Validate currently loaded instructions in memory)
  function निर्देश_स्मृति_सत्यापनम्() {
    const त्रुटयः = [];
    let भारित_संख्या = 0;

    for (let अ = 0; अ < 16; अ++) {
      const निर्देश = स्मृति_दत्त[अ];
      if (!निर्देश) continue;
      भारित_संख्या++;

      // Validate opcode
      const मान्य_प्रकाराः = [
        'ADD', 'SUB', 'AND', 'XOR', 'SHR', 'SHL', 'NOP', 'LOADIB',
        'SET0', 'SET1', 'LOADI', 'LOAD', 'MEM_LOAD', 'STORE', 'JMP', 'JMPNZ',
        'JMPC', 'MOV', 'NOT', 'HALT'
      ];

      if (!मान्य_प्रकाराः.includes(निर्देश.प्रकार)) {
        त्रुटयः.push(`[0x${अ.toString(16).toUpperCase()}]: Invalid instruction type '${निर्देश.प्रकार}'.`);
        continue;
      }

      // Validate register operands
      if (निर्देश.गन्तव्य !== undefined && (निर्देश.गन्तव्य < 0 || निर्देश.गन्तव्य > 7)) {
        त्रुटयः.push(`[0x${अ.toString(16).toUpperCase()}]: Destination register R${निर्देश.गन्तव्य} out of range (0-7).`);
      }
      if (निर्देश.स्रोत !== undefined && (निर्देश.स्रोत < 0 || निर्देश.स्रोत > 7)) {
        त्रुटयः.push(`[0x${अ.toString(16).toUpperCase()}]: Source register R${निर्देश.स्रोत} out of range (0-7).`);
      }

      // Validate address / pin / table operands
      if (निर्देश.पता !== undefined && (निर्देश.पता < 0 || निर्देश.पता > 15)) {
        त्रुटयः.push(`[0x${अ.toString(16).toUpperCase()}]: Memory address 0x${निर्देश.पता.toString(16)} out of range (0-15).`);
      }
      if (निर्देश.पिन !== undefined && (निर्देश.पिन < 0 || निर्देश.पिन > 3)) {
        त्रुटयः.push(`[0x${अ.toString(16).toUpperCase()}]: Pin index ${निर्देश.पिन} out of range (0-3).`);
      }
      if (निर्देश.तालिका_क्रमांक !== undefined && (निर्देश.तालिका_क्रमांक < 0 || निर्देश.तालिका_क्रमांक > 15)) {
        त्रुटयः.push(`[0x${अ.toString(16).toUpperCase()}]: Jump table id ${निर्देश.तालिका_क्रमांक} out of range (0-15).`);
      }
      if (निर्देश.स्थिर !== undefined && (निर्देश.स्थिर < 0 || निर्देश.स्थिर > 255)) {
        त्रुटयः.push(`[0x${अ.toString(16).toUpperCase()}]: Immediate value ${निर्देश.स्थिर} out of range (0-255).`);
      }
    }

    if (भारित_संख्या === 0) {
      सत्यापन_प्रदर्शनम्(false, "⚠️ Instruction memory is empty! Import an assembly program first.");
      लॉग_योजनम्("Validation: Instruction memory is empty.");
      return;
    }

    if (त्रुटयः.length === 0) {
      सत्यापन_प्रदर्शनम्(true, `✅ All ${भारित_संख्या} instruction(s) in memory are valid! All opcodes and operands are within specification limits.`);
      लॉग_योजनम्(`Validation PASSED: All ${भारित_संख्या} instructions verified successfully.`);
    } else {
      सत्यापन_प्रदर्शनम्(false, `❌ Validation Failed (${त्रुटयः.length} issue(s)):<br>${त्रुटयः.join('<br>')}`);
      लॉग_योजनम्(`Validation FAILED: ${त्रुटयः.length} error(s) found in instruction memory.`);
    }
  }

  // सत्यापन फलक प्रदर्शनम् (Render validation feedback banner)
  function सत्यापन_प्रदर्शनम्(सफलम्, संदेश_html) {
    const फलक = document.getElementById('सत्यापन-फलक');
    if (!फलक) return;
    फलक.style.display = 'block';
    if (सफलम्) {
      फलक.style.background = 'rgba(16, 185, 129, 0.15)';
      फलक.style.border = '1px solid #10b981';
      फलक.style.color = '#34d399';
    } else {
      फलक.style.background = 'rgba(239, 68, 68, 0.15)';
      फलक.style.border = '1px solid #ef4444';
      फलक.style.color = '#f87171';
    }
    फलक.innerHTML = संदेश_html;
  }

  // पंजिका विश्लेषण सहाय्यक (Helper to parse register string R0..R7, ACC, B, PIN_IN, PIN_EN, PIN_OUT, TIMER)
  function पंजिका_विश्लेषण_सहाय्यक(शब्द) {
    if (!शब्द) return 0;
    const शुद्ध = शब्द.toUpperCase().trim();
    if (शुद्ध === 'PIN_IN' || शुद्ध === 'R4') return 4;
    if (शुद्ध === 'PIN_EN' || शुद्ध === 'R5') return 5;
    if (शुद्ध === 'PIN_OUT' || शुद्ध === 'R6') return 6;
    if (शुद्ध === 'TIMER' || शुद्ध === 'R7') return 7;
    if (शुद्ध === 'ACC' || शुद्ध === 'R0') return 0;
    if (शुद्ध === 'B' || शुद्ध === 'R1') return 1;
    const संख्या_पाठ = शुद्ध.replace('R', '');
    const संख्या = parseInt(संख्या_पाठ, 10);
    return isNaN(संख्या) ? 0 : Math.max(0, Math.min(7, संख्या));
  }

  // स्थिर विश्लेषण सहाय्यक (Helper to parse immediate value or address)
  function स्थिर_विश्लेषण_सहाय्यक(शब्द, अधिकतम = 15) {
    if (!शब्द) return 0;
    let शुद्ध = शब्द.replace('#', '').replace('[', '').replace(']', '');
    let आधार = 10;
    if (शुद्ध.startsWith('0x') || शुद्ध.startsWith('0X')) {
      शुद्ध = शुद्ध.substring(2);
      आधार = 16;
    }
    const संख्या = parseInt(शुद्ध, आधार);
    return isNaN(संख्या) ? 0 : Math.max(0, Math.min(अधिकतम, संख्या));
  }

  // एकल निर्देश विश्लेषण (Parse a single instruction line into instruction object)
  function एकल_निर्देश_विश्लेषण(पंक्ति_पाठ) {
    if (!पंक्ति_पाठ) return null;
    let पंक्ति = पंक्ति_पाठ.trim();
    const अर्धविराम_सूचक = पंक्ति.search(/;|(\/\/)/);
    if (अर्धविराम_सूचक !== -1) {
      पंक्ति = पंक्ति.substring(0, अर्धविराम_सूचक).trim();
    }
    if (!पंक्ति) return null;

    const पदम् = पंक्ति.replace(/,/g, ' ').split(/\s+/);
    const ऑपकोड = पदम्[0].toUpperCase();

    switch (ऑपकोड) {
      case 'LOAD':
        if (पदम्[1] && पदम्[1].toUpperCase().startsWith('R') && पदम्[2] !== undefined) {
          return { प्रकार: 'LOAD', गन्तव्य: पंजिका_विश्लेषण_सहाय्यक(पदम्[1]), स्थिर: स्थिर_विश्लेषण_सहाय्यक(पदम्[2], 15) };
        } else {
          return { प्रकार: 'MEM_LOAD', पता: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 15) };
        }
      case 'STORE':
        return { प्रकार: 'STORE', पता: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 15) };
      case 'LOADI':
        return { प्रकार: 'LOADI', स्थिर: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 255) };
      case 'LOADIB':
        return { प्रकार: 'LOADIB', स्थिर: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 255) };
      case 'SET0':
        return { प्रकार: 'SET0', पिन: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 3) };
      case 'SET1':
        return { प्रकार: 'SET1', पिन: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 3) };
      case 'JMP':
        return { प्रकार: 'JMP', तालिका_क्रमांक: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 15) };
      case 'JMPNZ':
        return { प्रकार: 'JMPNZ', तालिका_क्रमांक: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 15) };
      case 'JMPC':
        return { प्रकार: 'JMPC', तालिका_क्रमांक: स्थिर_विश्लेषण_सहाय्यक(पदम्[1], 15) };
      case 'SUB':
        if (पदम्[1] && पदम्[2]) {
          return { प्रकार: 'SUB', गन्तव्य: पंजिका_विश्लेषण_सहाय्यक(पदम्[1]), स्रोत: पंजिका_विश्लेषण_सहाय्यक(पदम्[2]) };
        } else {
          return { प्रकार: 'SUB', गन्तव्य: 0, स्रोत: 1, संचायक_रूप: true };
        }
      case 'MOV':
        return { प्रकार: 'MOV', गन्तव्य: पंजिका_विश्लेषण_सहाय्यक(पदम्[1]), स्रोत: पंजिका_विश्लेषण_सहाय्यक(पदम्[2]) };
      case 'ADD':
      case 'AND':
      case 'OR':
      case 'XOR':
        if (पदम्[1] && पदम्[2]) {
          return { प्रकार: ऑपकोड, गन्तव्य: पंजिका_विश्लेषण_सहाय्यक(पदम्[1]), स्रोत: पंजिका_विश्लेषण_सहाय्यक(पदम्[2]) };
        } else {
          return { प्रकार: ऑपकोड, गन्तव्य: 0, स्रोत: 1, संचायक_रूप: true };
        }
      case 'NOT':
      case 'SHL':
      case 'SHR':
        if (पदम्[1]) {
          return { प्रकार: ऑपकोड, गन्तव्य: पंजिका_विश्लेषण_सहाय्यक(पदम्[1]) };
        } else {
          return { प्रकार: ऑपकोड, गन्तव्य: 0, संचायक_रूप: true };
        }
      case 'HALT':
        return { प्रकार: 'HALT' };
      case 'NOP':
        return { प्रकार: 'NOP' };
      default:
        return null;
    }
  }

  // संयोजन व भारणम् (Parse assembly lines into Instruction Memory)
  function संयोजन_व_भारणम्(कोड_पाठ) {
    const पंक्तयः = कोड_पाठ.split('\n');
    const नूतन_स्मृति = new Array(16).fill(null);
    let सूचकांक = 0;
    let भारित_संख्या = 0;

    for (let इ = 0; इ < पंक्तयः.length && सूचकांक < 16; इ++) {
      let पंक्ति = पंक्तयः[इ].trim();
      if (!पंक्ति || पंक्ति.startsWith(';') || पंक्ति.startsWith('//')) {
        continue;
      }
      const निर्देश = एकल_निर्देश_विश्लेषण(पंक्ति);
      if (निर्देश) {
        नूतन_स्मृति[सूचकांक] = निर्देश;
        सूचकांक++;
        भारित_संख्या++;
      }
    }

    स्मृति_दत्त = नूतन_स्मृति;
    कार्यक्रम_गणक = 0;
    निर्देश_पंजिका = null;
    लॉग_योजनम्(`Assembled and loaded ${भारित_संख्या} instruction(s) into Instruction Memory.`);
    पटल_अद्यतनम्();
  }

  // पटल एवं दृश्य अद्यतनम् (Render & Update UI View)
  function पटल_अद्यतनम्() {
    // १. पंजिका अद्यतनम् (Update registers R0..R7)
    // Synchronize R4=PIN_IN, R5=PIN_EN, R6=PIN_OUT, R7=TIMER
    पंजिका_दत्त[4] = पिन_पठन_पंजिका & 0x0F;
    पंजिका_दत्त[5] = पिन_सक्रियता_पंजिका & 0x0F;
    पंजिका_दत्त[6] = पिन_लेखन_पंजिका & 0x0F;
    पंजिका_दत्त[7] = समयगणक_पंजिका & 0x0F;

    for (let प = 0; प < 8; प++) {
      const मूल्य = पंजिका_दत्त[प] & 0x0F;
      const दशमलव_तत्व = document.getElementById(`पंजिका-दशमलव-${संख्या_रूपान्तर(प)}`);
      if (दशमलव_तत्व) दशमलव_तत्व.textContent = मूल्य;

      const पट्टिका_तत्व = document.getElementById(`बिट-पट्टिका-${संख्या_रूपान्तर(प)}`);
      if (पट्टिका_तत्व) {
        const बिट_सूची = पट्टिका_तत्व.children;
        for (let ब = 0; ब < 4; ब++) {
          const बिट_सूचक = 3 - ब; // MSB to LSB
          const बिट_मूल्य = (मूल्य >> बिट_सूचक) & 1;
          बिट_सूची[ब].textContent = बिट_मूल्य;
          if (बिट_मूल्य === 1) {
            बिट_सूची[ब].classList.add('सक्रिय-बिट');
          } else {
            बिट_सूची[ब].classList.remove('सक्रिय-बिट');
          }
        }
      }
    }

    // २. विशेष पंजिका (PC, Running Cycle & IR)
    document.getElementById('गणक-मान').textContent = `0x${कार्यक्रम_गणक.toString(16).toUpperCase()} (${कार्यक्रम_गणक})`;
    const घटिका_चक्र_तत्व = document.getElementById('घटिका-चक्र-मान');
    if (घटिका_चक्र_तत्व) {
      घटिका_चक्र_तत्व.textContent = `T${वर्तमान_घटिका_चक्र + 1}`;
    }
    if (निर्देश_पंजिका) {
      document.getElementById('निर्देश-पंजिका-मान').textContent = निर्देश_पाठ_निर्माणम्(निर्देश_पंजिका);
    } else {
      document.getElementById('निर्देश-पंजिका-मान').textContent = "0x00 [NOP]";
    }

    // ३. ध्वजा अद्यतनम् (Flags)
    const शून्य_तत्व = document.getElementById('शून्य-ध्वजा-दीपक');
    const हासिल_तत्व = document.getElementById('हासिल-ध्वजा-दीपक');
    if (शून्य_ध्वजा) शून्य_तत्व.classList.add('प्रज्वलित');
    else शून्य_तत्व.classList.remove('प्रज्वलित');

    if (हासिल_ध्वजा) हासिल_तत्व.classList.add('प्रज्वलित');
    else हासिल_तत्व.classList.remove('प्रज्वलित');

    // ४. पिन स्थिति अद्यतनम् (4 GPIO Data Pins: 0-3)
    const पिन_पाठ_तत्व = document.getElementById('पिन-दिशानिर्देश-पाठ');
    if (पिन_पाठ_तत्व) {
      पिन_पाठ_तत्व.textContent = `Dir: 0x${(पिन_दिशा_पंजिका & 0x0F).toString(16).toUpperCase()} | State: 0x${(पिन_स्थिति_पंजिका & 0x0F).toString(16).toUpperCase()}`;
    }
    for (let पि = 0; पि < 4; पि++) {
      const पिन_तत्व = document.getElementById(`पिन-गोलक-${संख्या_रूपान्तर(पि)}`);
      if (पिन_तत्व) {
        const पिन_मान = (पिन_स्थिति_पंजिका >> पि) & 1;
        पिन_तत्व.textContent = पिन_मान;
        if (पिन_मान === 1) {
          पिन_तत्व.classList.add('सक्रिय-बिट');
        } else {
          पिन_तत्व.classList.remove('सक्रिय-बिट');
        }
      }
    }

    // ५. पिन पंजिका अद्यतनम् (Update PIN_IN, PIN_OUT, PIN_EN Register Displays)
    const पठन_दशमलव = document.getElementById('पिन-पठन-दशमलव');
    const लेखन_दशमलव = document.getElementById('पिन-लेखन-दशमलव');
    const सक्रियता_दशमलव = document.getElementById('पिन-सक्रियता-दशमलव');
    if (पठन_दशमलव) पठन_दशमलव.textContent = पिन_पठन_पंजिका & 0x0F;
    if (लेखन_दशमलव) लेखन_दशमलव.textContent = पिन_लेखन_पंजिका & 0x0F;
    if (सक्रियता_दशमलव) सक्रियता_दशमलव.textContent = पिन_सक्रियता_पंजिका & 0x0F;

    for (let ब = 0; ब < 4; ब++) {
      const बिट_सूचक = 3 - ब;
      // PIN_IN bits
      const पठन_बिट = document.getElementById(`पिन-पठन-बिट-${संख्या_रूपान्तर(बिट_सूचक)}`);
      if (पठन_बिट) {
        const मान = (पिन_पठन_पंजिका >> बिट_सूचक) & 1;
        पठन_बिट.textContent = मान;
        if (मान) पठन_बिट.classList.add('सक्रिय-बिट');
        else पठन_बिट.classList.remove('सक्रिय-बिट');
      }
      // PIN_OUT bits
      const लेखन_बिट = document.getElementById(`पिन-लेखन-बिट-${संख्या_रूपान्तर(बिट_सूचक)}`);
      if (लेखन_बिट) {
        const मान = (पिन_लेखन_पंजिका >> बिट_सूचक) & 1;
        लेखन_बिट.textContent = मान;
        if (मान) लेखन_बिट.classList.add('सक्रिय-बिट');
        else लेखन_बिट.classList.remove('सक्रिय-बिट');
      }
      // PIN_EN bits
      const सक्रियता_बिट = document.getElementById(`पिन-सक्रियता-बिट-${संख्या_रूपान्तर(बिट_सूचक)}`);
      if (सक्रियता_बिट) {
        const मान = (पिन_सक्रियता_पंजिका >> बिट_सूचक) & 1;
        सक्रियता_बिट.textContent = मान;
        if (मान) सक्रियता_बिट.classList.add('सक्रिय-बिट');
        else सक्रियता_बिट.classList.remove('सक्रिय-बिट');
      }
    }

    // तरंगरूप चित्रफलक अंकनम् (Draw Waveform)
    तरंगरूप_अंकनम्();

    // ६. स्मृति सूची रेंडर (Render Memory list)
    const स्मृति_सूची_पात्र = document.getElementById('स्मृति-सूची-पात्र');
    स्मृति_सूची_पात्र.innerHTML = '';

    for (let अ = 0; अ < 16; अ++) {
      const प्रविष्टि = document.createElement('div');
      प्रविष्टि.className = 'स्मृति-प्रविष्टि';
      if (अ === कार्यक्रम_गणक) {
        प्रविष्टि.classList.add('सक्रिय-निर्देश');
      }

      const निर्देश = स्मृति_दत्त[अ];
      const निर्देश_पाठ = निर्देश ? निर्देश_पाठ_निर्माणम्(निर्देश) : 'NOP';
      const द्विआधारी_कूट = निर्देश ? द्विआधारी_कूट_निर्माणम्(निर्देश) : '0000 0000';

      प्रविष्टि.innerHTML = `
      <span class="स्मृति-पता">0x${अ.toString(16).toUpperCase()}</span>
      <span class="स्मृति-कूट">${निर्देश_पाठ}</span>
      <span class="स्मृति-द्विआधारी">${द्विआधारी_कूट}</span>
      <span style="font-size:0.75rem; color:#818cf8;">${अ === कार्यक्रम_गणक ? '👉 PC' : ''}</span>
    `;
      प्रविष्टि.onclick = () => {
        कार्यक्रम_गणक = अ;
        लॉग_योजनम्(`Jumped PC to address 0x${अ.toString(16).toUpperCase()}`);
        पटल_अद्यतनम्();
      };
      स्मृति_सूची_पात्र.appendChild(प्रविष्टि);
    }
  }

  // संख्या रूपान्तर (0->०, 1->१ ... 7->७ for devanagari element IDs)
  function संख्या_रूपान्तर(अंक) {
    const रूप = ['०', '१', '२', '३', '४', '५', '६', '७'];
    return रूप[अंक] !== undefined ? रूप[अंक] : अंक;
  }

  // निर्देश पाठ निर्माणम् (Generate human-readable instruction string)
  function निर्देश_पाठ_निर्माणम्(नि) {
    if (!नि) return "NOP";
    switch (नि.प्रकार) {
      case 'LOAD':
        return `LOAD R${नि.गन्तव्य}, #${नि.स्थिर}`;
      case 'MEM_LOAD':
        return `LOAD [0x${नि.पता.toString(16).toUpperCase()}]`;
      case 'STORE':
        return `STORE [0x${नि.पता.toString(16).toUpperCase()}]`;
      case 'LOADI':
        return `LOADI #${नि.स्थिर}`;
      case 'LOADIB':
        return `LOADIB #${नि.स्थिर}`;
      case 'SET0':
        return `SET0 pin${नि.पिन}`;
      case 'SET1':
        return `SET1 pin${नि.पिन}`;
      case 'JMP':
        return `JMP tab[${नि.तालिका_क्रमांक}]`;
      case 'JMPNZ':
        return `JMPNZ tab[${नि.तालिका_क्रमांक}]`;
      case 'JMPC':
        return `JMPC tab[${नि.तालिका_क्रमांक}]`;
      case 'SUB':
        return नि.संचायक_रूप ? `SUB` : `SUB R${नि.गन्तव्य}, R${नि.स्रोत}`;
      case 'MOV':
        return `MOV R${नि.गन्तव्य}, R${नि.स्रोत}`;
      case 'ADD':
        return नि.संचायक_रूप ? `ADD` : `ADD R${नि.गन्तव्य}, R${नि.स्रोत}`;
      case 'AND':
        return नि.संचायक_रूप ? `AND` : `AND R${नि.गन्तव्य}, R${नि.स्रोत}`;
      case 'OR':
        return `OR R${नि.गन्तव्य}, R${नि.स्रोत}`;
      case 'NOT':
        return `NOT R${नि.गन्तव्य}`;
      case 'XOR':
        return नि.संचायक_रूप ? `XOR` : `XOR R${नि.गन्तव्य}, R${नि.स्रोत}`;
      case 'SHL':
        return नि.संचायक_रूप ? `SHL` : `SHL R${नि.गन्तव्य}`;
      case 'SHR':
        return नि.संचायक_रूप ? `SHR` : `SHR R${नि.गन्तव्य}`;
      case 'HALT':
        return `HALT`;
      default:
        return "NOP";
    }
  }

  // द्विआधारी कूट निर्माणम् (Generate 8-bit binary representation)
  function द्विआधारी_कूट_निर्माणम्(नि) {
    if (!नि) return "0000 0000";
    const ऑपकोड_मानचित्र = {
      'ADD': 0b0000,
      'SUB': 0b0001,
      'AND': 0b0010,
      'XOR': 0b0011,
      'SHR': 0b0100,
      'SHL': 0b0101,
      'NOP': 0b0110,
      'LOADIB': 0b0111,
      'SET0': 0b1000,
      'SET1': 0b1001,
      'LOADI': 0b1010,
      'MEM_LOAD': 0b1011,
      'LOAD': 0b1011,
      'STORE': 0b1100,
      'JMP': 0b1101,
      'JMPNZ': 0b1110,
      'JMPC': 0b1111,
      'MOV': 0b0010,
      'OR': 0b0101,
      'NOT': 0b0110,
      'HALT': 0b1111
    };
    const ऑप = ऑपकोड_मानचित्र[नि.प्रकार] !== undefined ? ऑपकोड_मानचित्र[नि.प्रकार] : 0;
    const उच्च_निबल = ऑप.toString(2).padStart(4, '0');
    let निम्न_निबल = "0000";
    if (नि.प्रकार === 'LOAD' || नि.प्रकार === 'MEM_LOAD') {
      const पता_मान = नि.पता !== undefined ? नि.पता : (नि.स्थिर !== undefined ? नि.स्थिर : 0);
      निम्न_निबल = (पता_मान & 0xF).toString(2).padStart(4, '0');
    } else if (नि.प्रकार === 'LOADI' || नि.प्रकार === 'LOADIB') {
      निम्न_निबल = (नि.स्थिर & 0xF).toString(2).padStart(4, '0');
    } else if (नि.प्रकार === 'MEM_LOAD' || नि.प्रकार === 'STORE') {
      निम्न_निबल = (नि.पता & 0xF).toString(2).padStart(4, '0');
    } else if (नि.प्रकार === 'SET0' || नि.प्रकार === 'SET1') {
      निम्न_निबल = (नि.पिन & 0xF).toString(2).padStart(4, '0');
    } else if (नि.प्रकार === 'JMP' || नि.प्रकार === 'JMPNZ' || नि.प्रकार === 'JMPC') {
      निम्न_निबल = (नि.तालिका_क्रमांक & 0xF).toString(2).padStart(4, '0');
    } else if (नि.संचायक_रूप) {
      निम्न_निबल = "0000";
    } else {
      const गन्तव्य = (नि.गन्तव्य || 0) & 0x3;
      const स्रोत = (नि.स्रोत || 0) & 0x3;
      निम्न_निबल = ((गन्तव्य << 2) | स्रोत).toString(2).padStart(4, '0');
    }
    return `${उच्च_निबल} ${निम्न_निबल}`;
  }

  // एकल पद चालनम् (Step single instruction)
  function पद_चालनम्() {
    if (कार्यक्रम_गणक >= 16) {
      लॉग_योजनम्("End of Instruction Memory reached (PC=16). Reset to restart.");
      स्वचालित_विराम();
      return;
    }

    const वर्तमान_निर्देश = स्मृति_दत्त[कार्यक्रम_गणक];
    निर्देश_पंजिका = वर्तमान_निर्देश;

    if (!वर्तमान_निर्देश || वर्तमान_निर्देश.प्रकार === 'NOP') {
      लॉग_योजनम्(`[PC=0x${कार्यक्रम_गणक.toString(16).toUpperCase()}] NOP instruction executed.`);
      कार्यक्रम_गणक = (कार्यक्रम_गणक + 1) % 16;
      वर्तमान_घटिका_चक्र++;
      तरंगरूप_इतिहास_योजनम्();
      पटल_अद्यतनम्();
      return;
    }

    if (वर्तमान_निर्देश.प्रकार === 'HALT') {
      लॉग_योजनम्(`[PC=0x${कार्यक्रम_गणक.toString(16).toUpperCase()}] 🛑 HALT encountered. Processor stopped.`);
      स्वचालित_विराम();
      पटल_अद्यतनम्();
      return;
    }

    // समयगणक अवरोध स्थिति परीक्षणम् (Hardware Timer Read Stall check)
    // If timer countdown is active, decrement by 1 each clock cycle and block PC advance until it reaches 0
    if (समयगणक_अवरोध_सक्रिय) {
      if (समयगणक_पंजिका > 0) {
        समयगणक_पंजिका--;
        पंजिका_दत्त[7] = समयगणक_पंजिका & 0x0F;
        लॉग_योजनम्(`⏳ TIMER STALL: Waiting for timer to hit 0 (Remaining: ${समयगणक_पंजिका}). Instruction held at PC=0x${कार्यक्रम_गणक.toString(16).toUpperCase()}`);
        if (समयगणक_पंजिका === 0) {
          समयगणक_अवरोध_सक्रिय = false;
          लॉग_योजनम्(`⏰ TIMER EXPIRED: Timer reached 0. Unblocking processor at PC=0x${कार्यक्रम_गणक.toString(16).toUpperCase()}`);
        }
        वर्तमान_घटिका_चक्र++;
        तरंगरूप_इतिहास_योजनम्();
        पटल_अद्यतनम्();
        return;
      }
    }

    // अग्रिम चक्रस्य निवेश स्थिति स्वीकरणम् (Sample external waveform inputs for current cycle)
    if (वर्तमान_घटिका_चक्र < तरंगरूप_इतिहास.length) {
      const काल_तरंग_मान = तरंगरूप_इतिहास[वर्तमान_घटिका_चक्र];
      // Pins with OE = 0 (input mode) take their value from waveform timeline at this cycle
      for (let पि = 0; पि < 4; पि++) {
        if (!((पिन_सक्रियता_पंजिका >> पि) & 1)) {
          const इनपुट_बिट = (काल_तरंग_मान >> पि) & 1;
          if (इनपुट_बिट) {
            पिन_स्थिति_पंजिका |= (1 << पि);
          } else {
            पिन_स्थिति_पंजिका &= ~(1 << पि);
          }
        }
      }
      पिन_पठन_पंजिका = पिन_स्थिति_पंजिका & 0x0F;
    }

    // ALU व प्रक्रमक निष्पादनम् (Execute)
    const कूर्दन_लक्षित = निष्पादित_निर्देश(वर्तमान_निर्देश);

    // घटिका चक्र गणक वृद्धि (Increment executed clock cycle)
    वर्तमान_घटिका_चक्र++;

    // घटिका चक्र नमूना संग्रह (Record clock transition in waveform if beyond pre-allocated timeline)
    if (वर्तमान_घटिका_चक्र >= तरंगरूप_इतिहास.length) {
      तरंगरूप_इतिहास_योजनम्();
    } else {
      // Update actual driven pins into waveform history for driven bits
      तरंगरूप_इतिहास[वर्तमान_घटिका_चक्र - 1] = पिन_स्थिति_पंजिका & 0x0F;
      तरंगरूप_सक्रियता_इतिहास[वर्तमान_घटिका_चक्र - 1] = पिन_सक्रियता_पंजिका & 0x0F;
    }

    // यदि कूर्दन निष्पादितम् तर्हि कार्यक्रम गणक अद्यतनम् अन्यथा अग्रिम पदम्
    if (कूर्दन_लक्षित !== null && कूर्दन_लक्षित !== undefined) {
      कार्यक्रम_गणक = कूर्दन_लक्षित % 16;
    } else {
      कार्यक्रम_गणक = (कार्यक्रम_गणक + 1) % 16;
    }
    पटल_अद्यतनम्();
  }

  // निर्देश निष्पादन तर्क (Execute instruction)
  function निष्पादित_निर्देश(नि) {
    const ग = नि.गन्तव्य !== undefined ? नि.गन्तव्य : 0;
    const स्रो = नि.स्रोत !== undefined ? नि.स्रोत : (नि.संचायक_रूप ? 1 : 0);
    const मान_क = पंजिका_दत्त[ग];
    const मान_ख = नि.संचायक_रूप ? (गणित_पंजिका_ख & 0x0F) : पंजिका_दत्त[स्रो];

    let परिणाम = 0;
    let कैरी = false;

    // गणना यन्त्र सक्रिय प्रभाव
    const गणना_पिण्ड = document.getElementById('गणना-यन्त्र-पिण्ड');
    if (गणना_पिण्ड) {
      गणना_पिण्ड.classList.add('सक्रिय-संक्रिया');
      setTimeout(() => गणना_पिण्ड.classList.remove('सक्रिय-संक्रिया'), 350);
    }

    switch (नि.प्रकार) {
      case 'LOAD':
        पंजिका_दत्त[ग] = नि.स्थिर & 0x0F;
        लॉग_योजनम्(`LOAD: Loaded value ${पंजिका_दत्त[ग]} into R${ग}`);
        पंजिका_प्रभाव(ग);
        return null;

      case 'LOADI':
        पंजिका_दत्त[0] = नि.स्थिर & 0x0F;
        लॉग_योजनम्(`LOADI: Loaded 8-bit immediate #${नि.स्थिर} into ACC/R0 (${पंजिका_दत्त[0]})`);
        पंजिका_प्रभाव(0);
        return null;

      case 'LOADIB':
        गणित_पंजिका_ख = नि.स्थिर & 0xFF;
        पंजिका_दत्त[1] = नि.स्थिर & 0x0F;
        लॉग_योजनम्(`LOADIB: Loaded immediate #${नि.स्थिर} into register B (${गणित_पंजिका_ख})`);
        पंजिका_प्रभाव(1);
        return null;

      case 'MEM_LOAD':
        {
          let लोड_मान = 0;
          if (नि.पता === 0x6 || नि.पता === 0x4) {
            // Address 0x6 or R4: Read physical PIN_STATE into ACC
            लोड_मान = पिन_पठन_पंजिका & 0x0F;
            लॉग_योजनम्(`LOAD: Read PIN_IN / R4 (0x6) [${लोड_मान}] into ACC/R0`);
          } else if (नि.पता === 0xF || नि.पता === 0x5) {
            // Address 0xF or R5: Read PIN_EN / PIN_DIR
            लोड_मान = पिन_सक्रियता_पंजिका & 0x0F;
            लॉग_योजनम्(`LOAD: Read PIN_EN / R5 (0xF) [${लोड_मान}] into ACC/R0`);
          } else if (नि.पता === 0x7) {
            // Address 0x7 or R7: Read TIMER_L
            // If timer > 0, stall next instruction until timer reaches 0
            if (समयगणक_पंजिका > 0) {
              समयगणक_अवरोध_सक्रिय = true;
              लॉग_योजनम्(`⏳ TIMER READ (0x7/R7): Initiated Hardware Timer Stall (Countdown: ${समयगणक_पंजिका}). CPU blocked until 0.`);
              लोड_मान = समयगणक_पंजिका & 0x0F;
            } else {
              लोड_मान = 0;
              लॉग_योजनम्(`LOAD: Read TIMER_L (0x7/R7) [0] (Timer already 0, no stall).`);
            }
          } else {
            लोड_मान = आंकड़ा_स्मृति_दत्त[नि.पता] & 0x0F;
            लॉग_योजनम्(`LOAD: Loaded from Memory[0x${नि.पता.toString(16).toUpperCase()}] (${लोड_मान}) into ACC/R0`);
          }
          पंजिका_दत्त[0] = लोड_मान;
          पंजिका_प्रभाव(0);
          return null;
        }

      case 'STORE':
        {
          const संग्रह_मान = पंजिका_दत्त[0] & 0x0F;
          if (नि.पता === 0x6 || नि.पता === 0x6) {
            // Address 0x6 or R6: Write ACC into PIN_OUT register and drive enabled pins
            पिन_लेखन_पंजिका = संग्रह_मान;
            पिन_दिशा_पंजिका |= (पिन_सक्रियता_पंजिका & 0x0F);
            // Drive pins where enable bit is 1
            पिन_स्थिति_पंजिका = (पिन_स्थिति_पंजिका & ~पिन_सक्रियता_पंजिका) | (पिन_लेखन_पंजिका & पिन_सक्रियता_पंजिका);
            पिन_पठन_पंजिका = पिन_स्थिति_पंजिका & 0x0F;
            तरंगरूप_इतिहास_योजनम्();
            लॉग_योजनम्(`STORE: Wrote ACC (${संग्रह_मान}) to PIN_OUT / R6. Driven Pins: 0x${(पिन_स्थिति_पंजिका & 0x0F).toString(16).toUpperCase()}`);
          } else if (नि.पता === 0xF || नि.पता === 0x5) {
            // Address 0xF or R5: Write ACC into PIN_EN / PIN_DIR register
            पिन_सक्रियता_पंजिका = संग्रह_मान;
            पिन_दिशा_पंजिका = संग्रह_मान;
            लॉग_योजनम्(`STORE: Wrote ACC (${संग्रह_मान}) to PIN_EN / R5. Enabled Mask: 0x${पिन_सक्रियता_पंजिका.toString(16).toUpperCase()}`);
          } else if (नि.पता === 0x7 || नि.पता === 0x8) {
            // Address 0x7 / 0x8 or R7: Write timer initial countdown value
            समयगणक_पंजिका = संग्रह_मान;
            पंजिका_दत्त[7] = संग्रह_मान;
            लॉग_योजनम्(`STORE: Initialized Hardware Timer (R7/0x7) to ${संग्रह_मान} cycles.`);
          } else {
            आंकड़ा_स्मृति_दत्त[नि.पता] = संग्रह_मान;
            लॉग_योजनम्(`STORE: Stored ACC/R0 value (${संग्रह_मान}) into Memory[0x${नि.पता.toString(16).toUpperCase()}]`);
          }
          return null;
        }

      case 'SET0':
        {
          पिन_दिशा_पंजिका |= (1 << नि.पिन);
          पिन_स्थिति_पंजिका &= ~(1 << नि.पिन);
          तरंगरूप_इतिहास_योजनम्();
          लॉग_योजनम्(`SET0: Pin ${नि.पिन} actively driven LOW (0)`);
          return null;
        }

      case 'SET1':
        {
          पिन_दिशा_पंजिका |= (1 << नि.पिन);
          पिन_स्थिति_पंजिका |= (1 << नि.पिन);
          तरंगरूप_इतिहास_योजनम्();
          लॉग_योजनम्(`SET1: Pin ${नि.पिन} actively driven HIGH (1)`);
          return null;
        }

      case 'JMP':
        {
          const गन्तव्य_स्थान = कूर्दन_सारणी_दत्त[नि.तालिका_क्रमांक] & 0x0F;
          लॉग_योजनम्(`JMP: Unconditional branch via Jump Table[${नि.तालिका_क्रमांक}] -> 0x${गन्तव्य_स्थान.toString(16).toUpperCase()}`);
          return गन्तव्य_स्थान;
        }

      case 'JMPNZ':
        {
          if (!शून्य_ध्वजा) {
            const गन्तव्य_स्थान = कूर्दन_सारणी_दत्त[नि.तालिका_क्रमांक] & 0x0F;
            लॉग_योजनम्(`JMPNZ: Zero Flag == 0 -> Branch via Jump Table[${नि.तालिका_क्रमांक}] -> 0x${गन्तव्य_स्थान.toString(16).toUpperCase()}`);
            return गन्तव्य_स्थान;
          } else {
            लॉग_योजनम्(`JMPNZ: Zero Flag == 1 -> No branch taken.`);
            return null;
          }
        }

      case 'JMPC':
        {
          if (हासिल_ध्वजा) {
            const गन्तव्य_स्थान = कूर्दन_सारणी_दत्त[नि.तालिका_क्रमांक] & 0x0F;
            लॉग_योजनम्(`JMPC: Carry Flag == 1 -> Branch via Jump Table[${नि.तालिका_क्रमांक}] -> 0x${गन्तव्य_स्थान.toString(16).toUpperCase()}`);
            return गन्तव्य_स्थान;
          } else {
            लॉग_योजनम्(`JMPC: Carry Flag == 0 -> No branch taken.`);
            return null;
          }
        }

      case 'SUB':
        {
          const घट_मान = मान_क - मान_ख;
          परिणाम = (घट_मान + 16) & 0x0F;
          कैरी = मान_क >= मान_ख;
          अलु_प्रदर्शन_अद्यतन("SUB (A - B)", मान_क, मान_ख, परिणाम, कैरी, ग, नि.संचायक_रूप ? 1 : स्रो);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = कैरी;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`SUB: R${ग} (${मान_क}) - ${नि.संचायक_रूप ? 'B' : 'R' + स्रो} (${मान_ख}) = ${परिणाम} [Carry=${कैरी ? 1 : 0}, Zero=${शून्य_ध्वजा ? 1 : 0}]`);
          पंजिका_प्रभाव(ग);
          return null;
        }

      case 'MOV':
        // If destination is R7 (TIMER), set the timer value
        if (ग === 7) {
          समयगणक_पंजिका = मान_ख & 0x0F;
          लॉग_योजनम्(`TIMER SET (R7): Configured hardware timer to ${समयगणक_पंजिका} cycles.`);
        } else if (ग === 6) {
          // R6 = PIN_OUT
          पिन_लेखन_पंजिका = मान_ख & 0x0F;
          if (पिन_सक्रियता_पंजिका) {
            पिन_स्थिति_पंजिका = (पिन_स्थिति_पंजिका & ~पिन_सक्रियता_पंजिका) | (पिन_लेखन_पंजिका & पिन_सक्रियता_पंजिका);
            पिन_पठन_पंजिका = पिन_स्थिति_पंजिका & 0x0F;
          }
        } else if (ग === 5) {
          // R5 = PIN_EN
          पिन_सक्रियता_पंजिका = मान_ख & 0x0F;
          पिन_दिशा_पंजिका = पिन_सक्रियता_पंजिका;
        }

        पंजिका_दत्त[ग] = मान_ख & 0x0F;
        लॉग_योजनम्(`MOV: Copied R${स्रो} (${मान_ख}) to R${ग}`);

        // If source is R7 (TIMER), reading it triggers countdown stall if timer > 0
        if (स्रो === 7) {
          if (समयगणक_पंजिका > 0) {
            समयगणक_अवरोध_सक्रिय = true;
            लॉग_योजनम्(`⏳ TIMER READ (R7): Triggered Hardware Timer Stall. Remaining: ${समयगणक_पंजिका}. Next instructions stalled.`);
          }
        }
        पंजिका_प्रभाव(ग);
        return null;

      case 'ADD':
        {
          const पूर्ण_योग = मान_क + मान_ख;
          परिणाम = पूर्ण_योग & 0x0F;
          कैरी = पूर्ण_योग > 15;
          अलु_प्रदर्शन_अद्यतन("ADD (A + B)", मान_क, मान_ख, परिणाम, कैरी, ग, नि.संचायक_रूप ? 1 : स्रो);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = कैरी;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`ADD: R${ग} (${मान_क}) + ${नि.संचायक_रूप ? 'B' : 'R' + स्रो} (${मान_ख}) = ${परिणाम} [Carry=${कैरी ? 1 : 0}, Zero=${शून्य_ध्वजा ? 1 : 0}]`);
          पंजिका_प्रभाव(ग);
          return null;
        }

      case 'AND':
        {
          परिणाम = (मान_क & मान_ख) & 0x0F;
          अलु_प्रदर्शन_अद्यतन("AND (A & B)", मान_क, मान_ख, परिणाम, false, ग, नि.संचायक_रूप ? 1 : स्रो);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = false;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`AND: R${ग} (${मान_क}) & ${नि.संचायक_रूप ? 'B' : 'R' + स्रो} (${मान_ख}) = ${परिणाम}`);
          पंजिका_प्रभाव(ग);
          return null;
        }

      case 'OR':
        {
          परिणाम = (मान_क | मान_ख) & 0x0F;
          अलु_प्रदर्शन_अद्यतन("OR (A | B)", मान_क, मान_ख, परिणाम, false, ग, स्रो);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = false;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`OR: R${ग} (${मान_क}) | R${स्रो} (${मान_ख}) = ${परिणाम}`);
          पंजिका_प्रभाव(ग);
          return null;
        }

      case 'NOT':
        {
          परिणाम = (~मान_क) & 0x0F;
          अलु_प्रदर्शन_अद्यतन("NOT (~A)", मान_क, 0, परिणाम, false, ग, null);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = false;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`NOT: ~R${ग} (~${मान_क}) = ${परिणाम}`);
          पंजिका_प्रभाव(ग);
          return null;
        }

      case 'XOR':
        {
          परिणाम = (मान_क ^ मान_ख) & 0x0F;
          अलु_प्रदर्शन_अद्यतन("XOR (A ^ B)", मान_क, मान_ख, परिणाम, false, ग, नि.संचायक_रूप ? 1 : स्रो);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = false;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`XOR: R${ग} (${मान_क}) ^ ${नि.संचायक_रूप ? 'B' : 'R' + स्रो} (${मान_ख}) = ${परिणाम}`);
          पंजिका_प्रभाव(ग);
          return null;
        }

      case 'SHL':
        {
          const पूर्ण_विस्थापन = मान_क << 1;
          परिणाम = पूर्ण_विस्थापन & 0x0F;
          कैरी = (मान_क & 0x8) !== 0; // MSB shifted into carry
          अलु_प्रदर्शन_अद्यतन("SHL (A << 1)", मान_क, 1, परिणाम, कैरी, ग, null);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = कैरी;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`SHL: R${ग} (${मान_क} << 1) = ${परिणाम} [Carry Out=${कैरी ? 1 : 0}]`);
          पंजिका_प्रभाव(ग);
          return null;
        }

      case 'SHR':
        {
          परिणाम = (मान_क >> 1) & 0x0F;
          कैरी = (मान_क & 0x1) !== 0; // LSB shifted into carry
          अलु_प्रदर्शन_अद्यतन("SHR (A >> 1)", मान_क, 1, परिणाम, कैरी, ग, null);
          पंजिका_दत्त[ग] = परिणाम;
          हासिल_ध्वजा = कैरी;
          शून्य_ध्वजा = परिणाम === 0;
          लॉग_योजनम्(`SHR: R${ग} (${मान_क} >> 1) = ${परिणाम} [Carry Out=${कैरी ? 1 : 0}]`);
          पंजिका_प्रभाव(ग);
          return null;
        }
    }

    पंजिका_प्रभाव(ग);
    return null;
  }

  // ALU दृश्य विवरण अद्यतनम् (Update ALU Visual Block)
  function अलु_प्रदर्शन_अद्यतन(संक्रिया_नाम, मान_क, मान_ख, परिणाम, कैरी, पंजिका_क, पंजिका_ख) {
    document.getElementById('संक्रिया-पाठ').textContent = संक्रिया_नाम;
    const द्विक_क = (मान_क & 0xF).toString(2).padStart(4, '0');
    const द्विक_ख = (मान_ख & 0xF).toString(2).padStart(4, '0');
    const द्विक_परिणाम = (परिणाम & 0xF).toString(2).padStart(4, '0');

    const नाम_क = पंजिका_क !== null ? `R${पंजिका_क}` : 'InA';
    const नाम_ख = पंजिका_ख !== null ? `R${पंजिका_ख}` : 'InB';

    document.getElementById('संकेतक-निवेश-क').textContent = `${नाम_क}: ${द्विक_क} (${मान_क})`;
    document.getElementById('संकेतक-निवेश-ख').textContent = `${नाम_ख}: ${द्विक_ख} (${मान_ख})`;
    document.getElementById('संकेतक-निर्गम').textContent = `Result Output: ${द्विक_परिणाम} (${परिणाम}) ${कैरी ? '• [CARRY]' : ''}`;
  }

  // पंजिका दीप्ति प्रभाव (Register Flash effect on write)
  function पंजिका_प्रभाव(पंजिका_सूचक) {
    const कार्ड = document.getElementById(`पंजिका-कार्ड-${संख्या_रूपान्तर(पंजिका_सूचक)}`);
    if (कार्ड) {
      कार्ड.classList.add('सक्रिय-परिवर्तन');
      setTimeout(() => कार्ड.classList.remove('सक्रिय-परिवर्तन'), 500);
    }
  }

  // स्वचालित चालनम् (Auto Run loop)
  function स्वचालित_चालनम्() {
    const कुञ्जी = document.getElementById('स्वचालित-चालन-कुञ्जी');
    const स्थिति_संकेतक = document.getElementById('घटिका-स्थिति');

    if (स्वचालित_चक्र) {
      स्वचालित_विराम();
    } else {
      कुञ्जी.textContent = "⏸ PAUSE";
      कुञ्जी.classList.add('क्रिया-कुञ्जी-संकट');
      const हर्ट्ज = (1000 / घटिका_काल_मिलीसेकंड).toFixed(1);
      स्थिति_संकेतक.textContent = `CLOCK: ${हर्ट्ज} Hz RUNNING`;
      स्थिति_संकेतक.style.color = "#34d399";
      लॉग_योजनम्(`Automatic Clock Started (Period: ${घटिका_काल_मिलीसेकंड} ms, ${हर्ट्ज} Hz).`);
      स्वचालित_चक्र = setInterval(() => {
        पद_चालनम्();
      }, घटिका_काल_मिलीसेकंड);
    }
  }

  // स्वचालित विराम (Pause Auto Run)
  function स्वचालित_विराम() {
    if (स्वचालित_चक्र) {
      clearInterval(स्वचालित_चक्र);
      स्वचालित_चक्र = null;
    }
    const कुञ्जी = document.getElementById('स्वचालित-चालन-कुञ्जी');
    कुञ्जी.textContent = "⚡ AUTO RUN";
    कुञ्जी.classList.remove('क्रिया-कुञ्जी-संकट');
    const स्थिति_संकेतक = document.getElementById('घटिका-स्थिति');
    स्थिति_संकेतक.textContent = "CLOCK: PAUSED";
    स्थिति_संकेतक.style.color = "#f59e0b";
  }

  // यन्त्र पुनःस्थापनम् (Reset Processor)
  function यन्त्र_पुनःस्थापनम्() {
    स्वचालित_विराम();
    पंजिका_दत्त = [0, 0, 0, 0, 0, 15, 0, 0];
    समयगणक_पंजिका = 0;
    समयगणक_अवरोध_सक्रिय = false;
    कार्यक्रम_गणक = 0;
    वर्तमान_घटिका_चक्र = 0;
    निर्देश_पंजिका = null;
    शून्य_ध्वजा = false;
    हासिल_ध्वजा = false;
    पिन_स्थिति_पंजिका = 0;
    पिन_दिशा_पंजिका = 0;
    पिन_पठन_पंजिका = 0;
    पिन_लेखन_पंजिका = 0;
    पिन_सक्रियता_पंजिका = 0b1111;
    तरंगरूप_इतिहास = new Array(10).fill(0);
    तरंगरूप_सक्रियता_इतिहास = new Array(10).fill(0b1111);
    लॉग_योजनम्("Processor hard reset executed. Registers, clock cycles, and flags cleared.");
    अलु_प्रदर्शन_अद्यतन("RESET", 0, 0, 0, false, 0, 1);
    पटल_अद्यतनम्();
  }

  // तात्कालिक निर्देश निष्पादनम् (Instantly execute single typed instruction without altering program memory)
  function तात्कालिक_निर्देश_निष्पादनम्() {
    const निवेश_तत्व = document.getElementById('तात्कालिक-निर्देश-निवेश');
    const प्रतिक्रिया_तत्व = document.getElementById('तात्कालिक-निर्देश-प्रतिक्रिया');
    if (!निवेश_तत्व) return;

    const कूट = निवेश_तत्व.value.trim();
    if (!कूट) {
      if (प्रतिक्रिया_तत्व) {
        प्रतिक्रिया_तत्व.textContent = "⚠️ Please enter an instruction (e.g. ADD, SUB, LOADI #5, SET1 2).";
        प्रतिक्रिया_तत्व.style.color = "#f87171";
      }
      return;
    }

    // Validate single instruction using validation engine
    const सत्यापन = निर्देश_संहिता_सत्यापनम्(कूट);
    if (!सत्यापन.सफलम्) {
      if (प्रतिक्रिया_तत्व) {
        प्रतिक्रिया_तत्व.textContent = `❌ ${सत्यापन.त्रुटयः[0]}`;
        प्रतिक्रिया_तत्व.style.color = "#f87171";
      }
      लॉग_योजनम्(`Instant Execution Failed: ${सत्यापन.त्रुटयः[0]}`);
      return;
    }

    const निर्देश = एकल_निर्देश_विश्लेषण(कूट);
    if (!निर्देश) {
      if (प्रतिक्रिया_तत्व) {
        प्रतिक्रिया_तत्व.textContent = `❌ Could not parse instruction '${कूट}'.`;
        प्रतिक्रिया_तत्व.style.color = "#f87171";
      }
      return;
    }

    // Advance clock cycle for live execution trace
    वर्तमान_घटिका_चक्र++;
    if (वर्तमान_घटिका_चक्र >= तरंगरूप_इतिहास.length) {
      तरंगरूप_इतिहास_योजनम्();
    } else {
      तरंगरूप_इतिहास[वर्तमान_घटिका_चक्र - 1] = पिन_स्थिति_पंजिका & 0x0F;
      तरंगरूप_सक्रियता_इतिहास[वर्तमान_घटिका_चक्र - 1] = पिन_सक्रियता_पंजिका & 0x0F;
    }

    // Execute instruction
    const कूर्दन_लक्षित = निष्पादित_निर्देश(निर्देश);
    if (कूर्दन_लक्षित !== null && कूर्दन_लक्षित !== undefined) {
      कार्यक्रम_गणक = कूर्दन_लक्षित % 16;
      लॉग_योजनम्(`Instant instruction branched PC to 0x${कार्यक्रम_गणक.toString(16).toUpperCase()}`);
    }

    // Update IR display
    निर्देश_पंजिका = निर्देश;

    if (प्रतिक्रिया_तत्व) {
      प्रतिक्रिया_तत्व.textContent = `✅ Executed: '${कूट.toUpperCase()}' | ACC(R0)=${पंजिका_दत्त[0]}, B(R1)=${पंजिका_दत्त[1]} [CF=${हासिल_ध्वजा ? 1 : 0}, ZF=${शून्य_ध्वजा ? 1 : 0}]`;
      प्रतिक्रिया_तत्व.style.color = "#34d399";
    }

    लॉग_योजनम्(`⚡ Instant Execution: '${कूट.toUpperCase()}' completed successfully.`);
    पटल_अद्यतनम्();
  }

  // प्रत्यक्ष संक्रिया परीक्षण (Direct ALU Operations Testing)
  function प्रत्यक्ष_संक्रिया_परीक्षण(संक्रिया) {
    // संक्रिया बटनों की सक्रिय श्रेणी अद्यतन
    const संक्रिया_बटन = document.querySelectorAll('.संक्रिया-कुञ्जी');
    संक्रिया_बटन.forEach(बटन => {
      if (बटन.textContent.includes(संक्रिया)) बटन.classList.add('सक्रिय');
      else बटन.classList.remove('सक्रिय');
    });

    if (संक्रिया === 'CLR') {
      पंजिका_दत्त[0] = 0;
      अलु_प्रदर्शन_अद्यतन("CLEAR", 0, 0, 0, false, 0, null);
      शून्य_ध्वजा = true;
      हासिल_ध्वजा = false;
      लॉग_योजनम्("Direct ALU Test: Cleared R0 to 0.");
      पटल_अद्यतनम्();
      return;
    }

    // Execute simulated ALU instruction on R0 using R1
    const फर्जी_निर्देश = {
      प्रकार: संक्रिया,
      गन्तव्य: 0,
      स्रोत: 1
    };
    लॉग_योजनम्(`Direct ALU Operation Triggered: ${संक्रिया} on R0 & R1`);
    निष्पादित_निर्देश(फर्जी_निर्देश);
    पटल_अद्यतनम्();
  }

  // बिट परिवर्तनम् (Toggle Bit via click)
  function बिट_परिवर्तनम्(पंजिका_सूचक, बिट_क्रमांक) {
    पंजिका_दत्त[पंजिका_सूचक] ^= (1 << बिट_क्रमांक);
    लॉग_योजनम्(`Bit ${बिट_क्रमांक} toggled in R${पंजिका_सूचक}. New value: ${पंजिका_दत्त[पंजिका_सूचक]}`);
    पटल_अद्यतनम्();
  }

  // समयगणक परिवर्तनम् (Toggle bit in Timer R7 directly)
  function समयगणक_परिवर्तनम्(बिट_क्रमांक) {
    समयगणक_पंजिका ^= (1 << बिट_क्रमांक);
    पंजिका_दत्त[7] = समयगणक_पंजिका & 0x0F;
    लॉग_योजनम्(`TIMER (R7): Bit ${बिट_क्रमांक} toggled. Timer value = ${समयगणक_पंजिका}`);
    पटल_अद्यतनम्();
  }

  // द्रुत पंजिका स्थापन (Set direct value into register)
  function द्रुत_पंजिका_स्थापनम्() {
    const पंजिका_सूचक = parseInt(document.getElementById('द्रुत-पंजिका-चयन').value, 10);
    const मान = parseInt(document.getElementById('द्रुत-मूल्य-निवेश').value, 10);
    const वैध_मान = Math.max(0, Math.min(15, isNaN(मान) ? 0 : मान));
    पंजिका_दत्त[पंजिका_सूचक] = वैध_मान;
    if (पंजिका_सूचक === 1) {
      गणित_पंजिका_ख = वैध_मान;
    } else if (पंजिका_सूचक === 4) {
      पिन_पठन_पंजिका = वैध_मान;
    } else if (पंजिका_सूचक === 5) {
      पिन_सक्रियता_पंजिका = वैध_मान;
    } else if (पंजिका_सूचक === 6) {
      पिन_लेखन_पंजिका = वैध_मान;
    } else if (पंजिका_सूचक === 7) {
      समयगणक_पंजिका = वैध_मान;
    }
    लॉग_योजनम्(`Direct Set: R${पंजिका_सूचक} = ${वैध_मान}`);
    पंजिका_प्रभाव(पंजिका_सूचक);
    पटल_अद्यतनम्();
  }

  // पिन स्थिति परिवर्तनम् (Toggle Physical Pin State manually)
  function पिन_परिवर्तनम्(पिन_क्रमांक) {
    // If output enable is 1, the pin is driven by the processor output, block external toggle
    if ((पिन_सक्रियता_पंजिका >> पिन_क्रमांक) & 1) {
      लॉग_योजनम्(`⚠️ PIN ${पिन_क्रमांक} has Output Enable = 1 (Driven by PIN_OUT). External toggle blocked.`);
      return;
    }

    पिन_दिशा_पंजिका |= (1 << पिन_क्रमांक);
    पिन_स्थिति_पंजिका ^= (1 << पिन_क्रमांक);
    पिन_पठन_पंजिका = पिन_स्थिति_पंजिका & 0x0F;
    const नूतन_मान = (पिन_स्थिति_पंजिका >> पिन_क्रमांक) & 1;
    तरंगरूप_इतिहास_योजनम्();
    लॉग_योजनम्(`GPIO Pin ${पिन_क्रमांक} manually toggled to ${नूतन_मान}`);
    पटल_अद्यतनम्();
  }

  // पिन पंजिका बिट परिवर्तनम् (Toggle bit in PIN_IN, PIN_OUT or PIN_EN)
  function पिन_पंजिका_बिट_परिवर्तनम्(पंजिका_प्रकार, बिट_क्रमांक) {
    if (पंजिका_प्रकार === 'पठन') {
      // PIN_IN is a read-only input status register; toggle is blocked
      लॉग_योजनम्(`⚠️ PIN_IN is a Read-Only Register (Status of physical pins). Direct manual bit toggling is blocked.`);
      return;
    } else if (पंजिका_प्रकार === 'लेखन') {
      पिन_लेखन_पंजिका ^= (1 << बिट_क्रमांक);
      // Drive to physical pin if enabled
      if ((पिन_सक्रियता_पंजिका >> बिट_क्रमांक) & 1) {
        पिन_स्थिति_पंजिका = (पिन_स्थिति_पंजिका & ~(1 << बिट_क्रमांक)) | (पिन_लेखन_पंजिका & (1 << बिट_क्रमांक));
        पिन_पठन_पंजिका = पिन_स्थिति_पंजिका & 0x0F;
      }
      लॉग_योजनम्(`PIN_OUT: Bit ${बिट_क्रमांक} toggled. PIN_OUT = ${पिन_लेखन_पंजिका}`);
    } else if (पंजिका_प्रकार === 'सक्रियता') {
      पिन_सक्रियता_पंजिका ^= (1 << बिट_क्रमांक);
      पिन_दिशा_पंजिका = पिन_सक्रियता_पंजिका & 0x0F;
      // Re-apply write register to pin state for enabled bits
      पिन_स्थिति_पंजिका = (पिन_स्थिति_पंजिका & ~पिन_सक्रियता_पंजिका) | (पिन_लेखन_पंजिका & पिन_सक्रियता_पंजिका);
      पिन_पठन_पंजिका = पिन_स्थिति_पंजिका & 0x0F;
      // Future cycles in the waveform timeline also inherit updated PIN_EN
      for (let च = वर्तमान_घटिका_चक्र; च < तरंगरूप_सक्रियता_इतिहास.length; च++) {
        if ((पिन_सक्रियता_पंजिका >> बिट_क्रमांक) & 1) {
          तरंगरूप_सक्रियता_इतिहास[च] |= (1 << बिट_क्रमांक);
        } else {
          तरंगरूप_सक्रियता_इतिहास[च] &= ~(1 << बिट_क्रमांक);
        }
      }
      लॉग_योजनम्(`PIN_EN: Bit ${बिट_क्रमांक} toggled. PIN_EN = ${पिन_सक्रियता_पंजिका}`);
    }
    तरंगरूप_इतिहास_योजनम्();
    पटल_अद्यतनम्();
  }

  // तरंगरूप इतिहास योजनम् (Append pin state snapshot to waveform history)
  function तरंगरूप_इतिहास_योजनम्() {
    तरंगरूप_इतिहास.push(पिन_स्थिति_पंजिका & 0xFF);
    तरंगरूप_सक्रियता_इतिहास.push(पिन_सक्रियता_पंजिका & 0x0F);
    if (तरंगरूप_इतिहास.length > अधिकतम_तरंगरूप_नमूना) {
      तरंगरूप_इतिहास.shift();
      तरंगरूप_सक्रियता_इतिहास.shift();
    }
  }

  // घटिका चक्र योजनम् (Add Clock Period at the end of timeline)
  function घटिका_चक्र_योजनम्() {
    const अन्तिम_मान = तरंगरूप_इतिहास.length > 0 ? तरंगरूप_इतिहास[तरंगरूप_इतिहास.length - 1] : (पिन_स्थिति_पंजिका & 0x0F);
    const अन्तिम_सक्रियता = तरंगरूप_सक्रियता_इतिहास.length > 0 ? तरंगरूप_सक्रियता_इतिहास[तरंगरूप_सक्रियता_इतिहास.length - 1] : (पिन_सक्रियता_पंजिका & 0x0F);
    तरंगरूप_इतिहास.push(अन्तिम_मान);
    तरंगरूप_सक्रियता_इतिहास.push(अन्तिम_सक्रियता);
    const नूतन_चक्र = तरंगरूप_इतिहास.length;
    लॉग_योजनम्(`Clock Period added: T${नूतन_चक्र} added to waveform timeline.`);
    पटल_अद्यतनम्();

    // Scroll to the end to view the newly added clock period
    setTimeout(() => {
      const पात्र = document.getElementById('तरंगरूप-पात्र');
      if (पात्र) {
        पात्र.scrollLeft = पात्र.scrollWidth;
      }
    }, 50);
  }

  // तरंगरूप छवि अवरोहणम् (Save Waveform trace as PNG image directly to computer)
  function तरंगरूप_छवि_अवरोहणम्() {
    const चित्रफलक = document.getElementById('तरंगरूप-चित्रफलक');
    if (!चित्रफलक) return;

    const सम्बन्ध = document.createElement('a');
    सम्बन्ध.download = 'cpu_waveform_trace.png';
    सम्बन्ध.href = चित्रफलक.toDataURL('image/png');
    document.body.appendChild(सम्बन्ध);
    सम्बन्ध.click();
    document.body.removeChild(सम्बन्ध);
    लॉग_योजनम्("Waveform trace saved as PNG image to computer.");
  }

  // तरंगरूप दत्तांश निर्माणम् (Build Timing Diagram compatible waveform data object)
  function तरंगरूप_दत्तांश_निर्माणम्() {
    const कुल_नमूना_संख्या = Math.max(10, तरंगरूप_इतिहास.length);
    const संकेत_तालिका = [];

    // 1. CLK Signal: width 1, square wave toggling each half-cycle
    const घटी_खण्ड = [];
    for (let चक्र = 0; चक्र < कुल_नमूना_संख्या; चक्र++) {
      घटी_खण्ड.push({ start: चक्र, end: चक्र + 0.5, value: '1' });
      घटी_खण्ड.push({ start: चक्र + 0.5, end: चक्र + 1, value: '0' });
    }
    संकेत_तालिका.push({
      id: 'sig_clk',
      name: 'CLK',
      width: 1,
      radix: 'binary',
      pieces: घटी_खण्ड
    });

    // 2. 4-bit GPIO Data Bus: width 4, radix hex
    const बस_खण्ड = [];
    for (let चक्र = 0; चक्र < कुल_नमूना_संख्या; चक्र++) {
      const मूल्य = (चक्र < तरंगरूप_इतिहास.length) ? (तरंगरूप_इतिहास[चक्र] & 0x0F) : 0;
      const षोडश_मूल्य = '0x' + मूल्य.toString(16).toUpperCase();
      const पूर्व_खण्ड = बस_खण्ड.length > 0 ? बस_खण्ड[बस_खण्ड.length - 1] : null;
      if (पूर्व_खण्ड && पूर्व_खण्ड.value === षोडश_मूल्य) {
        पूर्व_खण्ड.end = चक्र + 1;
      } else {
        बस_खण्ड.push({ start: चक्र, end: चक्र + 1, value: षोडश_मूल्य });
      }
    }
    संकेत_तालिका.push({
      id: 'sig_gpio_bus',
      name: 'GPIO[3:0]',
      width: 4,
      radix: 'hex',
      pieces: बस_खण्ड
    });

    // 3. Individual GPIO Pins: PIN 3 down to PIN 0
    for (let पिन = 3; पिन >= 0; पिन--) {
      const पिन_खण्ड = [];
      for (let चक्र = 0; चक्र < कुल_नमूना_संख्या; चक्र++) {
        const नमूना = (चक्र < तरंगरूप_इतिहास.length) ? तरंगरूप_इतिहास[चक्र] : 0;
        const बिट = String((नमूना >> पिन) & 1);
        const पूर्व_खण्ड = पिन_खण्ड.length > 0 ? पिन_खण्ड[पिन_खण्ड.length - 1] : null;
        if (पूर्व_खण्ड && पूर्व_खण्ड.value === बिट) {
          पूर्व_खण्ड.end = चक्र + 1;
        } else {
          पिन_खण्ड.push({ start: चक्र, end: चक्र + 1, value: बिट });
        }
      }
      संकेत_तालिका.push({
        id: 'sig_pin_' + पिन,
        name: 'PIN_' + पिन,
        width: 1,
        radix: 'binary',
        pieces: पिन_खण्ड
      });
    }

    return {
      स्रोत: 'cpu_architecture',
      तरंगदैर्घ्यम्: कुल_नमूना_संख्या,
      समयमापकः: 1,
      समयैकम्: 'ns',
      सङ्केताः: संकेत_तालिका,
      संकेताः: संकेत_तालिका,
      signals: संकेत_तालिका,
      कालचिह्नम्: Date.now()
    };
  }

  // तरंगरूप संचिका अवरोहणम् (Save Waveform Trace directly to .tr file on user computer)
  function तरंगरूप_संचिका_अवरोहणम्() {
    const दत्तांश = तरंगरूप_दत्तांश_निर्माणम्();
    const सूत्र = JSON.stringify(दत्तांश, null, 2);
    const पिण्ड = new Blob([सूत्र], { type: 'application/json' });
    const सम्बन्ध = document.createElement('a');
    सम्बन्ध.download = 'cpu_waveform_trace.tr';
    सम्बन्ध.href = URL.createObjectURL(पिण्ड);
    document.body.appendChild(सम्बन्ध);
    सम्बन्ध.click();
    document.body.removeChild(सम्बन्ध);
    URL.revokeObjectURL(सम्बन्ध.href);
    लॉग_योजनम्(`Waveform trace exported and saved as cpu_waveform_trace.tr file.`);
  }

  // समयचित्रे तरंगरूप प्रेषणम् (Save CPU waveform data to storage and open in Timing Diagram Tool)
  function समयचित्रे_तरंगरूप_प्रेषणम्() {
    const प्रेषित_तरंग_दत्तांश = तरंगरूप_दत्तांश_निर्माणम्();
    const कुल_नमूना_संख्या = प्रेषित_तरंग_दत्तांश.तरंगदैर्घ्यम्;

    try {
      localStorage.setItem('पिभट्_तरंगदत्तांशः', JSON.stringify(प्रेषित_तरंग_दत्तांश));
      लॉग_योजनम्(`Waveform (${कुल_नमूना_संख्या} cycles, 6 signals) stored. Opening Timing Diagram Tool...`);
    } catch (दोष) {
      console.error(दोष);
    }

    // Open Timing Diagram in new tab
    window.open('../timing_diagram/timing_diagram.html?load_cpu_waveform=1', '_blank');
  }

  // तरंगरूप स्वच्छीकरणम् (Clear waveform history)
  function तरंगरूप_स्वच्छीकरणम्() {
    तरंगरूप_इतिहास = new Array(10).fill(पिन_स्थिति_पंजिका & 0x0F);
    तरंगरूप_सक्रियता_इतिहास = new Array(10).fill(पिन_सक्रियता_पंजिका & 0x0F);
    तरंगरूप_अंकनम्();
    लॉग_योजनम्("GPIO waveform buffer cleared.");
  }

  // तरंगरूप चित्रफलक अंकनम् (Draw digital waveform trace on Canvas with CLK & 4 Pins)
  function तरंगरूप_अंकनम्() {
    const चित्रफलक = document.getElementById('तरंगरूप-चित्रफलक');
    if (!चित्रफलक) return;

    // Ensure at least 10 clock periods are always available
    const प्रदर्शन_नमूना_संख्या = Math.max(10, तरंगरूप_इतिहास.length);
    const प्रारम्भ_क्ष = 100;
    const कदम_विस्तार = 80; // 80px per clock cycle
    const आवश्यक_विस्तार = प्रारम्भ_क्ष + (प्रदर्शन_नमूना_संख्या * कदम_विस्तार) + 40;

    if (चित्रफलक.width !== आवश्यक_विस्तार) {
      चित्रफलक.width = आवश्यक_विस्तार;
    }

    const संदर्भ = चित्रफलक.getContext('2d');
    const विस्तार = चित्रफलक.width;
    const उच्चता = चित्रफलक.height;

    // Background
    संदर्भ.fillStyle = "#030712";
    संदर्भ.fillRect(0, 0, विस्तार, उच्चता);

    // 5 Channels: CLK (index 0) + 4 GPIO Pins (PIN 3, 2, 1, 0)
    const पंक्ति_उच्चता = Math.floor(उच्चता / 5);

    // Timeline grid & cycle markers
    for (let ग्रि = 0; ग्रि < प्रदर्शन_नमूना_संख्या; ग्रि++) {
      const क्ष = प्रारम्भ_क्ष + (ग्रि * कदम_विस्तार);

      // Grid line for rising edge of clock
      संदर्भ.strokeStyle = "rgba(255, 255, 255, 0.07)";
      संदर्भ.lineWidth = 1;
      संदर्भ.beginPath();
      संदर्भ.moveTo(क्ष, 0);
      संदर्भ.lineTo(क्ष, उच्चता);
      संदर्भ.stroke();

      // Cycle number header label at top
      संदर्भ.fillStyle = "#6366f1";
      संदर्भ.font = "10px 'Fira Code', monospace";
      संदर्भ.fillText(`T${ग्रि + 1}`, क्ष + (कदम_विस्तार / 2) - 8, 12);
    }

    // 1. Draw CLOCK Waveform (Row 0)
    const क्लॉक_आधार_य = 0;
    const क्लॉक_निम्न_य = क्लॉक_आधार_य + पंक्ति_उच्चता - 6;
    const क्लॉक_उच्च_य = क्लॉक_आधार_य + 16;

    // CLK Divider line
    संदर्भ.strokeStyle = "rgba(99, 102, 241, 0.25)";
    संदर्भ.lineWidth = 1;
    संदर्भ.beginPath();
    संदर्भ.moveTo(0, क्लॉक_आधार_य + पंक्ति_उच्चता);
    संदर्भ.lineTo(विस्तार, क्लॉक_आधार_य + पंक्ति_उच्चता);
    संदर्भ.stroke();

    // CLK Label
    संदर्भ.fillStyle = "#fbbf24";
    संदर्भ.font = "bold 11px 'Fira Code', monospace";
    संदर्भ.fillText("CLK [T]", 8, क्लॉक_आधार_य + पंक्ति_उच्चता / 2 + 5);

    // CLK Square Waveform
    संदर्भ.strokeStyle = "#f59e0b";
    संदर्भ.lineWidth = 2.5;
    संदर्भ.beginPath();

    for (let न = 0; न < प्रदर्शन_नमूना_संख्या; न++) {
      const सुरु_क्ष = प्रारम्भ_क्ष + (न * कदम_विस्तार);
      const मध्य_क्ष = सुरु_क्ष + (कदम_विस्तार / 2);
      const अन्त्य_क्ष = सुरु_क्ष + कदम_विस्तार;

      if (न === 0) {
        संदर्भ.moveTo(सुरु_क्ष, क्लॉक_निम्न_य);
      }
      // Rising edge -> HIGH -> Falling edge -> LOW
      संदर्भ.lineTo(सुरु_क्ष, क्लॉक_उच्च_य);
      संदर्भ.lineTo(मध्य_क्ष, क्लॉक_उच्च_य);
      संदर्भ.lineTo(मध्य_क्ष, क्लॉक_निम्न_य);
      संदर्भ.lineTo(अन्त्य_क्ष, क्लॉक_निम्न_य);
    }
    संदर्भ.stroke();

    // 2. Draw 4 GPIO Data Pins (PIN 3 down to PIN 0)
    const प्रदर्शित_पिन = [3, 2, 1, 0];
    प्रदर्शित_पिन.forEach((पिन, सूचकांक) => {
      const पंक्ति_क्रमांक = सूचकांक + 1; // 1 to 4
      const आधार_य = पंक्ति_क्रमांक * पंक्ति_उच्चता;
      const निम्न_य = आधार_य + पंक्ति_उच्चता - 6;
      const उच्च_य = आधार_य + 8;

      // Divider grid line
      संदर्भ.strokeStyle = "rgba(99, 102, 241, 0.15)";
      संदर्भ.lineWidth = 1;
      संदर्भ.beginPath();
      संदर्भ.moveTo(0, आधार_य + पंक्ति_उच्चता);
      संदर्भ.lineTo(विस्तार, आधार_य + पंक्ति_उच्चता);
      संदर्भ.stroke();

      // Pin label
      const वर्तमान_मान = (पिन_स्थिति_पंजिका >> पिन) & 1;
      const दिशा_बिट = (पिन_दिशा_पंजिका >> पिन) & 1;
      संदर्भ.fillStyle = वर्तमान_मान ? "#34d399" : "#94a3b8";
      संदर्भ.font = "bold 11px 'Fira Code', monospace";
      संदर्भ.fillText(`PIN ${पिन} [${दिशा_बिट ? 'OUT' : 'IN'}]: ${वर्तमान_मान}`, 8, आधार_य + पंक्ति_उच्चता / 2 + 5);

      // Draw digital step waveform across clock periods
      for (let न = 0; न < प्रदर्शन_नमूना_संख्या; न++) {
        const नमूना_मूल्य = (न < तरंगरूप_इतिहास.length) ? तरंगरूप_इतिहास[न] : (पिन_स्थिति_पंजिका & 0x0F);
        const काल_सक्रियता = (न < तरंगरूप_सक्रियता_इतिहास.length) ? तरंगरूप_सक्रियता_इतिहास[न] : (पिन_सक्रियता_पंजिका & 0x0F);
        const निर्गम_सक्रिय = (काल_सक्रियता >> पिन) & 1;

        const पिन_बिट = (नमूना_मूल्य >> पिन) & 1;
        const य = पिन_बिट ? उच्च_य : निम्न_य;
        const सुरु_क्ष = प्रारम्भ_क्ष + (न * कदम_विस्तार);
        const अन्त्य_क्ष = सुरु_क्ष + कदम_विस्तार;

        // When Output Enable is 1 (driven by chip output), render in distinctive Emerald Green
        // When Output Enable is 0 (input / tri-state), render in Sky Blue
        संदर्भ.strokeStyle = निर्गम_सक्रिय ? "#10b981" : "#38bdf8";
        संदर्भ.lineWidth = 2.5;
        संदर्भ.beginPath();

        if (न === 0) {
          संदर्भ.moveTo(सुरु_क्ष, य);
        } else {
          const पूर्व_नमूना_मूल्य = ((न - 1) < तरंगरूप_इतिहास.length) ? तरंगरूप_इतिहास[न - 1] : (पिन_स्थिति_पंजिका & 0x0F);
          const पूर्व_बिट = (पूर्व_नमूना_मूल्य >> पिन) & 1;
          const पूर्व_य = पूर्व_बिट ? उच्च_य : निम्न_य;
          // Step transition at clock edge
          संदर्भ.lineTo(सुरु_क्ष, पूर्व_य);
          संदर्भ.lineTo(सुरु_क्ष, य);
        }
        // Maintain level across the clock period
        संदर्भ.lineTo(अन्त्य_क्ष, य);
        संदर्भ.stroke();

        // If Output Enable is 1, draw a subtle indicator bar at top of period
        if (निर्गम_सक्रिय) {
          संदर्भ.fillStyle = "rgba(16, 185, 129, 0.4)";
          संदर्भ.fillRect(सुरु_क्ष + 1, आधार_य + 1, कदम_विस्तार - 2, 2);
        }
      }
    });

    // Auto-scroll the waveform container to the latest clock period during execution
    const पात्र = document.getElementById('तरंगरूप-पात्र');
    if (पात्र && स्वचालित_चक्र) {
      पात्र.scrollLeft = पात्र.scrollWidth;
    }
  }

  // संक्रिया प्रकार परिवर्तनम् (UI Toggle for Immediate vs Register input)
  function संक्रिया_प्रकार_परिवर्तनम्() {
    const प्रकार = document.getElementById('निवेश-संक्रिया-प्रकार').value;
    const स्रोत_तत्व = document.getElementById('निवेश-स्रोत-पंजिका');
    const स्थिर_तत्व = document.getElementById('निवेश-स्थिर-मूल्य');
    const गन्तव्य_तत्व = document.getElementById('निवेश-गन्तव्य-पंजिका');

    if (प्रकार === 'LOAD') {
      गन्तव्य_तत्व.style.display = 'block';
      स्रोत_तत्व.style.display = 'none';
      स्थिर_तत्व.style.display = 'block';
      स्थिर_तत्व.placeholder = "Val (0-15)";
      स्थिर_तत्व.max = "15";
    } else if (प्रकार === 'LOADI' || प्रकार === 'LOADIB') {
      गन्तव्य_तत्व.style.display = 'none';
      स्रोत_तत्व.style.display = 'none';
      स्थिर_तत्व.style.display = 'block';
      स्थिर_तत्व.placeholder = "Imm (0-255)";
      स्थिर_तत्व.max = "255";
    } else if (प्रकार === 'MEM_LOAD' || प्रकार === 'STORE') {
      गन्तव्य_तत्व.style.display = 'none';
      स्रोत_तत्व.style.display = 'none';
      स्थिर_तत्व.style.display = 'block';
      स्थिर_तत्व.placeholder = "Addr (0-15)";
      स्थिर_तत्व.max = "15";
    } else if (प्रकार === 'SET0' || प्रकार === 'SET1') {
      गन्तव्य_तत्व.style.display = 'none';
      स्रोत_तत्व.style.display = 'none';
      स्थिर_तत्व.style.display = 'block';
      स्थिर_तत्व.placeholder = "Pin (0-3)";
      स्थिर_तत्व.max = "3";
    } else if (प्रकार === 'JMP' || प्रकार === 'JMPNZ' || प्रकार === 'JMPC') {
      गन्तव्य_तत्व.style.display = 'none';
      स्रोत_तत्व.style.display = 'none';
      स्थिर_तत्व.style.display = 'block';
      स्थिर_तत्व.placeholder = "TabID (0-15)";
      स्थिर_तत्व.max = "15";
    } else if (प्रकार === 'NOT' || प्रकार === 'SHL' || प्रकार === 'SHR' || प्रकार === 'HALT' || प्रकार === 'NOP') {
      गन्तव्य_तत्व.style.display = प्रकार === 'HALT' || प्रकार === 'NOP' ? 'none' : 'block';
      स्रोत_तत्व.style.display = 'none';
      स्थिर_तत्व.style.display = 'none';
    } else {
      // ADD, SUB, AND, OR, XOR, MOV
      गन्तव्य_तत्व.style.display = 'block';
      स्रोत_तत्व.style.display = 'block';
      स्थिर_तत्व.style.display = 'none';
    }
  }

  // निर्देश लेखनम् (Write instruction to Memory address)
  function निर्देश_लेखनम्() {
    const पता = parseInt(document.getElementById('निवेश-स्मृति-पता').value, 10);
    if (isNaN(पता) || पता < 0 || पता > 15) {
      alert("Please enter a valid memory address between 0 and 15.");
      return;
    }

    const प्रकार = document.getElementById('निवेश-संक्रिया-प्रकार').value;
    const गन्तव्य = parseInt(document.getElementById('निवेश-गन्तव्य-पंजिका').value, 10);
    const स्रोत = parseInt(document.getElementById('निवेश-स्रोत-पंजिका').value, 10);
    const स्थिर_मान = parseInt(document.getElementById('निवेश-स्थिर-मूल्य').value, 10);
    const मान्य_स्थिर = isNaN(स्थिर_मान) ? 0 : स्थिर_मान;

    let नया_निर्देश = null;
    if (प्रकार === 'LOADI' || प्रकार === 'LOADIB') {
      नया_निर्देश = { प्रकार: प्रकार, स्थिर: Math.max(0, Math.min(255, मान्य_स्थिर)) };
    } else if (प्रकार === 'MEM_LOAD' || प्रकार === 'STORE') {
      नया_निर्देश = { प्रकार: प्रकार, पता: Math.max(0, Math.min(15, मान्य_स्थिर)) };
    } else if (प्रकार === 'SET0' || प्रकार === 'SET1') {
      नया_निर्देश = { प्रकार: प्रकार, पिन: Math.max(0, Math.min(3, मान्य_स्थिर)) };
    } else if (प्रकार === 'JMP' || प्रकार === 'JMPNZ' || प्रकार === 'JMPC') {
      नया_निर्देश = { प्रकार: प्रकार, तालिका_क्रमांक: Math.max(0, Math.min(15, मान्य_स्थिर)) };
    } else if (प्रकार === 'LOAD') {
      नया_निर्देश = { प्रकार: प्रकार, गन्तव्य: गन्तव्य, स्थिर: Math.max(0, Math.min(15, मान्य_स्थिर)) };
    } else {
      नया_निर्देश = {
        प्रकार: प्रकार,
        गन्तव्य: गन्तव्य,
        स्रोत: स्रोत
      };
    }

    स्मृति_दत्त[पता] = नया_निर्देश;
    लॉग_योजनम्(`Memory 0x${पता.toString(16).toUpperCase()} updated: ${निर्देश_पाठ_निर्माणम्(नया_निर्देश)}`);
    पटल_अद्यतनम्();
  }

  // लॉग योजनम् (Append to console log)
  function लॉग_योजनम्(संदेश) {
    const पात्र = document.getElementById('विवरण-लॉग-पात्र');
    const समय = new Date().toTimeString().split(' ')[0];
    const प्रविष्टि = document.createElement('div');
    प्रविष्टि.className = 'विवरण-प्रविष्टि';
    प्रविष्टि.innerHTML = `
    <span class="विवरण-समय">[${समय}]</span>
    <span class="विवरण-संदेश">${संदेश}</span>
  `;
    पात्र.prepend(प्रविष्टि);
  }

  // लॉग स्वच्छीकरणम् (Clear console log)
  function लॉग_स्वच्छीकरणम्() {
    document.getElementById('विवरण-लॉग-पात्र').innerHTML = '';
    लॉग_योजनम्("Trace log cleared.");
  }
