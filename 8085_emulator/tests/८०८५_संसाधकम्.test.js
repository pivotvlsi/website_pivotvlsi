import { describe, test, expect, beforeEach } from 'vitest';
import { अष्टशून्यपञ्चाशीति_संसाधकम् } from './अष्टशून्यपञ्चाशीति_संसाधकम्.js';

describe('8085 Core Instructions Test Suite (Pure JS Engine)', () => {
  let संसाधकः;

  beforeEach(() => {
    संसाधकः = new अष्टशून्यपञ्चाशीति_संसाधकम्();
  });

  // NOP & HLT Test
  test('NOP: executes without altering registers', () => {
    संसाधकः.स्मृति[0] = 0x00; // NOP
    संसाधकः.स्मृति[1] = 0x76; // HLT
    संसाधकः.पञ्जिका.A = 0x42;
    संसाधकः.चालयति();

    expect(संसाधकः.पञ्जिका.A).toBe(0x42);
    expect(संसाधकः.पञ्जिका.PC).toBe(2);
    expect(संसाधकः.विरामः).toBe(true);
  });

  // MOV r, r' Tests
  test('MOV B, A and MOV C, B', () => {
    संसाधकः.स्मृति[0] = 0x3E; // MVI A, 55H
    संसाधकः.स्मृति[1] = 0x55;
    संसाधकः.स्मृति[2] = 0x47; // MOV B, A
    संसाधकः.स्मृति[3] = 0x48; // MOV C, B
    संसाधकः.स्मृति[4] = 0x76; // HLT
    संसाधकः.चालयति();

    expect(संसाधकः.पञ्जिका.A).toBe(0x55);
    expect(संसाधकः.पञ्जिका.B).toBe(0x55);
    expect(संसाधकः.पञ्जिका.C).toBe(0x55);
  });

  // ADD & Flags
  test('ADD: Addition and Carry/Auxiliary Carry flags', () => {
    // 0x2F + 0x01 = 0x30 (AC set, CY 0)
    संसाधकः.स्मृति[0] = 0x3E; // MVI A, 2FH
    संसाधकः.स्मृति[1] = 0x2F;
    संसाधकः.स्मृति[2] = 0x06; // MVI B, 01H
    संसाधकः.स्मृति[3] = 0x01;
    संसाधकः.स्मृति[4] = 0x80; // ADD B
    संसाधकः.स्मृति[5] = 0x76; // HLT
    संसाधकः.चालयति();

    expect(संसाधकः.पञ्जिका.A).toBe(0x30);
    expect(संसाधकः.ध्वजाः.AC).toBe(1);
    expect(संसाधकः.ध्वजाः.CY).toBe(0);
    expect(संसाधकः.ध्वजाः.Z).toBe(0);
  });

  // SUB Test
  test('SUB: 3EH minus itself produces zero and Zero flag', () => {
    संसाधकः.स्मृति[0] = 0x3E; // MVI A, 3EH
    संसाधकः.स्मृति[1] = 0x3E;
    संसाधकः.स्मृति[2] = 0x97; // SUB A
    संसाधकः.स्मृति[3] = 0x76; // HLT
    संसाधकः.चालयति();

    expect(संसाधकः.पञ्जिका.A).toBe(0x00);
    expect(संसाधकः.ध्वजाः.Z).toBe(1);
    expect(संसाधकः.ध्वजाः.CY).toBe(0);
  });

  // DAA (Decimal Adjust Accumulator)
  test('DAA: Half-carry adjust (2Bh becomes 31h)', () => {
    संसाधकः.स्मृति[0] = 0x3E; // MVI A, 2BH
    संसाधकः.स्मृति[1] = 0x2B;
    संसाधकः.स्मृति[2] = 0x27; // DAA
    संसाधकः.स्मृति[3] = 0x76; // HLT
    संसाधकः.चालयति();

    expect(संसाधकः.पञ्जिका.A).toBe(0x31);
    expect(संसाधकः.ध्वजाः.AC).toBe(1);
    expect(संसाधकः.ध्वजाः.CY).toBe(0);
  });

  // Logical operations (ANA, ORA, XRA)
  test('XRA: Clearing register via XRA A', () => {
    संसाधकः.स्मृति[0] = 0x3E; // MVI A, FFH
    संसाधकः.स्मृति[1] = 0xFF;
    संसाधकः.स्मृति[2] = 0xAF; // XRA A
    संसाधकः.स्मृति[3] = 0x76; // HLT
    संसाधकः.चालयति();

    expect(संसाधकः.पञ्जिका.A).toBe(0x00);
    expect(संसाधकः.ध्वजाः.Z).toBe(1);
    expect(संसाधकः.ध्वजाः.CY).toBe(0);
  });

  // Memory access: MOV M, A and MOV A, M
  test('Memory indirect addressing via HL pair', () => {
    संसाधकः.स्मृति[0] = 0x21; // LXI H, 2050H
    संसाधकः.स्मृति[1] = 0x50;
    संसाधकः.स्मृति[2] = 0x20;
    संसाधकः.स्मृति[3] = 0x3E; // MVI A, 99H
    संसाधकः.स्मृति[4] = 0x99;
    संसाधकः.स्मृति[5] = 0x77; // MOV M, A
    संसाधकः.स्मृति[6] = 0x3E; // MVI A, 00H
    संसाधकः.स्मृति[7] = 0x00;
    संसाधकः.स्मृति[8] = 0x7E; // MOV A, M
    संसाधकः.स्मृति[9] = 0x76; // HLT
    संसाधकः.चालयति();

    expect(संसाधकः.स्मृति[0x2050]).toBe(0x99);
    expect(संसाधकः.पञ्जिका.A).toBe(0x99);
  });
});

