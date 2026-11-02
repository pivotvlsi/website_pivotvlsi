use strict;
use warnings;
use utf8;
use Test::More;
use Selenium::Chrome;
use Cwd qw(abs_path);
use File::Temp qw(tempfile);
use JSON::PP;

binmode(STDOUT, ":utf8");
binmode(STDERR, ":utf8");

# Path to chromedriver
my $चालक_मार्ग = 'C:\\Users\\rnish\\vscode\\Pasupathi\\pivotvlsi\\truth_table\\chromedriver.exe';
my $चालक = eval {
    Selenium::Chrome->new(
        binary => $चालक_मार्ग,
        extra_capabilities => {
            'goog:chromeOptions' => {
                args => ['--headless=new', '--disable-gpu', '--no-sandbox']
            }
        }
    );
};

if (!$चालक) {
    plan skip_all => "ChromeDriver could not be launched: $@";
}

plan tests => 8;

# 1. Test CPU Architecture Page Waveform Export & File Structure
my $सीपियू_मार्ग = -f 'basic_cpu_gui.html'
    ? abs_path('basic_cpu_gui.html')
    : abs_path('workshop/cpu_architecture/basic_cpu_gui.html');
$सीपियू_मार्ग =~ s{\\}{/}g;
$चालक->get("file:///$सीपियू_मार्ग");

# Run steps to generate some waveform history
my $json_str = $चालक->execute_script(q{
    // Toggle pins
    window.पिन_परिवर्तनम्(0);
    window.पिन_परिवर्तनम्(2);
    // Add clock periods
    window.घटिका_चक्र_योजनम्();
    window.घटिका_चक्र_योजनम्();
    // Return direct JSON string from browser
    return JSON.stringify(window.तरंगरूप_दत्तांश_निर्माणम्(), null, 2);
});

ok($json_str && length($json_str) > 50, "CPU Simulator generated .tr JSON waveform string directly from browser");

# Save exact browser-generated .tr content to a temporary file
my ($fh, $संचिका_नाम) = tempfile(SUFFIX => '.tr', UNLINK => 1);
binmode($fh, ":utf8");
print $fh $json_str;
close($fh);

ok(-f $संचिका_नाम, "Created temporary .tr file: $संचिका_नाम");

# Verify payload structure in Perl
my $दत्तांश = JSON::PP->new->decode($json_str);
is($दत्तांश->{स्रोत}, 'cpu_architecture', "Exported payload source is cpu_architecture");
my $सङ्केताः = $दत्तांश->{सङ्केताः} || $दत्तांश->{संकेताः};
cmp_ok(scalar(@$सङ्केताः), '>=', 5, "Exported payload contains CLK, GPIO bus, and PIN signals");

# 2. Test Timing Diagram Page Loading .tr from File Input
my $समयचित्र_मार्ग = -f '../timing_diagram/timing_diagram.html'
    ? abs_path('../timing_diagram/timing_diagram.html')
    : abs_path('timing_diagram/timing_diagram.html');
$समयचित्र_मार्ग =~ s{\\}{/}g;
$चालक->get("file:///$समयचित्र_मार्ग");

# Check file input element exists
my $निवेश_घटक = eval { $चालक->find_element('तरंग-संचिका-निवेशः', 'id') };
ok($निवेश_घटक, "Found file input #तरंग-संचिका-निवेशः in timing diagram tool");

# Send .tr file path to file input element
$निवेश_घटक->send_keys($संचिका_नाम);

# Allow brief moment for FileReader onload to fire and render
sleep(1);

my $आयात_सत्यापनम् = $चालक->execute_script(q{
    const सङ्केताः = window.सङ्केतदत्तांशः || [];
    const पंक्ति_संख्या = document.querySelectorAll('.सङ्केतनामप्रदर्शनम्').length;
    const प्रथम_नाम = सङ्केताः.length > 0 ? सङ्केताः[0].name : '';
    return {
        count: सङ्केताः.length,
        dom_count: पंक्ति_संख्या,
        first_signal: प्रथम_नाम
    };
});

ok($आयात_सत्यापनम्->{count} >= 5, "Timing diagram successfully imported signals from .tr file (count >= 5)");
is($आयात_सत्यापनम्->{first_signal}, 'CLK', "First imported signal from .tr file is CLK");
is($आयात_सत्यापनम्->{dom_count}, $आयात_सत्यापनम्->{count}, "DOM signal labels rendered match imported signal count from file");

$चालक->quit();
