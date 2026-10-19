use strict;
use warnings;
use utf8;
use Selenium::Chrome;
use Cwd 'abs_path';
use File::Basename;
binmode STDOUT, ':utf8';

print "Starting Boolean Algebra Selenium UI Test...\n\n";

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

my $run_test = $ARGV[0] || 'all';

# --- Testcase 1: Validate SOP Generation ---
if ($run_test eq 'all' || $run_test eq '1') {
print "============================================\n";
print "Testcase 1: Validate SOP Generation\n";
print "============================================\n";

my $fmt_sel = $driver->find_element('format-select', 'id');
$driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel);

my $target_sel1 = $driver->find_element('target-format-select', 'id');
$driver->execute_script("arguments[0].value = 'SOP';", $target_sel1);

my $gen_btn = $driver->find_element('चालन-गुण्डिका', 'id');
$gen_btn->click();
sleep(1);

my $eq_input = $driver->find_element('सङ्ख्या-प्रदर्शनम्', 'id');
my $sop_val = $driver->execute_script("return arguments[0].value;", $eq_input);
print "Generated SOP: $sop_val\n";

# A valid SOP will typically have multiple product terms separated by '+'
# and the whole expression usually starts and ends with parentheses.
if ($sop_val && $sop_val =~ /\+/) {
    pass_test("Successfully generated an SOP equation format.");
} else {
    fail_test("SOP equation generation failed or returned invalid format.");
}

}

# --- Testcase 2: Validate POS Generation ---
if ($run_test eq 'all' || $run_test eq '2') {
print "\n============================================\n";
print "Testcase 2: Validate POS Generation\n";
print "============================================\n";

my $fmt_sel = $driver->find_element('format-select', 'id');
$driver->execute_script("arguments[0].value = 'POS';", $fmt_sel);
my $target_sel2 = $driver->find_element('target-format-select', 'id');
$driver->execute_script("arguments[0].value = 'POS';", $target_sel2);
my $gen_btn = $driver->find_element('चालन-गुण्डिका', 'id');
$gen_btn->click();
sleep(1);

my $eq_input = $driver->find_element('सङ्ख्या-प्रदर्शनम्', 'id');
my $pos_val = $driver->execute_script("return arguments[0].value;", $eq_input);
print "Generated POS: $pos_val\n";

# A valid POS will typically have multiple sum terms enclosed in parentheses
# multiplied together (using '.') or just juxtaposed.
if ($pos_val && $pos_val =~ /\)\.\(/ || $pos_val =~ /\)\(/ || $pos_val =~ /\+/) {
    pass_test("Successfully generated a POS equation format.");
} else {
    fail_test("POS equation generation failed or returned invalid format.");
}

}

# --- Testcase 3: Validate Target Format Dropdown Highlight ---
if ($run_test eq 'all' || $run_test eq '3') {
print "\n============================================\n";
print "Testcase 3: Validate Target Format Dropdown Highlight\n";
print "============================================\n";

$driver->get($url);
sleep(1);

my $fmt_sel3 = $driver->find_element('format-select', 'id');
$driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel3);

my $target_sel = $driver->find_element('target-format-select', 'id');
$driver->execute_script("arguments[0].value = 'select';", $target_sel);

my $gen_btn3 = $driver->find_element('चालन-गुण्डिका', 'id');
$gen_btn3->click();
sleep(1);

eval {
    $driver->accept_alert();
};

my $border_color = $driver->execute_script("return arguments[0].style.borderColor;", $target_sel);
print "Target Format Border Color: $border_color\n";

if ($border_color =~ /red/i) {
    pass_test("Target format dropdown was successfully highlighted in red.");
} else {
    fail_test("Target format dropdown was NOT highlighted. Got: $border_color");
}

}

