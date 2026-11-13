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

// पञ्जिका नामावलिः (Registers list: A, B, C, D, E, H, L, M, SP, PC)
const पञ्जिका_नामावलिः = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'SP', 'PC'];

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
  window.सम्पादके_उद्घाटनम् = सम्पादके_उद्घाटनम्;

  प्रक्रमक.पञ्जिका.PC = स्मृति_आरम्भ_सङ्केतः;
  बिट_पट्टिका_निर्माणम्();
  द्वितीय_निवेश_परिवर्तनम्();
  स्मृति_सूची_नवीकरणम्();
  पटल_अद्यतनम्();
  लॉग_योजनम्("Intel 8085 Microprocessor Ready. PC initialized to 0x" + स्मृति_आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0'));
});

// बिट पट्टिका निर्माणम् (Construct 8-bit / 16-bit bubbles for all registers)
function बिट_पट्टिका_निर्माणम्() {
  for (const पञ्जिका_नाम of पञ्जिका_नामावलिः) {
    const पट्टिका = document.getElementById(`बिट-पट्टिका-${पञ्जिका_नाम}`);
    if (!पट्टिका) continue;
    पट्टिका.innerHTML = '';
    const बिट्_संख्या = (पञ्जिका_नाम === 'SP' || पञ्जिका_नाम === 'PC') ? 16 : 8;
    if (बिट्_संख्या === 16) {
      पट्टिका.className = 'पंजिका-बिट-पट्टिका-षोडश';
    } else {
      पट्टिका.className = 'पंजिका-बिट-पट्टिका';
    }
    for (let बिट् = बिट्_संख्या - 1; बिट् >= 0; बिट्--) {
      const गोलक = document.createElement('div');
      गोलक.className = (बिट्_संख्या === 16) ? 'बिट-गोलक बिट-गोलक-लघु' : 'बिट-गोलक';
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
  const मुखौटा = (पञ्जिका_नाम === 'SP' || पञ्जिका_नाम === 'PC') ? 0xFFFF : 0xFF;

  if (पञ्जिका_नाम === 'M') {
    const एचएल = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
    प्रक्रमक.स्मृति[एचएल] = नूतन_मूल्यम् & 0xFF;
    लॉग_योजनम्(`Toggled Bit ${बिट्_सूचकाङ्कः} of Memory [0x${एचएल.toString(16).toUpperCase().padStart(4, '0')}]: now 0x${(नूतन_मूल्यम् & 0xFF).toString(16).toUpperCase().padStart(2, '0')}`);
  } else {
    प्रक्रमक.पञ्जिका[पञ्जिका_नाम] = नूतन_मूल्यम् & मुखौटा;
    const पैडिंग = (मुखौटा === 0xFFFF) ? 4 : 2;
    लॉग_योजनम्(`Toggled Bit ${बिट्_सूचकाङ्कः} of Register ${पञ्जिका_नाम}: now 0x${(नूतन_मूल्यम् & मुखौटा).toString(16).toUpperCase().padStart(पैडिंग, '0')}`);
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

  const मुखौटा = (पञ्जिका_नाम === 'SP' || पञ्जिका_नाम === 'PC') ? 0xFFFF : 0xFF;
  मूल्यम् = मूल्यम् & मुखौटा;
  const पैडिंग = (मुखौटा === 0xFFFF) ? 4 : 2;

  if (पञ्जिका_नाम === 'M') {
    const एचएल = (प्रक्रमक.पञ्जिका.H << 8) | प्रक्रमक.पञ्जिका.L;
    प्रक्रमक.स्मृति[एचएल] = मूल्यम्;
    लॉग_योजनम्(`Loaded 0x${मूल्यम्.toString(16).toUpperCase().padStart(2, '0')} into Memory [0x${एचएल.toString(16).toUpperCase().padStart(4, '0')}]`);
  } else {
    प्रक्रमक.पञ्जिका[पञ्जिका_नाम] = मूल्यम्;
    लॉग_योजनम्(`Loaded 0x${मूल्यम्.toString(16).toUpperCase().padStart(पैडिंग, '0')} into Register ${पञ्जिका_नाम}`);
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

  const दत्त_स्तूप = document.getElementById('दत्त-स्तूप-मान');
  if (दत्त_स्तूप) दत्त_स्तूप.textContent = '0x' + प्रक्रमक.पञ्जिका.SP.toString(16).toUpperCase().padStart(4, '0');

  const दत्त_गणक = document.getElementById('दत्त-गणक-मान');
  if (दत्त_गणक) दत्त_गणक.textContent = '0x' + प्रक्रमक.पञ्जिका.PC.toString(16).toUpperCase().padStart(4, '0');

  const स्मृति_एम_टैग = document.getElementById('स्मृति-एम-संकेतक');
  if (स्मृति_एम_टैग) स्मृति_एम_टैग.textContent = `@[HL: 0x${एचएल.toString(16).toUpperCase().padStart(4, '0')}]`;

  for (const पञ्जिका_नाम of पञ्जिका_नामावलिः) {
    let मूल्यम्;
    if (पञ्जिका_नाम === 'M') {
      मूल्यम् = प्रक्रमक.स्मृति[एचएल];
    } else {
      मूल्यम् = प्रक्रमक.पञ्जिका[पञ्जिका_नाम];
    }

    const बिट्_संख्या = (पञ्जिका_नाम === 'SP' || पञ्जिका_नाम === 'PC') ? 16 : 8;
    const पैडिंग = (बिट्_संख्या === 16) ? 4 : 2;

    const दशमलव = document.getElementById(`पंजिका-दशमलव-${पञ्जिका_नाम}`);
    if (दशमलव) {
      दशमलव.textContent = `0x${मूल्यम्.toString(16).toUpperCase().padStart(पैडिंग, '0')} (${मूल्यम्})`;
    }

    for (let बिट् = बिट्_संख्या - 1; बिट् >= 0; बिट्--) {
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

  // ३. ध्वजाः (Flags: S, Z, AC, P, CY, V, K updated with 0/1 values and active highlights)
  ध्वज_मान_नवीकरणम्('चिह्न-ध्वजा-मान', प्रक्रमक.ध्वजाः.S);
  ध्वज_मान_नवीकरणम्('शून्य-ध्वजा-मान', प्रक्रमक.ध्वजाः.Z);
  ध्वज_मान_नवीकरणम्('सहायक-वह-मान', प्रक्रमक.ध्वजाः.AC);
  ध्वज_मान_नवीकरणम्('समता-ध्वजा-मान', प्रक्रमक.ध्वजाः.P);
  ध्वज_मान_नवीकरणम्('हासिल-ध्वजा-मान', प्रक्रमक.ध्वजाः.CY);
  ध्वज_मान_नवीकरणम्('अधिकप्रवाह-ध्वजा-मान', प्रक्रमक.ध्वजाः.V);
  ध्वज_मान_नवीकरणम्('के-ध्वजा-मान', प्रक्रमक.ध्वजाः.K);

  // दत्त पञ्जिका फलके ध्वजाः (Flags in Data Registers panel with 0/1 values)
  ध्वज_मान_नवीकरणम्('दत्त-चिह्न-मान', प्रक्रमक.ध्वजाः.S);
  ध्वज_मान_नवीकरणम्('दत्त-शून्य-मान', प्रक्रमक.ध्वजाः.Z);
  ध्वज_मान_नवीकरणम्('दत्त-सहायक-मान', प्रक्रमक.ध्वजाः.AC);
  ध्वज_मान_नवीकरणम्('दत्त-समता-मान', प्रक्रमक.ध्वजाः.P);
  ध्वज_मान_नवीकरणम्('दत्त-हासिल-मान', प्रक्रमक.ध्वजाः.CY);
  ध्वज_मान_नवीकरणम्('दत्त-अधिकप्रवाह-मान', प्रक्रमक.ध्वजाः.V);
  ध्वज_मान_नवीकरणम्('दत्त-के-मान', प्रक्रमक.ध्वजाः.K);

  // ४. ALU आरेख व संकेतक (ALU Wedge & Live Operand Inputs)
  गणना_यन्त्र_अद्यतनम्();

  // ५. स्मृति सूचौ सक्रिय पद द्योतनम्
  स्मृति_सक्रिय_पद_द्योतनम्();
}

function ध्वज_मान_नवीकरणम्(कोष्ठक_इदम्, मानम्) {
  const कोष्ठक = document.getElementById(कोष्ठक_इदम्);
  if (!कोष्ठक) return;
  const संख्या_मान = मानम् ? 1 : 0;
  कोष्ठक.textContent = संख्या_मान;
  if (संख्या_मान === 1) {
    कोष्ठक.classList.add('सक्रिय-ध्वजा');
  } else {
    कोष्ठक.classList.remove('सक्रिय-ध्वजा');
  }
}

// द्वितीय निवेश परिवर्तनम् (Change chosen ALU second operand)
function द्वितीय_निवेश_परिवर्तनम्() {
  const चयन = document.getElementById('गणक-द्वितीय-निवेश-चयन');
  const निवेश = document.getElementById('गणक-तात्कालिक-मूल्य-निवेश');
  if (चयन && निवेश) {
    if (चयन.value === 'd8') {
      निवेश.style.display = 'inline-block';
    } else {
      निवेश.style.display = 'none';
    }
  }
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
    const निवेश = document.getElementById('गणक-तात्कालिक-मूल्य-निवेश');
    let मान = 0x05;
    if (निवेश) {
      const पाठ = निवेश.value.trim();
      if (पाठ.toUpperCase().endsWith('H')) {
        मान = parseInt(पाठ.slice(0, -1), 16);
      } else if (पाठ.startsWith('0x') || पाठ.startsWith('0X')) {
        मान = parseInt(पाठ, 16);
      } else {
        मान = parseInt(पाठ, 10);
      }
      if (isNaN(मान)) मान = 0;
    }
    मान = मान & 0xFF;
    return { नाम: `Imm ${मान.toString(16).toUpperCase().padStart(2, '0')}H`, मान: मान };
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

// स्मृति सूची नवीकरणम् (Disassemble memory instructions according to 8085 byte length: 1, 2, or 3 bytes)
function स्मृति_सूची_नवीकरणम्() {
  const पात्र = document.getElementById('स्मृति-सूची-पात्र');
  if (!पात्र) return;
  पात्र.innerHTML = '';

  let धारा_पता = स्मृति_आरम्भ_सङ्केतः;
  let पद_गणना = 0;

  // Render 32 sequential disassembled instructions from the selected base address
  while (पद_गणना < 32 && धारा_पता <= 0xFFFF) {
    const आरम्भ_सङ्केतः = धारा_पता;
    const विश्लेषण = प्रक्रमक_विसंयोजन(आरम्भ_सङ्केतः);
    const पंक्ति = document.createElement('div');
    पंक्ति.className = 'स्मृति-पंक्ति';
    पंक्ति.id = `स्मृति-पंक्ति-${आरम्भ_सङ्केतः}`;

    const पता_कोष्ठक = document.createElement('span');
    पता_कोष्ठक.className = 'स्मृति-पता';
    पता_कोष्ठक.textContent = आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0') + 'H';

    const बाइट_कोष्ठक = document.createElement('span');
    बाइट_कोष्ठक.className = 'स्मृति-बाइट';
    बाइट_कोष्ठक.textContent = विश्लेषण.हेक्स;

    const कूट_कोष्ठक = document.createElement('span');
    कूट_कोष्ठक.className = 'स्मृति-कूट';
    कूट_कोष्ठक.textContent = विश्लेषण.म्नेमोनिक;

    पंक्ति.appendChild(पता_कोष्ठक);
    पंक्ति.appendChild(बाइट_कोष्ठक);
    पंक्ति.appendChild(कूट_कोष्ठक);

    paत्र_योजनम्(पात्र, पंक्ति);
    धारा_पता = (धारा_पता + विश्लेषण.दीर्घता) & 0xFFFF;
    पद_गणना++;
    if (धारा_पता < आरम्भ_सङ्केतः) break; // Wrapped at 0xFFFF
  }

  स्मृति_सक्रिय_पद_द्योतनम्();
}

function paत्र_योजनम्(पात्र, पंक्ति) {
  पात्र.appendChild(पंक्ति);
}

// 8085 विसंयोजक (Industry Standard Intel 8085 Disassembler Engine)
function प्रक्रमक_विसंयोजन(पता) {
  const op = प्रक्रमक.स्मृति[पता & 0xFFFF];
  const b1 = प्रक्रमक.स्मृति[(पता + 1) & 0xFFFF];
  const b2 = प्रक्रमक.स्मृति[(पता + 2) & 0xFFFF];
  const hex1 = op.toString(16).toUpperCase().padStart(2, '0');
  const hex2 = b1.toString(16).toUpperCase().padStart(2, '0');
  const hex3 = b2.toString(16).toUpperCase().padStart(2, '0');
  const addr16 = ((b2 << 8) | b1).toString(16).toUpperCase().padStart(4, '0') + 'H';
  const data8 = hex2 + 'H';

  const regNames = ['B', 'C', 'D', 'E', 'H', 'L', 'M', 'A'];

  // 1. Data Transfer MOV r1, r2 (0x40 - 0x7F except 0x76 HLT)
  if (op >= 0x40 && op <= 0x7F) {
    if (op === 0x76) return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'HLT' };
    const dst = regNames[(op >> 3) & 0x07];
    const src = regNames[op & 0x07];
    return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: `MOV ${dst}, ${src}` };
  }

  // 2. Arithmetic & Logic on registers (0x80 - 0xBF)
  const aluOps = ['ADD', 'ADC', 'SUB', 'SBB', 'ANA', 'XRA', 'ORA', 'CMP'];
  if (op >= 0x80 && op <= 0xBF) {
    const opIndex = (op >> 3) & 0x07;
    const src = regNames[op & 0x07];
    return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: `${aluOps[opIndex]} ${src}` };
  }

  // 3. Specific table of standard 8085 instructions
  switch (op) {
    // 1-Byte Instructions
    case 0x00: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'NOP' };
    case 0x07: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RLC' };
    case 0x0F: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RRC' };
    case 0x17: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RAL' };
    case 0x1F: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RAR' };
    case 0x27: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DAA' };
    case 0x2F: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'CMA' };
    case 0x37: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'STC' };
    case 0x3F: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'CMC' };
    case 0xEB: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'XCHG' };
    case 0xE3: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'XTHL' };
    case 0xF9: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'SPHL' };
    case 0xE9: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'PCHL' };
    case 0xC9: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RET' };
    case 0xC8: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RZ' };
    case 0xC0: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RNZ' };
    case 0xD8: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RC' };
    case 0xD0: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RNC' };
    case 0xF8: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RM' };
    case 0xF0: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RP' };
    case 0xE8: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RPE' };
    case 0xE0: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'RPO' };

    // Pair math & transfer
    case 0x09: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DAD B' };
    case 0x19: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DAD D' };
    case 0x29: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DAD H' };
    case 0x39: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DAD SP' };

    case 0x03: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INX B' };
    case 0x13: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INX D' };
    case 0x23: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INX H' };
    case 0x33: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INX SP' };

    case 0x0B: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCX B' };
    case 0x1B: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCX D' };
    case 0x2B: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCX H' };
    case 0x3B: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCX SP' };

    case 0x0A: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'LDAX B' };
    case 0x1A: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'LDAX D' };
    case 0x02: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'STAX B' };
    case 0x12: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'STAX D' };

    case 0xC5: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'PUSH B' };
    case 0xD5: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'PUSH D' };
    case 0xE5: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'PUSH H' };
    case 0xF5: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'PUSH PSW' };
    case 0xC1: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'POP B' };
    case 0xD1: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'POP D' };
    case 0xE1: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'POP H' };
    case 0xF1: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'POP PSW' };

    // INR & DCR
    case 0x04: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR B' };
    case 0x0C: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR C' };
    case 0x14: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR D' };
    case 0x1C: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR E' };
    case 0x24: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR H' };
    case 0x2C: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR L' };
    case 0x34: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR M' };
    case 0x3C: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'INR A' };

    case 0x05: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR B' };
    case 0x0D: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR C' };
    case 0x15: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR D' };
    case 0x1D: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR E' };
    case 0x25: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR H' };
    case 0x2D: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR L' };
    case 0x35: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR M' };
    case 0x3D: return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: 'DCR A' };

    // 2-Byte Instructions (Immediate Data)
    case 0x06: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI B, ${data8}` };
    case 0x0E: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI C, ${data8}` };
    case 0x16: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI D, ${data8}` };
    case 0x1E: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI E, ${data8}` };
    case 0x26: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI H, ${data8}` };
    case 0x2E: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI L, ${data8}` };
    case 0x36: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI M, ${data8}` };
    case 0x3E: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `MVI A, ${data8}` };

    case 0xC6: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `ADI ${data8}` };
    case 0xCE: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `ACI ${data8}` };
    case 0xD6: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `SUI ${data8}` };
    case 0xDE: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `SBI ${data8}` };
    case 0xE6: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `ANI ${data8}` };
    case 0xEE: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `XRI ${data8}` };
    case 0xF6: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `ORI ${data8}` };
    case 0xFE: return { दीर्घता: 2, हेक्स: `${hex1} ${hex2}`, म्नेमोनिक: `CPI ${data8}` };

    // 3-Byte Instructions (Address or 16-bit Immediate)
    case 0x01: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `LXI B, ${addr16}` };
    case 0x11: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `LXI D, ${addr16}` };
    case 0x21: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `LXI H, ${addr16}` };
    case 0x31: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `LXI SP, ${addr16}` };

    case 0x3A: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `LDA ${addr16}` };
    case 0x32: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `STA ${addr16}` };
    case 0x2A: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `LHLD ${addr16}` };
    case 0x22: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `SHLD ${addr16}` };

    case 0xC3: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JMP ${addr16}` };
    case 0xCA: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JZ ${addr16}` };
    case 0xC2: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JNZ ${addr16}` };
    case 0xDA: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JC ${addr16}` };
    case 0xD2: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JNC ${addr16}` };
    case 0xFA: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JM ${addr16}` };
    case 0xF2: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JP ${addr16}` };
    case 0xEA: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JPE ${addr16}` };
    case 0xE2: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JPO ${addr16}` };
    case 0xFD: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `JX5 ${addr16}` };

    case 0xCD: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CALL ${addr16}` };
    case 0xCC: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CZ ${addr16}` };
    case 0xC4: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CNZ ${addr16}` };
    case 0xDC: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CC ${addr16}` };
    case 0xD4: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CNC ${addr16}` };
    case 0xFC: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CM ${addr16}` };
    case 0xF4: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CP ${addr16}` };
    case 0xEC: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CPE ${addr16}` };
    case 0xE4: return { दीर्घता: 3, हेक्स: `${hex1} ${hex2} ${hex3}`, म्नेमोनिक: `CPO ${addr16}` };

    default:
      // RST n (0xC7 | (n << 3))
      if ((op & 0xC7) === 0xC7) {
        const n = (op >> 3) & 0x07;
        return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: `RST ${n}` };
      }
      return { दीर्घता: 1, हेक्स: hex1, म्नेमोनिक: `DB ${hex1}H` };
  }
}

