export class अष्टशून्यपञ्चाशीति_संसाधकम् {
  constructor() {
    this.स्मृति = new Uint8Array(65536);
    this.निवेशनिर्गमः = new Uint8Array(256);
    this.पुनःस्थापनम्();
  }

  पुनःस्थापनम्() {
    this.पञ्जिका = {
      A: 0x00,
      B: 0x00,
      C: 0x00,
      D: 0x00,
      E: 0x00,
      H: 0x00,
      L: 0x00,
      SP: 0xFFFF,
      PC: 0x0000
    };
    this.ध्वजाः = {
      S: 0,
      Z: 0,
      AC: 0,
      P: 0,
      CY: 0,
      V: 0,
      K: 0
    };
    this.विरामः = false;
    this.अवरोध_सक्रियः = false;
    this.घटिका_चक्राणि = 0;
  }

  समता_परीक्षणम्(मूल्यम्) {
    let संख्या = मूल्यम् & 0xFF;
    let गणना = 0;
    while (संख्या !== 0) {
      गणना += संख्या & 1;
      संख्या >>>= 1;
    }
    return (गणना % 2 === 0) ? 1 : 0;
  }

  अङ्कगणित_ध्वज_नवीकरणम्(परिणामः, पूर्व_क, पूर्व_ख, संकलनम् = true, वह_निवेशः = 0) {
    const अष्टबिट् = परिणामः & 0xFF;
    this.ध्वजाः.Z = (अष्टबिट् === 0) ? 1 : 0;
    this.ध्वजाः.S = (अष्टबिट् & 0x80) ? 1 : 0;
    this.ध्वजाः.P = this.समता_परीक्षणम्(अष्टबिट्);

    if (संकलनम्) {
      this.ध्वजाः.CY = (परिणामः > 0xFF) ? 1 : 0;
      this.ध्वजाः.AC = (((पूर्व_क & 0x0F) + (पूर्व_ख & 0x0F) + वह_निवेशः) > 0x0F) ? 1 : 0;
      const चिह्न_वहः = (((पूर्व_क & 0x7F) + (पूर्व_ख & 0x7F) + वह_निवेशः) > 0x7F);
      const वह_निर्गमः = (परिणामः > 0xFF);
      this.ध्वजाः.V = (चिह्न_वहः !== वह_निर्गमः) ? 1 : 0;
      this.ध्वजाः.K = (this.ध्वजाः.V !== this.ध्वजाः.S) ? 1 : 0;
    } else {
      const पूरकम् = (~पूर्व_ख) & 0xFF;
      const ऋण_वह_निवेशः = 1 - वह_निवेशः;
      const कुल_घट्य = पूर्व_ख + वह_निवेशः;
      this.ध्वजाः.CY = (पूर्व_क < कुल_घट्य) ? 1 : 0;
      this.ध्वजाः.AC = (((पूर्व_क & 0x0F) + (पूरकम् & 0x0F) + ऋण_वह_निवेशः) > 0x0F) ? 1 : 0;
      const चिह्न_वहः = (((पूर्व_क & 0x7F) + (पूरकम् & 0x7F) + ऋण_वह_निवेशः) > 0x7F);
      const वह_निर्गमः = ((पूर्व_क + पूरकम् + ऋण_वह_निवेशः) > 0xFF);
      this.ध्वजाः.V = (चिह्न_वहः !== वह_निर्गमः) ? 1 : 0;
      this.ध्वजाः.K = (this.ध्वजाः.V !== this.ध्वजाः.S) ? 1 : 0;
    }
  }

  तर्क_ध्वज_नवीकरणम्(परिणामः, अर्ध_वहः = 0) {
    const अष्टबिट् = परिणामः & 0xFF;
    this.ध्वजाः.Z = (अष्टबिट् === 0) ? 1 : 0;
    this.ध्वजाः.S = (अष्टबिट् & 0x80) ? 1 : 0;
    this.ध्वजाः.P = this.समता_परीक्षणम्(अष्टबिट्);
    this.ध्वजाः.CY = 0;
    this.ध्वजाः.AC = अर्ध_वहः ? 1 : 0;
    this.ध्वजाः.V = 0;
    this.ध्वजाः.K = 0;
  }

