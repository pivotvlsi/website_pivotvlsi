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

diag("Starting Selenium Chrome Driver for way_3/problem4.asm 10-Cycle Halting Verification...");

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

subtest "Way 3: 10 Clock Cycles Pulse Generator (problem4.asm) Halts Cleanly" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_3', 'problem4.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Validate assembly code
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "way_3/problem4.asm passes 16-instruction hardware ISA validation");

    # 2. Assemble and load (which automatically parses JUMP_TABLE[0] = 0x3)
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Verify that JUMP_TABLE[0] was configured to 0x3
    my $jump0 = $driver->execute_script(qq{
        return window.कूर्दन_सारणी_दत्त[0];
    });
    is($jump0, 3, "JUMP_TABLE[0] automatically configured to 0x3 from header");

    # 3. Step through initialization:
    # 0x0: LOADIB #1
    $driver->execute_script('window.पद_चालनम्();');
    # 0x1: LOADI #10
    $driver->execute_script('window.पद_चालनम्();');
    # 0x2: STORE 0x2 -> R2 = 10
    $driver->execute_script('window.पद_चालनम्();');

    my $pin0_elem = $driver->find_element('पिन-गोलक-०', 'id');
    my $high_count = 0;
    my $low_count = 0;

    # Execute 10 loop iterations (each iteration is 7 instructions: SET1, NOP, SET0, LOAD, SUB, STORE, JMPNZ)
    for (my $it = 1; $it <= 10; $it++) {
        # 0x3: SET1 0
        $driver->execute_script('window.पद_चालनम्();');
        $high_count++ if $pin0_elem->get_text() eq '1';

        # 0x4: NOP
        $driver->execute_script('window.पद_चालनम्();');

        # 0x5: SET0 0
        $driver->execute_script('window.पद_चालनम्();');
        $low_count++ if $pin0_elem->get_text() eq '0';

        # 0x6: LOAD 0x2
        $driver->execute_script('window.पद_चालनम्();');

        # 0x7: SUB
        $driver->execute_script('window.पद_चालनम्();');

        # 0x8: STORE 0x2
        $driver->execute_script('window.पद_चालनम्();');

        # 0x9: JMPNZ 0
        $driver->execute_script('window.पद_चालनम्();');
    }

    is($high_count, 10, "Pin 0 generated exactly 10 HIGH pulse edges");
    is($low_count, 10, "Pin 0 generated exactly 10 LOW pulse edges");

    # Check counter R2
    my $r2 = $driver->execute_script(qq{
        return window.पंजिका_दत्त[2];
    });
    is($r2, 0, "Counter R2 decremented to 0 after 10 completed cycles");

    # Next step must hit HALT at 0xA
    $driver->execute_script('window.पद_चालनम्();');
    my $halt_pc = $driver->execute_script(qq{
        return window.कार्यक्रम_गणक_प्राप्ति();
    });
    is($halt_pc, 0xA, "Execution halted cleanly at PC = 0xA (HALT instruction)");
};

$driver->quit();
done_testing();