function स्मृति_सक्रिय_पद_द्योतनम्() {
  document.querySelectorAll('.स्मृति-पंक्ति').forEach(प => प.classList.remove('सक्रिय-निर्देश'));
  let सक्रिय = document.getElementById(`स्मृति-पंक्ति-${प्रक्रमक.पञ्जिका.PC}`);

  // If the instruction at the current PC is not in the currently rendered window,
  // re-center the disassembly window starting around PC
  if (!सक्रिय) {
    स्मृति_आरम्भ_सङ्केतः = प्रक्रमक.पञ्जिका.PC;
    स्मृति_सूची_नवीकरणम्();
    सक्रिय = document.getElementById(`स्मृति-पंक्ति-${प्रक्रमक.पञ्जिका.PC}`);
  }

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
  try {
    sessionStorage.removeItem('अष्टशून्यपञ्चाशीति_वर्तमान_संहिता');
  } catch (इ) {}
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
    try {
      sessionStorage.setItem('अष्टशून्यपञ्चाशीति_वर्तमान_संहिता', संहिता);
    } catch (इ) {}
    स्मृति_आरम्भ_सङ्केतः = आरम्भ;
    const निवेश = document.getElementById('स्मृति-आरम्भ-निवेश');
    if (निवेश) निवेश.value = आरम्भ.toString(16).toUpperCase().padStart(4, '0');
    स्मृति_सूची_नवीकरणम्();
    पटल_अद्यतनम्();
    लॉग_योजनम्(`Assembly program loaded successfully at 0x${आरम्भ.toString(16).toUpperCase().padStart(4, '0')}.`);
  } catch (दोषः) {
    लॉग_योजनम्(`Assembler Error: ${दोषः.message}`);
  }
}