# --- Testcase 4: Auto-infer SOP from POS Target ---
if ($run_test eq 'all' || $run_test eq '4') {
print "\n============================================\n";
print "Testcase 4: Auto-infer SOP from POS Target\n";
print "============================================\n";
$driver->get($url);
sleep(1);

my $fmt_sel4 = $driver->find_element('format-select', 'id');
$driver->execute_script("arguments[0].value = 'select';", $fmt_sel4);
my $target_sel4 = $driver->find_element('target-format-select', 'id');
$driver->execute_script("arguments[0].value = 'POS';", $target_sel4);

my $gen_btn4 = $driver->find_element('चालन-गुण्डिका', 'id');
$gen_btn4->click();
sleep(1);

my $auto_fmt_val = $driver->execute_script("return arguments[0].value;", $fmt_sel4);
print "Auto-inferred Source Format: $auto_fmt_val\n";

if ($auto_fmt_val eq 'SOP') {
    pass_test("Successfully auto-inferred SOP from POS target.");
} else {
    fail_test("Failed to auto-infer SOP from POS target. Got: $auto_fmt_val");
}

}

# --- Testcase 5: Auto-infer POS from SOP Target ---
if ($run_test eq 'all' || $run_test eq '5') {
print "\n============================================\n";
print "Testcase 5: Auto-infer POS from SOP Target\n";
print "============================================\n";
$driver->get($url);
sleep(1);

my $fmt_sel5 = $driver->find_element('format-select', 'id');
$driver->execute_script("arguments[0].value = 'select';", $fmt_sel5);
my $target_sel5 = $driver->find_element('target-format-select', 'id');
$driver->execute_script("arguments[0].value = 'SOP';", $target_sel5);

my $gen_btn5 = $driver->find_element('चालन-गुण्डिका', 'id');
$gen_btn5->click();
sleep(1);

my $auto_fmt_val2 = $driver->execute_script("return arguments[0].value;", $fmt_sel5);
print "Auto-inferred Source Format: $auto_fmt_val2\n";

if ($auto_fmt_val2 eq 'POS') {
    pass_test("Successfully auto-inferred POS from SOP target.");
} else {
    fail_test("Failed to auto-infer POS from SOP target. Got: $auto_fmt_val2");
}

}

# --- Testcase 6: Validate Both Dropdowns Highlight When Both Unselected ---
if ($run_test eq 'all' || $run_test eq '6') {
    print "\n============================================\n";
    print "Testcase 6: Validate Both Dropdowns Highlight When Both Unselected\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel6 = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'select';", $fmt_sel6);

    my $target_sel6 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'select';", $target_sel6);

    my $gen_btn6 = $driver->find_element('चालन-गुण्डिका', 'id');
    $gen_btn6->click();
    sleep(1);

    eval {
        $driver->accept_alert();
    };

    my $fmt_border_color = $driver->execute_script("return arguments[0].style.borderColor;", $fmt_sel6);
    my $tgt_border_color = $driver->execute_script("return arguments[0].style.borderColor;", $target_sel6);
    
    print "Source Format Border Color: $fmt_border_color\n";
    print "Target Format Border Color: $tgt_border_color\n";

    if ($fmt_border_color =~ /red/i && $tgt_border_color =~ /red/i) {
        pass_test("Both dropdowns successfully highlighted in red.");
    } else {
        fail_test("Dropdowns NOT highlighted. Source: $fmt_border_color, Target: $tgt_border_color");
    }
}

# --- Testcase 7: Validate Lock When Destination Format Unselected ---
if ($run_test eq 'all' || $run_test eq '7') {
    print "\n============================================\n";
    print "Testcase 7: Validate Lock When Destination Format Unselected\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $target_sel7 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'select';", $target_sel7);

    my $lock_btn7 = $driver->find_element('बन्धन-गुण्डिका', 'id');
    $lock_btn7->click();
    sleep(1);

    eval {
        $driver->accept_alert();
    };

    my $tgt_border_color = $driver->execute_script("return arguments[0].style.borderColor;", $target_sel7);
    my $is_locked = $driver->execute_script("return arguments[0].disabled;", $target_sel7);
    
    print "Target Format Border Color: $tgt_border_color\n";
    print "Is Target Format Locked: " . ($is_locked ? "Yes" : "No") . "\n";

    if ($tgt_border_color =~ /red/i && !$is_locked) {
        pass_test("Destination format highlighted and NOT locked successfully.");
    } else {
        fail_test("Destination format highlight or lock state incorrect. Border: $tgt_border_color, Locked: " . ($is_locked ? "Yes" : "No"));
    }
}

