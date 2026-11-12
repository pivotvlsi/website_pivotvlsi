import { अष्टशून्यपञ्चाशीति_संसाधकम् } from '../अष्टशून्यपञ्चाशीति_संसाधकम्.js';
import { expect } from 'vitest';

export function deepMerge(लक्ष्यम्, स्रोतः) {
  const परिणामः = { ...लक्ष्यम् };
  for (const कुंजी in स्रोतः) {
    if (स्रोतः[कुंजी] && typeof स्रोतः[कुंजी] === 'object' && !Array.isArray(स्रोतः[कुंजी])) {
      परिणामः[कुंजी] = deepMerge(परिणामः[कुंजी] || {}, स्रोतः[कुंजी]);
    } else if (स्रोतः[कुंजी] !== undefined) {
      परिणामः[कुंजी] = स्रोतः[कुंजी];
    }
  }
  return परिणामः;
}

// Global active CPU instance
let सक्रिय_संसाधकः = new अष्टशून्यपञ्चाशीति_संसाधकम्();

export async function initSimulator() {
  सक्रिय_संसाधकः = new अष्टशून्यपञ्चाशीति_संसाधकम्();
  return 1;
}

function संख्या_पार्स(पाठ, षोडश_बिट् = false) {
  let s = पाठ.trim();
  const मुखौटा = षोडश_बिट् ? 0xFFFF : 0xFF;
  if (s.startsWith("'") && s.endsWith("'")) {
    return s.charCodeAt(1) & मुखौटा;
  }
  if (s.toUpperCase().endsWith("B") && /^[01]+B$/i.test(s)) {
    return parseInt(s.slice(0, -1), 2) & मुखौटा;
  }
  if (s.toUpperCase().endsWith("Q") || s.toUpperCase().endsWith("O")) {
    return parseInt(s.slice(0, -1), 8) & मुखौटा;
  }
  if (s.toUpperCase().endsWith("H") || s.toUpperCase().startsWith("0X") || /[A-F]/i.test(s)) {
    return parseInt(s.replace(/0X/i, '').replace(/H/i, ''), 16) & मुखौटा;
  }
  if (/^[0-9+*\-/() ]+$/.test(s)) {
    try {
      return (Function(`"use strict"; return (${s});`)()) & मुखौटा;
    } catch {
      return parseInt(s, 10) & मुखौटा;
    }
  }
  return parseInt(s, 10) & मुखौटा;
}

