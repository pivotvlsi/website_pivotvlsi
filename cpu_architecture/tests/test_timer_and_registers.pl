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

note("Starting Selenium Chrome Driver for R4..R7 & Timer Testing...");
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

subtest '१. आर४..आर७ पंजिका दृश्य एवं नामकरण परीक्षणम् (R4..R7 Register UI & Labels Verification)' => sub {
    # Verify R4 (PIN_IN), R5 (PIN_EN), R6 (PIN_OUT), and R7 (TIMER) cards exist
    for my $प (4..7) {
        my @अंक = ('०', '१', '२', '३', '४', '५', '६', '७');
        my $पंजिका_कार्ड = $चालक->find_element("पंजिका-कार्ड-$अंक[$प]", 'id');
        ok($पंजिका_कार्ड, "Register card R$प is present in GUI");
    }

    # Verify R7 (TIMER) displays initial value 0
    my $समयगणक_मान = $चालक->find_element('पंजिका-दशमलव-७', 'id')->get_text();
    is($समयगणक_मान, '0', 'Hardware Timer R7 displays initial value 0');
};

subtest '२. आर४..आर७ ऑपरैण्ड सत्यापन परीक्षणम् (Assembly Validation with R4..R7 & Aliases)' => sub {
    my $परीक्षण_कोड = qq{
        MOV R7, R0
        MOV R6, R1
        MOV R0, R4
        MOV R0, R5
        MOV R0, PIN_IN
        MOV R0, PIN_EN
        MOV PIN_OUT, R0
        MOV TIMER, R0
    };

    my $परिणाम = $चालक->execute_script(qq{
        return window.निर्देश_संहिता_सत्यापनम्(`$परीक्षण_कोड`);
    });

    is($परिणाम->{सफलम्}, 1, 'Validation succeeds with R4, R5, R6, R7, and operand aliases (PIN_IN, PIN_EN, PIN_OUT, TIMER)');
    is(scalar(@{$परिणाम->{त्रुटयः}}), 0, 'No validation errors encountered');
};

subtest '३. समयगणक पठन एवं निर्देश अवरोध परीक्षणम् (Hardware Timer Read Countdown Stall Test)' => sub {
    # Import assembly program testing timer countdown stall
    my $प्रोग्राम_मार्ग = abs_path('tests/test_timer_registers.asm');
    my $संचिका_निवेश = $चालक->find_element('संचिका-भारक-निवेश', 'id');
    $संचिका_निवेश->send_keys($प्रोग्राम_मार्ग);
    sleep(1);

    # Step 1: LOADI #3 -> ACC = 3
    my $पद_कुञ्जी = $चालक->find_element('पद-चालन-कुञ्जी', 'id');
    $पद_कुञ्जी->click();
    my $acc = $चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text();
    is($acc, '3', 'Step 1: LOADI #3 loaded into ACC');

    # Step 2: MOV R7, R0 -> Timer = 3
    $पद_कुञ्जी->click();
    my $timer_val = $चालक->find_element('पंजिका-दशमलव-७', 'id')->get_text();
    is($timer_val, '3', 'Step 2: MOV R7, R0 configured Timer R7 = 3');

    # Step 3: LOADI #0 -> ACC = 0
    $पद_कुञ्जी->click();
    $acc = $चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text();
    is($acc, '0', 'Step 3: LOADI #0 executed');

    # Step 4: MOV R0, R7 (Reading Timer R7) -> Triggers stall, PC is at 0x3
    $पद_कुञ्जी->click();
    my $pc_before = $चालक->find_element('गणक-मान', 'id')->get_text();
    my $log_stall = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($log_stall, qr/TIMER READ.*Triggered Hardware Timer Stall/i, 'Step 4: Reading R7 initiates hardware timer stall');

    # Next Step: Countdown cycle 1 -> Timer reduces 3 -> 2, PC stays blocked at same instruction
    $पद_कुञ्जी->click();
    $timer_val = $चालक->find_element('पंजिका-दशमलव-७', 'id')->get_text();
    is($timer_val, '2', 'Stall Cycle 1: Timer decremented to 2');
    my $pc_stall_1 = $चालक->find_element('गणक-मान', 'id')->get_text();
    is($pc_stall_1, $pc_before, 'Instruction blocked from advancing during stall cycle 1');

    # Next Step: Countdown cycle 2 -> Timer reduces 2 -> 1, PC still blocked
    $पद_कुञ्जी->click();
    $timer_val = $चालक->find_element('पंजिका-दशमलव-७', 'id')->get_text();
    is($timer_val, '1', 'Stall Cycle 2: Timer decremented to 1');

    # Next Step: Countdown cycle 3 -> Timer reduces 1 -> 0, logs TIMER EXPIRED
    $पद_कुञ्जी->click();
    $timer_val = $चालक->find_element('पंजिका-दशमलव-७', 'id')->get_text();
    is($timer_val, '0', 'Stall Cycle 3: Timer reached 0');
    my $log_expired = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($log_expired, qr/TIMER EXPIRED.*Unblocking processor/i, 'Timer expired notification emitted when timer reaches 0');

    # Next Step: CPU is unblocked and executes next instruction (LOADI #15)
    $पद_कुञ्जी->click();
    my $acc_after = $चालक->find_element('पंजिका-दशमलव-०', 'id')->get_text();
    is($acc_after, '15', 'After unblocking, CPU successfully advances and executes next instruction (LOADI #15)');
};

$चालक->shutdown_binary();
done_testing();