# --- Testcase 8: Check Generated Equation Variables ---
if ($run_test eq 'all' || $run_test eq '8') {
    print "\n============================================\n";
    print "Testcase 8: Validate Generated Equation Variables\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel8 = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel8);

    my $target_sel8 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel8);

    my $gen_btn8 = $driver->find_element('चालन-गुण्डिका', 'id');
    $gen_btn8->click();
    sleep(1);

    my $lock_btn8 = $driver->find_element('बन्धन-गुण्डिका', 'id');
    $lock_btn8->click();
    sleep(1);

    my $eq_input8 = $driver->find_element('सङ्ख्या-प्रदर्शनम्', 'id');
    my $eq_val8 = $driver->execute_script("return arguments[0].value;", $eq_input8);
    
    my $num_vars;
    eval {
        $num_vars = $driver->execute_script("return चरसंख्या;");
    };
    if ($@) {
        # Fallback if let variables aren't exposed directly
        $num_vars = $driver->execute_script("return window.चरसंख्या || 4;"); 
    }
    
    print "Generated Equation: $eq_val8\n";
    print "Number of Variables: $num_vars\n";

    my @allowed_vars = ('A', 'B', 'C', 'D', 'E', 'F');
    my @expected_vars = @allowed_vars[0 .. $num_vars - 1];
    my @unexpected_vars = @allowed_vars[$num_vars .. 5];

    my $valid = 1;
    my $error_msg = "";

    foreach my $v (@unexpected_vars) {
        if ($eq_val8 =~ /$v/) {
            $valid = 0;
            $error_msg .= "Found unexpected variable $v. ";
        }
    }

    if ($valid) {
        pass_test("Equation properly constrained to $num_vars variables (@expected_vars).");
    } else {
        fail_test("Equation contains invalid variables. $error_msg");
    }
}

# --- Testcase 9: Validate Improper Equation Prevention ---
if ($run_test eq 'all' || $run_test eq '9') {
    print "\n============================================\n";
    print "Testcase 9: Validate Improper Equation Prevention\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel9 = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel9);

    my $target_sel9 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel9);

    my $eq_input9 = $driver->find_element('सङ्ख्या-प्रदर्शनम्', 'id');
    
    # Enter an improper equation (e.g. illegal char * and unbalanced parenthesis)
    $driver->execute_script("arguments[0].value = 'A+B*(C'; arguments[0].readOnly = false;", $eq_input9);
    
    my $lock_btn9 = $driver->find_element('बन्धन-गुण्डिका', 'id');
    $lock_btn9->click();
    sleep(1);

    eval {
        $driver->accept_alert();
    };

    my $eq_border_color = $driver->execute_script("return arguments[0].style.borderColor;", $eq_input9);
    my $is_eq_readonly = $driver->execute_script("return arguments[0].readOnly;", $eq_input9);
    my $lock_btn_text = $driver->execute_script("return arguments[0].innerText;", $lock_btn9);
    
    print "Equation Border Color: $eq_border_color\n";
    print "Is Equation ReadOnly: " . ($is_eq_readonly ? "Yes" : "No") . "\n";
    print "Lock Button Text: $lock_btn_text\n";

    if ($eq_border_color =~ /red/i && !$is_eq_readonly && $lock_btn_text !~ /Locked/i) {
        pass_test("Improper equation properly rejected, highlighted, and left editable.");
    } else {
        fail_test("Improper equation not handled correctly. Border: $eq_border_color, ReadOnly: " . ($is_eq_readonly ? "Yes" : "No") . ", Lock Btn: $lock_btn_text");
    }
}

