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

diag("Starting Selenium Chrome Driver for way_4/problem4.asm Timer-Based Waveform Verification...");

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

subtest "Way 4: Timer-Controlled Clock Waveform Generator (problem4.asm)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_4', 'problem4.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Validate assembly code
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "way_4/problem4.asm passes 16-instruction hardware ISA validation");

    # 2. Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Configure jump table: index 0 -> 0x2 (loop entry point)
    $driver->execute_script(qq{
        if (window.कूर्दन_सारणी_दत्त) {
            window.कूर्दन_सारणी_दत्त[0] = 0x2;
        }
    });

    my $pin0_elem = $driver->find_element('पिन-गोलक-०', 'id');
    my $pin0_transitions = 0;
    my $last_pin0 = '0';
    my $stalls_observed = 0;

    # Execute 30 single steps
    for (my $step = 1; $step <= 30; $step++) {
        my $state = $driver->execute_script(qq{
            const wasStalled = window.समयगणक_अवरोध_प्राप्ति() ? 1 : 0;
            window.पद_चालनम्();
            const isStalled = window.समयगणक_अवरोध_प्राप्ति() ? 1 : 0;
            const timer = window.समयगणक_पंजिका_प्राप्ति();
            const pc = window.कार्यक्रम_गणक_प्राप्ति();
            return {
                wasStalled: wasStalled,
                isStalled: isStalled,
                timer: timer,
                pc: pc
            };
        });

        if ($state->{wasStalled} || $state->{isStalled}) {
            $stalls_observed++;
        }

        my $current_pin0 = $pin0_elem->get_text();
        if ($current_pin0 ne $last_pin0) {
            $pin0_transitions++;
            $last_pin0 = $current_pin0;
        }
    }

    ok($stalls_observed >= 4, "Timer countdown stall executed ($stalls_observed stall steps observed)");
    ok($pin0_transitions >= 2, "Pin 0 generated square wave transitions ($pin0_transitions transitions observed)");
};

$driver->quit();
done_testing();
