use strict;
use warnings;
use utf8;
use Test::More;
use Selenium::Chrome;
use Cwd qw(abs_path);

binmode(STDOUT, ":utf8");
binmode(STDERR, ":utf8");

my $चालक_मार्ग = 'C:\\Users\\rnish\\vscode\\Pasupathi\\pivotvlsi\\truth_table\\chromedriver.exe';
my $संचिका_पूर्ण_मार्ग = abs_path('basic_cpu_gui.html');
$संचिका_पूर्ण_मार्ग =~ s{\\}{/}g;
my $जाल_स्थान = "file:///" . $संचिका_पूर्ण_मार्ग;

note("Starting Selenium Chrome Driver for ISA Spec 16-Instruction Verification...");
my $चालक = eval {
    Selenium::Chrome->new(
        binary => $चालक_मार्ग,
        extra_capabilities => {
            'goog:chromeOptions' => {
                args => [
                    '--headless=new',
                    '--disable-gpu',
                    '--no-sandbox',
                    '--window-size=1600,1000'
                ]
            }
        }
    );
};

if ($@ || !$चालक) {
    BAIL_OUT("Failed to start Selenium Chrome Driver: $@");
}

$चालक->get($जाल_स्थान);
sleep(1);

subtest '१. ऑपकोड द्विआधारी एनकोडिंग समानता (Opcode Binary Encoding Match with isa_spec.md)' => sub {
    # Verify all 16 opcodes match isa_spec.md binary definitions
    my $ऑपकोड_तालिका = {
        'ADD'    => '0000',
        'SUB'    => '0001',
        'AND'    => '0010',
        'XOR'    => '0011',
        'SHR'    => '0100',
        'SHL'    => '0101',
        'NOP'    => '0110',
        'LOADIB' => '0111',
        'SET0'   => '1000',
        'SET1'   => '1001',
        'LOADI'  => '1010',
        'LOAD'   => '1011',
        'STORE'  => '1100',
        'JMP'    => '1101',
        'JMPNZ'  => '1110',
        'JMPC'   => '1111'
    };

    for my $ऑप (sort keys %$ऑपकोड_तालिका) {
        my $अपेक्षित_द्विक = $ऑपकोड_तालिका->{$ऑप};
        my $प्राप्त_द्विक = $चालक->execute_script(qq{
            const नि = { प्रकार: '$ऑप', स्थिर: 0, पता: 0, पिन: 0, तालिका_क्रमांक: 0, संचायक_रूप: true };
            const बाइनरी = window.द्विआधारी_कूट_निर्माणम्(नि);
            return बाइनरी.split(' ')[0];
        });
        is($प्राप्त_द्विक, $अपेक्षित_द्विक, "Opcode $ऑप binary encoding matches isa_spec ($अपेक्षित_द्विक)");
    }
};

subtest '२. अंकगणित एवं तर्क संक्रिया निष्पादन (ALU Instructions ACC=ACC op B Execution)' => sub {
    # Reset
    $चालक->find_element('पुनःस्थापन-कुञ्जी', 'id')->click();

    # 1. LOADI #5 -> ACC = 5
    # 2. LOADIB #3 -> B = 3
    # 3. ADD -> ACC = 5 + 3 = 8
    # 4. SUB -> ACC = 8 - 3 = 5
    # 5. AND -> ACC = 5 & 3 = 1
    # 6. XOR -> ACC = 1 ^ 3 = 2
    # 7. SHL -> ACC = 2 << 1 = 4
    # 8. SHR -> ACC = 4 >> 1 = 2
    my $alu_asm = qq{
        LOADI #5
        LOADIB #3
        ADD
        SUB
        AND
        XOR
        SHL
        SHR
        NOP
        HALT
    };

    $चालक->execute_script(qq{
        window.संयोजन_व_भारणम्(`$alu_asm`);
    });

    my $पद_कुञ्जी = $चालक->find_element('पद-चालन-कुञ्जी', 'id');

    # Step 1: LOADI #5
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '5', 'LOADI #5 sets ACC=5');

    # Step 2: LOADIB #3
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-१', 'id')->get_text(), '3', 'LOADIB #3 sets B=3');

    # Step 3: ADD -> 5 + 3 = 8
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '8', 'ADD: ACC = 5 + 3 = 8');

    # Step 4: SUB -> 8 - 3 = 5
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '5', 'SUB: ACC = 8 - 3 = 5');

    # Step 5: AND -> 5 & 3 = 1
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '1', 'AND: ACC = 5 & 3 = 1');

    # Step 6: XOR -> 1 ^ 3 = 2
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '2', 'XOR: ACC = 1 ^ 3 = 2');

    # Step 7: SHL -> 2 << 1 = 4
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '4', 'SHL: ACC = 2 << 1 = 4');

    # Step 8: SHR -> 4 >> 1 = 2
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '2', 'SHR: ACC = 4 >> 1 = 2');
};

