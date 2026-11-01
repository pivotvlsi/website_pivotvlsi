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

diag("Starting Selenium Chrome Driver for Instant Execution Testing...");

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

subtest "१. तात्कालिक निवेश पट्टिका उपस्थिति (Instant Execution Bar UI elements present)" => sub {
    my $input = eval { $driver->find_element('तात्कालिक-निर्देश-निवेश', 'id') };
    ok($input, "Instant instruction input field is present");

    my $run_btn = eval { $driver->find_element('तात्कालिक-निष्पादन-कुञ्जी', 'id') };
    ok($run_btn, "Instant run button is present");

    my $feedback = eval { $driver->find_element('तात्कालिक-निर्देश-प्रतिक्रिया', 'id') };
    ok($feedback, "Instant feedback message element is present");
};

subtest "२. तात्कालिक अंकगणितीय संक्रिया निष्पादन (Instant ALU Execution: ADD, SUB, AND, XOR)" => sub {
    my $input = $driver->find_element('तात्कालिक-निर्देश-निवेश', 'id');
    my $run_btn = $driver->find_element('तात्कालिक-निष्पादन-कुञ्जी', 'id');

    # 1. LOADI #7
    $input->clear();
    $input->send_keys('LOADI #7');
    $run_btn->click();
    sleep(0.3);

    my $acc = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc, 7, "LOADI #7 executed instantly: ACC=7");

    # 2. LOADIB #3
    $input->clear();
    $input->send_keys('LOADIB #3');
    $run_btn->click();
    sleep(0.3);

    my $b_val = $driver->execute_script('return window.पंजिका_दत्त[1];');
    is($b_val, 3, "LOADIB #3 executed instantly: B=3");

    # 3. Instant ADD
    $input->clear();
    $input->send_keys('ADD');
    $run_btn->click();
    sleep(0.3);

    $acc = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc, 10, "ADD executed instantly on ACC & B: 7 + 3 = 10");

    # 4. Instant SUB
    $input->clear();
    $input->send_keys('SUB');
    $run_btn->click();
    sleep(0.3);

    $acc = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc, 7, "SUB executed instantly on ACC & B: 10 - 3 = 7");

    # 5. Instant XOR
    $input->clear();
    $input->send_keys('XOR');
    $run_btn->click();
    sleep(0.3);

    $acc = $driver->execute_script('return window.पंजिका_दत्त[0];');
    is($acc, 4, "XOR executed instantly: 7 ^ 3 = 4");

    # Check feedback text
    my $feedback = $driver->find_element('तात्कालिक-निर्देश-प्रतिक्रिया', 'id');
    like($feedback->get_text(), qr/Executed: 'XOR'/i, "Feedback confirms instant execution of XOR");
};

subtest "३. तात्कालिक पिन संक्रिया निष्पादन (Instant SET0 / SET1 Pin Driving)" => sub {
    my $input = $driver->find_element('तात्कालिक-निर्देश-निवेश', 'id');
    my $run_btn = $driver->find_element('तात्कालिक-निष्पादन-कुञ्जी', 'id');

    # Drive Pin 2 HIGH via instant SET1 2
    $input->clear();
    $input->send_keys('SET1 2');
    $run_btn->click();
    sleep(0.3);

    my $pin_elem = $driver->find_element('पिन-गोलक-२', 'id');
    is($pin_elem->get_text(), '1', "SET1 2 executed instantly: Pin 2 is 1");

    # Drive Pin 2 LOW via instant SET0 2
    $input->clear();
    $input->send_keys('SET0 2');
    $run_btn->click();
    sleep(0.3);

    is($pin_elem->get_text(), '0', "SET0 2 executed instantly: Pin 2 is 0");
};

subtest "४. अमान्य निर्देश सत्यापन एवं सुरक्षा (Invalid Instant Instruction Rejection)" => sub {
    my $input = $driver->find_element('तात्कालिक-निर्देश-निवेश', 'id');
    my $run_btn = $driver->find_element('तात्कालिक-निष्पादन-कुञ्जी', 'id');
    my $feedback = $driver->find_element('तात्कालिक-निर्देश-प्रतिक्रिया', 'id');

    # Invalid Opcode
    $input->clear();
    $input->send_keys('INVALID_OP');
    $run_btn->click();
    sleep(0.3);

    like($feedback->get_text(), qr/Invalid Opcode/i, "Invalid opcode rejected by instant execution validator");

    # Out of range immediate
    $input->clear();
    $input->send_keys('LOADI #999');
    $run_btn->click();
    sleep(0.3);

    like($feedback->get_text(), qr/immediate operand/i, "Out-of-range immediate rejected by instant execution validator");
};

$driver->quit();
done_testing();

