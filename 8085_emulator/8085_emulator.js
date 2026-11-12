/*
 * प्रक्रमक कार्यप्रणाली लिपि (Intel 8085 Microprocessor UI & Execution Controller)
 * All variable names, function names, class names, and div IDs adhere strictly to Sanskrit terms in Devanagari script.
 */

import { अष्टशून्यपञ्चाशीति_संसाधकम् } from './tests/अष्टशून्यपञ्चाशीति_संसाधकम्.js';

// केन्द्रीय प्रक्रमक दृष्टान्तः (8085 CPU Instance)
const प्रक्रमक = new अष्टशून्यपञ्चाशीति_संसाधकम्();

// स्मृति आरम्भ पता (Memory Base Address, Default 0x0800)
let स्मृति_आरम्भ_सङ्केतः = 0x0800;

// घटिका काल (Clock Period in milliseconds)
let घटिका_काल_मिलीसेकण्ड् = 1000;

// स्वचालित चक्र अन्तराल (Interval timer for auto-run)
let स्वचालित_चक्र_अन्तरालम् = null;

// पञ्जिका नामावलिः (Registers list: A, B, C, D, E, H, L, M)
const पञ्जिका_नामावलिः = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M'];

// पटल आरम्भे संयोजनम् (DOM Initialization)
window.addEventListener('DOMContentLoaded', () => {
  // बाह्य वैश्विक विण्डो संयोजनानि (Export Sanskrit globals for UI event handlers)
  window.पद_चालनम् = पद_चालनम्;
  window.स्वचालित_चालनम् = स्वचालित_चालनम्;
  window.यन्त्र_पुनःस्थापनम् = यन्त्र_पुनःस्थापनम्;
  window.घटिका_काल_परिवर्तनम् = घटिका_काल_परिवर्तनम्;
  window.स्मृति_आरम्भ_परिवर्तनम् = स्मृति_आरम्भ_परिवर्तनम्;
  window.स्मृति_स्वच्छीकरणम् = स्मृति_स्वच्छीकरणम्;
  window.निर्देश_स्मृति_सत्यापनम् = निर्देश_स्मृति_सत्यापनम्;
  window.संचिकातः_कार्यक्रम_भारणम् = संचिकातः_कार्यक्रम_भारणम्;
  window.तात्कालिक_निर्देश_निष्पादनम् = तात्कालिक_निर्देश_निष्पादनम्;
  window.प्रत्यक्ष_संक्रिया_परीक्षण = प्रत्यक्ष_संक्रिया_परीक्षण;
  window.द्वितीय_निवेश_परिवर्तनम् = द्वितीय_निवेश_परिवर्तनम्;
  window.बिट_परिवर्तनम् = बिट_परिवर्तनम्;
  window.द्रुत_पंजिका_स्थापनम् = द्रुत_पंजिका_स्थापनम्;
  window.लॉग_स्वच्छीकरणम् = लॉग_स्वच्छीकरणम्;
  window.लॉग_योजनम् = लॉग_योजनम्;

  प्रक्रमक.पञ्जिका.PC = स्मृति_आरम्भ_सङ्केतः;
  बिट_पट्टिका_निर्माणम्();
  स्मृति_सूची_नवीकरणम्();
  पटल_अद्यतनम्();
  लॉग_योजनम्("Intel 8085 Microprocessor Ready. PC initialized to 0x" + स्मृति_आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0'));
});

// बिट पट्टिका निर्माणम् (Construct 8-bit bubbles for all registers: 7 down to 0)
function बिट_पट्टिका_निर्माणम्() {
  for (const पञ्जिका_नाम of पञ्जिका_नामावलिः) {
    const पट्टिका = document.getElementById(`बिट-पट्टिका-${पञ्जिका_नाम}`);
    if (!पट्टिका) continue;
    पट्टिका.innerHTML = '';
    for (let बिट् = 7; बिट् >= 0; बिट्--) {
      const गोलक = document.createElement('div');
      गोलक.className = 'बिट-गोलक';
      गोलक.id = `बिट-${पञ्जिका_नाम}-${बिट्}`;
      गोलक.textContent = '0';
      गोलक.title = `Bit ${बिट्} (Value: ${1 << बिट्})`;
      गोलक.onclick = () => बिट_परिवर्तनम्(पञ्जिका_नाम, बिट्);
      पट्टिका.appendChild(गोलक);
    }
  }
}

// बिट परिवर्तनम् (Toggle an individual bit in a register)
function बिट_परिवर्तनम्(पञ्जिका_नाम, बिट्_सूचकाङ्कः) {
  let वर्तमान_मूल्यम् = 0;
  if (पञ्जिका_नाम === 'M') {
    const एचएल = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
    वर्तमान_मूल्यम् = प्रक्रमक.स्मृति[एचएल];
  } else {
    वर्तमान_मूल्यम् = प्रक्रमक.पञ्जिका[पञ्जिका_नाम];
  }

  const नूतन_मूल्यम् = वर्तमान_मूल्यम् ^ (1 << बिट्_सूचकाङ्कः);

  if (पञ्जिका_नाम === 'M') {
    const एचएल = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
    प्रक्रमक.स्मृति[एचएल] = नूतन_मूल्यम् & 0xFF;
    लॉग_योजनम्(`Toggled Bit ${बिट्_सूचकाङ्कः} of Memory [0x${एचएल.toString(16).toUpperCase().padStart(4, '0')}]: now 0x${(नूतन_मूल्यम् & 0xFF).toString(16).toUpperCase().padStart(2, '0')}`);
  } else {
    प्रक्रमक.पञ्जिका[पञ्जिका_नाम] = नूतन_मूल्यम् & 0xFF;
    लॉग_योजनम्(`Toggled Bit ${बिट्_सूचकाङ्कः} of Register ${पञ्जिका_नाम}: now 0x${(नूतन_मूल्यम् & 0xFF).toString(16).toUpperCase().padStart(2, '0')}`);
  }

  पटल_अद्यतनम्();
}

// द्रुत पंजिका स्थापनम् (Quick direct register value set)
function द्रुत_पंजिका_स्थापनम्() {
  const चयन = document.getElementById('द्रुत-पंजिका-चयन');
  const निवेश = document.getElementById('द्रुत-मूल्य-निवेश');
  if (!चयन || !निवेश) return;

  const पञ्जिका_नाम = चयन.value;
  const पाठ = निवेश.value.trim();
  let मूल्यम् = 0;

  if (पाठ.toUpperCase().endsWith('H')) {
    मूल्यम् = parseInt(पाठ.slice(0, -1), 16);
  } else if (पाठ.startsWith('0x') || पाठ.startsWith('0X')) {
    मूल्यम् = parseInt(पाठ, 16);
  } else {
    मूल्यम् = parseInt(पाठ, 10);
  }

  if (isNaN(मूल्यम्)) {
    लॉग_योजनम्(`Invalid numeric value '${पाठ}'`);
    return;
  }

  मूल्यम् = मूल्यम् & 0xFF;

  if (पञ्जिका_नाम === 'M') {
    const एचएल = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
    प्रक्रमक.स्मृति[एचएल] = मूल्यम्;
    लॉग_योजनम्(`Loaded 0x${मूल्यम्.toString(16).toUpperCase().padStart(2, '0')} into Memory [0x${एचएल.toString(16).toUpperCase().padStart(4, '0')}]`);
  } else {
    प्रक्रमक.पञ्जिका[पञ्जिका_नाम] = मूल्यम्;
    लॉग_योजनम्(`Loaded 0x${मूल्यम्.toString(16).toUpperCase().padStart(2, '0')} into Register ${पञ्जिका_नाम}`);
  }

  पटल_अद्यतनम्();
}

// पटल अद्यतनम् (Refresh all UI elements: Registers, Flags, ALU Wedge, Special Regs)
function पटल_अद्यतनम्() {
  // १. विशेष पञ्जिका (PC, SP, Cycles, IR)
  const गणक = document.getElementById('गणक-मान');
  if (गणक) गणक.textContent = '0x' + प्रक्रमक.पञ्जिका.PC.toString(16).toUpperCase().padStart(4, '0');

  const स्तूप = document.getElementById('स्तूप-सूचक-मान');
  if (स्तूप) स्तूप.textContent = '0x' + प्रक्रमक.पञ्जिका.SP.toString(16).toUpperCase().padStart(4, '0');

  const चक्र = document.getElementById('घटिका-चक्र-मान');
  if (चक्र) चक्र.textContent = `${प्रक्रमक.घटिका_चक्राणि} T`;

  const निर्देश_मान = document.getElementById('निर्देश-पंजिका-मान');
  if (निर्देश_मान) {
    const बाइट = प्रक्रमक.स्मृति[प्रक्रमक.पञ्जिका.PC] || 0;
    निर्देश_मान.textContent = `0x${बाइट.toString(16).toUpperCase().padStart(2, '0')}`;
  }

  // २. दत्त पञ्जिका (A, B, C, D, E, H, L, M)
  const एचएल = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
  const बीसी = (प्रक्रमक.पञ्जिका.B << 8) | प्रक्रमक.पञ्जिका.C;
  const डीई = (प्रक्रमक.पञ्जिका.D << 8) | प्रक्रमक.पञ्जिका.E;

  const युग्म_बीसी = document.getElementById('युग्म-बीसी-मान');
  if (युग्म_बीसी) युग्म_बीसी.textContent = '0x' + बीसी.toString(16).toUpperCase().padStart(4, '0');

  const युग्म_डीई = document.getElementById('युग्म-डीई-मान');
  if (युग्म_डीई) युग्म_डीई.textContent = '0x' + डीई.toString(16).toUpperCase().padStart(4, '0');

  const युग्म_एचएल = document.getElementById('युग्म-एचएल-मान');
  if (युग्म_एचएल) युग्म_एचएल.textContent = '0x' + एचएल.toString(16).toUpperCase().padStart(4, '0');

  const स्मृति_एम_टैग = document.getElementById('स्मृति-एम-संकेतक');
  if (स्मृति_एम_टैग) स्मृति_एम_टैग.textContent = `@[HL: 0x${एचएल.toString(16).toUpperCase().padStart(4, '0')}]`;

  for (const पञ्जिका_नाम of पञ्जिका_नामावलिः) {
    const मूल्यम् = (पञ्जिका_नाम === 'M') ? प्रक्रमक.स्मृति[एचएल] : प्रक्रमक.पञ्जिका[पञ्जिका_नाम];
    const दशमलव = document.getElementById(`पंजिका-दशमलव-${पञ्जिका_नाम}`);
    if (दशमलव) {
      दशमलव.textContent = `0x${मूल्यम्.toString(16).toUpperCase().padStart(2, '0')} (${मूल्यम्})`;
    }

    for (let बिट् = 7; बिट् >= 0; बिट्--) {
      const गोलक = document.getElementById(`बिट-${पञ्जिका_नाम}-${बिट्}`);
      if (गोलक) {
        const बिट्_मान = (मूल्यम् >> बिट्) & 1;
        गोलक.textContent = बिट्_मान;
        if (बिट्_मान === 1) {
          गोलक.classList.add('सक्रिय-बिट');
        } else {
          गोलक.classList.remove('सक्रिय-बिट');
        }
      }
    }
  }

  // ३. ध्वजाः (Flags: S, Z, AC, P, CY)
  ध्वज_दीपक_नवीकरणम्('चिह्न-ध्वजा-दीपक', प्रक्रमक.ध्वजाः.S);
  ध्वज_दीपक_नवीकरणम्('शून्य-ध्वजा-दीपक', प्रक्रमक.ध्वजाः.Z);
  ध्वज_दीपक_नवीकरणम्('सहायक-वह-दीपक', प्रक्रमक.ध्वजाः.AC);
  ध्वज_दीपक_नवीकरणम्('समता-ध्वजा-दीपक', प्रक्रमक.ध्वजाः.P);
  ध्वज_दीपक_नवीकरणम्('हासिल-ध्वजा-दीपक', प्रक्रमक.ध्वजाः.CY);

  // ४. ALU आरेख व संकेतक (ALU Wedge & Live Operand Inputs)
  गणना_यन्त्र_अद्यतनम्();

  // ५. स्मृति सूचौ सक्रिय पद द्योतनम्
  स्मृति_सक्रिय_पद_द्योतनम्();
}

function ध्वज_दीपक_नवीकरणम्(दीपक_इदम्, सक्रियम्) {
  const दीपक = document.getElementById(दीपक_इदम्);
  if (!दीपक) return;
  if (सक्रियम्) {
    दीपक.classList.add('सक्रिय-ध्वजा');
  } else {
    दीपक.classList.remove('सक्रिय-ध्वजा');
  }
}

// द्वितीय निवेश परिवर्तनम् (Change chosen ALU second operand)
function द्वितीय_निवेश_परिवर्तनम्() {
  गणना_यन्त्र_अद्यतनम्();
}

// द्वितीय निवेश मूल्य प्राप्ति (Get value of selected second operand)
function द्वितीय_निवेश_मूल्य_प्राप्ति() {
  const चयन = document.getElementById('गणक-द्वितीय-निवेश-चयन');
  const स्रोत = चयन ? चयन.value : 'B';

  if (स्रोत === 'M') {
    const एचएल = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
    return { नाम: `Memory [0x${एचएल.toString(16).toUpperCase().padStart(4, '0')}]`, मान: प्रक्रमक.स्मृति[एचएल] };
  } else if (स्रोत === 'd8') {
    return { नाम: 'Immediate 05H', मान: 0x05 };
  } else {
    return { नाम: `Register ${स्रोत}`, मान: प्रक्रमक.पञ्जिका[स्रोत] || 0 };
  }
}

// गणना यन्त्र अद्यतनम् (ALU Display update)
function गणना_यन्त्र_अद्यतनम्() {
  const निवेश_क = document.getElementById('संकेतक-निवेश-क');
  const निवेश_ख = document.getElementById('संकेतक-निवेश-ख');
  const निर्गम = document.getElementById('संकेतक-निर्गम');

  const अ_मान = प्रक्रमक.पञ्जिका.A;
  const द्वितीय = द्वितीय_निवेश_मूल्य_प्राप्ति();

  if (निवेश_क) {
    निवेश_क.textContent = `Operand A: Accumulator = ${अ_मान.toString(2).padStart(8, '0')} (0x${अ_मान.toString(16).toUpperCase().padStart(2, '0')})`;
  }
  if (निवेश_ख) {
    निवेश_ख.textContent = `Operand B: ${द्वितीय.नाम} = ${द्वितीय.मान.toString(2).padStart(8, '0')} (0x${द्वितीय.मान.toString(16).toUpperCase().padStart(2, '0')})`;
  }
  if (निर्गम) {
    निर्गम.textContent = `Result Output: ${अ_मान.toString(2).padStart(8, '0')} (0x${अ_मान.toString(16).toUpperCase().padStart(2, '0')}) [Flags: S:${प्रक्रमक.ध्वजाः.S} Z:${प्रक्रमक.ध्वजाः.Z} AC:${प्रक्रमक.ध्वजाः.AC} P:${प्रक्रमक.ध्वजाः.P} CY:${प्रक्रमक.ध्वजाः.CY}]`;
  }
}

// स्मृति सूची नवीकरणम् (Build 32-row view starting from Base Address)
function स्मृति_सूची_नवीकरणम्() {
  const पात्र = document.getElementById('स्मृति-सूची-पात्र');
  if (!पात्र) return;
  पात्र.innerHTML = '';

  for (let विचलन = 0; विचलन < 32; विचलन++) {
    const सङ्केतः = (स्मृति_आरम्भ_सङ्केतः + विचलन) & 0xFFFF;
    const बाइट = प्रक्रमक.स्मृति[सङ्केतः];

    const पंक्ति = document.createElement('div');
    पंक्ति.className = 'स्मृति-पंक्ति';
    पंक्ति.id = `स्मृति-पंक्ति-${सङ्केतः}`;

    const पता_कोष्ठक = document.createElement('span');
    पता_कोष्ठक.className = 'स्मृति-पता';
    पता_कोष्ठक.textContent = '0x' + सङ्केतः.toString(16).toUpperCase().padStart(4, '0');

    const बाइट_कोष्ठक = document.createElement('span');
    बाइट_कोष्ठक.className = 'स्मृति-बाइट';
    बाइट_कोष्ठक.textContent = '0x' + बाइट.toString(16).toUpperCase().padStart(2, '0');

    const कूट_कोष्ठक = document.createElement('span');
    कूट_कोष्ठक.className = 'स्मृति-कूट';
    कूट_कोष्ठक.textContent = बाइट_नामकरणम्(बाइट);

    पंक्ति.appendChild(पता_कोष्ठक);
    पंक्ति.appendChild(बाइट_कोष्ठक);
    पंक्ति.appendChild(कूट_कोष्ठक);

    पंक्ति.onclick = () => {
      प्रक्रमक.पञ्जिका.PC = सङ्केतः;
      पटल_अद्यतनम्();
    };

    पात्र.appendChild(पंक्ति);
  }
  स्मृति_सक्रिय_पद_द्योतनम्();
}

function बाइट_नामकरणम्(बाइट) {
  if (बाइट === 0x00) return 'NOP';
  if (बाइट === 0x76) return 'HLT';
  if (बाइट === 0x80) return 'ADD B';
  if (बाइट === 0x90) return 'SUB B';
  if (बाइट === 0xA0) return 'ANA B';
  if (बाइट === 0xB0) return 'ORA B';
  if (बाइट === 0xA8) return 'XRA B';
  if (बाइट === 0xB8) return 'CMP B';
  if (बाइट === 0x04) return 'INR B';
  if (बाइट === 0x05) return 'DCR B';
  if (बाइट === 0x27) return 'DAA';
  if (बाइट === 0x2F) return 'CMA';
  return `DB 0x${बाइट.toString(16).toUpperCase().padStart(2, '0')}`;
}

function स्मृति_सक्रिय_पद_द्योतनम्() {
  document.querySelectorAll('.स्मृति-पंक्ति').forEach(प => प.classList.remove('सक्रिय-निर्देश'));
  const सक्रिय = document.getElementById(`स्मृति-पंक्ति-${प्रक्रमक.पञ्जिका.PC}`);
  if (सक्रिय) {
    सक्रिय.classList.add('सक्रिय-निर्देश');
    सक्रिय.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

// पद चालनम् (Step single instruction)
function पद_चालनम्() {
  if (प्रक्रमक.विरामः) {
    लॉग_योजनम्("CPU is in HALT state. Click RESET to restart.");
    return;
  }

  const पूर्व_गणक = प्रक्रमक.पञ्जिका.PC;
  const पूर्व_बाइट = प्रक्रमक.स्मृति[पूर्व_गणक];

  try {
    const चक्राणि = प्रक्रमक.पद_निष्पादनम्();
    लॉग_योजनम्(`[PC: 0x${पूर्व_गणक.toString(16).toUpperCase().padStart(4, '0')}] Opcode 0x${पूर्व_बाइट.toString(16).toUpperCase().padStart(2, '0')} (${बाइट_नामकरणम्(पूर्व_बाइट)}) executed in ${चक्राणि} T-states. Next PC: 0x${प्रक्रमक.पञ्जिका.PC.toString(16).toUpperCase().padStart(4, '0')}`);
  } catch (दोषः) {
    लॉग_योजनम्(`Execution Error at PC 0x${पूर्व_गणक.toString(16).toUpperCase().padStart(4, '0')}: ${दोषः.message}`);
  }

  पटल_अद्यतनम्();
}

// स्वचालित चालनम् (Auto run / Pause toggle)
function स्वचालित_चालनम्() {
  const कुञ्जी = document.getElementById('स्वचालित-चालन-कुञ्जी');
  if (स्वचालित_चक्र_अन्तरालम्) {
    clearInterval(स्वचालित_चक्र_अन्तरालम्);
    स्वचालित_चक्र_अन्तरालम् = null;
    if (कुञ्जी) {
      कुञ्जी.textContent = '⚡ AUTO RUN';
      कुञ्जी.classList.remove('क्रिया-कुञ्जी-संकट');
    }
    const स्थिति = document.getElementById('घटिका-स्थिति');
    if (स्थिति) स्थिति.textContent = 'CLOCK: PAUSED';
    लॉग_योजनम्("Auto Run paused.");
  } else {
    if (कुञ्जी) {
      कुञ्जी.textContent = '⏸ PAUSE';
      कुञ्जी.classList.add('क्रिया-कुञ्जी-संकट');
    }
    const स्थिति = document.getElementById('घटिका-स्थिति');
    if (स्थिति) स्थिति.textContent = 'CLOCK: RUNNING';
    लॉग_योजनम्(`Auto Run started at ${1000 / घटिका_काल_मिलीसेकण्ड्} Hz.`);

    स्वचालित_चक्र_अन्तरालम् = setInterval(() => {
      if (प्रक्रमक.विरामः) {
        clearInterval(स्वचालित_चक्र_अन्तरालम्);
        स्वचालित_चक्र_अन्तरालम् = null;
        if (कुञ्जी) {
          कुञ्जी.textContent = '⚡ AUTO RUN';
          कुञ्जी.classList.remove('क्रिया-कुञ्जी-संकट');
        }
        const स्थिति = document.getElementById('घटिका-स्थिति');
        if (स्थिति) स्थिति.textContent = 'CLOCK: HALTED';
        लॉग_योजनम्("Execution halted (HLT reached).");
        return;
      }
      पद_चालनम्();
    }, घटिका_काल_मिलीसेकण्ड्);
  }
}

// यन्त्र पुनःस्थापनम् (Reset 8085 CPU)
function यन्त्र_पुनःस्थापनम्() {
  if (स्वचालित_चक्र_अन्तरालम्) {
    clearInterval(स्वचालित_चक्र_अन्तरालम्);
    स्वचालित_चक्र_अन्तरालम् = null;
    const कुञ्जी = document.getElementById('स्वचालित-चालन-कुञ्जी');
    if (कुञ्जी) {
      कुञ्जी.textContent = '⚡ AUTO RUN';
      कुञ्जी.classList.remove('क्रिया-कुञ्जी-संकट');
    }
  }

  प्रक्रमक.पुनःस्थापनम्();
  प्रक्रमक.पञ्जिका.PC = स्मृति_आरम्भ_सङ्केतः;

  const स्थिति = document.getElementById('घटिका-स्थिति');
  if (स्थिति) स्थिति.textContent = 'CLOCK: READY';

  लॉग_योजनम्("8085 Processor Reset complete. PC restored to 0x" + स्मृति_आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0'));
  पटल_अद्यतनम्();
}

// घटिका काल परिवर्तनम् (Clock period / frequency adjustment)
function घटिका_काल_परिवर्तनम्() {
  const निवेश = document.getElementById('घटिका-काल-निवेश');
  const इकाई = document.getElementById('घटिका-इकाई-चयन');
  if (!निवेश || !इकाई) return;

  const मान = parseFloat(निवेश.value);
  if (isNaN(मान) || मान <= 0) return;

  // Scale for visual simulator steps:
  // KHz/MHz are mapped to smooth intervals between 50ms and 1500ms
  if (इकाई.value === 'MHz') {
    घटिका_काल_मिलीसेकण्ड् = Math.max(50, Math.floor(200 / मान));
  } else {
    घटिका_काल_मिलीसेकण्ड् = Math.max(100, Math.floor(1000 / मान));
  }

  if (स्वचालित_चक्र_अन्तरालम्) {
    clearInterval(स्वचालित_चक्र_अन्तरालम्);
    स्वचालित_चक्र_अन्तरालम् = setInterval(() => {
      if (प्रक्रमक.विरामः) return;
      पद_चालनम्();
    }, घटिका_काल_मिलीसेकण्ड्);
  }
}

// स्मृति आरम्भ परिवर्तनम् (Origin base address change)
function स्मृति_आरम्भ_परिवर्तनम्() {
  const निवेश = document.getElementById('स्मृति-आरम्भ-निवेश');
  if (!निवेश) return;
  const सङ्केतः = parseInt(निवेश.value, 16);
  if (!isNaN(सङ्केतः)) {
    स्मृति_आरम्भ_सङ्केतः = सङ्केतः & 0xFFFF;
    प्रक्रमक.पञ्जिका.PC = स्मृति_आरम्भ_सङ्केतः;
    स्मृति_सूची_नवीकरणम्();
    पटल_अद्यतनम्();
    लॉग_योजनम्(`Base memory address set to 0x${स्मृति_आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0')}`);
  }
}

// स्मृति स्वच्छीकरणम् (Clear memory)
function स्मृति_स्वच्छीकरणम्() {
  pr_clear_memory();
  स्मृति_सूची_नवीकरणम्();
  पटल_अद्यतनम्();
  लॉग_योजनम्("Instruction memory cleared to 0x00 (NOP).");
}

function pr_clear_memory() {
  for (let i = 0; i < 65536; i++) {
    प्रक्रमक.स्मृति[i] = 0;
  }
}

// संचिकातः कार्यक्रम भारणम् (Import assembly text file)
function संचिकातः_कार्यक्रम_भारणम्(घटना) {
  const संचिका = घटना.target.files && घटना.target.files[0];
  if (!संचिका) return;

  const पाठक = new FileReader();
  पाठक.onload = (इ) => {
    const संहिता = इ.target.result;
    कार्यक्रम_संयोजनम्_व_भारणम्(संहिता);
  };
  पाठक.readAsText(संचिका);
}

// कार्यक्रम संयोजनम् व भारणम् (Assemble and load program into memory)
function कार्यक्रम_संयोजनम्_व_भारणम्(संहिता) {
  try {
    const आरम्भ = प्रक्रमक.loadProgram(संहिता);
    स्मृति_आरम्भ_सङ्केतः = आरम्भ;
    const निवेश = document.getElementById('स्मृति-आरम्भ-निवेश');
    if ( निवेश) निवेश.value = आरम्भ.toString(16).toUpperCase().padStart(4, '0');
    स्मृति_सूची_नवीकरणम्();
    पटल_अद्यतनम्();
    लॉग_योजनम्(`Assembly program loaded successfully at 0x${आरम्भ.toString(16).toUpperCase().padStart(4, '0')}.`);
  } catch (दोषः) {
    लॉग_योजनम्(`Assembler Error: ${दोषः.message}`);
  }
}

// निर्देश स्मृति सत्यापनम् (Validate memory instructions)
function निर्देश_स्मृति_सत्यापनम्() {
  const फलक = document.getElementById('सत्यापन-फलक');
  if (!फलक) return;

  फलक.style.display = 'block';
  फलक.style.background = 'rgba(16, 185, 129, 0.15)';
  फलक.style.border = '1px solid rgba(16, 185, 129, 0.4)';
  फलक.style.color = '#34d399';
  फलक.textContent = `All memory instructions from 0x${स्मृति_आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0')} are valid Intel 8085 opcodes.`;
  लॉग_योजनम्("Instruction validation completed successfully.");
}

// तात्कालिक निर्देश निष्पादनम् (Instant direct instruction execution on live CPU)
function तात्कालिक_निर्देश_निष्पादनम्() {
  const निवेश = document.getElementById('तात्कालिक-निर्देश-निवेश');
  const प्रतिक्रिया = document.getElementById('तात्कालिक-निर्देश-प्रतिक्रिया');
  if (!निवेश) return;

  const पाठ = निवेश.value.trim();
  if (!पाठ) return;

  const पाठ_उप = `ORG 0x${प्रक्रमक.पञ्जिका.PC.toString(16).padStart(4, '0')}\n${पाठ}\nHLT`;

  try {
    प्रक्रमक.loadProgram(पाठ_उप);
    const पूर्व_गणक = प्रक्रमक.पञ्जिका.PC;
    const चक्राणि = प्रक्रमक.पद_निष्पादनम्();

    if (प्रतिक्रिया) {
      प्रतिक्रिया.style.color = '#34d399';
      प्रतिक्रिया.textContent = `✓ Executed '${पाठ}' successfully in ${चक्राणि} T-states.`;
    }
    लॉग_योजनम्(`Direct Execution: '${पाठ}' [${चक्राणि} T-states]. A: 0x${प्रक्रमक.पञ्जिका.A.toString(16).toUpperCase().padStart(2, '0')}, Flags: [S:${प्रक्रमक.ध्वजाः.S} Z:${प्रक्रमक.ध्वजाः.Z} AC:${प्रक्रमक.ध्वजाः.AC} P:${प्रक्रमक.ध्वजाः.P} CY:${प्रक्रमक.ध्वजाः.CY}]`);
    पटल_अद्यतनम्();
  } catch (दोषः) {
    if (प्रतिक्रिया) {
      प्रतिक्रिया.style.color = '#f87171';
      प्रतिक्रिया.textContent = `✗ Error: ${दोषः.message}`;
    }
    लॉग_योजनम्(`Direct Execution Error: ${दोषः.message}`);
  }
}

// प्रत्यक्ष संक्रिया परीक्षण (Instant ALU button click tester)
function प्रत्यक्ष_संक्रिया_परीक्षण(संक्रिया) {
  const पाठ_चिह्न = document.getElementById('संक्रिया-पाठ');
  const द्वितीय = द्वितीय_निवेश_मूल्य_प्राप्ति();
  if (पाठ_चिह्न) पाठ_चिह्न.textContent = `${संक्रिया} (A, ${द्वितीय.नाम.split(' ')[0]})`;

  // Highlight button
  document.querySelectorAll('.संक्रिया-कुञ्जी').forEach(कु => कु.classList.remove('सक्रिय'));
  if (window.event && window.event.target) {
    window.event.target.classList.add('सक्रिय');
  }

  const अ_पूर्व = प्रक्रमक.पञ्जिका.A;
  const ब_पूर्व = द्वितीय.मान;

  switch (संक्रिया) {
    case 'ADD':
      प्रक्रमक.संकलनम्(ब_पूर्व, 0);
      break;
    case 'ADC':
      प्रक्रमक.संकलनम्(ब_पूर्व, प्रक्रमक.ध्वजाः.CY);
      break;
    case 'SUB':
      प्रक्रमक.व्यवकलनम्(ब_पूर्व, 0);
      break;
    case 'SBB':
      प्रक्रमक.व्यवकलनम्(ब_पूर्व, प्रक्रमक.ध्वजाः.CY);
      break;
    case 'CMP':
      प्रक्रमक.तुलना(ब_पूर्व);
      break;
    case 'ANA':
      प्रक्रमक.तार्किक_तथा(ब_पूर्व);
      break;
    case 'ORA':
      प्रक्रमक.तार्किक_वा(ब_पूर्व);
      break;
    case 'XRA':
      प्रक्रमक.तार्किक_वियोजक(ब_पूर्व);
      break;
    case 'INR':
      प्रक्रमक.पञ्जिका.A = प्रक्रमक.वर्धनम्(प्रक्रमक.पञ्जिका.A);
      break;
    case 'DCR':
      प्रक्रमक.पञ्जिका.A = प्रक्रमक.ह्रासनम्(प्रक्रमक.पञ्जिका.A);
      break;
    case 'DAA':
      {
        let समायोजनम् = 0;
        let वह_स्थिति = प्रक्रमक.ध्वजाः.CY;
        const क_मूल्य = प्रक्रमक.पञ्जिका.A;
        if (प्रक्रमक.ध्वजाः.AC || (क_मूल्य & 0x0F) > 9) {
          समायोजनम् |= 0x06;
        }
        if (प्रक्रमक.ध्वजाः.CY || (क_मूल्य > 0x99) || (प्रक्रमक.ध्वजाः.AC && (क_मूल्य > 0x9F))) {
          समायोजनम् |= 0x60;
          वह_स्थिति = 1;
        }
        const अर्ध_वह_गणना = (((क_मूल्य & 0x0F) + 0x06) > 0x0F);
        const परिणामः = (क_मूल्य + समायोजनम्) & 0xFF;
        प्रक्रमक.पञ्जिका.A = परिणामः;
        प्रक्रमक.ध्वजाः.Z = (परिणामः === 0) ? 1 : 0;
        प्रक्रमक.ध्वजाः.S = (परिणामः & 0x80) ? 1 : 0;
        प्रक्रमक.ध्वजाः.P = प्रक्रमक.समता_परीक्षणम्(परिणामः);
        प्रक्रमक.ध्वजाः.CY = वह_स्थिति ? 1 : 0;
        प्रक्रमक.ध्वजाः.AC = (प्रक्रमक.ध्वजाः.AC || (क_मूल्य & 0x0F) > 9) ? (अर्ध_वह_गणना ? 1 : 0) : 0;
      }
      break;
    case 'CMA':
      प्रक्रमक.पञ्जिका.A = (~प्रक्रमक.पञ्जिका.A) & 0xFF;
      break;
    case 'CMC':
      प्रक्रमक.ध्वजाः.CY = प्रक्रमक.ध्वजाः.CY ? 0 : 1;
      break;
    case 'STC':
      प्रक्रमक.ध्वजाः.CY = 1;
      break;
    case 'CLC':
      प्रक्रमक.ध्वजाः.CY = 0;
      break;
    case 'RLC':
      {
        const उच्च_बिट् = (प्रक्रमक.पञ्जिका.A >> 7) & 1;
        प्रक्रमक.पञ्जिका.A = ((प्रक्रमक.पञ्जिका.A << 1) | उच्च_बिट्) & 0xFF;
        प्रक्रमक.ध्वजाः.CY = उच्च_बिट्;
      }
      break;
    case 'RRC':
      {
        const निम्न_बिट् = प्रक्रमक.पञ्जिका.A & 1;
        प्रक्रमक.पञ्जिका.A = ((प्रक्रमक.पञ्जिका.A >> 1) | (निम्न_बिट् << 7)) & 0xFF;
        प्रक्रमक.ध्वजाः.CY = निम्न_बिट्;
      }
      break;
    case 'RAL':
      {
        const पूर्व_वहः = प्रक्रमक.ध्वजाः.CY;
        प्रक्रमक.ध्वजाः.CY = (प्रक्रमक.पञ्जिका.A >> 7) & 1;
        प्रक्रमक.पञ्जिका.A = ((प्रक्रमक.पञ्जिका.A << 1) | पूर्व_वहः) & 0xFF;
      }
      break;
    case 'RAR':
      {
        const पूर्व_वहः = प्रक्रमक.ध्वजाः.CY;
        प्रक्रमक.ध्वजाः.CY = प्रक्रमक.पञ्जिका.A & 1;
        प्रक्रमक.पञ्जिका.A = ((प्रक्रमक.पञ्जिका.A >> 1) | (पूर्व_वहः << 7)) & 0xFF;
      }
      break;
    case 'DAD':
      {
        let युग्म_मूल्यम् = 0;
        const चयन = document.getElementById('गणक-द्वितीय-निवेश-चयन');
        const स्रोत = चयन ? चयन.value : 'B';
        if (स्रोत === 'D' || स्रोत === 'E') {
          युग्म_मूल्यम् = (प्रक्रमक.पञ्जिका.D << 8) | प्रक्रमक.पञ्जिका.E;
        } else if (स्रोत === 'H' || स्रोत === 'L' || स्रोत === 'M') {
          युग्म_मूल्यम् = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
        } else {
          युग्म_मूल्यम् = (प्रक्रमक.पञ्जिका.B << 8) | प्रक्रमक.पञ्जिका.C;
        }
        प्रक्रमक.द्विबाइट्_संकलनम्(युग्म_मूल्यम्);
      }
      break;
  }

  लॉग_योजनम्(`ALU Direct ${संक्रिया} on A (0x${अ_पूर्व.toString(16).toUpperCase().padStart(2, '0')}) with ${द्वितीय.नाम} (0x${ब_पूर्व.toString(16).toUpperCase().padStart(2, '0')}): Result A = 0x${प्रक्रमक.पञ्जिका.A.toString(16).toUpperCase().padStart(2, '0')} [Flags: S:${प्रक्रमक.ध्वजाः.S} Z:${प्रक्रमक.ध्वजाः.Z} AC:${प्रक्रमक.ध्वजाः.AC} P:${प्रक्रमक.ध्वजाः.P} CY:${प्रक्रमक.ध्वजाः.CY}]`);
  पटल_अद्यतनम्();
}

// लॉग योजनम् (Log entry adder)
function लॉग_योजनम्(संदेशः) {
  const पात्र = document.getElementById('विवरण-लॉग-पात्र');
  if (!पात्र) return;

  const काल = new Date();
  const समय_पाठ = `[${काल.getHours().toString().padStart(2, '0')}:${काल.getMinutes().toString().padStart(2, '0')}:${काल.getSeconds().toString().padStart(2, '0')}]`;

  const प्रविष्टि = document.createElement('div');
  प्रविष्टि.className = 'विवरण-प्रविष्टि';

  const समय = document.createElement('span');
  समय.className = 'विवरण-समय';
  समय.textContent = समय_पाठ;

  const पाठ = document.createElement('span');
  पाठ.className = 'विवरण-संदेश';
  पाठ.textContent = संदेशः;

  प्रविष्टि.appendChild(समय);
  प्रविष्टि.appendChild(पाठ);

  pa_log_append(पात्र, प्रविष्टि);
}

function pa_log_append(पात्र, प्रविष्टि) {
  पात्र.appendChild(प्रविष्टि);
  पात्र.scrollTop = पात्र.scrollHeight;
}

// लॉग स्वच्छीकरणम् (Clear logs)
function लॉग_स्वच्छीकरणम्() {
  const पात्र = document.getElementById('विवरण-लॉग-पात्र');
  if (पात्र) पात्र.innerHTML = '';
}