subtest '३. SET0, SET1 एवं पिन दिशा संक्रिया (SET0/SET1 Pin Driving)' => sub {
    # Reset
    $चालक->find_element('पुनःस्थापन-कुञ्जी', 'id')->click();

    my $pin_asm = qq{
        SET1 2
        SET0 2
        HALT
    };

    $चालक->execute_script(qq{ window.संयोजन_व_भारणम्(`$pin_asm`); });
    my $पद_कुञ्जी = $चालक->find_element('पद-चालन-कुञ्जी', 'id');

    # Step 1: SET1 2 -> Pin 2 should be driven 1
    $पद_कुञ्जी->click();
    my $pin2_val1 = $चालक->find_element('पिन-गोलक-२', 'id')->get_text();
    is($pin2_val1, '1', 'SET1 2: Pin 2 driven HIGH (1)');

    # Step 2: SET0 2 -> Pin 2 should be driven 0
    $पद_कुञ्जी->click();
    my $pin2_val0 = $चालक->find_element('पिन-गोलक-२', 'id')->get_text();
    is($pin2_val0, '0', 'SET0 2: Pin 2 driven LOW (0)');
};

subtest '४. स्मृति भारण एवं संग्रह संक्रिया (LOAD/STORE memory[addr] and Memory-Mapped Registers)' => sub {
    # Reset
    $चालक->find_element('पुनःस्थापन-कुञ्जी', 'id')->click();

    my $mem_asm = qq{
        LOADI #10
        STORE 0x2
        LOADI #0
        LOAD 0x2
        HALT
    };

    $चालक->execute_script(qq{ window.संयोजन_व_भारणम्(`$mem_asm`); });
    my $पद_कुञ्जी = $चालक->find_element('पद-चालन-कुञ्जी', 'id');

    # LOADI #10
    $पद_कुञ्जी->click();
    # STORE 0x2 -> Memory[0x2] = 10
    $पद_कुञ्जी->click();
    # LOADI #0 -> ACC = 0
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '0', 'ACC cleared to 0');

    # LOAD 0x2 -> ACC = Memory[0x2] = 10
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '10', 'LOAD 0x2 restored ACC = 10 from memory');
};

subtest '५. कूर्दन संक्रिया (JMP, JMPNZ, JMPC Branching via Jump Table)' => sub {
    # Reset
    $चालक->find_element('पुनःस्थापन-कुञ्जी', 'id')->click();

    # Configure Jump Table entry 0 to target PC = 0x3
    $चालक->execute_script(q{
        window.कूर्दन_सारणी_दत्त = window.कूर्दन_सारणी_दत्त || new Array(16).fill(0);
        window.कूर्दन_सारणी_दत्त[0] = 3;
    });

    # Simple 4-line program:
    # 0x0: JMP 0   (Jumps directly to 0x3)
    # 0x1: LOADI #1
    # 0x2: LOADI #2
    # 0x3: LOADI #7
    my $jmp_asm = "JMP 0\nLOADI #1\nLOADI #2\nLOADI #7\nHALT\n";

    $चालक->execute_script(qq{
        window.संयोजन_व_भारणम्(`$jmp_asm`);
        window.कूर्दन_सारणी_दत्त[0] = 3; // Ensure jump table is set after assemble
    });

    my $पद_कुञ्जी = $चालक->find_element('पद-चालन-कुञ्जी', 'id');

    # Execute JMP 0 -> PC jumps to 3
    $पद_कुञ्जी->click();
    my $pc_text = $चालक->find_element('गणक-मान', 'id')->get_text();
    like($pc_text, qr/0x3/, 'JMP 0 restored PC to target address 0x3 via JUMP_TABLE[0]');

    # Execute instruction at 0x3: LOADI #7
    $पद_कुञ्जी->click();
    is($चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text(), '7', 'Instruction at jump target executed successfully (ACC=7)');
};

$चालक->shutdown_binary();
done_testing();
