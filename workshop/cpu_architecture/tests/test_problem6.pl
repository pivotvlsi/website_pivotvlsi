use strict;
use warnings;
use utf8;
binmode(STDOUT, ":utf8");
binmode(STDERR, ":utf8");

use Test::More;
use Selenium::Chrome;
use File::Spec;
use Cwd 'abs_path';

my $root_dir = abs_path(File::Spec->catdir(__FILE__, '..', '..'));
my $html_file = File::Spec->catfile($root_dir, 'basic_cpu_gui.html');
my $file_url = "file:///" . $html_file;
$file_url =~ s{\\}{/}g;

my $driver_path = 'C:\Users\rnish\vscode\Pasupathi\pivotvlsi\truth_table\chromedriver.exe';

diag("Starting Selenium Chrome Driver for way_4/problem6.asm (Clock-Triggered Data Latch)...");

my $driver = eval {
    Selenium::Chrome->new(
        binary => $driver_path,
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

if (!$driver) {
    plan skip_all => "Could not start ChromeDriver: $@";
    exit;
}

$driver->get($file_url);
sleep(1);

subtest "Way 4: Clock-Triggered Data Latch (GPIO_0 CLK, GPIO_1 DATA -> GPIO_2)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_4', 'problem6.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Validate assembly code
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "way_4/problem6.asm passes 16-instruction hardware ISA validation");

    # 2. Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Configure jump table:
    # JUMP_TABLE[0] = 0x3 (wait for clock LOW entry)
    # JUMP_TABLE[1] = 0xA (rising edge detected -> evaluate data)
    # JUMP_TABLE[2] = 0xE (drive GPIO_2 HIGH)
    $driver->execute_script(qq{
        if (window.कूर्दन_सारणी_दत्त) {
            window.कूर्दन_सारणी_दत्त[0] = 0x3;
            window.कूर्दन_सारणी_दत्त[1] = 0xA;
            window.कूर्दन_सारणी_दत्त[2] = 0xE;
        }
    });

    # Run initialization steps: LOADI #12, STORE 0xF, LOADIB #1
    for (my $i = 0; $i < 3; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    # Verify PIN_EN is configured to 12 (0b1100: Pin 0 & 1 input)
    my $oe = $driver->execute_script(qq{
        return window.पंजिका_दत्त[5];
    });
    is($oe, 12, "Hardware configured: Pin 0 (CLK) and Pin 1 (DATA) set to Inputs (OE=12)");

    # --- Scenario 1: Clock is LOW (0), Data changes to HIGH (1). ---
    # Since Clock has NOT had a rising edge, GPIO_2 must remain 0!
    $driver->execute_script(qq{
        // Toggle Pin 1 (DATA) to 1
        if (((window.पिन_पठन_पंजिका() >> 1) & 1) === 0) {
            window.पिन_परिवर्तनम्(1);
        }
    });

    for (my $i = 0; $i < 8; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $out_before_clk = $driver->execute_script(qq{
        return (window.पिन_पठन_पंजिका() >> 2) & 1;
    });
    is($out_before_clk, 0, "Before clock rising edge, GPIO_2 remains LOW (0) even though DATA is HIGH");

    # --- Scenario 2: Clock rises (GPIO_0 LOW -> HIGH). ---
    # Now GPIO_2 must latch DATA (1)!
    $driver->execute_script(qq{
        // Toggle Pin 0 (CLK) to 1
        window.पिन_परिवर्तनम्(0);
    });

    for (my $i = 0; $i < 10; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $out_after_clk1 = $driver->execute_script(qq{
        return (window.पिन_पठन_पंजिका() >> 2) & 1;
    });
    is($out_after_clk1, 1, "On clock rising edge (GPIO_0 0->1), GPIO_2 successfully latched DATA (1)");

    # --- Scenario 3: Change DATA to 0 while clock is steady HIGH. ---
    # GPIO_2 must hold 1 (latched value preserved)!
    $driver->execute_script(qq{
        // Toggle Pin 1 (DATA) to 0
        window.पिन_परिवर्तनम्(1);
    });

    for (my $i = 0; $i < 8; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $out_held = $driver->execute_script(qq{
        return (window.पिन_पठन_पंजिका() >> 2) & 1;
    });
    is($out_held, 1, "GPIO_2 holds previous latched value 1 while clock is steady HIGH");

    # --- Scenario 4: Clock falls LOW, then rises again with DATA = 0. ---
    # Clock goes LOW:
    $driver->execute_script(qq{
        window.पिन_परिवर्तनम्(0);
    });
    for (my $i = 0; $i < 8; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    # Clock rises LOW -> HIGH:
    $driver->execute_script(qq{
        window.पिन_परिवर्तनम्(0);
    });
    for (my $i = 0; $i < 10; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $out_after_clk2 = $driver->execute_script(qq{
        return (window.पिन_पठन_पंजिका() >> 2) & 1;
    });
    is($out_after_clk2, 0, "On subsequent clock rising edge with DATA=0, GPIO_2 updated to 0");
};

$driver->quit();
done_testing();