function असेम्बल_पङ्क्ति(पङ्क्ति) {
  let पाठ = पङ्क्ति.split(';')[0].trim().toUpperCase();
  if (!पाठ) return [];

  // NOP / HLT
  if (पाठ === 'NOP') return [0x00];
  if (पाठ === 'HLT') return [0x76];

  // XCHG
  if (पाठ === 'XCHG') return [0xEB];

  // DAA / CMA / CMC / STC
  if (पाठ === 'DAA') return [0x27];
  if (पाठ === 'CMA') return [0x2F];
  if (पाठ === 'CMC') return [0x3F];
  if (पाठ === 'STC') return [0x37];
  if (पाठ === 'RLC') return [0x07];
  if (पाठ === 'RRC') return [0x0F];
  if (पाठ === 'RAL') return [0x17];
  if (पाठ === 'RAR') return [0x1F];

  // ADD r / ADD M
  const संकलन_मेल = पाठ.match(/^ADD\s+([A-EHLM])$/);
  if (संकलन_मेल) {
    const पञ्जिका = संकलन_मेल[1];
    const मानचित्र = { 'B': 0x80, 'C': 0x81, 'D': 0x82, 'E': 0x83, 'H': 0x84, 'L': 0x85, 'M': 0x86, 'A': 0x87 };
    return [मानचित्र[पञ्जिका]];
  }

  // ADC r / ADC M
  const एडिसी_मेल = पाठ.match(/^ADC\s+([A-EHLM])$/);
  if (एडिसी_मेल) {
    const पञ्जिका = एडिसी_मेल[1];
    const मानचित्र = { 'B': 0x88, 'C': 0x89, 'D': 0x8A, 'E': 0x8B, 'H': 0x8C, 'L': 0x8D, 'M': 0x8E, 'A': 0x8F };
    return [मानचित्र[पञ्जिका]];
  }

  // ADI d8 / ACI d8
  const एडीआई_मेल = पाठ.match(/^ADI\s+([0-9A-FX]+)H?$/);
  if (एडीआई_मेल) {
    const मूल्य = parseInt(एडीआई_मेल[1].replace('0X', ''), 16) & 0xFF;
    return [0xC6, मूल्य];
  }
  const एसीआई_मेल = पाठ.match(/^ACI\s+([0-9A-FX]+)H?$/);
  if (एसीआई_मेल) {
    const मूल्य = parseInt(एसीआई_मेल[1].replace('0X', ''), 16) & 0xFF;
    return [0xCE, मूल्य];
  }

  // SUB r / SUB M
  const व्यवकलन_मेल = पाठ.match(/^SUB\s+([A-EHLM])$/);
  if (व्यवकलन_मेल) {
    const पञ्जिका = व्यवकलन_मेल[1];
    const मानचित्र = { 'B': 0x90, 'C': 0x91, 'D': 0x92, 'E': 0x93, 'H': 0x94, 'L': 0x95, 'M': 0x96, 'A': 0x97 };
    return [मानचित्र[पञ्जिका]];
  }

  // SBB r / SBB M
  const एसबीबी_मेल = पाठ.match(/^SBB\s+([A-EHLM])$/);
  if (एसबीबी_मेल) {
    const पञ्जिका = एसबीबी_मेल[1];
    const मानचित्र = { 'B': 0x98, 'C': 0x99, 'D': 0x9A, 'E': 0x9B, 'H': 0x9C, 'L': 0x9D, 'M': 0x9E, 'A': 0x9F };
    return [मानचित्र[पञ्जिका]];
  }

  // SUI d8 / SBI d8
  const एसयूआई_मेल = पाठ.match(/^SUI\s+([0-9A-FX]+)H?$/);
  if (एसयूआई_मेल) {
    const कच्चा_पाठ = एसयूआई_मेल[1];
    let मूल्य;
    if (पङ्क्ति.toUpperCase().includes('H') || कच्चा_पाठ.startsWith('0X') || /[A-F]/.test(कच्चा_पाठ)) {
      मूल्य = parseInt(कच्चा_पाठ.replace('0X', ''), 16) & 0xFF;
    } else {
      मूल्य = parseInt(कच्चा_पाठ, 10) & 0xFF;
    }
    return [0xD6, मूल्य];
  }
  const एसबीआई_मेल = पाठ.match(/^SBI\s+([0-9A-FX]+)H?$/);
  if (एसबीआई_मेल) {
    const कच्चा_पाठ = एसबीआई_मेल[1];
    let मूल्य;
    if (पङ्क्ति.toUpperCase().includes('H') || कच्चा_पाठ.startsWith('0X') || /[A-F]/.test(कच्चा_पाठ)) {
      मूल्य = parseInt(कच्चा_पाठ.replace('0X', ''), 16) & 0xFF;
    } else {
      मूल्य = parseInt(कच्चा_पाठ, 10) & 0xFF;
    }
    return [0xDE, मूल्य];
  }

  // ANA r / ANI d8
  const एना_मेल = पाठ.match(/^ANA\s+([A-EHLM])$/);
  if (एना_मेल) {
    const पञ्जिका = एना_मेल[1];
    const मानचित्र = { 'B': 0xA0, 'C': 0xA1, 'D': 0xA2, 'E': 0xA3, 'H': 0xA4, 'L': 0xA5, 'M': 0xA6, 'A': 0xA7 };
    return [मानचित्र[पञ्जिका]];
  }
  // ANI d8
  const एनीआई_मेल = पङ्क्ति.split(';')[0].trim().match(/^ANI\s+(.+)$/i);
  if (एनीआई_मेल) {
    return [0xE6, संख्या_पार्स(एनीआई_मेल[1])];
  }

  // ORA r / ORI d8
  const ओरा_मेल = पाठ.match(/^ORA\s+([A-EHLM])$/);
  if (ओरा_मेल) {
    const पञ्जिका = ओरा_मेल[1];
    const मानचित्र = { 'B': 0xB0, 'C': 0xB1, 'D': 0xB2, 'E': 0xB3, 'H': 0xB4, 'L': 0xB5, 'M': 0xB6, 'A': 0xB7 };
    return [मानचित्र[पञ्जिका]];
  }
  const ओआरआई_मेल = पङ्क्ति.split(';')[0].trim().match(/^ORI\s+(.+)$/i);
  if (ओआरआई_मेल) {
    return [0xF6, संख्या_पार्स(ओआरआई_मेल[1])];
  }

  // XRA r / XRI d8
  const एक्सरा_मेल = पाठ.match(/^XRA\s+([A-EHLM])$/);
  if (एक्सरा_मेल) {
    const पञ्जिका = एक्सरा_मेल[1];
    const मानचित्र = { 'B': 0xA8, 'C': 0xA9, 'D': 0xAA, 'E': 0xAB, 'H': 0xAC, 'L': 0xAD, 'M': 0xAE, 'A': 0xAF };
    return [मानचित्र[पञ्जिका]];
  }
  const एक्सआरआई_मेल = पङ्क्ति.split(';')[0].trim().match(/^XRI\s+(.+)$/i);
  if (एक्सआरआई_मेल) {
    return [0xEE, संख्या_पार्स(एक्सआरआई_मेल[1])];
  }

  // CMP r / CPI d8
  const सीएमपी_मेल = पाठ.match(/^CMP\s+([A-EHLM])$/);
  if (सीएमपी_मेल) {
    const पञ्जिका = सीएमपी_मेल[1];
    const मानचित्र = { 'B': 0xB8, 'C': 0xB9, 'D': 0xBA, 'E': 0xBB, 'H': 0xBC, 'L': 0xBD, 'M': 0xBE, 'A': 0xBF };
    return [मानचित्र[पञ्जिका]];
  }
  const सीपीआई_मेल = पाठ.match(/^CPI\s+(.+)$/);
  if (सीपीआई_मेल) {
    let raw = सीपीआई_मेल[1].trim();
    let मूल्य;
    if (raw.startsWith("'") && raw.endsWith("'")) {
      मूल्य = raw.charCodeAt(1) & 0xFF;
    } else if (raw.endsWith("H") || raw.startsWith("0X") || /[A-F]/.test(raw)) {
      मूल्य = parseInt(raw.replace(/0X/i, '').replace(/H/i, ''), 16) & 0xFF;
    } else {
      मूल्य = parseInt(raw, 10) & 0xFF;
    }
    return [0xFE, मूल्य];
  }

  // DAD rp
  const डैड_मेल = पाठ.match(/^DAD\s+(B|D|H|SP)$/i);
  if (डैड_मेल) {
    const युग्म = डैड_मेल[1].toUpperCase();
    const मानचित्र = { 'B': 0x09, 'D': 0x19, 'H': 0x29, 'SP': 0x39 };
    return [मानचित्र[युग्म]];
  }

  // INX rp / DCX rp
  const आइएनएक्स_मेल = पाठ.match(/^INX\s+(B|D|H|SP)$/i);
  if (आइएनएक्स_मेल) {
    const युग्म = आइएनएक्स_मेल[1].toUpperCase();
    const मानचित्र = { 'B': 0x03, 'D': 0x13, 'H': 0x23, 'SP': 0x33 };
    return [मानचित्र[युग्म]];
  }
  const डीसीएक्स_मेल = पाठ.match(/^DCX\s+(B|D|H|SP)$/i);
  if (डीसीएक्स_मेल) {
    const युग्म = डीसीएक्स_मेल[1].toUpperCase();
    const मानचित्र = { 'B': 0x0B, 'D': 0x1B, 'H': 0x2B, 'SP': 0x3B };
    return [मानचित्र[युग्म]];
  }

  // INR r / DCR r
  const आइएनआर_मेल = पाठ.match(/^INR\s+([A-EHLM])$/i);
  if (आइएनआर_मेल) {
    const पञ्जिका = आइएनआर_मेल[1].toUpperCase();
    const मानचित्र = { 'B': 0x04, 'C': 0x0C, 'D': 0x14, 'E': 0x1C, 'H': 0x24, 'L': 0x2C, 'M': 0x34, 'A': 0x3C };
    return [मानचित्र[पञ्जिका]];
  }
  const डीसीआर_मेल = पाठ.match(/^DCR\s+([A-EHLM])$/i);
  if (डीसीआर_मेल) {
    const पञ्जिका = डीसीआर_मेल[1].toUpperCase();
    const मानचित्र = { 'B': 0x05, 'C': 0x0D, 'D': 0x15, 'E': 0x1D, 'H': 0x25, 'L': 0x2D, 'M': 0x35, 'A': 0x3D };
    return [मानचित्र[पञ्जिका]];
  }

  // MOV r1, r2
  const एमओवी_मेल = पाठ.match(/^MOV\s+([A-EHLM]),\s*([A-EHLM])$/);
  if (एमओवी_मेल) {
    const गन्तव्य = एमओवी_मेल[1];
    const स्रोतः = एमओवी_मेल[2];
    const पञ्जिका_क्रमाङ्क = { 'B': 0, 'C': 1, 'D': 2, 'E': 3, 'H': 4, 'L': 5, 'M': 6, 'A': 7 };
    const ओपकोड = 0x40 | (पञ्जिका_क्रमाङ्क[गन्तव्य] << 3) | पञ्जिका_क्रमाङ्क[स्रोतः];
    return [ओपकोड];
  }

  // MVI r, d8
  const एमवीआई_मेल = पाठ.match(/^MVI\s+([A-EHLM]),\s*(.+)$/i);
  if (एमवीआई_मेल) {
    const पञ्जिका = एमवीआई_मेल[1].toUpperCase();
    const मूल्य = संख्या_पार्स(एमवीआई_मेल[2]) & 0xFF;
    const पञ्जिका_क्रमाङ्क = { 'B': 0, 'C': 1, 'D': 2, 'E': 3, 'H': 4, 'L': 5, 'M': 6, 'A': 7 };
    const ओपकोड = 0x06 | (पञ्जिका_क्रमाङ्क[पञ्जिका] << 3);
    return [ओपकोड, मूल्य];
  }

  // LDAX rp / STAX rp
  const एलडीएएक्स_मेल = पाठ.match(/^LDAX\s+(B|D)$/i);
  if (एलडीएएक्स_मेल) {
    const युग्म = एलडीएएक्स_मेल[1].toUpperCase();
    return [युग्म === 'B' ? 0x0A : 0x1A];
  }
  const एसटीएएक्स_मेल = पाठ.match(/^STAX\s+(B|D)$/i);
  if (एसटीएएक्स_मेल) {
    const युग्म = एसटीएएक्स_मेल[1].toUpperCase();
    return [युग्म === 'B' ? 0x02 : 0x12];
  }

  // LXI rp, d16
  const एलएक्सआई_मेल = पङ्क्ति.split(';')[0].trim().match(/^LXI\s+(B|D|H|SP),\s*(.+)$/i);
  if (एलएक्सआई_मेल) {
    const युग्म = एलएक्सआई_मेल[1].toUpperCase();
    const मूल्य = संख्या_पार्स(एलएक्सआई_मेल[2], true) & 0xFFFF;
    const निम्न = मूल्य & 0xFF;
    const उच्च = (मूल्य >> 8) & 0xFF;
    const मानचित्र = { 'B': 0x01, 'D': 0x11, 'H': 0x21, 'SP': 0x31 };
    return [मानचित्र[युग्म], निम्न, उच्च];
  }

  // LDA / STA / LHLD / SHLD
  const एलडीए_मेल = पाठ.match(/^LDA\s+(.+)$/i);
  if (एलडीए_मेल) {
    const मूल्य = संख्या_पार्स(एलडीए_मेल[1], true) & 0xFFFF;
    return [0x3A, मूल्य & 0xFF, (मूल्य >> 8) & 0xFF];
  }
  const एसटीए_मेल = पाठ.match(/^STA\s+(.+)$/i);
  if (एसटीए_मेल) {
    const मूल्य = संख्या_पार्स(एसटीए_मेल[1], true) & 0xFFFF;
    return [0x32, मूल्य & 0xFF, (मूल्य >> 8) & 0xFF];
  }
  const एलएचएलडी_मेल = पाठ.match(/^LHLD\s+(.+)$/i);
  if (एलएचएलडी_मेल) {
    const मूल्य = संख्या_पार्स(एलएचएलडी_मेल[1], true) & 0xFFFF;
    return [0x2A, मूल्य & 0xFF, (मूल्य >> 8) & 0xFF];
  }
  const एसएचएलडी_मेल = पाठ.match(/^SHLD\s+(.+)$/i);
  if (एसएचएलडी_मेल) {
    const मूल्य = संख्या_पार्स(एसएचएलडी_मेल[1], true) & 0xFFFF;
    return [0x22, मूल्य & 0xFF, (मूल्य >> 8) & 0xFF];
  }

    // 4. JMP / JZ / JNZ / JC / JNC / JM / JP / JPE / JPO / JX5 adr
    const कूर्दन_मेल = पाठ.match(/^(JMP|JZ|JNZ|JC|JNC|JM|JP|JPE|JPO|JX5)\s+(.+)$/i);
    if (कूर्दन_मेल) {
      const संक्रिया = कूर्दन_मेल[1].toUpperCase();
      const मूल्यम् = संख्या_पार्स(कूर्दन_मेल[2], true) & 0xFFFF;
      const निम्न = मूल्यम् & 0xFF;
      const उच्च = (मूल्यम् >> 8) & 0xFF;
      const संकेतक_मानचित्र = {
        'JMP': 0xC3, 'JNZ': 0xC2, 'JZ': 0xCA,
        'JNC': 0xD2, 'JC': 0xDA,
        'JPO': 0xE2, 'JPE': 0xEA,
        'JP': 0xF2, 'JM': 0xFA,
        'JX5': 0xFD
      };
      const ओपकोड = संकेतक_मानचित्र[संक्रिया];
      return [ओपकोड, निम्न, उच्च];
    }

    // 5. CALL / CC / CNC / CZ / CNZ / CM / CP / CPE / CPO adr
    const आह्वान_मेल = पाठ.match(/^(CALL|CC|CNC|CZ|CNZ|CM|CP|CPE|CPO)\s+(.+)$/i);
    if (आह्वान_मेल) {
      const संक्रिया = आह्वान_मेल[1].toUpperCase();
      const मूल्यम् = संख्या_पार्स(आह्वान_मेल[2], true) & 0xFFFF;
      const निम्न = मूल्यम् & 0xFF;
      const उच्च = (मूल्यम् >> 8) & 0xFF;
      const संकेतक_मानचित्र = {
        'CALL': 0xCD, 'CNZ': 0xC4, 'CZ': 0xCC,
        'CNC': 0xD4, 'CC': 0xDC,
        'CPO': 0xE4, 'CPE': 0xEC,
        'CP': 0xF4, 'CM': 0xFC
      };
      const ओपकोड = संकेतक_मानचित्र[संक्रिया];
      return [ओपकोड, निम्न, उच्च];
    }

    // 6. RET / RC / RNC / RZ / RNZ / RP / RM / RPE / RPO / RSTV / XTHL / SPHL / PCHL
    const निवर्तन_मानचित्र = {
      'RET': 0xC9, 'RNZ': 0xC0, 'RZ': 0xC8,
      'RNC': 0xD0, 'RC': 0xD8,
      'RPO': 0xE0, 'RPE': 0xE8,
      'RP': 0xF0, 'RM': 0xF8,
      'RSTV': 0xCB,
      'XTHL': 0xE3,
      'SPHL': 0xF9,
      'PCHL': 0xE9
    };
    if (निवर्तन_मानचित्र[पाठ]) {
      return [निवर्तन_मानचित्र[पाठ]];
    }

    // RST n (0..7)
    const आरएसटी_मेल = पाठ.match(/^RST\s+([0-7])$/i);
    if (आरएसटी_मेल) {
      const n = parseInt(आरएसटी_मेल[1], 10);
      return [0xC7 | (n << 3)];
    }

    // 7. PUSH rp / POP rp
    const पुश्_मेल = पाठ.match(/^PUSH\s+(B|D|H|PSW)$/i);
    if (पुश्_मेल) {
      const rp = पुश्_मेल[1].toUpperCase();
      const मानचित्र = { 'B': 0xC5, 'D': 0xD5, 'H': 0xE5, 'PSW': 0xF5 };
      return [मानचित्र[rp]];
    }
    const पॉप_मेल = पाठ.match(/^POP\s+(B|D|H|PSW)$/i);
    if (पॉप_मेल) {
      const rp = पॉप_मेल[1].toUpperCase();
      const मानचित्र = { 'B': 0xC1, 'D': 0xD1, 'H': 0xE1, 'PSW': 0xF1 };
      return [मानचित्र[rp]];
    }

  return [];
}

