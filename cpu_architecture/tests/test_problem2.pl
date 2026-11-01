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

diag("Starting Selenium Chrome Driver for problem 2.asm Verification...");

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

subtest "Problem 2: Execution of LSH(2 + 3 - 5)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'problem 2.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Assembly validation
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "problem 2.asm passes ISA validation");

    # 2. Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Step 1: LOADI #2 -> ACC = 2
    $driver->execute_script('window.पद_चालनम्();');
    my $acc1 = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc1, 2, "Step 1 (LOADI #2): ACC = 2");

    # Step 2: LOADIB #3 -> B = 3
    $driver->execute_script('window.पद_चालनम्();');
    my $b1 = $driver->execute_script('return window.पंजिका_दत्त[1];');
    is($b1, 3, "Step 2 (LOADIB #3): B = 3");

    # Step 3: ADD -> ACC = 2 + 3 = 5
    $driver->execute_script('window.पद_चालनम्();');
    my $acc2 = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc2, 5, "Step 3 (ADD): ACC = 5");

    # Step 4: LOADIB #5 -> B = 5
    $driver->execute_script('window.पद_चालनम्();');
    my $b2 = $driver->execute_script('return window.पंजिका_दत्त[1];');
    is($b2, 5, "Step 4 (LOADIB #5): B = 5");

    # Step 5: SUB -> ACC = 5 - 5 = 0
    $driver->execute_script('window.पद_चालनम्();');
    my $acc3 = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc3, 0, "Step 5 (SUB): ACC = 0");

    # Step 6: SHL -> ACC = 0 << 1 = 0
    $driver->execute_script('window.पद_चालनम्();');
    my $acc_final = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc_final, 0, "Step 6 (SHL): ACC = 0");

    # Step 7: HALT
    $driver->execute_script('window.पद_चालनम्();');
    my $pc = $driver->find_element('गणक-मान', 'id')->get_text();
    like($pc, qr/0x6/i, "Program safely halted at PC 0x6");
};

$driver->quit();
done_testing();

