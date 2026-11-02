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

diag("Starting Selenium Chrome Driver for unrolled way_2/problem3.asm Verification...");

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

subtest "Way 2: Unrolled Fibonacci without loops (0, 1, 1, 2, 3, 5, 8)" => sub {
    my $asm_file = File::Spec->catfile($root_dir, 'asm_files', 'way_2', 'problem3.asm');
    open my $fh, '<:utf8', $asm_file or die "Cannot open $asm_file: $!";
    my $asm_code = do { local $/; <$fh> };
    close $fh;

    # 1. Validate assembly code
    my $valid = $driver->execute_script(qq{
        const परिणाम = window.निर्देश_संहिता_सत्यापनम्(`$asm_code`);
        return परिणाम.सफलम्;
    });
    ok($valid, "Unrolled problem3.asm passes 16-instruction hardware ISA validation");

    # 2. Assemble and load
    $driver->execute_script(qq{
        window.संयोजन_व_भारणम्(`$asm_code`);
    });

    # Execute all 16 instructions line by line (linear pipeline without jump tables)
    for (1..16) {
        $driver->execute_script('window.पद_चालनम्();');
    }

    # Verify each Fibonacci term in memory:
    my $m2 = $driver->execute_script('return window.आंकड़ा_स्मृति_दत्त[2];');  # F(2) = 1
    my $m3 = $driver->execute_script('return window.आंकड़ा_स्मृति_दत्त[3];');  # F(3) = 2
    my $m9 = $driver->execute_script('return window.आंकड़ा_स्मृति_दत्त[9];');  # F(4) = 3
    my $mA = $driver->execute_script('return window.आंकड़ा_स्मृति_दत्त[10];'); # F(5) = 5
    my $mB = $driver->execute_script('return window.आंकड़ा_स्मृति_दत्त[11];'); # F(6) = 8
    my $acc = $driver->execute_script('return window.पंजिका_दत्त[0];');        # Latest term = 8

    is($m2, 1, "Memory[0x2] contains Fibonacci term F(2) = 1");
    is($m3, 2, "Memory[0x3] contains Fibonacci term F(3) = 2");
    is($m9, 3, "Memory[0x9] contains Fibonacci term F(4) = 3");
    is($mA, 5, "Memory[0xA] contains Fibonacci term F(5) = 5");
    is($mB, 8, "Memory[0xB] contains Fibonacci term F(6) = 8");
    is($acc, 8, "ACC contains final computed term = 8");

    my $pc = $driver->find_element('गणक-मान', 'id')->get_text();
    like($pc, qr/0xF/i, "Linear execution halted cleanly at PC 0xF without jumping");
};

$driver->quit();
done_testing();