  पदम्_चालयति() {
    if (this.विरामः) return 0;

    const संकेतम् = this.स्मृति[this.पञ्जिका.PC];
    this.पञ्जिका.PC = (this.पञ्जिका.PC + 1) & 0xFFFF;

    switch (संकेतम्) {
      // NOP
      case 0x00:
        this.घटिका_चक्राणि += 4;
        return 4;

      // HLT
      case 0x76:
        this.विरामः = true;
        this.घटिका_चक्राणि += 5;
        return 5;

      // XCHG (0xEB)
      case 0xEB: {
        const पूर्व_घ = this.पञ्जिका.D;
        const पूर्व_ङ = this.पञ्जिका.E;
        this.पञ्जिका.D = this.पञ्जिका.H;
        this.पञ्जिका.E = this.पञ्जिका.L;
        this.पञ्जिका.H = पूर्व_घ;
        this.पञ्जिका.L = पूर्व_ङ;
        this.घटिका_चक्राणि += 4;
        return 4;
      }

      // CMA
      case 0x2F:
        this.पञ्जिका.A = (~this.पञ्जिका.A) & 0xFF;
        this.घटिका_चक्राणि += 4;
        return 4;

      // CMC
      case 0x3F:
        this.ध्वजाः.CY = this.ध्वजाः.CY ? 0 : 1;
        this.घटिका_चक्राणि += 4;
        return 4;

      // STC
      case 0x37:
        this.ध्वजाः.CY = 1;
        this.घटिका_चक्राणि += 4;
        return 4;

      // RLC (0x07)
      case 0x07: {
        const उच्च_बिट् = (this.पञ्जिका.A >> 7) & 1;
        this.पञ्जिका.A = ((this.पञ्जिका.A << 1) | उच्च_बिट्) & 0xFF;
        this.ध्वजाः.CY = उच्च_बिट्;
        this.घटिका_चक्राणि += 4;
        return 4;
      }

      // RRC (0x0F)
      case 0x0F: {
        const निम्न_बिट् = this.पञ्जिका.A & 1;
        this.पञ्जिका.A = ((this.पञ्जिका.A >> 1) | (निम्न_बिट् << 7)) & 0xFF;
        this.ध्वजाः.CY = निम्न_बिट्;
        this.घटिका_चक्राणि += 4;
        return 4;
      }

      // RAL (0x17)
      case 0x17: {
        const पूर्व_वहः = this.ध्वजाः.CY;
        this.ध्वजाः.CY = (this.पञ्जिका.A >> 7) & 1;
        this.पञ्जिका.A = ((this.पञ्जिका.A << 1) | पूर्व_वहः) & 0xFF;
        this.घटिका_चक्राणि += 4;
        return 4;
      }

      // RAR (0x1F)
      case 0x1F: {
        const पूर्व_वहः = this.ध्वजाः.CY;
        this.ध्वजाः.CY = this.पञ्जिका.A & 1;
        this.पञ्जिका.A = ((this.पञ्जिका.A >> 1) | (पूर्व_वहः << 7)) & 0xFF;
        this.घटिका_चक्राणि += 4;
        return 4;
      }

      // MOV r, r'
      case 0x7F: this.पञ्जिका.A = this.पञ्जिका.A; this.घटिका_चक्राणि += 4; return 4;
      case 0x78: this.पञ्जिका.A = this.पञ्जिका.B; this.घटिका_चक्राणि += 4; return 4;
      case 0x79: this.पञ्जिका.A = this.पञ्जिका.C; this.घटिका_चक्राणि += 4; return 4;
      case 0x7A: this.पञ्जिका.A = this.पञ्जिका.D; this.घटिका_चक्राणि += 4; return 4;
      case 0x7B: this.पञ्जिका.A = this.पञ्जिका.E; this.घटिका_चक्राणि += 4; return 4;
      case 0x7C: this.पञ्जिका.A = this.पञ्जिका.H; this.घटिका_चक्राणि += 4; return 4;
      case 0x7D: this.पञ्जिका.A = this.पञ्जिका.L; this.घटिका_चक्राणि += 4; return 4;

      case 0x47: this.पञ्जिका.B = this.पञ्जिका.A; this.घटिका_चक्राणि += 4; return 4;
      case 0x40: this.पञ्जिका.B = this.पञ्जिका.B; this.घटिका_चक्राणि += 4; return 4;
      case 0x41: this.पञ्जिका.B = this.पञ्जिका.C; this.घटिका_चक्राणि += 4; return 4;
      case 0x42: this.पञ्जिका.B = this.पञ्जिका.D; this.घटिका_चक्राणि += 4; return 4;
      case 0x43: this.पञ्जिका.B = this.पञ्जिका.E; this.घटिका_चक्राणि += 4; return 4;
      case 0x44: this.पञ्जिका.B = this.पञ्जिका.H; this.घटिका_चक्राणि += 4; return 4;
      case 0x45: this.पञ्जिका.B = this.पञ्जिका.L; this.घटिका_चक्राणि += 4; return 4;

      case 0x4F: this.पञ्जिका.C = this.पञ्जिका.A; this.घटिका_चक्राणि += 4; return 4;
      case 0x48: this.पञ्जिका.C = this.पञ्जिका.B; this.घटिका_चक्राणि += 4; return 4;
      case 0x49: this.पञ्जिका.C = this.पञ्जिका.C; this.घटिका_चक्राणि += 4; return 4;
      case 0x4A: this.पञ्जिका.C = this.पञ्जिका.D; this.घटिका_चक्राणि += 4; return 4;
      case 0x4B: this.पञ्जिका.C = this.पञ्जिका.E; this.घटिका_चक्राणि += 4; return 4;
      case 0x4C: this.पञ्जिका.C = this.पञ्जिका.H; this.घटिका_चक्राणि += 4; return 4;
      case 0x4D: this.पञ्जिका.C = this.पञ्जिका.L; this.घटिका_चक्राणि += 4; return 4;

      case 0x57: this.पञ्जिका.D = this.पञ्जिका.A; this.घटिका_चक्राणि += 4; return 4;
      case 0x50: this.पञ्जिका.D = this.पञ्जिका.B; this.घटिका_चक्राणि += 4; return 4;
      case 0x51: this.पञ्जिका.D = this.पञ्जिका.C; this.घटिका_चक्राणि += 4; return 4;
      case 0x52: this.पञ्जिका.D = this.पञ्जिका.D; this.घटिका_चक्राणि += 4; return 4;
      case 0x53: this.पञ्जिका.D = this.पञ्जिका.E; this.घटिका_चक्राणि += 4; return 4;
      case 0x54: this.पञ्जिका.D = this.पञ्जिका.H; this.घटिका_चक्राणि += 4; return 4;
      case 0x55: this.पञ्जिका.D = this.पञ्जिका.L; this.घटिका_चक्राणि += 4; return 4;

      case 0x5F: this.पञ्जिका.E = this.पञ्जिका.A; this.घटिका_चक्राणि += 4; return 4;
      case 0x58: this.पञ्जिका.E = this.पञ्जिका.B; this.घटिका_चक्राणि += 4; return 4;
      case 0x59: this.पञ्जिका.E = this.पञ्जिका.C; this.घटिका_चक्राणि += 4; return 4;
      case 0x5A: this.पञ्जिका.E = this.पञ्जिका.D; this.घटिका_चक्राणि += 4; return 4;
      case 0x5B: this.पञ्जिका.E = this.पञ्जिका.E; this.घटिका_चक्राणि += 4; return 4;
      case 0x5C: this.पञ्जिका.E = this.पञ्जिका.H; this.घटिका_चक्राणि += 4; return 4;
      case 0x5D: this.पञ्जिका.E = this.पञ्जिका.L; this.घटिका_चक्राणि += 4; return 4;

      case 0x67: this.पञ्जिका.H = this.पञ्जिका.A; this.घटिका_चक्राणि += 4; return 4;
      case 0x60: this.पञ्जिका.H = this.पञ्जिका.B; this.घटिका_चक्राणि += 4; return 4;
      case 0x61: this.पञ्जिका.H = this.पञ्जिका.C; this.घटिका_चक्राणि += 4; return 4;
      case 0x62: this.पञ्जिका.H = this.पञ्जिका.D; this.घटिका_चक्राणि += 4; return 4;
      case 0x63: this.पञ्जिका.H = this.पञ्जिका.E; this.घटिका_चक्राणि += 4; return 4;
      case 0x64: this.पञ्जिका.H = this.पञ्जिका.H; this.घटिका_चक्राणि += 4; return 4;
      case 0x65: this.पञ्जिका.H = this.पञ्जिका.L; this.घटिका_चक्राणि += 4; return 4;

      case 0x6F: this.पञ्जिका.L = this.पञ्जिका.A; this.घटिका_चक्राणि += 4; return 4;
      case 0x68: this.पञ्जिका.L = this.पञ्जिका.B; this.घटिका_चक्राणि += 4; return 4;
      case 0x69: this.पञ्जिका.L = this.पञ्जिका.C; this.घटिका_चक्राणि += 4; return 4;
      case 0x6A: this.पञ्जिका.L = this.पञ्जिका.D; this.घटिका_चक्राणि += 4; return 4;
      case 0x6B: this.पञ्जिका.L = this.पञ्जिका.E; this.घटिका_चक्राणि += 4; return 4;
      case 0x6C: this.पञ्जिका.L = this.पञ्जिका.H; this.घटिका_चक्राणि += 4; return 4;
      case 0x6D: this.पञ्जिका.L = this.पञ्जिका.L; this.घटिका_चक्राणि += 4; return 4;

      // MOV M, r & MOV r, M
      case 0x77: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.स्मृति[पता] = this.पञ्जिका.A;
        this.घटिका_चक्राणि += 7;
        return 7;
      }
      case 0x7E: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.पञ्जिका.A = this.स्मृति[पता];
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // MVI r, d8
      case 0x3E: this.पञ्जिका.A = this.स्मृति[this.पञ्जिका.PC++]; this.घटिका_चक्राणि += 7; return 7;
      case 0x06: this.पञ्जिका.B = this.स्मृति[this.पञ्जिका.PC++]; this.घटिका_चक्राणि += 7; return 7;
      case 0x0E: this.पञ्जिका.C = this.स्मृति[this.पञ्जिका.PC++]; this.घटिका_चक्राणि += 7; return 7;
      case 0x16: this.पञ्जिका.D = this.स्मृति[this.पञ्जिका.PC++]; this.घटिका_चक्राणि += 7; return 7;
      case 0x1E: this.पञ्जिका.E = this.स्मृति[this.पञ्जिका.PC++]; this.घटिका_चक्राणि += 7; return 7;
      case 0x26: this.पञ्जिका.H = this.स्मृति[this.पञ्जिका.PC++]; this.घटिका_चक्राणि += 7; return 7;
      case 0x2E: this.पञ्जिका.L = this.स्मृति[this.पञ्जिका.PC++]; this.घटिका_चक्राणि += 7; return 7;
      case 0x36: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.स्मृति[पता] = this.स्मृति[this.पञ्जिका.PC++];
        this.घटिका_चक्राणि += 10;
        return 10;
      }