export function loadProgram({ activeFile, loadAddress = 0 }) {
  const सामग्री = activeFile.content;
  const पङ्क्तयः = सामग्री.split('\n');
  const लेबल_मानचित्र = {};

  // Pass 1: Collect labels and calculate instruction addresses
  let धारा_पता = loadAddress;
  for (const पङ्क्ति of पङ्क्तयः) {
    let पाठ = पङ्क्ति.split(';')[0].trim();
    if (!पाठ) continue;
    if (पाठ.toLowerCase().startsWith('org')) {
      const भाग = पाठ.split(/\s+/)[1];
      धारा_पता = संख्या_पार्स(भाग, true) & 0xFFFF;
      continue;
    }
    const लेबल_मेल = पाठ.match(/^([a-zA-Z0-9_?@]+):\s*(.*)$/);
    if (लेबल_मेल) {
      लेबल_मानचित्र[लेबल_मेल[1].toLowerCase()] = धारा_पता;
      पाठ = लेबल_मेल[2].trim();
      if (!पाठ) continue;
    }
    const बाइट्स = असेम्बल_पङ्क्ति(पाठ);
    धारा_पता += बाइट्स.length > 0 ? बाइट्स.length : 3;
  }

  // Pass 2: Assemble instructions with resolved labels
  const assembled = [];
  धारा_पता = loadAddress;
  for (const पङ्क्ति of पङ्क्तयः) {
    let पाठ = पङ्क्ति.split(';')[0].trim();
    if (!पाठ) continue;
    if (पाठ.toLowerCase().startsWith('org')) {
      const भाग = पाठ.split(/\s+/)[1];
      धारा_पता = संख्या_पार्स(भाग, true) & 0xFFFF;
      continue;
    }
    const लेबल_मेल = पाठ.match(/^([a-zA-Z0-9_?@]+):\s*(.*)$/);
    if (लेबल_मेल) {
      पाठ = लेबल_मेल[2].trim();
      if (!पाठ) continue;
    }

    // Replace label operand if found (only on jump/call target operands)
    const खण्ड = पाठ.split(/\s+/);
    if (['JMP', 'JZ', 'JNZ', 'JC', 'JNC', 'JM', 'JP', 'JPE', 'JPO', 'JX5',
         'CALL', 'CC', 'CNC', 'CZ', 'CNZ', 'CM', 'CP', 'CPE', 'CPO'].includes(खण्ड[0].toUpperCase())) {
      const लक्ष्य_नाम = खण्ड.slice(1).join(' ').trim().toLowerCase();
      if (लेबल_मानचित्र[लक्ष्य_नाम] !== undefined) {
        पाठ = `${खण्ड[0]} 0x${लेबल_मानचित्र[लक्ष्य_नाम].toString(16)}`;
      }
    }

    const बाइट्स = असेम्बल_पङ्क्ति(पाठ);
    for (const बाइट of बाइट्स) {
      सक्रिय_संसाधकः.स्मृति[धारा_पता++] = बाइट;
      assembled.push({ data: बाइट });
    }
  }

  return {
    statePointer: 1,
    memory: सक्रिय_संसाधकः.स्मृति,
    assembled
  };
}

