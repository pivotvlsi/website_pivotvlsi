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

note("Starting Selenium Chrome Driver for Exhaustive Validation Testing...");
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

subtest '१. सम्पादक निष्कासन एवं आयात पटल सत्यापनम् (Editor Removal & Import Verification)' => sub {
    # Verify textarea was completely removed from DOM
    my $पाठ_निवेश = eval { $चालक->find_element('पाठ-कार्यक्रम-निवेश', 'id') };
    ok(!$पाठ_निवेश, 'Textarea editor is completely removed from GUI');

    # Verify Import File control exists
    my $आयात_नियन्त्रण = $चालक->find_element('संचिका-भारक-निवेश', 'id');
    ok($आयात_नियन्त्रण, 'File Import control (#संचिका-भारक-निवेश) is present');

    # Verify Validate Button exists
    my $सत्यापन_कुञ्जी = $चालक->find_element('निर्देश-सत्यापन-कुञ्जी', 'id');
    ok($सत्यापन_कुञ्जी, 'Validate Button (#निर्देश-सत्यापन-कुञ्जी) is present');
};

subtest '२. रिक्त स्मृति सत्यापन परीक्षणम् (Empty Memory Validation)' => sub {
    # Clicking validate on empty memory must alert/banner
    my $सत्यापन_कुञ्जी = $चालक->find_element('निर्देश-सत्यापन-कुञ्जी', 'id');
    $सत्यापन_कुञ्जी->click();

    my $सत्यापन_फलक = $चालक->find_element('सत्यापन-फलक', 'id');
    my $सन्देश = $सत्यापन_फलक->get_text();
    like($सन्देश, qr/Instruction memory is empty/i, 'Empty memory triggers warning banner');
};

subtest '३. मान्य निर्देश समुच्चय सत्यापनम् (Exhaustive Valid Instructions Test)' => sub {
    my $मान्य_संचिका = abs_path('tests/valid_program.asm');
    my $संचिका_निवेश = $चालक->find_element('संचिका-भारक-निवेश', 'id');
    $संचिका_निवेश->send_keys($मान्य_संचिका);
    sleep(1);

    # Click Validate
    my $सत्यापन_कुञ्जी = $चालक->find_element('निर्देश-सत्यापन-कुञ्जी', 'id');
    $सत्यापन_कुञ्जी->click();

    my $सत्यापन_फलक = $चालक->find_element('सत्यापन-फलक', 'id');
    my $सन्देश = $सत्यापन_फलक->get_text();
    like($सन्देश, qr/All 16 instruction\(s\) in memory are valid/i, 'Valid 16-instruction program passes validation completely');

    # Check that PC runs first instruction cleanly
    my $पद_कुञ्जी = $चालक->find_element('पद-चालन-कुञ्जी', 'id');
    $पद_कुञ्जी->click(); # Executes LOADI #12
    my $पंजिका_मान = $चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text();
    is($पंजिका_मान, '12', 'LOADI #12 correctly executed into ACC (R0 = 12)');
};

subtest '४. अमान्य ऑपकोड एवं ऑपरैण्ड सीमा परीक्षणम् (Invalid Instructions & Out-of-Bounds Operands Test)' => sub {
    # Test validator parser with bad opcodes and out-of-range operands
    my $परीक्षण_परिणाम = $चालक->execute_script(q{
        const badCode = `
          BADOPCODE R0, R1
          LOADI #999
          SET0 8
          LOAD 0x1F
          STORE 0xFF
          MOV R12, R0
          ADD R8, R9
        `;
        return window.निर्देश_संहिता_सत्यापनम्(badCode);
    });

    is($परीक्षण_परिणाम->{सफलम्}, 0, 'Validator correctly detects invalid code');
    cmp_ok(scalar(@{$परीक्षण_परिणाम->{त्रुटयः}}), '>=', 6, 'All 6 distinct errors correctly captured');

    # Inspect captured errors
    my $त्रुटि_पाठ = join("\n", @{$परीक्षण_परिणाम->{त्रुटयः}});
    like($त्रुटि_पाठ, qr/Invalid Opcode 'BADOPCODE'/i, 'Caught invalid opcode BADOPCODE');
    like($त्रुटि_पाठ, qr/LOADI immediate operand.*invalid/i, 'Caught out-of-range immediate #999');
    like($त्रुटि_पाठ, qr/SET0 pin index.*invalid/i, 'Caught out-of-range pin 8');
    like($त्रुटि_पाठ, qr/LOAD address.*invalid/i, 'Caught out-of-range memory address 0x1F');
    like($त्रुटि_पाठ, qr/MOV dest operand.*invalid/i, 'Caught non-existent register R12 (>R7)');
    like($त्रुटि_पाठ, qr/ADD.*invalid/i, 'Caught non-existent register R8 (>R7)');
};

subtest '५. स्मृति अतिप्रवाह परीक्षणम् (Instruction Memory Overflow Test)' => sub {
    # Attempting to load > 16 instructions must fail validation
    my $अतिप्रवाह_परिणाम = $चालक->execute_script(q{
        let bigCode = "";
        for (let i = 0; i < 20; i++) {
            bigCode += "NOP\n";
        }
        return window.निर्देश_संहिता_सत्यापनम्(bigCode);
    });

    is($अतिप्रवाह_परिणाम->{सफलम्}, 0, 'Code with > 16 instructions fails validation');
    my $त्रुटि_पाठ = join("\n", @{$अतिप्रवाह_परिणाम->{त्रुटयः}});
    like($त्रुटि_पाठ, qr/Instruction memory overflow/i, 'Correctly flags instruction memory overflow (>16 instructions)');
};

$चालक->shutdown_binary();
done_testing();

