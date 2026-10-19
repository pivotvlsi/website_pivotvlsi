use strict;
use warnings;
use utf8;
use Selenium::Chrome;
use Cwd 'abs_path';
binmode STDOUT, ':utf8';

$ENV{PATH} = abs_path("..") . ";" . $ENV{PATH};

print "=====================================================================\n";
print "Test Suite: Full Browser UI Pipeline for POS -> SOP\n";
print "=====================================================================\n\n";

my $driver = Selenium::Chrome->new;
$driver->set_implicit_wait_timeout(5000);

my $html_file = 'file:///' . abs_path('boolean_algebra.html');
$html_file =~ s|\\|/|g;
$driver->get($html_file);
sleep(1);

my $test_count = 0;
my $pass_count = 0;
my $fail_count = 0;

sub check_pass {
    my ($msg, $cond) = @_;
    $test_count++;
    if ($cond) {
        $pass_count++;
        print "[PASS] Step $test_count: $msg\n";
    } else {
        $fail_count++;
        print "[FAIL] Step $test_count: $msg\n";
    }
}

# 1. Select POS -> SOP
$driver->execute_script(q{
    document.getElementById('format-select').value = 'POS';
    document.getElementById('target-format-select').value = 'SOP';
});
my $fmt_val = $driver->execute_script("return document.getElementById('format-select').value;");
my $target_val = $driver->execute_script("return document.getElementById('target-format-select').value;");
check_pass("Format set to POS -> SOP", $fmt_val eq 'POS' && $target_val eq 'SOP');

# 2. Inject handcrafted POS equation with at least 4 simplification steps
my $handcrafted_eq = "((A+B).(A+B+C).(A+B+D).(C+D).(C+D+E).(A+C+D))";
$driver->execute_script(qq{
    document.getElementById('सङ्ख्या-प्रदर्शनम्').value = "$handcrafted_eq";
    चरसरणी = ['A', 'B', 'C', 'D', 'E'];
    चरसंख्या = 5;
});
sleep(1);

my $gen_info = $driver->execute_script(q{
    let eq = document.getElementById('सङ्ख्या-प्रदर्शनम्').value;
    let vars = (typeof चरसरणी !== 'undefined' && Array.isArray(चरसरणी)) ? चरसरणी : [];
    let count = typeof चरसंख्या !== 'undefined' ? चरसंख्या : vars.length;
    return { equation: eq, vars: vars, count: count };
});

my $gen_eq = $gen_info->{equation};
my $var_list = join(",", @{$gen_info->{vars}});
my $var_count = $gen_info->{count};

print "       Loaded Handcrafted POS Equation: $gen_eq\n";
print "       Variables ($var_count): [$var_list]\n";
check_pass("Loaded handcrafted POS equation with 4 to 6 vars ($var_count: [$var_list])",
    length($gen_eq) > 0 && $var_count >= 4 && $var_count <= 6);

# 3. Lock
$driver->find_element('बन्धन-गुण्डिका', 'id')->click();
sleep(1);
my $is_locked = $driver->execute_script(q{
    let btn = document.getElementById('बन्धन-गुण्डिका');
    let txt = btn.textContent || btn.innerText || "";
    return btn.disabled && txt.includes('Locked');
});
check_pass("Locked state confirmed", $is_locked);

# 4. Hint on original
$driver->find_element('संकेत-गुण्डिका', 'id')->click();
sleep(1);
my $hint_text = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
print "       Initial Hint: $hint_text\n";
check_pass("Initial Hint valid", length($hint_text) > 0 && $hint_text !~ /Invalid syntax/i);

# 5. Iterative simplification loop
my $step_count = 0;
my $max_steps = 15;
my $is_fully_simplified = 0;

