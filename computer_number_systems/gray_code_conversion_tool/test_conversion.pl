use strict;
use warnings;
use utf8;
use open qw(:std :utf8);
use Selenium::Chrome;
use Time::HiRes qw(sleep);

# Ensure you have chromedriver running or installed.
print "Initializing Selenium Chrome Driver...\n";
my $driver = Selenium::Chrome->new(
    binary => 'c:\\Users\\rnish\\vscode\\Pasupathi\\pivotvlsi\\truth_table\\chromedriver.exe'
);

# Construct absolute file path
my $filepath = "file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/computer_number_systems/gray_code_conversion_tool/gray_code_conversion_tool.html";

print "Navigating to tool...\n";
$driver->get($filepath);
sleep(2);

print "==========================\n";
print "STARTING TEST 1: Binary to Gray\n";
print "==========================\n";

# 1. Mode selection
my $select = $driver->find_element('रूपान्तरण-दिक्', 'id');
$select->send_keys("b2g");
sleep(0.5);

# 2. Generate problem
my $gen_btn = $driver->find_element('समस्या-सर्जन-कीलः', 'id');
$gen_btn->click();
sleep(1);

# 3. Lock problem
my $prob_lock = $driver->find_element('समस्या-ताला-कीलः', 'id');
$prob_lock->click();
sleep(1);

# 4. Fill XOR table
my @xor_inputs = $driver->find_elements('.xor-input', 'css');
foreach my $input (@xor_inputs) {
    my $a = $input->get_attribute('data-a');
    my $b = $input->get_attribute('data-b');
    my $val = $a ^ $b;
    $input->send_keys("$val");
    sleep(0.2);
}

my $xor_verify = $driver->find_element('ताला-कीलः', 'id');
$xor_verify->click();
sleep(1);

# 5. Read problem and fill top row
my $prob_str = $driver->execute_script("return document.getElementById('समस्या-मूल्यम्').value;");
print "Generated Binary Problem: $prob_str\n";

my @all_inputs = $driver->find_elements('.पद-निवेशनम्', 'css');
my $len = length($prob_str);

for my $i (0 .. $len-1) {
    my $char = substr($prob_str, $i, 1);
    $driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $all_inputs[$i], $char);
    sleep(0.1);
}
sleep(0.5);

# 6. Fill bottom row (Binary to Gray)
my $expected_gray = "";
for my $i (0 .. $len-1) {
    my $b_val = int(substr($prob_str, $i, 1));
    my $prev_b = ($i == 0) ? 0 : int(substr($prob_str, $i-1, 1));
    my $g_val = $b_val ^ $prev_b;
    $expected_gray .= $g_val;
    $driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $all_inputs[$len + $i], "$g_val");
    sleep(0.1);
}

sleep(1);
# 7. Final Verification
my $final_src = $driver->find_element('अन्तिम-स्रोतः', 'id');
$driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $final_src, $prob_str);

my $final_dest = $driver->find_element('अन्तिम-लक्ष्यम्', 'id');
$driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $final_dest, $expected_gray);
sleep(0.5);

my $actual_src = $driver->execute_script("return arguments[0].value;", $final_src);
my $actual_dest = $driver->execute_script("return arguments[0].value;", $final_dest);
print "Debug Test 1: srcVal='$actual_src', expected_src='$prob_str', destVal='$actual_dest', expected_dest='$expected_gray'\n";

my $final_verify = $driver->find_element('अन्तिम-सत्यापन-कीलः', 'id');
$final_verify->click();
sleep(1);

my $verify_text = $driver->execute_script("return arguments[0].innerHTML;", $final_verify);
if ($verify_text =~ /Verified/i) {
    print "TEST 1 PASS: Successfully verified Binary to Gray conversion.\n";
} else {
    print "TEST 1 FAIL: Verification failed.\n";
}

sleep(2);


print "\n==========================\n";
print "STARTING TEST 2: Gray to Binary\n";
print "==========================\n";

# Reload via getting path directly for a fresh slate
$driver->get($filepath);
sleep(2);

$select = $driver->find_element('रूपान्तरण-दिक्', 'id');
$select->send_keys("g2b");
sleep(0.5);

$gen_btn = $driver->find_element('समस्या-सर्जन-कीलः', 'id');
$gen_btn->click();
sleep(1);

$prob_lock = $driver->find_element('समस्या-ताला-कीलः', 'id');
$prob_lock->click();
sleep(1);

@xor_inputs = $driver->find_elements('.xor-input', 'css');
foreach my $input (@xor_inputs) {
    my $a = int($input->get_attribute('data-a'));
    my $b = int($input->get_attribute('data-b'));
    my $val = $a ^ $b;
    $input->send_keys("$val");
    sleep(0.2);
}
$xor_verify = $driver->find_element('ताला-कीलः', 'id');
$xor_verify->click();
sleep(1);

$prob_str = $driver->execute_script("return document.getElementById('समस्या-मूल्यम्').value;");
print "Generated Gray Problem: $prob_str\n";

@all_inputs = $driver->find_elements('.पद-निवेशनम्', 'css');
$len = length($prob_str);

for my $i (0 .. $len-1) {
    my $char = substr($prob_str, $i, 1);
    $driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $all_inputs[$i], $char);
    sleep(0.1);
}
sleep(0.5);

my $expected_bin = "";
my $prev_b = 0;
for my $i (0 .. $len-1) {
    my $g_val = int(substr($prob_str, $i, 1));
    my $b_val = $g_val ^ $prev_b;
    $expected_bin .= $b_val;
    $prev_b = $b_val;
    
    $driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $all_inputs[$len + $i], "$b_val");
    sleep(0.1);
}

sleep(1);
$final_src = $driver->find_element('अन्तिम-स्रोतः', 'id');
$final_src->send_keys($prob_str);

$final_dest = $driver->find_element('अन्तिम-लक्ष्यम्', 'id');
$final_dest->send_keys($expected_bin);
sleep(0.5);

my $actual_src = $driver->execute_script("return arguments[0].value;", $final_src);
my $actual_dest = $driver->execute_script("return arguments[0].value;", $final_dest);
print "Debug Test 2: srcVal='$actual_src', expected_src='$prob_str', destVal='$actual_dest', expected_dest='$expected_bin'\n";

my $final_verify = $driver->find_element('अन्तिम-सत्यापन-कीलः', 'id');
$final_verify->click();
sleep(1);

my $verify_text = $driver->execute_script("return arguments[0].innerHTML;", $final_verify);
if ($verify_text =~ /Verified/i) {
    print "TEST 2 PASS: Successfully verified Gray to Binary conversion.\n";
} else {
    print "TEST 2 FAIL: Verification failed.\n";
}

sleep(3);
$driver->quit();
print "Automation testing complete.\n";
