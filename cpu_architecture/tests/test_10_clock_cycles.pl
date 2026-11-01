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

diag("Starting Selenium Chrome Driver for 10 Clock Cycles Verification...");

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

subtest "१० क्लॉक साइकल असेंबली सत्यापन (Validation and Stepping of 10 Highs & 10 Lows via STORE/LOAD)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'clock_burst_10cycles.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # Run validation in browser
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });

    ok($valid, "clock_burst_10cycles.asm passes assembly validation");

    # Load assembly into CPU
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
        window.कूर्दन_सारणी_दत्त[0] = 3;
    });

    my $pin0_elem = $driver->find_element('पिन-गोलक-०', 'id');

    # Execute initialization:
    # 0x0: LOADIB #1
    $driver->execute_script('window.पद_चालनम्();');
    # 0x1: LOADI #10
    $driver->execute_script('window.पद_चालनम्();');
    # 0x2: STORE 0x2 -> R2 = 10
    $driver->execute_script('window.पद_चालनम्();');

    my $r2_val = $driver->execute_script('return window.पंजिका_दत्त[2];');
    is($r2_val, 10, "Loop counter R2 initialized to 10 via STORE 0x2");

    # Step through 10 iterations of the clock pulse generator
    my $high_count = 0;
    my $low_count = 0;

    for (my $it = 1; $it <= 10; $it++) {
        # 0x3: SET1 0 -> Pin 0 = 1
        $driver->execute_script('window.पद_चालनम्();');
        $high_count++ if $pin0_elem->get_text() eq '1';

        # 0x4: NOP
        $driver->execute_script('window.पद_चालनम्();');

        # 0x5: SET0 0 -> Pin 0 = 0
        $driver->execute_script('window.पद_चालनम्();');
        $low_count++ if $pin0_elem->get_text() eq '0';

        # 0x6: LOAD 0x2 (Restore R2 counter to ACC)
        $driver->execute_script('window.पद_चालनम्();');

        # 0x7: SUB (ACC = ACC - B)
        $driver->execute_script('window.पद_चालनम्();');

        # 0x8: STORE 0x2 (Save decremented count to R2)
        $driver->execute_script('window.पद_चालनम्();');

        # 0x9: JMPNZ 0
        $driver->execute_script('window.पद_चालनम्();');
    }

    is($high_count, 10, "Pin 0 rose HIGH exactly 10 times");
    is($low_count, 10, "Pin 0 fell LOW exactly 10 times");

    # Counter R2 should now be 0
    my $final_r2 = $driver->execute_script('return window.पंजिका_दत्त[2];');
    is($final_r2, 0, "Counter R2 reached 0 after 10 full clock periods");

    # After loop terminates, PC advances to 0xA (HALT)
    $driver->execute_script('window.पद_चालनम्();');
    my $pc = $driver->find_element('गणक-मान', 'id')->get_text();
    like($pc, qr/0xA/i, "Execution arrived and stopped at HALT (PC = 0xA)");
};

$driver->quit();
done_testing();
