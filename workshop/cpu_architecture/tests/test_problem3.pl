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

diag("Starting Selenium Chrome Driver for problem3.asm Fibonacci Verification...");

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

subtest "Problem 3: Fibonacci Sequence Generation (0, 1, 1, 2, 3, 5, 8, 13)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'problem3.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Validate assembly code
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "problem3.asm passes 16-instruction hardware ISA validation");

    # 2. Assemble and load into processor memory
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
        window.कूर्दन_सारणी_दत्त[0] = 3;  // Loop start at 0x3
        window.कूर्दन_सारणी_दत्त[1] = 12; // HALT address at 0xC
    });

    # Expected Fibonacci numbers computed by ADD at each loop iteration:
    # F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13 (0xD)
    my @expected_fib = (1, 2, 3, 5, 8, 13);
    my @collected_fib = ();

    # Initialization:
    # 0x0: LOADIB #1 (B = 1)
    $driver->execute_script('window.पद_चालनम्();');
    # 0x1: LOADI #0  (ACC = 0)
    $driver->execute_script('window.पद_चालनम्();');
    # 0x2: STORE 0x3 (R3 = 0)
    $driver->execute_script('window.पद_चालनम्();');

    for (my $it = 0; $it < 6; $it++) {
        # 0x3: ADD
        $driver->execute_script('window.पद_चालनम्();');
        my $acc_val = $driver->execute_script('return window.पंजिका_दत्त[0];');
        push @collected_fib, $acc_val;

        # 0x4: JMPC 1 (No jump, carry is 0)
        $driver->execute_script('window.पद_चालनम्();');
        # 0x5: STORE 0x2
        $driver->execute_script('window.पद_चालनम्();');
        # 0x6: LOAD 0x1
        $driver->execute_script('window.पद_चालनम्();');
        # 0x7: STORE 0x3
        $driver->execute_script('window.पद_चालनम्();');
        # 0x8: LOAD 0x2
        $driver->execute_script('window.पद_चालनम्();');
        # 0x9: STORE 0x1
        $driver->execute_script('window.पद_चालनम्();');
        # 0xA: LOAD 0x3
        $driver->execute_script('window.पद_चालनम्();');
        # 0xB: JMP 0 -> loops back to 0x3
        $driver->execute_script('window.पद_चालनम्();');
    }

    is_deeply(\@collected_fib, \@expected_fib, "Computed Fibonacci sequence matches: 1, 2, 3, 5, 8, 13 (0xD)");

    # Iteration 7: 8 + 13 = 21 -> Overflows 4-bit range (> 15), sets Carry
    # 0x3: ADD -> 8 + 13 = 21 (ACC = 5, Carry = 1)
    $driver->execute_script('window.पद_चालनम्();');
    # 0x4: JMPC 1 -> Carry=1, branches directly to HALT (0xC)
    $driver->execute_script('window.पद_चालनम्();');

    my $pc = $driver->find_element('गणक-मान', 'id')->get_text();
    like($pc, qr/0xC/i, "JMPC took branch to HALT at PC 0xC upon 4-bit overflow");
};

$driver->quit();
done_testing();
