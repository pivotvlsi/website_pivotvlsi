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

diag("Starting Selenium Chrome Driver for JMP_TABLE Register 0xC Verification...");

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

subtest "Programmatic JUMP_TABLE configuration via memory-mapped Register 0xC" => sub {
    # Program that configures JUMP_TABLE[0] dynamically via STORE 0xC:
    # 0x0: LOADI #5
    # 0x1: STORE 0xC   -> Sets JUMP_TABLE[0] = 0x5!
    # 0x2: LOADIB #1
    # 0x3: LOADI #10
    # 0x4: STORE 0x2
    # 0x5: SET1 0      -> Loop Start
    # 0x6: NOP
    # 0x7: SET0 0
    # 0x8: LOAD 0x2
    # 0x9: SUB
    # 0xA: STORE 0x2
    # 0xB: JMPNZ 0     -> Jumps to JUMP_TABLE[0] (0x5)
    # 0xC: HALT
    my $asm_code = qq{
        LOADI #5
        STORE 0xC
        LOADIB #1
        LOADI #10
        STORE 0x2
        SET1 0
        NOP
        SET0 0
        LOAD 0x2
        SUB
        STORE 0x2
        JMPNZ 0
        HALT
    };

    # Force JUMP_TABLE[0] to 0 to prove STORE 0xC overrides it at runtime
    $driver->execute_script(qq{
        window.कूर्दन_सारणी_दत्त[0] = 0;
        window.संयोजन_व_भारणम्(`$asm_code`);
        window.कूर्दन_सारणी_दत्त[0] = 0;
    });

    # Execute 0x0 (LOADI #5) and 0x1 (STORE 0xC)
    $driver->execute_script('window.पद_चालनम्();');
    $driver->execute_script('window.पद_चालनम्();');

    my $configured_jump = $driver->execute_script(qq{
        return window.कूर्दन_सारणी_दत्त[0];
    });
    is($configured_jump, 5, "STORE 0xC successfully configured JUMP_TABLE[0] to 0x5 at runtime");

    # Execute initialization:
    # 0x2: LOADIB #1
    $driver->execute_script('window.पद_चालनम्();');
    # 0x3: LOADI #10
    $driver->execute_script('window.पद_चालनम्();');
    # 0x4: STORE 0x2
    $driver->execute_script('window.पद_चालनम्();');

    my $pin0_elem = $driver->find_element('पिन-गोलक-०', 'id');
    my $high_count = 0;
    my $low_count = 0;

    for (my $it = 1; $it <= 10; $it++) {
        # 0x5: SET1 0
        $driver->execute_script('window.पद_चालनम्();');
        $high_count++ if $pin0_elem->get_text() eq '1';

        # 0x6: NOP
        $driver->execute_script('window.पद_चालनम्();');

        # 0x7: SET0 0
        $driver->execute_script('window.पद_चालनम्();');
        $low_count++ if $pin0_elem->get_text() eq '0';

        # 0x8: LOAD 0x2
        $driver->execute_script('window.पद_चालनम्();');

        # 0x9: SUB
        $driver->execute_script('window.पद_चालनम्();');

        # 0xA: STORE 0x2
        $driver->execute_script('window.पद_चालनम्();');

        # 0xB: JMPNZ 0
        $driver->execute_script('window.पद_चालनम्();');
    }

    is($high_count, 10, "Pin 0 generated 10 HIGH pulse edges");
    is($low_count, 10, "Pin 0 generated 10 LOW pulse edges");

    my $final_r2 = $driver->execute_script('return window.पंजिका_दत्त[2];');
    is($final_r2, 0, "Counter R2 decremented to 0 after 10 full clock periods");

    # 0xC: HALT
    $driver->execute_script('window.पद_चालनम्();');
    my $final_pc = $driver->execute_script('return window.कार्यक्रम_गणक_प्राप्ति();');
    is($final_pc, 0xC, "Execution halted cleanly at PC = 0xC (HALT)");
};

$driver->quit();
done_testing();