export function setFlags(state) {
  if (state.flags) {
    सक्रिय_संसाधकः.ध्वजाः.S = state.flags.s ? 1 : 0;
    सक्रिय_संसाधकः.ध्वजाः.Z = state.flags.z ? 1 : 0;
    सक्रिय_संसाधकः.ध्वजाः.AC = state.flags.ac ? 1 : 0;
    सक्रिय_संसाधकः.ध्वजाः.P = state.flags.p ? 1 : 0;
    सक्रिय_संसाधकः.ध्वजाः.CY = state.flags.c ? 1 : 0;
    सक्रिय_संसाधकः.ध्वजाः.V = state.flags.v ? 1 : 0;
    सक्रिय_संसाधकः.ध्वजाः.K = state.flags.k ? 1 : 0;
  }
}

export function setRegisters(state) {
  if (state.accumulator !== undefined) {
    सक्रिय_संसाधकः.पञ्जिका.A = state.accumulator & 0xFF;
  }
  if (state.registers) {
    if (state.registers.bc) {
      सक्रिय_संसाधकः.पञ्जिका.B = state.registers.bc.high & 0xFF;
      सक्रिय_संसाधकः.पञ्जिका.C = state.registers.bc.low & 0xFF;
    }
    if (state.registers.de) {
      सक्रिय_संसाधकः.पञ्जिका.D = state.registers.de.high & 0xFF;
      सक्रिय_संसाधकः.पञ्जिका.E = state.registers.de.low & 0xFF;
    }
    if (state.registers.hl) {
      सक्रिय_संसाधकः.पञ्जिका.H = state.registers.hl.high & 0xFF;
      सक्रिय_संसाधकः.पञ्जिका.L = state.registers.hl.low & 0xFF;
    }
  }
  if (state.stackPointer !== undefined) {
    सक्रिय_संसाधकः.पञ्जिका.SP = state.stackPointer & 0xFFFF;
  }
  if (state.programCounter !== undefined) {
    सक्रिय_संसाधकः.पञ्जिका.PC = state.programCounter & 0xFFFF;
  }
}