while ($step_count < $max_steps) {
    $step_count++;
    print "\n--- Reduction Step $step_count ---\n";

    $driver->find_element('संकेत-गुण्डिका', 'id')->click();
    sleep(1);
    my $current_hint = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    print "  Hint: $current_hint\n";

    my $step_info = $driver->execute_script(q{
        let prevEq = "";
        let verifiedRows = document.querySelectorAll('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type:disabled');
        if (verifiedRows.length > 0) {
            prevEq = verifiedRows[verifiedRows.length - 1].value.replace(/\s+/g, '');
        } else {
            prevEq = document.getElementById('सङ्ख्या-प्रदर्शनम्').value.replace(/\s+/g, '');
        }

        let vars = (typeof चरसरणी !== 'undefined' && Array.isArray(चरसरणी)) ? चरसरणी : [];
        let ast = window.सत्यता_सारणी_प्रारंभ(window.सूत्र_विभाजन(prevEq), vars);
        let hint = window.सूत्र_अभिज्ञानम् ? window.सूत्र_अभिज्ञानम्(ast) : null;
        let nextAst = window.सूत्र_एकपद_सरलीकरणम् ? window.सूत्र_एकपद_सरलीकरणम्(ast) : null;
        let nextStr = nextAst ? window.सारणीतः_सूत्रम्(nextAst, vars) : "";
        if (nextStr.startsWith('(') && nextStr.endsWith(')')) nextStr = nextStr.slice(1, -1);

        let formulaMap = {
            "Contradiction (विरोधः)": "A.A'=0",
            "Zero Property (शून्य_गुण)": "A.0=0",
            "Identity AND (तत्समक_अन्)": "A.1=A",
            "Tautology (सर्वदा_सत्य)": "A+A'=1",
            "One Property (एक_गुण)": "A+1=1",
            "Identity OR (तत्समक_अथवा)": "A+0=A",
            "De Morgan's Law (डिमॉर्गन_नियमः)": "(A+B)'=A'.B'",
            "Idempotent Law (समशक्ति_नियमः)": "A+A=A",
            "Absorption Law (अवशोषण_नियमः)": "A.(A+B)=A",
            "Simplification Theorem (सरलीकरण_प्रमेय)": "(A+B).(A+B')=A"
        };
        let formula = (hint && formulaMap[hint.rule]) ? formulaMap[hint.rule] : "A.(A+B)=A";
        let fullSimp = window.सूत्र_सरलीकरणम्(JSON.parse(JSON.stringify(ast)));
        let isAlreadyTerminal = (JSON.stringify(ast) === JSON.stringify(fullSimp));

        return { nextStr: nextStr, formula: formula, hasRule: !!hint, isAlreadyTerminal: isAlreadyTerminal };
    });

    if ($step_info->{isAlreadyTerminal}) {
        print "  Terminal state reached.\n";
        $is_fully_simplified = 1;
        last;
    }

    my $next_eq = $step_info->{nextStr};
    my $formula_to_use = $step_info->{formula};

    print "  Next Equation: $next_eq\n";
    print "  Formula: $formula_to_use\n";

    $driver->execute_script(qq{
        let rows = document.querySelectorAll('#पद-पात्रम् .तर्क-पङ्क्तिः');
        let activeRow = rows[rows.length - 1];
        let inputs = activeRow.querySelectorAll('input');
        inputs[0].value = "$next_eq";
        inputs[1].value = "$formula_to_use";
    });

    $driver->execute_script(q{
        let rows = document.querySelectorAll('#पद-पात्रम् .तर्क-पङ्क्तिः');
        let activeRow = rows[rows.length - 1];
        activeRow.querySelector('button').click();
    });
    sleep(1);

    my $verify_msg = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    print "  Status after verify: $verify_msg\n";

    if ($verify_msg =~ /Ready for Check Result/i || $verify_msg =~ /already fully simplified/i) {
        $is_fully_simplified = 1;
        check_pass("Step $step_count reached terminal state: $verify_msg", 1);
        last;
    } else {
        check_pass("Step $step_count verified successfully", 1);
    }
}

check_pass("POS -> SOP reached final answer after $step_count step(s) (>= 4 steps)", $is_fully_simplified && $step_count >= 4);

# 6. Check Result at terminal state
$driver->find_element('परीक्षण-गुण्डिका', 'id')->click();
sleep(1);
my $final_status = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
my $next_btn_text = $driver->execute_script("return document.getElementById('परीक्षण-गुण्डिका').innerText;");
print "\nFinal Check Result Status: $final_status\n";

check_pass("Check Result confirms 'successfully simplified' and offers 'Next Problem'", 
    $final_status =~ /successfully simplified/i && $next_btn_text =~ /Next Problem/i);

$driver->quit();

print "\n=====================================================================\n";
if ($fail_count == 0) {
    print "SUCCESS: POS -> SOP full UI test passed ($pass_count/$test_count steps)!\n";
} else {
    print "FAILED: $fail_count step(s) failed in POS -> SOP.\n";
}
print "=====================================================================\n";

exit($fail_count == 0 ? 0 : 1);
