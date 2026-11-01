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

diag("Starting Selenium Chrome Driver for unrolled way_2/problem4.asm Verification...");

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

subtest "Way 2: Unrolled Clock Pulse Burst without loops (problem4.asm)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_2', 'problem4.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Validate assembly code
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "Unrolled problem4.asm passes 16-instruction hardware ISA validation");

    # 2. Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    my $pin0_elem = $driver->find_element('पिन-गोलक-०', 'id');
    my $high_count = 0;
    my $low_count = 0;

    # Step through all 15 pulse transitions
    for (my $step = 1; $step <= 15; $step++) {
        $driver->execute_script('window.पद_चालनम्();');
        my $val = $pin0_elem->get_text();
        if ($val eq '1') {
            $high_count++;
        } elsif ($val eq '0') {
            $low_count++;
        }
    }

    is($high_count, 8, "Pin 0 rose HIGH exactly 8 times during linear unrolled execution");
    is($low_count, 7, "Pin 0 fell LOW exactly 7 times during linear unrolled execution");

    # Step 16: HALT
    $driver->execute_script('window.पद_चालनम्();');
    my $pc = $driver->find_element('गणक-मान', 'id')->get_text();
    like($pc, qr/0xF/i, "Linear execution halted cleanly at PC 0xF without jumping");
};

$driver->quit();
done_testing();

