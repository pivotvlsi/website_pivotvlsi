use strict;
use warnings;
use utf8;
binmode(STDOUT, ":utf8");
use File::Temp qw(tempfile);

my $run_test1 = 1;
my $run_test2 = 1;
my $run_test3 = 1;
my $run_test4 = 1;
my $run_test5 = 1;
my $run_test6 = 1;
my $run_test7 = 1;

if (@ARGV > 0) {
    $run_test1 = 0; $run_test2 = 0; $run_test3 = 0; $run_test4 = 0; $run_test5 = 0; $run_test6 = 0; $run_test7 = 0;
    if ($ARGV[0] == 1) {
        $run_test1 = 1;
    } elsif ($ARGV[0] == 2) {
        $run_test2 = 1;
    } elsif ($ARGV[0] == 3) {
        $run_test3 = 1;
    } elsif ($ARGV[0] == 4) {
        $run_test4 = 1;
    } elsif ($ARGV[0] == 5) {
        $run_test5 = 1;
    } elsif ($ARGV[0] == 6) {
        $run_test6 = 1;
    } elsif ($ARGV[0] == 7) {
        $run_test7 = 1;
    }
}

if ($run_test1) {
    print "--- Perl to Node JS Testing ---\n\n";

    # Test cases: Expression => Expected Pattern
    my %test_cases = (
        "A + B . C" => qr/^\(A\+\(B\.C\)\)$/,
        "A . B + C" => qr/^\(\(A\.B\)\+C\)$/,
        "A + B + C" => qr/^\(A\+B\+C\)$/,
        "A  B + C" => qr/^\(\(A\.B\)\+C\)$/,
        "a  b + c" => qr/^\(\(A\.B\)\+C\)$/,
        "a + b . c" => qr/^\(A\+\(B\.C\)\)$/,
        "a . b + c" => qr/^\(\(A\.B\)\+C\)$/,
        "a + b + c" => qr/^\(A\+B\+C\)$/,
        "a(b + c)" => qr/^\(A\.\(B\+C\)\)$/,
        "A B + C (D + E)" => qr/^\(\(A\.B\)\+\(C\.\(D\+E\)\)\)$/,
        "A'" => qr/^A\'$/,
        "A' + B" => qr/^\(A\'\+B\)$/,
        "(A + B)'" => qr/^\(A\+B\)\'$/,
        "A'B" => qr/^\(A\'\.B\)$/,
        "A''" => qr/^\(A\'\)\'$/,
        "A.B + C.D' + A'.C + 1 + 0" => qr/^\(\(A\.B\)\+\(C\.D\'\)\+\(A\'\.C\)\+1\+0\)$/,
    );

    # A wrapper Node script to evaluate trial.js without modifying trial.js itself
    my $node_wrapper = <<'END_NODE';
const { सूत्र_विभाजन } = require('./sootra_vibhajana.js');

const input = process.argv[2].toUpperCase(); // arg 2 is the expression
const result = सूत्र_विभाजन(input);
console.log(result);
END_NODE

    # Write wrapper to a temporary file to avoid encoding issues in shell args
    my ($fh, $filename) = tempfile("temp_runner_XXXX", SUFFIX => '.js', UNLINK => 1);
    binmode($fh, ":utf8");
    print $fh $node_wrapper;
    close($fh);

    print "--- Perl to Node JS Testing ---\n\n";
    open(my $out_fh, '>', 'output.txt') or die "Cannot open output.txt: $!";
    print $out_fh "--- Perl to Node JS Testing ---\n\n";

    foreach my $expr (keys %test_cases) {
        print "Testing (परीक्षण): $expr\n";
        
        # Call node using the temp file
        my $cmd = qq(node $filename "$expr");
        my $output = `$cmd`;
        
        # Chomp to remove newline
        chomp($output);
        
        print "Output (निर्गम): $output\n";
        print $out_fh "Testing (परीक्षण): $expr\n";
        print $out_fh "Output (निर्गम): $output\n";
        
        # Pattern match to check if answer is correct
        if ($output =~ $test_cases{$expr}) {
            print "Result (परिणाम): SUCCESS (सफल)\n";
            print $out_fh "Result (परिणाम): SUCCESS (सफल)\n\n";
        } else {
            print "Result (परिणाम): FAILED (विफल)\n";
            print $out_fh "Result (परिणाम): FAILED (विफल)\n\n";
        }
    }
    close($out_fh);
    print "Output written to output.txt\n";
}


if ($run_test2) {
    print "--- Random Array Generation Test ---\n";

    # Random l between 2 and 5
    my $random_l = int(rand(4)) + 2; 
    print "Generated l (आयाम): $random_l\n";

    my $node_array_wrapper = <<"END_NODE";
const { यादृच्छिक_सूचि_निर्माण } = require('./yadrucchika_soochi.js');
const { सारणीतः_सूत्रम् } = require('./saranitah_sutram.js');

// Call the function with our random l
const result = यादृच्छिक_सूचि_निर्माण($random_l);
// Compact print JSON
console.log(JSON.stringify(result));

END_NODE

    my ($fh2, $filename2) = tempfile("temp_runner_array_XXXX", SUFFIX => '.js', UNLINK => 1);
    binmode($fh2, ":utf8");
    print $fh2 $node_array_wrapper;
    close($fh2);

    my $array_output = `node $filename2`;
    print "Output Array:\n$array_output\n";
}

if ($run_test3) {
    print "--- Bracket Mapping Test (सत्यता सारणी प्रारंभ) ---\n";

    my $node_bracket_wrapper = <<"END_NODE";
const { सूत्र_विभाजन } = require('./sootra_vibhajana.js');
const { सत्यता_सारणी_प्रारंभ } = require('./satyata_saarani_prarambha.js');
const { सारणीतः_सूत्रम् } = require('./saranitah_sutram.js');

const test_cases = [
    "A",
    "A'",
    "A''",
    "A' + B",
    "A.B + C'",
    "(A + B)'",
    "A + A'",
    "(A.B)'",
    "A'.B' + C'",
    "A.B + A'.B'",
    "A.B + C.(D + E')",
    "((A+B).C)'",
    "(A + B').C + (D' . E)'",
    "A.B.C + D.E'",
    "(A+B+C).(A'+B'+C')",
    "A.B + C.D' + A'.C + 1 + 0",
    "(A+B).(C+D)",
    "(A + B.C).(D + E.F)",
    "(A.B + C.D) . (A'.B' + C'.D')",
    "((A+B).(C+D)) + ((E+F).(G+H))",
    "A.0 + B.1",
    "(A+0).(B+1)",
    "0.1 + A",
    "(A+B).0 + C.1'"
];

for (let expr of test_cases) {
    console.log("Testing (परीक्षण): " + expr);
    const parsed = सूत्र_विभाजन(expr);
    console.log("Parsed String: " + parsed);
    const result = सत्यता_सारणी_प्रारंभ(parsed);
    console.log("Mapped Array:");
    console.log(JSON.stringify(result));
    
    let chars = parsed.match(/[A-Za-z]/g);
    let variables = chars ? Array.from(new Set(chars)).sort() : [];
    const reconstructed = सारणीतः_सूत्रम्(result, variables);
    console.log("Reconstructed String: " + reconstructed + "\\n");
}
END_NODE

    my ($fh3, $filename3) = tempfile("temp_runner_bracket_XXXX", SUFFIX => '.js', UNLINK => 1);
    binmode($fh3, ":utf8");
    print $fh3 $node_bracket_wrapper;
    close($fh3);

    my $bracket_output = `node $filename3`;
    print $bracket_output;
}

if ($run_test4) {
    print "--- Test 4: Random Array to Boolean Expression ---\n";

    my $random_l = int(rand(3)) + 3;
    print "Generated l (आयाम): $random_l\n";

    my $node_test4_wrapper = <<"END_NODE";
const { यादृच्छिक_सूचि_निर्माण } = require('./yadrucchika_soochi.js');
const { सारणीतः_सूत्रम् } = require('./saranitah_sutram.js');

const result = यादृच्छिक_सूचि_निर्माण($random_l);
console.log("Generated Array:");
console.log(JSON.stringify(result));

console.log("\\nConverted Boolean Expression:");
console.log(सारणीतः_सूत्रम्(result));
END_NODE

    my ($fh4, $filename4) = tempfile("temp_runner_test4_XXXX", SUFFIX => '.js', UNLINK => 1);
    binmode($fh4, ":utf8");
    print $fh4 $node_test4_wrapper;
    close($fh4);

    my $test4_output = `node $filename4`;
    print $test4_output;
}

if ($run_test5) {
    print "\n--- Test 5: Step-by-Step Simplification (सरलीकरणम्) ---\n";
    print "This test verifies the 6 boolean identities implemented in saralikarana.js\n\n";

    my $node_test5_wrapper = <<"END_NODE";
const { सूत्र_विभाजन } = require('./sootra_vibhajana.js');
const { सत्यता_सारणी_प्रारंभ } = require('./satyata_saarani_prarambha.js');
const { सारणीतः_सूत्रम् } = require('./saranitah_sutram.js');
const { सूत्र_सरलीकरणम् } = require('./saralikarana.js');

const unsimplified_exprs = [
    { expr: "A.A'", desc: "1. Contradiction (विरोधः): A . A' = 0" },
    { expr: "A.0", desc: "2. Zero Property (शून्य_गुण): A . 0 = 0" },
    { expr: "A.1", desc: "3. Identity AND (तत्समक_अन्): A . 1 = A" },
    { expr: "A+A'", desc: "4. Tautology (सर्वदा_सत्य): A + A' = 1" },
    { expr: "A+1", desc: "5. One Property (एक_गुण): A + 1 = 1" },
    { expr: "A+0", desc: "6. Identity OR (तत्समक_अथवा): A + 0 = A" },
    { expr: "(A.A') + (B.1) + (C.0)", desc: "7. Complex Simplification combining multiple rules" }
];

for (let testcase of unsimplified_exprs) {
    console.log("--------------------------------------");
    console.log(testcase.desc);
    console.log("Original Expression:", testcase.expr);
    
    let parsed = सूत्र_विभाजन(testcase.expr);
    let original_array = सत्यता_सारणी_प्रारंभ(parsed);
    
    console.log("Raw Array:", JSON.stringify(original_array));
    
    let simplified_array = सूत्र_सरलीकरणम्(original_array);
    
    console.log("Simplified Array:", JSON.stringify(simplified_array));
    
    let final_expr = सारणीतः_सूत्रम्(simplified_array);
    console.log("Final Simplified Expression:", final_expr);
    console.log("");
}
console.log("--------------------------------------");
END_NODE

    my ($fh5, $filename5) = tempfile("temp_runner_test5_XXXX", SUFFIX => '.js', UNLINK => 1);
    binmode($fh5, ":utf8");
    print $fh5 $node_test5_wrapper;
    close($fh5);

    my $test5_output = `node $filename5`;
    print $test5_output;
}

if ($run_test6) {
    print "\n--- Test 6: Random Equation Generation & Simplification ---\n";

    my $node_test6_wrapper = <<"END_NODE";
const { यादृच्छिक_सूचि_निर्माण } = require('./yadrucchika_soochi.js');
const { सारणीतः_सूत्रम् } = require('./saranitah_sutram.js');
const { सूत्र_सरलीकरणम् } = require('./saralikarana.js');

let l = Math.floor(Math.random() * 3) + 2; // Random variables between 2 and 4
let random_array = यादृच्छिक_सूचि_निर्माण(l, 1);
console.log("1. Generated Random Dimension (आयामः):", l);
console.log("2. Generated Random Array:");
console.log(JSON.stringify(random_array));

let original_expr = सारणीतः_सूत्रम्(random_array);
console.log("\\n3. Generated Unsimplified Expression:");
console.log(original_expr);

console.log("\\n4. Running Simplification Blocks...");
let simplified_array = सूत्र_सरलीकरणम्(random_array, true);

console.log("\\n5. Simplified Array:");
console.log(JSON.stringify(simplified_array));

let simplified_expr = सारणीतः_सूत्रम्(simplified_array);
console.log("\\n6. Final Simplified Expression:");
console.log(simplified_expr);
END_NODE

    my ($fh6, $filename6) = tempfile("temp_runner_test6_XXXX", SUFFIX => '.js', UNLINK => 1);
    binmode($fh6, ":utf8");
    print $fh6 $node_test6_wrapper;
    close($fh6);

    my $test6_output = `node $filename6`;
    print $test6_output;
}

if ($run_test7) {
    print "\n--- Test 7: Random Equation Generation (Pure Form) ---\n";

    my $node_test7_wrapper = <<"END_NODE";
const { यादृच्छिक_सूचि_निर्माण } = require('./yadrucchika_soochi.js');
const { सारणीतः_सूत्रम् } = require('./saranitah_sutram.js');
const { सूत्र_सरलीकरणम् } = require('./saralikarana.js');

let l = Math.floor(Math.random() * 3) + 2; // Random variables between 2 and 4
let random_array = यादृच्छिक_सूचि_निर्माण(l, 1, 1);
console.log("1. Generated Random Dimension (आयामः):", l);
console.log("2. Generated Random Array (Pure):");
console.log(JSON.stringify(random_array));

let original_expr = सारणीतः_सूत्रम्(random_array);
console.log("\\n3. Generated Unsimplified Expression:");
console.log(original_expr);

console.log("\\n4. Running Simplification Blocks...");
let simplified_array = सूत्र_सरलीकरणम्(random_array, true);

console.log("\\n5. Simplified Array:");
console.log(JSON.stringify(simplified_array));

let simplified_expr = सारणीतः_सूत्रम्(simplified_array);
console.log("\\n6. Final Simplified Expression:");
console.log(simplified_expr);
END_NODE

    my ($fh7, $filename7) = tempfile("temp_runner_test7_XXXX", SUFFIX => '.js', UNLINK => 1);
    binmode($fh7, ":utf8");
    print $fh7 $node_test7_wrapper;
    close($fh7);

    my $test7_output = `node $filename7`;
    print $test7_output;
}
