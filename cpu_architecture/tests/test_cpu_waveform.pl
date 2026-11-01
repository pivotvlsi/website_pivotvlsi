use strict;
use warnings;
use utf8;
use Test::More;
use Selenium::Chrome;
use Cwd qw(abs_path);

binmode(STDOUT, ":utf8");
binmode(STDERR, ":utf8");

# Path to chromedriver and basic_cpu_gui.html
my $चालक_मार्ग = 'C:\\Users\\rnish\\vscode\\Pasupathi\\pivotvlsi\\truth_table\\chromedriver.exe';
my $संचिका_पूर्ण_मार्ग = abs_path('basic_cpu_gui.html');
$संचिका_पूर्ण_मार्ग =~ s{\\}{/}g;
my $जाल_स्थान = "file:///" . $संचिका_पूर्ण_मार्ग;

note("Starting Selenium Chrome Driver...");
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

subtest '१. आरम्भिक अवस्था परीक्षणम् (Initial State Verification)' => sub {
    my $शीर्षक = $चालक->get_title();
    like($शीर्षक, qr/PIVOT VLSI/, 'Page title contains PIVOT VLSI branding');

    # PC and Running Cycle near PC
    my $गणक_पाठ = $चालक->find_element('गणक-मान', 'id')->get_text();
    like($गणक_पाठ, qr/0x0/, 'PC initialized to 0x0');

    my $घटिका_चक्र_पाठ = $चालक->find_element('घटिका-चक्र-मान', 'id')->get_text();
    is($घटिका_चक्र_पाठ, 'T1', 'Initial clock cycle displayed near PC is T1');

    # All 4 registers initialized
    my @अंक = ('०', '१', '२', '३');
    for my $प (0..3) {
        my $पंजिका_मान = $चालक->find_element("पंजिका-दशमलव-$अंक[$प]", 'id')->get_text();
        is($पंजिका_मान, '0', "Register R$प initialized to 0");
    }
};

subtest '२. पंजिका बिट परिवर्तन नियम परीक्षणम् (Register Cards Bit Toggle Rules)' => sub {
    # 1. PIN_IN (पठन) is Read-Only: direct click blocked
    my $पठन_दशमलव_पूर्व = $चालक->find_element('पिन-पठन-दशमलव', 'id')->get_text();
    my $पठन_बिट_० = $चालक->find_element('पिन-पठन-बिट-०', 'id');
    $पठन_बिट_०->click();
    my $पठन_दशमलव_पश्चात् = $चालक->find_element('पिन-पठन-दशमलव', 'id')->get_text();
    is($पठन_दशमलव_पश्चात्, $पठन_दशमलव_पूर्व, 'PIN_IN (0x6 [R]) bit click is blocked (read-only)');

    my $लॉग_संदेश_१ = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($लॉग_संदेश_१, qr/PIN_IN is a Read-Only Register/i, 'Log verifies PIN_IN direct toggle blocked');

    # 2. PIN_EN (0xF [OE]) toggle is allowed
    my $सक्रियता_बिट_० = $चालक->find_element('पिन-सक्रियता-बिट-०', 'id');
    my $सक्रियता_पूर्व = $सक्रियता_बिट_०->get_text();
    $सक्रियता_बिट_०->click();
    my $सक्रियता_पश्चात् = $सक्रियता_बिट_०->get_text();
    isnt($सक्रियता_पश्चात्, $सक्रियता_पूर्व, 'PIN_EN (0xF [OE]) bit 0 toggles successfully');

    # 3. PIN_OUT (0x6 [W]) toggle is allowed
    my $लेखन_बिट_० = $चालक->find_element('पिन-लेखन-बिट-०', 'id');
    my $लेखन_पूर्व = $लेखन_बिट_०->get_text();
    $लेखन_बिट_०->click();
    my $लेखन_पश्चात् = $लेखन_बिट_०->get_text();
    isnt($लेखन_पश्चात्, $लेखन_पूर्व, 'PIN_OUT (0x6 [W]) bit 0 toggles successfully');
};

