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

diag("Starting Selenium Chrome Driver for Clock Generator Assembly Verification...");

my $driver = eval {
    Selenium::Chrome->new(
        binary => $driver_path,
        custom_args => '--headless --disable-gpu --window-size=1600,1000 --no-sandbox'
    );
};

if (!$driver) {
    plan skip_all => "Could not start ChromeDriver: $@";
    exit;
}

$driver->get($file_url);
sleep(1);

subtest "१. क्लॉक जनरेटर असेंबली सत्यापन (Validate clock_generator.asm)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'clock_generator.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # Run validation in browser
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });

    ok($valid, "clock_generator.asm passes assembly validation (all opcodes & operands valid)");

    # Load into memory
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
        window.कूर्दन_सारणी_दत्त[0] = 0; // JMP 0 loops back to 0x0
    });

    my $step_btn = $driver->find_element('पद-चालन-कुञ्जी', 'id');
    my $pin0_elem = $driver->find_element('पिन-गोलक-०', 'id');

    # Step 1: SET1 0 -> Pin 0 becomes 1
    $step_btn->click();
    is($pin0_elem->get_text(), '1', "Step 1 (SET1 0): Pin 0 driven HIGH (1)");

    # Step 2: NOP
    $step_btn->click();
    is($pin0_elem->get_text(), '1', "Step 2 (NOP): Pin 0 stays HIGH");

    # Step 3: NOP
    $step_btn->click();
    is($pin0_elem->get_text(), '1', "Step 3 (NOP): Pin 0 stays HIGH");

    # Step 4: SET0 0 -> Pin 0 becomes 0
    $step_btn->click();
    is($pin0_elem->get_text(), '0', "Step 4 (SET0 0): Pin 0 driven LOW (0)");

    # Step 5: NOP
    $step_btn->click();
    is($pin0_elem->get_text(), '0', "Step 5 (NOP): Pin 0 stays LOW");

    # Step 6: NOP
    $step_btn->click();
    is($pin0_elem->get_text(), '0', "Step 6 (NOP): Pin 0 stays LOW");

    # Step 7: JMP 0 -> loops back to 0x0
    $step_btn->click();
    my $pc = $driver->find_element('गणक-मान', 'id')->get_text();
    like($pc, qr/0x0/, "Step 7 (JMP 0): Loop completed, PC looped back to 0x0 for next clock period");

    # Next cycle Step 8 (0x0 again): SET1 0 -> Pin 0 becomes 1
    $step_btn->click();
    is($pin0_elem->get_text(), '1', "Cycle 2 Step 1 (SET1 0): Pin 0 driven HIGH again");
};

subtest "२. टाइमर आधारित क्लॉक जनरेटर सत्यापन (Validate timer_clock_generator.asm)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'timer_clock_generator.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # Run validation in browser
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });

    ok($valid, "timer_clock_generator.asm passes assembly validation (timer operands valid)");
};

$driver->quit();
done_testing();