// स्मृतितः असेंबली निष्कर्षणम् (Disassemble memory back to assembly code text)
function स्मृतितः_असेंबली_निष्कर्षणम्() {
  let पाठ = `ORG ${स्मृति_आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0')}H\n`;
  let धारा_पता = स्मृति_आरम्भ_सङ्केतः;
  let शून्य_सङ्ख्या = 0;
  let संकलित_पंक्तयः = [];

  while (धारा_पता <= 0xFFFF && संकलित_पंक्तयः.length < 64) {
    const विश्लेषण = प्रक्रमक_विसंयोजन(धारा_पता);
    const बाइट = प्रक्रमक.स्मृति[धारा_पता];

    if (बाइट === 0x00) {
      शून्य_सङ्ख्या++;
      if (शून्य_सङ्ख्या > 5) break; // End of program code block
    } else {
      शून्य_सङ्ख्या = 0;
    }

    संकलित_पंक्तयः.push(`    ${विश्लेषण.म्नेमोनिक}`);
    धारा_पता = (धारा_पता + विश्लेषण.दीर्घता) & 0xFFFF;
    if (बाइट === 0x76) break; // HLT encountered
    if (धारा_पता === 0) break;
  }

  // Remove trailing NOPs
  while (संकलित_पंक्तयः.length > 0 && संकलित_पंक्तयः[संकलित_पंक्तयः.length - 1].trim() === 'NOP') {
    संकलित_पंक्तयः.pop();
  }

  if (संकलित_पंक्तयः.length === 0) return '';
  return पाठ + संकलित_पंक्तयः.join('\n') + '\n';
}