subtest '३. अधस्तन पिन गोलक सक्रियता नियम परीक्षणम् (Physical Pin Bubble OE Blocking)' => sub {
    # Pin 1: Default PIN_EN is 1 (Driven Output mode) -> physical toggle must be blocked
    my $पिन_गोलक_१ = $चालक->find_element('पिन-गोलक-१', 'id');
    my $पिन_मान_पूर्व = $पिन_गोलक_१->get_text();
    $पिन_गोलक_१->click();
    my $पिन_मान_अवरुद्ध = $पिन_गोलक_१->get_text();
    is($पिन_मान_अवरुद्ध, $पिन_मान_पूर्व, 'Pin 1 click blocked when PIN_EN = 1 (Driven by processor)');

    my $लॉग_संदेश_२ = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($लॉग_संदेश_२, qr/Output Enable = 1.*blocked/i, 'Log confirms physical pin toggle blocked when OE=1');

    # Now toggle PIN_EN bit 1 to 0 (Input mode) via PIN_EN register card
    my $सक्रियता_बिट_१ = $चालक->find_element('पिन-सक्रियता-बिट-१', 'id');
    $सक्रियता_बिट_१->click(); # Toggles PIN_EN[1] from 1 to 0

    # Now click Pin 1 bubble: must be allowed
    $पिन_गोलक_१->click();
    my $पिन_मान_मुक्त = $पिन_गोलक_१->get_text();
    isnt($पिन_मान_मुक्त, $पिन_मान_पूर्व, 'Pin 1 click allowed when PIN_EN = 0 (Input mode)');
};

subtest '४. तरंगरूप चित्रफलक कीलन एवं भविष्य-चक्र नियम परीक्षणम् (Waveform Canvas Timeline Constraints)' => sub {
    my $कील_कुञ्जी = $चालक->find_element('तरंगरूप-कील-कुञ्जी', 'id');
    my $चित्रफलक = $चालक->find_element('तरंगरूप-चित्रफलक', 'id');

    # Ensure waveform is locked initially
    my $कुञ्जी_पाठ = $कील_कुञ्जी->get_text();
    if ($कुञ्जी_पाठ =~ /Unlocked/i) {
        $कील_कुञ्जी->click(); # Lock it
    }

    # Click on canvas while locked
    $चित्रफलक->click();
    my $लॉग_कीलन = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($लॉग_कीलन, qr/Waveform is LOCKED/i, 'Waveform click blocked while canvas is Locked');

    # Unlock waveform
    $कील_कुञ्जी->click();
    my $कुञ्जी_पाठ_मुक्त = $कील_कुञ्जी->get_text();
    like($कुञ्जी_पाठ_मुक्त, qr/Unlocked/i, 'Waveform button toggled to Unlocked state');

    # Rule: Timeline before and including current execution cycle (T1) is locked by default.
    $चालक->execute_script(q{
        const canvas = document.getElementById('तरंगरूप-चित्रफलक');
        const rect = canvas.getBoundingClientRect();
        const evt = new MouseEvent('click', {
            clientX: rect.left + 140,
            clientY: rect.top + 72,
            bubbles: true
        });
        canvas.dispatchEvent(evt);
    });

    my $लॉग_अतीत = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($लॉग_अतीत, qr/past \/ current execution time.*Only future cycles/i, 'Current/past clock cycle click is blocked');

    # Rule: Future cycle (T3, >= current+2 or T > current) is allowed IRRESPECTIVE of PIN_EN
    # Click on T3 on Pin 2 even when PIN_EN is 1:
    # Row 0: CLK (0..44), Row 1: Pin 3 (44..88), Row 2: Pin 2 (88..132).
    # Click y: 88 + 22 = 110px.
    # Click x: 100 + 2*80 + 40 = 300px.
    $चालक->execute_script(q{
        const canvas = document.getElementById('तरंगरूप-चित्रफलक');
        const rect = canvas.getBoundingClientRect();
        const evt = new MouseEvent('click', {
            clientX: rect.left + 300,
            clientY: rect.top + 110,
            bubbles: true
        });
        canvas.dispatchEvent(evt);
    });

    my $लॉग_भविष्य = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($लॉग_भविष्य, qr/Clock Cycle T3: PIN 2 toggled/i, 'Future clock cycle T3 toggled successfully irrespective of PIN_EN');
};

subtest '५. घटिका चक्र योजनम् (+T बटन) एवं पद चालनम् (Add Clock Period + Step Execution)' => sub {
    # Test ➕ +T button (id: तरंगरूप-अन्त्य-योजन-कुञ्जी)
    my $योजन_कुञ्जी = $चालक->find_element('तरंगरूप-अन्त्य-योजन-कुञ्जी', 'id');
    $योजन_कुञ्जी->click();

    my $लॉग_योजन = $चालक->find_element('विवरण-संदेश', 'class')->get_text();
    like($लॉग_योजन, qr/Clock Period added/i, '➕ +T button successfully appends new clock cycle');

    # Test Step Execution (पद चालनम्)
    my $पद_कुञ्जी = $चालक->find_element('पद-चालन-कुञ्जी', 'id');
    $पद_कुञ्जी->click();

    my $नूतन_घटिका_चक्र = $चालक->find_element('घटिका-चक्र-मान', 'id')->get_text();
    is($नूतन_घटिका_चक्र, 'T2', 'Executing 1 instruction step advances running cycle to T2');
};

$चालक->shutdown_binary();
done_testing();