export function setInterruptState() {}
export function setMemoryLocation(state, पता, मूल्य) {
  सक्रिय_संसाधकः.स्मृति[पता & 0xFFFF] = मूल्य & 0xFF;
}
export function setIOPort(state, द्वार, मूल्य) {
  सक्रिय_संसाधकः.निवेशनिर्गमः[द्वार & 0xFF] = मूल्य & 0xFF;
}

export function runProgram(finalState) {
  सक्रिय_संसाधकः.चालयति();

  return {
    accumulator: सक्रिय_संसाधकः.पञ्जिका.A,
    registers: {
      bc: { high: सक्रिय_संसाधकः.पञ्जिका.B, low: सक्रिय_संसाधकः.पञ्जिका.C },
      de: { high: सक्रिय_संसाधकः.पञ्जिका.D, low: सक्रिय_संसाधकः.पञ्जिका.E },
      hl: { high: सक्रिय_संसाधकः.पञ्जिका.H, low: सक्रिय_संसाधकः.पञ्जिका.L }
    },
    stackPointer: सक्रिय_संसाधकः.पञ्जिका.SP,
    programCounter: सक्रिय_संसाधकः.पञ्जिका.PC,
    flags: {
      s: Boolean(सक्रिय_संसाधकः.ध्वजाः.S),
      z: Boolean(सक्रिय_संसाधकः.ध्वजाः.Z),
      ac: Boolean(सक्रिय_संसाधकः.ध्वजाः.AC),
      p: Boolean(सक्रिय_संसाधकः.ध्वजाः.P),
      c: Boolean(सक्रिय_संसाधकः.ध्वजाः.CY),
      v: Boolean(सक्रिय_संसाधकः.ध्वजाः.V),
      k: Boolean(सक्रिय_संसाधकः.ध्वजाः.K)
    },
    memory: सक्रिय_संसाधकः.स्मृति
  };
}