# --- Testcase 10: Validate Improper Variables Reject on Lock ---
if ($run_test eq 'all' || $run_test eq '10') {
    print "\n============================================\n";
    print "Testcase 10: Validate Improper Variables Reject on Lock\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel10 = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel10);

    my $target_sel10 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel10);

    my $gen_btn10 = $driver->find_element('चालन-गुण्डिका', 'id');
    $gen_btn10->click();
    sleep(1);

    my $eq_input10 = $driver->find_element('सङ्ख्या-प्रदर्शनम्', 'id');
    
    # Enter an improper equation containing 'F'
    # We must first execute a script to ensure चरसंख्या is low enough to make 'F' invalid.
    $driver->execute_script("चरसंख्या = 4;");
    $driver->execute_script("arguments[0].value = 'A+B+F'; arguments[0].readOnly = false;", $eq_input10);
    
    my $lock_btn10 = $driver->find_element('बन्धन-गुण्डिका', 'id');
    $lock_btn10->click();
    sleep(1);

    eval {
        $driver->accept_alert();
    };

    my $eq_border_color = $driver->execute_script("return arguments[0].style.borderColor;", $eq_input10);
    my $is_eq_readonly = $driver->execute_script("return arguments[0].readOnly;", $eq_input10);
    my $lock_btn_text = $driver->execute_script("return arguments[0].innerText;", $lock_btn10);

    if ($eq_border_color =~ /red/i && !$is_eq_readonly && $lock_btn_text !~ /Locked/i) {
        pass_test("Equation with unauthorized variable properly rejected, highlighted, and left editable.");
    } else {
        fail_test("Unauthorized variable not handled correctly. Border: $eq_border_color, ReadOnly: " . ($is_eq_readonly ? "Yes" : "No") . ", Lock Btn: $lock_btn_text");
    }
}

# --- Testcase 11: Validate One-Way Lock and Row Append ---
if ($run_test eq 'all' || $run_test eq '11') {
    print "\n============================================\n";
    print "Testcase 11: Validate One-Way Lock and Row Append\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel11 = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel11);

    my $target_sel11 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel11);

    my $gen_btn11 = $driver->find_element('चालन-गुण्डिका', 'id');
    $gen_btn11->click();
    sleep(1);
    
    my $lock_btn11 = $driver->find_element('बन्धन-गुण्डिका', 'id');
    $lock_btn11->click();
    sleep(1);

    my $is_lock_disabled = $driver->execute_script("return arguments[0].disabled;", $lock_btn11);
    my $step_section = $driver->find_element('step-section', 'id');
    my $step_display = $driver->execute_script("return arguments[0].style.display;", $step_section);
    my $row_contents = $driver->execute_script(
        "var row = document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः'); " .
        "if (!row) return null; " .
        "var inputs = row.querySelectorAll('input').length; " .
        "var btns = row.querySelectorAll('button').length; " .
        "return inputs + '|' + btns;"
    );

    print "Lock Disabled: " . ($is_lock_disabled ? "Yes" : "No") . "\n";
    print "Step Section Display: $step_display\n";
    print "Row Contents (Inputs|Buttons): " . ($row_contents || "No Row") . "\n";

    if ($is_lock_disabled && $step_display =~ /flex/i && $row_contents eq "2|1") {
        pass_test("Lock is disabled and new row with 2 textboxes + 1 verify button appeared.");
    } else {
        fail_test("UI lock flow failed. Lock Disabled: $is_lock_disabled, Display: $step_display, Row: $row_contents");
    }
}

# --- Testcase 12: Validate Footer Buttons Appear on Lock ---
if ($run_test eq 'all' || $run_test eq '12') {
    print "\n============================================\n";
    print "Testcase 12: Validate Footer Buttons Appear on Lock\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel12 = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel12);

    my $target_sel12 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel12);

    my $gen_btn12 = $driver->find_element('चालन-गुण्डिका', 'id');
    $gen_btn12->click();
    sleep(1);
    
    my $lock_btn12 = $driver->find_element('बन्धन-गुण्डिका', 'id');
    $lock_btn12->click();
    sleep(1);

    my $control_section = $driver->find_element('control-section', 'id');
    my $control_display = $driver->execute_script("return arguments[0].style.display;", $control_section);

    my $check_btn = $driver->find_element('परीक्षण-गुण्डिका', 'id');
    my $hint_btn = $driver->find_element('संकेत-गुण्डिका', 'id');

    print "Control Section Display: $control_display\n";

    if ($control_display =~ /block/i && $check_btn && $hint_btn) {
        pass_test("Footer Verify and Hint buttons successfully revealed upon locking.");
    } else {
        fail_test("Footer buttons missing. Control Display: $control_display");
    }
}

