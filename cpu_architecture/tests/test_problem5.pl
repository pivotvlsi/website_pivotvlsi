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

diag("Starting Selenium Chrome Driver for way_4/problem5.asm (GPIO_0 -> GPIO_1 Pass-through)...");

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

subtest "Way 4: GPIO Pass-through (GPIO_0 input mirrored to GPIO_1 output)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_4', 'problem5.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Validate assembly code
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "way_4/problem5.asm passes 16-instruction hardware ISA validation");

    # 2. Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Configure jump table:
    # JUMP_TABLE[0] = 0x3 (loop entry: sample GPIO_0)
    # JUMP_TABLE[1] = 0x8 (drive GPIO_1 HIGH)
    $driver->execute_script(qq{
        if (window.कूर्दन_सारणी_दत्त) {
            window.कूर्दन_सारणी_दत्त[0] = 0x3;
            window.कूर्दन_सारणी_दत्त[1] = 0x8;
        }
    });

    # Run initialization instructions (LOADI #14, STORE 0xF, LOADIB #1)
    for (my $i = 0; $i < 3; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    # Verify PIN_EN is configured with Pin 0 as Input (OE = 0)
    my $oe0 = $driver->execute_script(qq{
        return (window.पंजिका_दत्त[5] & 1);
    });
    is($oe0, 0, "Pin 0 is configured as Input (PIN_EN bit 0 = 0)");

    # Test Case 1: GPIO_0 is LOW (0) -> Run loop -> GPIO_1 must be LOW (0)
    for (my $i = 0; $i < 10; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }
    my $pin1_low = $driver->execute_script(qq{
        return (window.पिन_पठन_पंजिका() >> 1) & 1;
    });
    is($pin1_low, 0, "When GPIO_0 is 0, GPIO_1 is driven to 0");

    # Test Case 2: Toggle GPIO_0 to HIGH (1) -> Run loop -> GPIO_1 must become HIGH (1)
    $driver->execute_script(qq{
        window.पिन_परिवर्तनम्(0);
    });

    for (my $i = 0; $i < 10; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $pin1_high = $driver->execute_script(qq{
        return (window.पिन_पठन_पंजिका() >> 1) & 1;
    });
    is($pin1_high, 1, "When GPIO_0 becomes 1, GPIO_1 is driven to 1");

    # Test Case 3: Toggle GPIO_0 back to LOW (0) -> Run loop -> GPIO_1 must return to LOW (0)
    $driver->execute_script(qq{
        window.पिन_परिवर्तनम्(0);
    });

    for (my $i = 0; $i < 10; $i++) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $pin1_low_again = $driver->execute_script(qq{
        return (window.पिन_पठन_पंजिका() >> 1) & 1;
    });
    is($pin1_low_again, 0, "When GPIO_0 returns to 0, GPIO_1 returns to 0");
};

$driver->quit();
done_testing();
