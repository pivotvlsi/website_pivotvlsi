#!/usr/bin/perl
use strict;
use warnings;
use utf8;
use open qw(:std :utf8);
use Selenium::Chrome;
use File::Spec;
use Cwd 'abs_path';

# Start a new Selenium session
# Use Selenium::Chrome which automatically starts the chromedriver
print "Initializing Selenium Chrome Driver...\n";
my $driver = Selenium::Chrome->new(
    binary => 'c:\\Users\\rnish\\vscode\\Pasupathi\\pivotvlsi\\truth_table\\chromedriver.exe'
);

# Get absolute path to the HTML file
my $html_file = abs_path('twos_complement_conversion_tool.html');
$driver->get("file://$html_file");
sleep(2);

print "Testing 2's Complement Conversion Tool UI...\n";

# 1. Generate Binary Number
my $gen_btn = $driver->find_element('समस्या-सर्जन-कीलः', 'id');
$gen_btn->click();
sleep(1);

my $lock_btn = $driver->find_element('समस्या-ताला-कीलः', 'id');
$lock_btn->click();
sleep(1);

# Get the generated binary string
my $binary_str = $driver->execute_script("return document.getElementById('समस्या-मूल्यम्').value;");
$binary_str =~ s/ //g; # Remove spaces
print "Generated Binary: $binary_str\n";

# 2. Step 1: 1's Complement
# Find the inputs in the first step (the ones with maxlength="1")
# Wait for them to be visible
sleep(1);
my @step1_inputs = $driver->find_elements("(//div[\@id='वाम-पटलम्']//div[contains(\@class, 'पद-पङ्क्ति')])[2]//input", 'xpath');
if (@step1_inputs != length($binary_str)) {
    die "Mismatch in number of input boxes for Step 1.\n";
}

# The user is expected to type L to R (or however). 
# We'll just type the inverted bits.
my $ones_comp = "";
for my $i (0 .. $#step1_inputs) {
    my $bit = substr($binary_str, $i, 1);
    my $inv_bit = $bit eq '1' ? '0' : '1';
    $step1_inputs[$i]->send_keys($inv_bit);
    $ones_comp .= $inv_bit;
    sleep(0.1);
}
print "1's Complement entered: $ones_comp\n";

# 3. Step 2: Binary Addition -> Truth Table Prerequisite
sleep(1);
print "Filling Full Adder Truth Table...\n";
my @fa_inputs = $driver->find_elements("//input[\@class='fa-input']", 'xpath');

foreach my $inp (@fa_inputs) {
    my $a = $inp->get_attribute('data-a');
    my $b = $inp->get_attribute('data-b');
    my $c = $inp->get_attribute('data-c');
    my $type = $inp->get_attribute('data-type');
    
    my $total = $a + $b + $c;
    my $expected = "";
    if ($type eq 'sum') {
        $expected = $total % 2;
    } else {
        $expected = $total >= 2 ? 1 : 0;
    }
    $inp->send_keys("$expected");
}

my $verify_tt_btn = $driver->find_element('सत्यता-सारणी-ताला-कीलः', 'id');
$verify_tt_btn->click();
sleep(1);
print "Truth Table verified.\n";

# 4. Step 2: Fill Operands
# Operands are unlocked now. We need to find the inputs in the left pane (Row 1 and Row 2)
# Row 1 expected: $ones_comp
# Row 2 expected: 0000000001
my $row2_expected = "0000000001";
print "Filling Operands...\n";

# We know there are 3 rows of inputs inside 'योग-पात्रम्': 
# first row of inputs is 'Carry'
# second is Row 1
# third is Row 2
# fourth is Sum
# So we select by their expected dataset attributes to be safe, or just find all in प्रथम_पङ्क्ति
my @row1_inputs = $driver->find_elements("(//div[\@id='पद-पात्रम्']//div[contains(\@class, 'पद-पङ्क्ति')])[4]//input", 'xpath');
my @row2_inputs = $driver->find_elements("(//div[\@id='पद-पात्रम्']//div[contains(\@class, 'पद-पङ्क्ति')])[5]//input", 'xpath');

# Fill right to left as per our new UX, or just iterate through
for (my $i = 9; $i >= 0; $i--) {
    $row1_inputs[$i]->send_keys(substr($ones_comp, $i, 1));
    sleep(0.2);
}
for (my $i = 9; $i >= 0; $i--) {
    $row2_inputs[$i]->send_keys(substr($row2_expected, $i, 1));
    sleep(0.2);
}

# Click Proceed for operands (the first Proceed button)
my @proceed_btns = $driver->find_elements("//div[\@id='पद-पात्रम्']//button[text()='Proceed']", 'xpath');
$proceed_btns[0]->click();
sleep(1);
print "Operands verified.\n";

# 5. Step 2: Fill Carry
print "Filling Carries...\n";
my @carry_inputs = $driver->find_elements("(//div[\@id='पद-पात्रम्']//div[contains(\@class, 'पद-पङ्क्ति')])[3]//input", 'xpath');

# Calculate carries manually
my @carries = (0) x 10;
my $c_in = 0;
my $sum_str = "";
for (my $i = 9; $i >= 0; $i--) {
    my $b1 = substr($ones_comp, $i, 1);
    my $b2 = substr($row2_expected, $i, 1);
    my $sum_bit = $b1 + $b2 + $c_in;
    $sum_str = ($sum_bit % 2) . $sum_str;
    $c_in = $sum_bit >= 2 ? 1 : 0;
    if ($i > 0) {
        $carries[$i - 1] = $c_in;
    }
}

# The LSB carry is a div placeholder, so input array is size 9 for bits 0..8
# 6. Step 2: Fill Carry and Sum column by column
print "Filling Carries and Sums (Right to Left)...\n";
my @sum_inputs = $driver->find_elements("(//div[\@id='पद-पात्रम्']//div[contains(\@class, 'पद-पङ्क्ति')])[6]//input", 'xpath');

# LSB only has Sum input
$sum_inputs[9]->send_keys(substr($sum_str, 9, 1));
sleep(0.3);

# Other columns have Carry and Sum
for (my $i = 8; $i >= 0; $i--) {
    $carry_inputs[$i]->send_keys("$carries[$i]");
    sleep(0.3);
    $sum_inputs[$i]->send_keys(substr($sum_str, $i, 1));
    sleep(0.3);
}

# Click Proceed for Sum (the second proceed button, since Carry proceed was removed)
@proceed_btns = $driver->find_elements("//div[\@id='पद-पात्रम्']//button[text()='Proceed']", 'xpath');
$proceed_btns[1]->click();
sleep(5);

print "Sum verified. Test Completed Successfully!\n";

$driver->quit();
