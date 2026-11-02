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

diag("Starting Selenium Chrome Driver for Register Initialization Verification...");

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

subtest "Way 2: Strict ISA LOADIB & STORE Verification" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_2', 'store_r1_r2_r4.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # Run validation in browser
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "Way 2 assembly passes validation");

    # Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Execute instructions (LOADIB #1, LOADI #2, STORE 0x2, LOADI #4, STORE 0x4, HALT = 6 steps)
    for (1..6) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $r1 = $driver->execute_script('return window.पंजिका_दत्त[1];');
    my $r2 = $driver->execute_script('return window.पंजिका_दत्त[2];');
    my $r4 = $driver->execute_script('return window.पंजिका_दत्त[4];');

    is($r1, 1, "R1 has value 1 in Way 2");
    is($r2, 2, "R2 has value 2 in Way 2");
    is($r4, 4, "R4 has value 4 in Way 2");
};

subtest "Way 1: Pure LOADI & STORE Verification" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_1', 'store_r1_r2_r4.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # Run validation in browser
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "Way 1 assembly passes validation");

    # Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Execute all instructions (LOADI #1, STORE 0x1, LOADI #2, STORE 0x2, LOADI #4, STORE 0x4, HALT = 7 steps)
    for (1..7) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    my $r1 = $driver->execute_script('return window.पंजिका_दत्त[1];');
    my $r2 = $driver->execute_script('return window.पंजिका_दत्त[2];');
    my $r4 = $driver->execute_script('return window.पंजिका_दत्त[4];');

    is($r1, 1, "R1 has value 1 in Way 1");
    is($r2, 2, "R2 has value 2 in Way 1");
    is($r4, 4, "R4 has value 4 in Way 1");
};

$driver->quit();
done_testing();
