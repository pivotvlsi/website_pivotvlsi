use strict;
use warnings;
use utf8;

BEGIN {
    open my $log_fh, '>', 'test_output.log' or die "Cannot open log file: $!";
    binmode($log_fh, ":utf8");
    open STDOUT, '>&', $log_fh or die "Can't redirect STDOUT: $!";
    binmode(STDOUT, ":utf8");
    open STDERR, '>&', $log_fh or die "Can't redirect STDERR: $!";
    binmode(STDERR, ":utf8");
    $| = 1; # Autoflush
}

use open ':std', ':encoding(UTF-8)';
use Test::More;
use Selenium::Chrome;
use IO::Socket::INET;
use Time::HiRes qw(sleep);
use FindBin;
use File::Spec;
use JSON;
use IPC::Cmd qw(can_run);

# Ensure autoflush so logs are written immediately
$| = 1;

our ($simulate_drag_js, $simulate_wire_draw_js, $wire_count, $temp_wire_active, $normal_btn, $canvas, $wire_btn, $canvas_cursor, $wire_count_10, $wire_count_11, $overlap_detour_js, $was_shifted, $overlap_check_js, $passed, $draw_test9_path_js);

$ENV{PATH} = 'C:\Users\rnish\vscode\Pasupathi\pivotvlsi\truth_table;'.$ENV{PATH};
print "\n==============================================\n";
print "  PIVOT VLSI - Perl/Selenium Automated Test Suite\n";
print "==============================================\n\n";

# Grab the target test number from the command line (e.g., `perl test_suite.pl 8`)
# If no argument is provided, default to 0 (which means run everything)
our $target_test = $ARGV[0] || 0;

# 1. Initialize Chrome visibly so tests can be watched
our $driver = Selenium::Chrome->new(
    custom_args => '--allow-file-access-from-files'
);

END {
    if (defined $driver) {
        eval { $driver->quit() };
    }
    # Forcefully kill any lingering chromedriver processes on Windows
    system("taskkill /IM chromedriver.exe /F >nul 2>&1");
}
$SIG{INT} = sub {
    if (defined $driver) {
        eval { $driver->quit() };
    }
    system("taskkill /IM chromedriver.exe /F >nul 2>&1");
    exit 1;
};

# 2. Load the Schematic HTML
our $file_path = 'file:///c:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/schematic/schematic.html';
$driver->get($file_path);

# Give the DOM and Canvas a brief moment to initialize
sleep(1);

# --- GLOBAL ASSIGNMENTS ---
$canvas = $driver->find_element('तर्कद्वारपटः', 'id');
$wire_btn = $driver->find_element('तन्तुकुञ्जिका', 'id');
$normal_btn = $driver->find_element('सामान्यकुञ्जिका', 'id');

$simulate_drag_js = <<'JS';
    let startX = arguments[0];
    let endX = arguments[1];
    let div = document.getElementById('पट्टिकाविभाजकः');
    div.dispatchEvent(new MouseEvent('mousedown', {clientX: startX}));
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: endX}));
    document.dispatchEvent(new MouseEvent('mouseup'));
JS

$simulate_wire_draw_js = <<'JS';
    let canvas = arguments[0];
    let rect = canvas.getBoundingClientRect();
    let startX = rect.left + arguments[1];
    let startY = rect.top + arguments[2];
    let endX = rect.left + arguments[3];
    let endY = rect.top + arguments[4];
    
    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: startX, clientY: startY, bubbles: true }));
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: startX, clientY: startY, bubbles: true }));
    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: endX, clientY: endY, bubbles: true }));
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: endX, clientY: endY, bubbles: true }));
JS
# --------------------------


require './schematic_test_suite/test_01.pl';

require './schematic_test_suite/test_02.pl';

require './schematic_test_suite/test_03.pl';

require './schematic_test_suite/test_04.pl';

require './schematic_test_suite/test_05.pl';

require './schematic_test_suite/test_06.pl';

require './schematic_test_suite/test_07.pl';

require './schematic_test_suite/test_08.pl';

require './schematic_test_suite/test_09.pl';

require './schematic_test_suite/test_10.pl';

require './schematic_test_suite/test_11.pl';

require './schematic_test_suite/test_12.pl';

require './schematic_test_suite/test_13.pl';

require './schematic_test_suite/test_15.pl';

require './schematic_test_suite/test_16.pl';

require './schematic_test_suite/test_17.pl';

require './schematic_test_suite/test_18.pl';

require './schematic_test_suite/test_19.pl';

require './schematic_test_suite/test_20.pl';

require './schematic_test_suite/test_29.pl';

require './schematic_test_suite/test_56.pl';

require './schematic_test_suite/test_57.pl';

require './schematic_test_suite/test_58.pl';

require './schematic_test_suite/test_59.pl';

require './schematic_test_suite/test_60.pl';

require './schematic_test_suite/test_61.pl';

require './schematic_test_suite/test_62.pl';

require './schematic_test_suite/test_63.pl';

require './schematic_test_suite/test_64.pl';

require './schematic_test_suite/test_65.pl';

require './schematic_test_suite/test_66.pl';

require './schematic_test_suite/test_67.pl';

require './schematic_test_suite/test_68.pl';

require './schematic_test_suite/test_69.pl';

require './schematic_test_suite/test_70.pl';

require './schematic_test_suite/test_71.pl';

require './schematic_test_suite/test_72.pl';

require './schematic_test_suite/test_73.pl';

require './schematic_test_suite/test_74.pl';

require './schematic_test_suite/test_75.pl';

require './schematic_test_suite/test_76.pl';

require './schematic_test_suite/test_78.pl';

require './schematic_test_suite/test_79.pl';

require './schematic_test_suite/test_80.pl';
require './schematic_test_suite/test_83.pl';
require './schematic_test_suite/test_84.pl';
require './schematic_test_suite/test_85.pl';
require './schematic_test_suite/test_86.pl';
require './schematic_test_suite/test_87.pl';
$driver->quit();
my $tb = Test::More->builder;
my @summary = $tb->summary();
my $failed = grep { !$_ } @summary;
my $total = $tb->current_test;

diag("\n" . "="x46);
diag("TEST SUMMARY:");
diag("Total Tests Run: $total");
diag("Total Failures:  $failed");
if ($failed == 0) {
    diag("Status: PERFECT PASS! 🚀");
} else {
    diag("Status: FAILED ❌");
}
done_testing();