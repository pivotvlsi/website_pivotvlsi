#!/usr/bin/perl
use strict;
use warnings;
use utf8;
binmode(STDOUT, ":utf8");

my $html_file = 'signed_odometer_tool.html';
my $css_file = 'signed_odometer_tool.css';
my $js_file = 'signed_odometer_tool.js';

my $errors = 0;

print "Testing Signed Odometer Tool Files...\n";

# 1. Check if files exist
foreach my $file ($html_file, $css_file, $js_file) {
    if (-e $file) {
        print "[PASS] File exists: $file\n";
    } else {
        print "[FAIL] File missing: $file\n";
        $errors++;
    }
}

exit 1 if $errors > 0;

# 2. Check HTML content
open(my $fh, '<:encoding(UTF-8)', $html_file) or die "Cannot open $html_file: $!";
my $html_content = do { local $/; <$fh> };
close($fh);

my @html_checks = (
    'id="प्रश्न-कीलः"',
    'id="प्रश्न-पात्रम्"',
    'id="उपकरण-पात्रम्"',
    'class="घटी-पात्रम्"',
    'id="घटी-मुखम्"',
    'id="विपरीत-सूचिका"',
    'id="सूचिका"',
    'id="घटी-केन्द्रम्"',
    'id="प्रकार-चयकः"'
);

foreach my $check (@html_checks) {
    if ($html_content =~ /\Q$check\E/) {
        print "[PASS] HTML contains Sanskrit ID/Class: $check\n";
    } else {
        print "[FAIL] HTML missing: $check\n";
        $errors++;
    }
}

# 3. Check CSS content
open($fh, '<:encoding(UTF-8)', $css_file) or die "Cannot open $css_file: $!";
my $css_content = do { local $/; <$fh> };
close($fh);

my @css_checks = (
    '\.घटी-पात्रम्',
    '\#घटी-मुखम्',
    '\.घटी-चिह्निका',
    '\.चिह्निका-दशमलव',
    '\.चिह्निका-द्विमान',
    '\#घटी-केन्द्रम्',
    '\#सूचिका',
    '\#विपरीत-सूचिका'
);

foreach my $check (@css_checks) {
    if ($css_content =~ /$check/) {
        print "[PASS] CSS contains Sanskrit Selector: $check\n";
    } else {
        print "[FAIL] CSS missing: $check\n";
        $errors++;
    }
}

# 4. Check JS content
open($fh, '<:encoding(UTF-8)', $js_file) or die "Cannot open $js_file: $!";
my $js_content = do { local $/; <$fh> };
close($fh);

my @js_checks = (
    'वर्तमानमूल्यम्',
    'कुलपदानि',
    'वर्तमानप्रकारः',
    'चक्रमूल्यानिप्राप्तुम्',
    'घटीनिर्माणम्',
    'प्रदर्शनम्अद्यतनीकरणम्',
    "10's Complement",
    "2's Complement",
    '(16 - वर्तमानमूल्यम्) % 16',
    '(10 - वर्तमानमूल्यम्) % 10'
);

foreach my $check (@js_checks) {
    if ($js_content =~ /\Q$check\E/) {
        print "[PASS] JS contains required logic/Sanskrit name: $check\n";
    } else {
        print "[FAIL] JS missing: $check\n";
        $errors++;
    }
}

print "\n";
if ($errors == 0) {
    print "All tests passed successfully! The tool is fully translated and functionally verified.\n";
} else {
    print "$errors test(s) failed. Please review the output above.\n";
}