      // LDA adr (0x3A)
      case 0x3A: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        const पता = (उच्च << 8) | निम्न;
        this.पञ्जिका.A = this.स्मृति[पता];
        this.घटिका_चक्राणि += 13;
        return 13;
      }

      // STA adr (0x32)
      case 0x32: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        const पता = (उच्च << 8) | निम्न;
        this.स्मृति[पता] = this.पञ्जिका.A;
        this.घटिका_चक्राणि += 13;
        return 13;
      }

      // LHLD adr (0x2A)
      case 0x2A: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        const पता = (उच्च << 8) | निम्न;
        this.पञ्जिका.L = this.स्मृति[पता];
        this.पञ्जिका.H = this.स्मृति[(पता + 1) & 0xFFFF];
        this.घटिका_चक्राणि += 16;
        return 16;
      }

      // SHLD adr (0x22)
      case 0x22: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        const पता = (उच्च << 8) | निम्न;
        this.स्मृति[पता] = this.पञ्जिका.L;
        this.स्मृति[(पता + 1) & 0xFFFF] = this.पञ्जिका.H;
        this.घटिका_चक्राणि += 16;
        return 16;
      }

      // LDAX rp (0x0A, 0x1A)
      case 0x0A: {
        const पता = (this.पञ्जिका.B << 8) | this.पञ्जिका.C;
        this.पञ्जिका.A = this.स्मृति[पता];
        this.घटिका_चक्राणि += 7;
        return 7;
      }
      case 0x1A: {
        const पता = (this.पञ्जिका.D << 8) | this.पञ्जिका.E;
        this.पञ्जिका.A = this.स्मृति[पता];
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // STAX rp (0x02, 0x12)
      case 0x02: {
        const पता = (this.पञ्जिका.B << 8) | this.पञ्जिका.C;
        this.स्मृति[पता] = this.पञ्जिका.A;
        this.घटिका_चक्राणि += 7;
        return 7;
      }
      case 0x12: {
        const पता = (this.पञ्जिका.D << 8) | this.पञ्जिका.E;
        this.स्मृति[पता] = this.पञ्जिका.A;
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // LXI rp, d16
      case 0x01:
        this.पञ्जिका.C = this.स्मृति[this.पञ्जिका.PC++];
        this.पञ्जिका.B = this.स्मृति[this.पञ्जिका.PC++];
        this.घटिका_चक्राणि += 10;
        return 10;
      case 0x11:
        this.पञ्जिका.E = this.स्मृति[this.पञ्जिका.PC++];
        this.पञ्जिका.D = this.स्मृति[this.पञ्जिका.PC++];
        this.घटिका_चक्राणि += 10;
        return 10;
      case 0x21:
        this.पञ्जिका.L = this.स्मृति[this.पञ्जिका.PC++];
        this.पञ्जिका.H = this.स्मृति[this.पञ्जिका.PC++];
        this.घटिका_चक्राणि += 10;
        return 10;
      case 0x31: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        this.पञ्जिका.SP = (उच्च << 8) | निम्न;
        this.घटिका_चक्राणि += 10;
        return 10;
      }

      // ADD r
      case 0x87: this.संकलनम्(this.पञ्जिका.A); return 4;
      case 0x80: this.संकलनम्(this.पञ्जिका.B); return 4;
      case 0x81: this.संकलनम्(this.पञ्जिका.C); return 4;
      case 0x82: this.संकलनम्(this.पञ्जिका.D); return 4;
      case 0x83: this.संकलनम्(this.पञ्जिका.E); return 4;
      case 0x84: this.संकलनम्(this.पञ्जिका.H); return 4;
      case 0x85: this.संकलनम्(this.पञ्जिका.L); return 4;
      case 0x86: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.संकलनम्(this.स्मृति[पता]);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // ADC r
      case 0x8F: this.संकलनम्(this.पञ्जिका.A, this.ध्वजाः.CY); return 4;
      case 0x88: this.संकलनम्(this.पञ्जिका.B, this.ध्वजाः.CY); return 4;
      case 0x89: this.संकलनम्(this.पञ्जिका.C, this.ध्वजाः.CY); return 4;
      case 0x8A: this.संकलनम्(this.पञ्जिका.D, this.ध्वजाः.CY); return 4;
      case 0x8B: this.संकलनम्(this.पञ्जिका.E, this.ध्वजाः.CY); return 4;
      case 0x8C: this.संकलनम्(this.पञ्जिका.H, this.ध्वजाः.CY); return 4;
      case 0x8D: this.संकलनम्(this.पञ्जिका.L, this.ध्वजाः.CY); return 4;
      case 0x8E: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.संकलनम्(this.स्मृति[पता], this.ध्वजाः.CY);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // ADI d8 / ACI d8
      case 0xC6: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.संकलनम्(मूल्यम्);
        this.घटिका_चक्राणि += 3;
        return 7;
      }
      case 0xCE: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.संकलनम्(मूल्यम्, this.ध्वजाः.CY);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // SUB r
      case 0x97: this.व्यवकलनम्(this.पञ्जिका.A); return 4;
      case 0x90: this.व्यवकलनम्(this.पञ्जिका.B); return 4;
      case 0x91: this.व्यवकलनम्(this.पञ्जिका.C); return 4;
      case 0x92: this.व्यवकलनम्(this.पञ्जिका.D); return 4;
      case 0x93: this.व्यवकलनम्(this.पञ्जिका.E); return 4;
      case 0x94: this.व्यवकलनम्(this.पञ्जिका.H); return 4;
      case 0x95: this.व्यवकलनम्(this.पञ्जिका.L); return 4;
      case 0x96: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.व्यवकलनम्(this.स्मृति[पता]);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // CMP r (0xB8 - 0xBF)
      case 0xBF: this.तुलना(this.पञ्जिका.A); return 4;
      case 0xB8: this.तुलना(this.पञ्जिका.B); return 4;
      case 0xB9: this.तुलना(this.पञ्जिका.C); return 4;
      case 0xBA: this.तुलना(this.पञ्जिका.D); return 4;
      case 0xBB: this.तुलना(this.पञ्जिका.E); return 4;
      case 0xBC: this.तुलना(this.पञ्जिका.H); return 4;
      case 0xBD: this.तुलना(this.पञ्जिका.L); return 4;
      case 0xBE: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.तुलना(this.स्मृति[पता]);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // CPI d8
      case 0xFE: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.तुलना(मूल्यम्);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // SBB r
      case 0x9F: this.व्यवकलनम्(this.पञ्जिका.A, this.ध्वजाः.CY); return 4;
      case 0x98: this.व्यवकलनम्(this.पञ्जिका.B, this.ध्वजाः.CY); return 4;
      case 0x99: this.व्यवकलनम्(this.पञ्जिका.C, this.ध्वजाः.CY); return 4;
      case 0x9A: this.व्यवकलनम्(this.पञ्जिका.D, this.ध्वजाः.CY); return 4;
      case 0x9B: this.व्यवकलनम्(this.पञ्जिका.E, this.ध्वजाः.CY); return 4;
      case 0x9C: this.व्यवकलनम्(this.पञ्जिका.H, this.ध्वजाः.CY); return 4;
      case 0x9D: this.व्यवकलनम्(this.पञ्जिका.L, this.ध्वजाः.CY); return 4;
      case 0x9E: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.व्यवकलनम्(this.स्मृति[पता], this.ध्वजाः.CY);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // SUI d8 / SBI d8
      case 0xD6: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.व्यवकलनम्(मूल्यम्);
        this.घटिका_चक्राणि += 3;
        return 7;
      }
      case 0xDE: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.व्यवकलनम्(मूल्यम्, this.ध्वजाः.CY);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // ANA r / ANI d8
      case 0xA7: this.तार्किक_तथा(this.पञ्जिका.A); return 4;
      case 0xA0: this.तार्किक_तथा(this.पञ्जिका.B); return 4;
      case 0xA1: this.तार्किक_तथा(this.पञ्जिका.C); return 4;
      case 0xA2: this.तार्किक_तथा(this.पञ्जिका.D); return 4;
      case 0xA3: this.तार्किक_तथा(this.पञ्जिका.E); return 4;
      case 0xA4: this.तार्किक_तथा(this.पञ्जिका.H); return 4;
      case 0xA5: this.तार्किक_तथा(this.पञ्जिका.L); return 4;
      case 0xE6: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.तार्किक_तथा(मूल्यम्);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // ORA r / ORI d8
      case 0xB7: this.तार्किक_वा(this.पञ्जिका.A); return 4;
      case 0xB0: this.तार्किक_वा(this.पञ्जिका.B); return 4;
      case 0xB1: this.तार्किक_वा(this.पञ्जिका.C); return 4;
      case 0xB2: this.तार्किक_वा(this.पञ्जिका.D); return 4;
      case 0xB3: this.तार्किक_वा(this.पञ्जिका.E); return 4;
      case 0xB4: this.तार्किक_वा(this.पञ्जिका.H); return 4;
      case 0xB5: this.तार्किक_वा(this.पञ्जिका.L); return 4;
      case 0xF6: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.तार्किक_वा(मूल्यम्);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // XRA r / XRI d8
      case 0xAF: this.तार्किक_वियोजक(this.पञ्जिका.A); return 4;
      case 0xA8: this.तार्किक_वियोजक(this.पञ्जिका.B); return 4;
      case 0xA9: this.तार्किक_वियोजक(this.पञ्जिका.C); return 4;
      case 0xAA: this.तार्किक_वियोजक(this.पञ्जिका.D); return 4;
      case 0xAB: this.तार्किक_वियोजक(this.पञ्जिका.E); return 4;
      case 0xAC: this.तार्किक_वियोजक(this.पञ्जिका.H); return 4;
      case 0xAD: this.तार्किक_वियोजक(this.पञ्जिका.L); return 4;
      case 0xEE: {
        const मूल्यम् = this.स्मृति[this.पञ्जिका.PC++];
        this.तार्किक_वियोजक(मूल्यम्);
        this.घटिका_चक्राणि += 3;
        return 7;
      }

      // INX rp (0x03, 0x13, 0x23, 0x33)
      case 0x03: {
        let मान = ((this.पञ्जिका.B << 8) | this.पञ्जिका.C) + 1;
        this.ध्वजाः.K = ((मान & 0xFFFF) === 0x0000) ? 1 : 0;
        this.पञ्जिका.B = (मान >> 8) & 0xFF;
        this.पञ्जिका.C = मान & 0xFF;
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0x13: {
        let मान = ((this.पञ्जिका.D << 8) | this.पञ्जिका.E) + 1;
        this.ध्वजाः.K = ((मान & 0xFFFF) === 0x0000) ? 1 : 0;
        this.पञ्जिका.D = (मान >> 8) & 0xFF;
        this.पञ्जिका.E = मान & 0xFF;
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0x23: {
        let मान = ((this.पञ्जिका.H << 8) | this.पञ्जिका.L) + 1;
        this.ध्वजाः.K = ((मान & 0xFFFF) === 0x0000) ? 1 : 0;
        this.पञ्जिका.H = (मान >> 8) & 0xFF;
        this.पञ्जिका.L = मान & 0xFF;
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0x33: {
        let मान = (this.पञ्जिका.SP + 1) & 0xFFFF;
        this.ध्वजाः.K = (मान === 0x0000) ? 1 : 0;
        this.पञ्जिका.SP = मान;
        this.घटिका_चक्राणि += 6;
        return 6;
      }

      // DCX rp (0x0B, 0x1B, 0x2B, 0x3B)
      case 0x0B: {
        let मान = ((this.पञ्जिका.B << 8) | this.पञ्जिका.C) - 1;
        this.ध्वजाः.K = ((मान & 0xFFFF) === 0xFFFF) ? 1 : 0;
        this.पञ्जिका.B = (मान >> 8) & 0xFF;
        this.पञ्जिका.C = मान & 0xFF;
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0x1B: {
        let मान = ((this.पञ्जिका.D << 8) | this.पञ्जिका.E) - 1;
        this.ध्वजाः.K = ((मान & 0xFFFF) === 0xFFFF) ? 1 : 0;
        this.पञ्जिका.D = (मान >> 8) & 0xFF;
        this.पञ्जिका.E = मान & 0xFF;
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0x2B: {
        let मान = ((this.पञ्जिका.H << 8) | this.पञ्जिका.L) - 1;
        this.ध्वजाः.K = ((मान & 0xFFFF) === 0xFFFF) ? 1 : 0;
        this.पञ्जिका.H = (मान >> 8) & 0xFF;
        this.पञ्जिका.L = मान & 0xFF;
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0x3B: {
        let मान = (this.पञ्जिका.SP - 1) & 0xFFFF;
        this.ध्वजाः.K = (मान === 0xFFFF) ? 1 : 0;
        this.पञ्जिका.SP = मान;
        this.घटिका_चक्राणि += 6;
        return 6;
      }

      // DAD rp (0x09, 0x19, 0x29, 0x39)
      case 0x09: {
        const खग = (this.पञ्जिका.B << 8) | this.पञ्जिका.C;
        this.द्विबाइट्_संकलनम्(खग);
        return 10;
      }
      case 0x19: {
        const घङ = (this.पञ्जिका.D << 8) | this.पञ्जिका.E;
        this.द्विबाइट्_संकलनम्(घङ);
        return 10;
      }
      case 0x29: {
        const चछ = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.द्विबाइट्_संकलनम्(चछ);
        return 10;
      }
      case 0x39: {
        this.द्विबाइट्_संकलनम्(this.पञ्जिका.SP);
        return 10;
      }

      // INR M / DCR M
      case 0x34: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.स्मृति[पता] = this.वर्धनम्(this.स्मृति[पता]);
        this.घटिका_चक्राणि += 6;
        return 10;
      }
      case 0x35: {
        const पता = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.स्मृति[पता] = this.ह्रासनम्(this.स्मृति[पता]);
        this.घटिका_चक्राणि += 6;
        return 10;
      }

      // INR r
      case 0x3C: this.पञ्जिका.A = this.वर्धनम्(this.पञ्जिका.A); return 4;
      case 0x04: this.पञ्जिका.B = this.वर्धनम्(this.पञ्जिका.B); return 4;
      case 0x0C: this.पञ्जिका.C = this.वर्धनम्(this.पञ्जिका.C); return 4;
      case 0x14: this.पञ्जिका.D = this.वर्धनम्(this.पञ्जिका.D); return 4;
      case 0x1C: this.पञ्जिका.E = this.वर्धनम्(this.पञ्जिका.E); return 4;
      case 0x24: this.पञ्जिका.H = this.वर्धनम्(this.पञ्जिका.H); return 4;
      case 0x2C: this.पञ्जिका.L = this.वर्धनम्(this.पञ्जिका.L); return 4;

      // DCR r
      case 0x3D: this.पञ्जिका.A = this.ह्रासनम्(this.पञ्जिका.A); return 4;
      case 0x05: this.पञ्जिका.B = this.ह्रासनम्(this.पञ्जिका.B); return 4;
      case 0x0D: this.पञ्जिका.C = this.ह्रासनम्(this.पञ्जिका.C); return 4;
      case 0x15: this.पञ्जिका.D = this.ह्रासनम्(this.पञ्जिका.D); return 4;
      case 0x1D: this.पञ्जिका.E = this.ह्रासनम्(this.पञ्जिका.E); return 4;
      case 0x25: this.पञ्जिका.H = this.ह्रासनम्(this.पञ्जिका.H); return 4;
      case 0x2D: this.पञ्जिका.L = this.ह्रासनम्(this.पञ्जिका.L); return 4;

      // DAA
      case 0x27: {
        let समायोजनम् = 0;
        let वह_स्थिति = this.ध्वजाः.CY;
        const क_मूल्य = this.पञ्जिका.A;

        if (this.ध्वजाः.AC || (क_मूल्य & 0x0F) > 9) {
          समायोजनम् |= 0x06;
        }
        if (this.ध्वजाः.CY || (क_मूल्य > 0x99) || (this.ध्वजाः.AC && (क_मूल्य > 0x9F))) {
          समायोजनम् |= 0x60;
          वह_स्थिति = 1;
        }

        const अर्ध_वह_गणना = (((क_मूल्य & 0x0F) + 0x06) > 0x0F);
        const योगफल = क_मूल्य + समायोजनम्;
        const परिणामः = योगफल & 0xFF;

        // V flag for DAA: overflow of signed range during addition of समायोजनम् to क_मूल्य
        // K flag = V ^ S
        const अधिकप्रवाह = (~(क_मूल्य ^ समायोजनम्) & (क_मूल्य ^ परिणामः) & 0x80) !== 0;
        this.ध्वजाः.V = अधिकप्रवाह ? 1 : 0;
        this.ध्वजाः.S = (परिणामः & 0x80) ? 1 : 0;
        this.ध्वजाः.K = (this.ध्वजाः.V ^ this.ध्वजाः.S) ? 1 : 0;

        this.पञ्जिका.A = परिणामः;
        this.ध्वजाः.Z = (परिणामः === 0) ? 1 : 0;
        this.ध्वजाः.P = this.समता_परीक्षणम्(परिणामः);
        this.ध्वजाः.CY = वह_स्थिति ? 1 : 0;
        this.ध्वजाः.AC = (this.ध्वजाः.AC || (क_मूल्य & 0x0F) > 9) ? (अर्ध_वह_गणना ? 1 : 0) : 0;

        this.घटिका_चक्राणि += 4;
        return 4;
      }

      // JMP adr
      case 0xC3: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        this.पञ्जिका.PC = (उच्च << 8) | निम्न;
        this.घटिका_चक्राणि += 10;
        return 10;
      }

      // JX5 adr (0xFD - Undocumented 8085 opcode for jump if K / X5 flag set)
      case 0xFD: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.K) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JZ adr (0xCA)
      case 0xCA: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.Z) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JNZ adr (0xC2)
      case 0xC2: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.Z) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JC adr (0xDA)
      case 0xDA: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.CY) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JNC adr (0xD2)
      case 0xD2: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.CY) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JPE adr (0xEA)
      case 0xEA: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.P) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JPO adr (0xE2)
      case 0xE2: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.P) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JM adr (0xFA)
      case 0xFA: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.S) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // JP adr (0xF2)
      case 0xF2: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.S) {
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 10;
          return 10;
        }
        this.घटिका_चक्राणि += 7;
        return 7;
      }

      // CALL & Conditional CALL
      case 0xCD: {
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
        this.पञ्जिका.PC = (उच्च << 8) | निम्न;
        this.घटिका_चक्राणि += 18;
        return 18;
      }
      case 0xDC: { // CC
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.CY) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }
      case 0xD4: { // CNC
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.CY) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }
      case 0xCC: { // CZ
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.Z) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }
      case 0xC4: { // CNZ
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.Z) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }
      case 0xFC: { // CM
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.S) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }
      case 0xF4: { // CP
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.S) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }
      case 0xEC: { // CPE
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (this.ध्वजाः.P) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }
      case 0xE4: { // CPO
        const निम्न = this.स्मृति[this.पञ्जिका.PC++];
        const उच्च = this.स्मृति[this.पञ्जिका.PC++];
        if (!this.ध्वजाः.P) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = (उच्च << 8) | निम्न;
          this.घटिका_चक्राणि += 18;
          return 18;
        }
        this.घटिका_चक्राणि += 9;
        return 9;
      }

      // RET & Conditional RET
      case 0xC9: { // RET
        this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
        this.घटिका_चक्राणि += 10;
        return 10;
      }
      case 0xD8: { // RC
        if (this.ध्वजाः.CY) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0xD0: { // RNC
        if (!this.ध्वजाः.CY) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0xC8: { // RZ
        if (this.ध्वजाः.Z) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0xC0: { // RNZ
        if (!this.ध्वजाः.Z) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0xF8: { // RM
        if (this.ध्वजाः.S) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0xF0: { // RP
        if (!this.ध्वजाः.S) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0xE8: { // RPE
        if (this.ध्वजाः.P) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }
      case 0xE0: { // RPO
        if (!this.ध्वजाः.P) {
          this.पञ्जिका.PC = this.स्तूप_निष्कासनम्_षोडश();
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }

      // PUSH rp
      case 0xC5: this.स्तूप_स्थापनम्_षोडश((this.पञ्जिका.B << 8) | this.पञ्जिका.C); this.घटिका_चक्राणि += 12; return 12;
      case 0xD5: this.स्तूप_स्थापनम्_षोडश((this.पञ्जिका.D << 8) | this.पञ्जिका.E); this.घटिका_चक्राणि += 12; return 12;
      case 0xE5: this.स्तूप_स्थापनम्_षोडश((this.पञ्जिका.H << 8) | this.पञ्जिका.L); this.घटिका_चक्राणि += 12; return 12;
      case 0xF5: { // PUSH PSW
        const psw_निम्न = (this.ध्वजाः.S << 7) | (this.ध्वजाः.Z << 6) | (this.ध्वजाः.K << 5) | (this.ध्वजाः.AC << 4) | (0 << 3) | (this.ध्वजाः.P << 2) | (this.ध्वजाः.V << 1) | this.ध्वजाः.CY;
        this.स्तूप_स्थापनम्_षोडश((this.पञ्जिका.A << 8) | psw_निम्न);
        this.घटिका_चक्राणि += 12;
        return 12;
      }

      // POP rp
      case 0xC1: {
        const मूल्यम् = this.स्तूप_निष्कासनम्_षोडश();
        this.पञ्जिका.B = (मूल्यम् >> 8) & 0xFF;
        this.पञ्जिका.C = मूल्यम् & 0xFF;
        this.घटिका_चक्राणि += 10;
        return 10;
      }
      case 0xD1: {
        const मूल्यम् = this.स्तूप_निष्कासनम्_षोडश();
        this.पञ्जिका.D = (मूल्यम् >> 8) & 0xFF;
        this.पञ्जिका.E = मूल्यम् & 0xFF;
        this.घटिका_चक्राणि += 10;
        return 10;
      }
      case 0xE1: {
        const मूल्यम् = this.स्तूप_निष्कासनम्_षोडश();
        this.पञ्जिका.H = (मूल्यम् >> 8) & 0xFF;
        this.पञ्जिका.L = मूल्यम् & 0xFF;
        this.घटिका_चक्राणि += 10;
        return 10;
      }
      case 0xF1: { // POP PSW
        const मूल्यम् = this.स्तूप_निष्कासनम्_षोडश();
        this.पञ्जिका.A = (मूल्यम् >> 8) & 0xFF;
        const psw_निम्न = मूल्यम् & 0xFF;
        this.ध्वजाः.S = (psw_निम्न >> 7) & 1;
        this.ध्वजाः.Z = (psw_निम्न >> 6) & 1;
        this.ध्वजाः.K = (psw_निम्न >> 5) & 1;
        this.ध्वजाः.AC = (psw_निम्न >> 4) & 1;
        this.ध्वजाः.P = (psw_निम्न >> 2) & 1;
        this.ध्वजाः.V = (psw_निम्न >> 1) & 1;
        this.ध्वजाः.CY = psw_निम्न & 1;
        this.घटिका_चक्राणि += 10;
        return 10;
      }

      // RSTV (0xCB - restart on overflow to 0x0040)
      case 0xCB: {
        if (this.ध्वजाः.V) {
          this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC);
          this.पञ्जिका.PC = 0x0040;
          this.घटिका_चक्राणि += 12;
          return 12;
        }
        this.घटिका_चक्राणि += 6;
        return 6;
      }

      // XTHL (0xE3 - Exchange HL with stack top)
      case 0xE3: {
        const पूर्व_ल = this.पञ्जिका.L;
        const पूर्व_ह = this.पञ्जिका.H;
        this.पञ्जिका.L = this.स्मृति[this.पञ्जिका.SP];
        this.पञ्जिका.H = this.स्मृति[(this.पञ्जिका.SP + 1) & 0xFFFF];
        this.स्मृति[this.पञ्जिका.SP] = पूर्व_ल;
        this.स्मृति[(this.पञ्जिका.SP + 1) & 0xFFFF] = पूर्व_ह;
        this.घटिका_चक्राणि += 16;
        return 16;
      }

      // SPHL (0xF9 - Move HL to SP)
      case 0xF9: {
        this.पञ्जिका.SP = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.घटिका_चक्राणि += 6;
        return 6;
      }

      // PCHL (0xE9 - Move HL to PC)
      case 0xE9: {
        this.पञ्जिका.PC = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
        this.घटिका_चक्राणि += 6;
        return 6;
      }

      // RST n (0xC7, 0xCF, 0xD7, 0xDF, 0xE7, 0xEF, 0xF7, 0xFF)
      case 0xC7: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 0 * 8; this.घटिका_चक्राणि += 12; return 12;
      case 0xCF: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 1 * 8; this.घटिका_चक्राणि += 12; return 12;
      case 0xD7: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 2 * 8; this.घटिका_चक्राणि += 12; return 12;
      case 0xDF: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 3 * 8; this.घटिका_चक्राणि += 12; return 12;
      case 0xE7: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 4 * 8; this.घटिका_चक्राणि += 12; return 12;
      case 0xEF: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 5 * 8; this.घटिका_चक्राणि += 12; return 12;
      case 0xF7: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 6 * 8; this.घटिका_चक्राणि += 12; return 12;
      case 0xFF: this.स्तूप_स्थापनम्_षोडश(this.पञ्जिका.PC); this.पञ्जिका.PC = 7 * 8; this.घटिका_चक्राणि += 12; return 12;

      default:
        this.विरामः = true;
        return 0;
    }
  }

  स्तूप_स्थापनम्_षोडश(मूल्यम्) {
    const उच्च = (मूल्यम् >> 8) & 0xFF;
    const निम्न = मूल्यम् & 0xFF;
    this.पञ्जिका.SP = (this.पञ्जिका.SP - 1) & 0xFFFF;
    this.स्मृति[this.पञ्जिका.SP] = उच्च;
    this.पञ्जिका.SP = (this.पञ्जिका.SP - 1) & 0xFFFF;
    this.स्मृति[this.पञ्जिका.SP] = निम्न;
  }

  स्तूप_निष्कासनम्_षोडश() {
    const निम्न = this.स्मृति[this.पञ्जिका.SP];
    this.पञ्जिका.SP = (this.पञ्जिका.SP + 1) & 0xFFFF;
    const उच्च = this.स्मृति[this.पञ्जिका.SP];
    this.पञ्जिका.SP = (this.पञ्जिका.SP + 1) & 0xFFFF;
    return (उच्च << 8) | निम्न;
  }

  संकलनम्(मूल्यम्, वह_निवेशः = 0) {
    const पूर्व_क = this.पञ्जिका.A;
    const परिणामः = पूर्व_क + मूल्यम् + वह_निवेशः;
    this.पञ्जिका.A = परिणामः & 0xFF;
    this.अङ्कगणित_ध्वज_नवीकरणम्(परिणामः, पूर्व_क, मूल्यम्, true, वह_निवेशः);
    this.घटिका_चक्राणि += 4;
  }

  व्यवकलनम्(मूल्यम्, वह_निवेशः = 0) {
    const पूर्व_क = this.पञ्जिका.A;
    const परिणामः = (पूर्व_क - मूल्यम् - वह_निवेशः) & 0xFF;
    this.पञ्जिका.A = परिणामः;
    this.अङ्कगणित_ध्वज_नवीकरणम्(परिणामः, पूर्व_क, मूल्यम्, false, वह_निवेशः);
    this.घटिका_चक्राणि += 4;
  }

  तुलना(मूल्यम्) {
    const पूर्व_क = this.पञ्जिका.A;
    const परिणामः = (पूर्व_क - मूल्यम्) & 0xFF;
    this.अङ्कगणित_ध्वज_नवीकरणम्(परिणामः, पूर्व_क, मूल्यम्, false, 0);
    this.घटिका_चक्राणि += 4;
  }

  तार्किक_तथा(मूल्यम्) {
    const पूर्व_क = this.पञ्जिका.A;
    const परिणामः = पूर्व_क & मूल्यम्;
    this.पञ्जिका.A = परिणामः;
    // 8085 specification: Logical AND (ANA / ANI) always sets the AC flag to 1
    this.तर्क_ध्वज_नवीकरणम्(परिणामः, 1);
    this.घटिका_चक्राणि += 4;
  }

  तार्किक_वा(मूल्यम्) {
    const परिणामः = this.पञ्जिका.A | मूल्यम्;
    this.पञ्जिका.A = परिणामः;
    this.तर्क_ध्वज_नवीकरणम्(परिणामः, 0);
    this.घटिका_चक्राणि += 4;
  }

  तार्किक_वियोजक(मूल्यम्) {
    const परिणामः = this.पञ्जिका.A ^ मूल्यम्;
    this.पञ्जिका.A = परिणामः;
    this.तर्क_ध्वज_नवीकरणम्(परिणामः, 0);
    this.घटिका_चक्राणि += 4;
  }

  वर्धनम्(मूल्यम्) {
    const परिणामः = (मूल्यम् + 1) & 0xFF;
    this.ध्वजाः.Z = (परिणामः === 0) ? 1 : 0;
    this.ध्वजाः.S = (परिणामः & 0x80) ? 1 : 0;
    this.ध्वजाः.P = this.समता_परीक्षणम्(परिणामः);
    this.ध्वजाः.AC = ((मूल्यम् & 0x0F) === 0x0F) ? 1 : 0;
    this.घटिका_चक्राणि += 4;
    return परिणामः;
  }

  ह्रासनम्(मूल्यम्) {
    const परिणामः = (मूल्यम् - 1) & 0xFF;
    this.ध्वजाः.Z = (परिणामः === 0) ? 1 : 0;
    this.ध्वजाः.S = (परिणामः & 0x80) ? 1 : 0;
    this.ध्वजाः.P = this.समता_परीक्षणम्(परिणामः);
    this.ध्वजाः.AC = ((मूल्यम् & 0x0F) === 0x00) ? 0 : 1;
    this.घटिका_चक्राणि += 4;
    return परिणामः;
  }

  द्विबाइट्_संकलनम्(मूल्यम्) {
    const पूर्व_चछ = (this.पञ्जिका.H << 8) | this.पञ्जिका.L;
    const परिणामः = पूर्व_चछ + मूल्यम्;
    this.ध्वजाः.CY = (परिणामः > 0xFFFF) ? 1 : 0;
    this.पञ्जिका.H = (परिणामः >> 8) & 0xFF;
    this.पञ्जिका.L = परिणामः & 0xFF;
    this.घटिका_चक्राणि += 10;
  }

  चालयति(अधिकतम_चक्राणि = 1000000) {
    let चक्राणि = 0;
    while (!this.विरामः && चक्राणि < अधिकतम_चक्राणि) {
      const पद_चक्र = this.पदम्_चालयति();
      if (पद_चक्र === 0) break;
      चक्राणि += पद_चक्र;
    }
    return चक्राणि;
  }
}