# --- Testcase 13: Validate Empty Textbox Highlight on Verify ---
if ($run_test eq 'all' || $run_test eq '13') {
    print "\n============================================\n";
    print "Testcase 13: Validate Empty Textbox Highlight on Verify\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel13 = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel13);
    my $target_sel13 = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel13);
    $driver->find_element('चालन-गुण्डिका', 'id')->click();
    sleep(1);
    $driver->find_element('बन्धन-गुण्डिका', 'id')->click();
    sleep(1);

    # Click the inline verify button
    my $verify_btn = $driver->find_element('//div[contains(@class, "तर्क-पङ्क्तिः")]/button', 'xpath');
    $verify_btn->click();
    sleep(1);

    my $alert_text = "";
    eval {
        $alert_text = $driver->get_alert_text();
        $driver->accept_alert();
    };

    my $first_input_border = $driver->execute_script(
        "var input = document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type');" .
        "return input ? input.style.borderColor : 'none';"
    );
    
    my $second_input_border = $driver->execute_script(
        "var input = document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः input:nth-of-type(2)');" .
        "return input ? input.style.borderColor : 'none';"
    );
    
    print "First Input Border Color: $first_input_border\n";
    print "Second Input Border Color: $second_input_border\n";
    print "Alert Message: $alert_text\n";

    if ($first_input_border =~ /red/i && $second_input_border =~ /red/i && $alert_text =~ /expression and identity must be filled/i) {
        pass_test("Both textboxes correctly highlighted red and expected alert message shown.");
    } else {
        fail_test("Empty textboxes not handled correctly. Border1: $first_input_border, Border2: $second_input_border, Alert: $alert_text");
    }
}

# ---------------------------------------------
# Testcase 14: Validate "Check Result" logic
# ---------------------------------------------
{
    print "\n============================================\n";
    print "Testcase 14: Validate Check Result Logic\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel);
    my $target_sel = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel);
    $driver->find_element('चालन-गुण्डिका', 'id')->click();
    sleep(1);
    
    # We will override the generated equation directly for deterministic testing
    $driver->execute_script("document.getElementById('सङ्ख्या-प्रदर्शनम्').value = '((A.B)+(A.B\\'))';");
    
    $driver->find_element('बन्धन-गुण्डिका', 'id')->click();
    sleep(1);

    # Test 'Wrong answer'
    $driver->execute_script("document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type').value = '(C)';");
    $driver->find_element('परीक्षण-गुण्डिका', 'id')->click();
    sleep(1);
    my $res_wrong = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    
    # Test 'further simplification exists'
    $driver->execute_script("document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type').value = '((A.B)+(A.B\\'))';");
    $driver->find_element('परीक्षण-गुण्डिका', 'id')->click();
    sleep(1);
    my $res_further = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    
    # Test 'successfully simplified'
    $driver->execute_script("document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type').value = 'A';");
    $driver->find_element('परीक्षण-गुण्डिका', 'id')->click();
    sleep(1);
    my $res_success = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    
    print "Wrong Answer: $res_wrong\n";
    print "Further Simplification: $res_further\n";
    print "Success: $res_success\n";
    
    if ($res_wrong =~ /Wrong answer/i && $res_further =~ /further simplification exists/i && $res_success =~ /successfully simplified/i) {
        pass_test("Check Result validated all simplification states successfully.");
    } else {
        fail_test("Check Result validation failed. Wrong: $res_wrong, Further: $res_further, Success: $res_success");
    }
}

