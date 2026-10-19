use strict;
use warnings;
use utf8;
use Selenium::Chrome;
use Cwd 'abs_path';
use File::Basename;
binmode STDOUT, ':utf8';

print "Starting Boolean Algebra HTML Equation Generation Selenium UI Test...\n\n";

my $test_count = 0;
my $pass_count = 0;
my $fail_count = 0;

sub pass_test {
    my ($msg) = @_;
    $test_count++;
    $pass_count++;
    print "[Test $test_count] [PASS] $msg\n";
}

sub fail_test {
    my ($msg) = @_;
    $test_count++;
    $fail_count++;
    print "[Test $test_count] [FAIL] $msg\n";
}

my $current_dir = dirname(abs_path($0));
my $driver_dir = abs_path("$current_dir/../../");
$ENV{PATH} = "$driver_dir;" . $ENV{PATH};

my $driver;
eval {
    $driver = Selenium::Chrome->new;
};
if ($@) {
    die "Failed to connect to ChromeDriver. Error: $@\n";
}
$driver->set_implicit_wait_timeout(5000);

my $url = "file://$current_dir/../boolean_algebra.html";
$url =~ s|\\|/|g;

print "Navigating to: $url\n\n";
$driver->get($url);
sleep(1);

my $fmt_sel = $driver->find_element('format-select', 'id');
my $target_sel = $driver->find_element('target-format-select', 'id');
my $gen_btn = $driver->find_element('चालन-गुण्डिका', 'id');
my $eq_input = $driver->find_element('सङ्ख्या-प्रदर्शनम्', 'id');

# -------------------------------------------------------------
# Scenario 1: SOP Generation in HTML UI
# -------------------------------------------------------------
print "============================================\n";
print "Scenario 1: Validate SOP Generation in HTML UI\n";
print "============================================\n";

$driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel);
$driver->execute_script("arguments[0].value = 'SOP';", $target_sel);
$gen_btn->click();
sleep(1);

my $sop_val = $driver->execute_script("return arguments[0].value;", $eq_input);
print "Generated SOP: $sop_val\n";

if ($sop_val && $sop_val =~ /\+/ && $sop_val =~ /^[A-H01\+\.\'\(\)]+$/) {
    pass_test("Successfully generated SOP equation format in HTML.");
} else {
    fail_test("SOP equation generation failed in HTML: $sop_val");
}

# -------------------------------------------------------------
# Scenario 2: POS Generation in HTML UI
# -------------------------------------------------------------
print "\n============================================\n";
print "Scenario 2: Validate POS Generation in HTML UI\n";
print "============================================\n";

$driver->execute_script("arguments[0].value = 'POS';", $fmt_sel);
$driver->execute_script("arguments[0].value = 'POS';", $target_sel);
$gen_btn->click();
sleep(1);

my $pos_val = $driver->execute_script("return arguments[0].value;", $eq_input);
print "Generated POS: $pos_val\n";

if ($pos_val && ($pos_val =~ /\)\.\(/ || $pos_val =~ /\)\(/ || $pos_val =~ /\+/) && $pos_val =~ /^[A-H01\+\.\'\(\)]+$/) {
    pass_test("Successfully generated POS equation format in HTML.");
} else {
    fail_test("POS equation generation failed in HTML: $pos_val");
}

# -------------------------------------------------------------
# Scenario 3: ANY (Mixed Form) Generation in HTML UI
# -------------------------------------------------------------
print "\n============================================\n";
print "Scenario 3: Validate ANY Generation in HTML UI\n";
print "============================================\n";

$driver->execute_script("arguments[0].value = 'ANY';", $fmt_sel);
$driver->execute_script("arguments[0].value = 'SOP';", $target_sel);
$gen_btn->click();
sleep(1);

my $any_val = $driver->execute_script("return arguments[0].value;", $eq_input);
print "Generated ANY: $any_val\n";

if ($any_val && $any_val =~ /^[A-H01\+\.\'\(\)]+$/ && length($any_val) > 2) {
    pass_test("Successfully generated ANY equation format in HTML.");
} else {
    fail_test("ANY equation generation failed in HTML: $any_val");
}

# -------------------------------------------------------------
# Scenario 4: Multiple Consecutive Invocations across all options
# -------------------------------------------------------------
print "\n============================================\n";
print "Scenario 4: Validate Multiple Iterations across Dropdown Options\n";
print "============================================\n";

my @options = ('SOP', 'POS', 'ANY');
my $iterations_passed = 1;

for my $fmt (@options) {
    $driver->execute_script("arguments[0].value = '$fmt';", $fmt_sel);
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel);
    for (1..3) {
        $gen_btn->click();
        sleep(0.5);
        my $val = $driver->execute_script("return arguments[0].value;", $eq_input);
        if (!$val || $val !~ /^[A-H01\+\.\'\(\)]+$/) {
            $iterations_passed = 0;
            last;
        }
    }
}

if ($iterations_passed) {
    pass_test("Successfully verified repeated generation across SOP, POS, ANY in HTML UI.");
} else {
    fail_test("Failed repeated generation iterations in HTML UI.");
}

$driver->quit();

print "\n============================================\n";
print "Summary: $pass_count / $test_count tests passed.\n";
print "============================================\n";

exit($fail_count > 0 ? 1 : 0);