export async function setupSimulator(code, loadAddress = 0) {
  await initSimulator();
  const loadResult = loadProgram({
    activeFile: { content: code },
    loadAddress
  });
  return loadResult;
}

export function runTestProgram(state) {
  const defaultState = {
    accumulator: 0,
    registers: {
      bc: { high: 0, low: 0 },
      de: { high: 0, low: 0 },
      hl: { high: 0, low: 0 }
    },
    stackPointer: 0xFFFF,
    programCounter: 0,
    flags: { s: false, z: false, ac: false, p: false, c: false, v: false, k: false }
  };
  const finalState = deepMerge(defaultState, state);
  setFlags(finalState);
  setRegisters(finalState);

  if (state.memory) {
    Object.entries(state.memory).forEach(([पता, मूल्य]) => {
      सक्रिय_संसाधकः.स्मृति[parseInt(पता, 10)] = मूल्य;
    });
  }

  return runProgram(finalState);
}

export function verifyCpuState(resultState, expectedState, path = '') {
  Object.keys(expectedState).forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof expectedState[key] === 'object' && !Array.isArray(expectedState[key])) {
      verifyCpuState(resultState[key], expectedState[key], currentPath);
    } else {
      expect(
        resultState[key],
        `Verification failed at "${currentPath}": Expected ${expectedState[key]} but got ${resultState[key]}`
      ).toBe(expectedState[key]);
    }
  });
}

export async function runTest(code, initialState, expectedCpuState) {
  const { assembled, memory } = await setupSimulator(code);
  const resultState = runTestProgram({
    assembled,
    memory,
    loadAddress: 0,
    ...initialState
  });
  verifyCpuState(resultState, expectedCpuState);
  return resultState;
}

export async function runAndGetState(code, initialState = {}) {
  const { assembled, memory } = await setupSimulator(code);
  return runTestProgram({
    assembled,
    memory,
    loadAddress: 0,
    ...initialState
  });
}