# ---------------------------------------------
# Testcase 15: Validate "Hint" Logic
# ---------------------------------------------
{
    print "\n============================================\n";
    print "Testcase 15: Validate Hint Logic\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel);
    my $target_sel = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel);
    $driver->find_element('चालन-गुण्डिका', 'id')->click();
    sleep(1);
    
    $driver->execute_script("document.getElementById('सङ्ख्या-प्रदर्शनम्').value = '((A.B)+(A.B\\'))';");
    $driver->find_element('बन्धन-गुण्डिका', 'id')->click();
    sleep(1);

    # Test hint on unsimplified
    $driver->execute_script("document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type').value = '((A.B)+(A.B\\'))';");
    $driver->find_element('संकेत-गुण्डिका', 'id')->click();
    sleep(1);
    my $hint_text = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    
    print "Hint text: $hint_text\n";
    
    if ($hint_text =~ /Hint: Focus on the terms/i) {
        pass_test("Hint provided the correct focus terms.");
    } else {
        fail_test("Hint output did not match expected structure.");
    }

    print "\n============================================\n";
    print "Testcase 16: Validate SOP Hint formatting\n";
    print "============================================\n";

    # Set the dropdowns to SOP
    $driver->execute_script("document.getElementById('format-select').value = 'SOP';");
    $driver->execute_script("document.getElementById('target-format-select').value = 'SOP';");

    # Manually inject the exact SOP equation and Charasoochi
    $driver->execute_script("window.चरसरणी = ['A', 'B', 'C', 'D', 'E'];");
    $driver->execute_script("document.getElementById('सङ्ख्या-प्रदर्शनम्').value = \"((D'.E')+(A'.B.C.D'.E')+(C.E')+(C.D.E)+(C'.D.E))\";");

    # Click Hint
    $driver->find_element('संकेत-गुण्डिका', 'id')->click();
    sleep(1);

    my $res_hint_16 = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    print "Hint text: $res_hint_16\n";

    if ($res_hint_16 =~ /Hint: Focus on the terms/i) {
        pass_test("Hint provided the correct focus terms for SOP.");
    } else {
        fail_test("Hint output did not match expected structure. Output: $res_hint_16");
    }
}

# ---------------------------------------------
{
    print "\n============================================\n";
    print "Testcase 17: Verify step by step identity simplification\n";
    print "============================================\n";

    $driver->get($url);
    sleep(1);

    my $fmt_sel = $driver->find_element('format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $fmt_sel);
    my $target_sel = $driver->find_element('target-format-select', 'id');
    $driver->execute_script("arguments[0].value = 'SOP';", $target_sel);
    $driver->find_element('चालन-गुण्डिका', 'id')->click();
    sleep(1);
    
    $driver->execute_script("document.getElementById('सङ्ख्या-प्रदर्शनम्').value = \"((A.B)+(A.B'))\";");
    $driver->execute_script("window.चरसरणी = ['A', 'B'];");
    
    $driver->find_element('बन्धन-गुण्डिका', 'id')->click();
    sleep(1);

    # Fill first step input
    $driver->execute_script("document.querySelectorAll('.तर्क-पङ्क्तिः input')[0].value = 'A';");
    $driver->execute_script("document.querySelectorAll('.तर्क-पङ्क्तिः input')[1].value = \"A.B+A.B'=A\";");

    # Click verify
    $driver->execute_script("document.querySelector('.तर्क-पङ्क्तिः button').click();");
    sleep(1);

            my $verify_msg = $driver->execute_script("return document.getElementById('परिणाम-प्रमाणीकरणम्').innerText;");
    my $ast1 = $driver->execute_script("return window.debug_ast1;");
        my $ast2 = $driver->execute_script("return window.debug_ast2;");
                if ($verify_msg =~ /Ready for Check Result/i) {
        pass_test("Step by step verify successful.");
    } else {
        fail_test("Step by step verify failed. Output: $verify_msg");
    }
}

$driver->quit();

print "\n============================================\n";
if ($fail_count == 0) {
    print "SUCCESS: All $test_count UI tests passed!\n";
} else {
    print "ERROR: $fail_count UI test(s) failed!\n";
}
print "============================================\n";
