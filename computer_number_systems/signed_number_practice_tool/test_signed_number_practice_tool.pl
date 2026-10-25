use strict;
use warnings;
use utf8;
use open qw(:std :utf8);
use Selenium::Chrome;
use Time::HiRes qw(sleep);
use Test::More;

print "Initializing Selenium Chrome Driver...\n";
my $driver = Selenium::Chrome->new(
    binary => 'c:\\Users\\rnish\\vscode\\Pasupathi\\pivotvlsi\\truth_table\\chromedriver.exe'
);

my $filepath = "file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/computer_number_systems/signed_number_practice_tool/signed_number_practice_tool.html";

print "Navigating to tool...\n";
$driver->get($filepath);
sleep(2);

print "==========================\n";
print "STARTING TEST: Signed Number Practice Tool\n";
print "==========================\n";

my @rows = $driver->find_elements('#सारणीशरीरम् tr', 'css');
ok(scalar(@rows) == 31, "Verified 31 rows are present");

for my $i (0 .. $#rows) {
    my $sNoValue = $i - 15;
    
    my $absVal = abs($sNoValue);
    my $absStr = sprintf("%b", $absVal);
    my $magBits = length($absStr) < 4 ? 4 : length($absStr);
    
    while (length($absStr) < $magBits) {
        $absStr = '0' . $absStr;
    }
    
    # 1. Signed Magnitude
    my $expectedSM = ($sNoValue < 0 ? '1' : '0') . $absStr;
    
    # 2. 1's Complement
    my $expected1s = '';
    if ($sNoValue >= 0) {
        $expected1s = '0' . $absStr;
    } else {
        $expected1s = '1' . join('', map { $_ eq '0' ? '1' : '0' } split(//, $absStr));
    }
    
    # 3. 2's Complement
    my $expected2s = '';
    if ($sNoValue >= 0) {
        $expected2s = '0' . $absStr;
    } else {
        my $bitLen = $magBits + 1;
        if ($sNoValue == -16) { $bitLen = 5; }
        my $val = (2 ** $bitLen) + $sNoValue;
        $expected2s = sprintf("%0${bitLen}b", $val);
    }
    
    # Fetch inputs for the current row
    my @inputs = $driver->find_elements("input[data-पङ्क्ति='$i']", 'css');
    
    # Column indices correspond to data-स्तम्भ values:
    # 1 = Signed Magnitude, 2 = 2's Complement, 3 = 1's Complement
    $driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $inputs[0], $expectedSM);
    $driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $inputs[1], $expected2s);
    $driver->execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", $inputs[2], $expected1s);
}

sleep(1);
my $check_btn = $driver->find_element('परीक्षणकीलः', 'id');
$check_btn->click();
sleep(1);

my $success_msg = $driver->find_element('सफलता-सन्देशः', 'id');
ok($success_msg, "Success message is displayed after checking correct inputs");

sleep(2);
$driver->quit();
done_testing();
print "Automation testing complete.\n";