// सम्पादके उद्घाटनम् (Open in ASM Editor with current program)
function सम्पादके_उद्घाटनम्() {
  try {
    let वर्तमान_संहिता = sessionStorage.getItem('अष्टशून्यपञ्चाशीति_वर्तमान_संहिता');
    if (!वर्तमान_संहिता || !वर्तमान_संहिता.trim()) {
      const निष्कर्षित = स्मृतितः_असेंबली_निष्कर्षणम्();
      if (निष्कर्षित && निष्कर्षित.trim()) {
        वर्तमान_संहिता = निष्कर्षित;
        sessionStorage.setItem('अष्टशून्यपञ्चाशीति_वर्तमान_संहिता', वर्तमान_संहिता);
      }
    }
  } catch (इ) {}
  window.open('8085_asm_editor/8085_asm_editor.html', '_blank');
}
// निर्देश स्मृति सत्यापनम् (Validate memory instructions)
function निर्देश_स्मृति_सत्यापनम्() {
  const फलक = document.getElementById('सत्यापन-फलक');
  if (!फलक) return;

  फलक.style.display = 'block';
  फलक.style.background = 'rgba(16, 185, 129, 0.15)';
  फलक.style.border = '1px solid rgba(16, 185, 129, 0.4)';
  फलक.style.color = '#34d399';
  फलक.innerHTML = `<span>✓ All memory instructions from 0x${स्मृति_आरम्भ_सङ्केतः.toString(16).toUpperCase().padStart(4, '0')} are valid Intel 8085 opcodes.</span> <a href="javascript:void(0)" onclick="सम्पादके_उद्घाटनम्()" style="color: #38bdf8; margin-left: 0.5rem; text-decoration: underline;">Open in 8085 ASM Editor ↗</a>`;
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
