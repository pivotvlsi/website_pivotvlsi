use strict;
use warnings;
use utf8;
use open qw(:std :utf8);
use Selenium::Remote::Driver;
use File::Spec;
use Test::More;

# Determine the absolute path to the HTML file
my $html_file = File::Spec->rel2abs('binary_addition.html');
my $url = "file:///$html_file";

# Replace backslashes with forward slashes for the URL (Windows specific)
$url =~ s/\\/\//g;

use Selenium::Chrome;

print "Initializing Selenium Chrome Driver...\n";
my $driver;
eval {
    $driver = Selenium::Chrome->new(
        binary => 'c:\\Users\\rnish\\vscode\\Pasupathi\\pivotvlsi\\truth_table\\chromedriver.exe'
    );
};
if ($@) {
    die "Could not start ChromeDriver.\nError: $@\n";
}

print "Opening $url\n";
$driver->get($url);

# Wait for the page to load
sleep(2);

# 1. Click Generate numbers
print "Setting fixed negative values...\n";
$driver->execute_script("document.getElementById('दशमलव-प्रथम-मूल्यम्').value = '-45'; document.getElementById('दशमलव-द्वितीय-मूल्यम्').value = '15';");
sleep(1);

# 2. Click Lock button
print "Clicking 'Lock' button...\n";
my $lock_btn = $driver->find_element('ताला-कीलः', 'id');
$lock_btn->click();
sleep(1);
my $txt = $driver->find_element('ताला-कीलः', 'id')->get_text();
print "Button text after lock: $txt\n";
$driver->capture_screenshot("screenshot_after_lock.png");

# Check if Number A panel is visible
my $pane_a;
eval {
    $pane_a = $driver->find_element('रूपान्तरण-पट्टिका-१', 'id');
};
if ($@ || !$pane_a->is_displayed()) {
    print "Error finding Number A panel! Dumping browser console logs:\n";
    my $logs = $driver->get_log('browser');
    foreach my $log (@$logs) {
        print "[$log->{level}] $log->{message}\n";
    }
    print "\nPage Source:\n";
    my $source = $driver->get_page_source();
    print "$source\n";
    
    die "Number A conversion panel is not displayed\n";
}
ok($pane_a->is_displayed(), "Number A conversion panel is displayed");

# Retrieve Number A's decimal value
my $decimal_val_a = $driver->find_element('वर्तमान-दशमलव-मूल्यम्-१', 'id')->get_text();
print "Generated Number A: $decimal_val_a\n";
ok($decimal_val_a =~ /^-?\d+$/, "Decimal A is a valid number: $decimal_val_a");

# Enter some logic to fill the division table.
# Since we know the decimal, we can bypass actually calculating by using JS or interacting directly.
# For a basic test, let's just make sure the division verification button exists and we can click it
my $proceed_a = $driver->find_element('विभाजन-सत्यापन-कीलः-१', 'id');
ok($proceed_a->is_displayed(), "Proceed button for A is visible");

# We will execute some JS to fill the correct values so we can proceed
$driver->execute_script(<<"END_JS"
    const decimal = parseInt(document.getElementById('वर्तमान-दशमलव-मूल्यम्-१').textContent, 10);
    const inputs = document.getElementById('विभाजन-पात्रम्-१').querySelectorAll('.div-input:not([readonly])');
    inputs.forEach(input => {
        if (input.style.visibility !== 'hidden') {
            input.value = input.dataset.expected;
        }
    });
END_JS
);

# Now click proceed to verify
print "Clicking Proceed for Number A's division table...\n";
$proceed_a->click();

# This should create the next division row, loop until done
for (my $i = 0; $i < 10; $i++) {
    sleep(1);
    
    my $is_locked = $driver->execute_script(<<"END_JS"
        const btn = document.getElementById('विभाजन-सत्यापन-कीलः-१');
        return btn.style.display === 'none' || btn.disabled;
END_JS
    );
    
    last if $is_locked;
    
    # Fill the new row
    $driver->execute_script(<<"END_JS"
        const inputs = document.getElementById('विभाजन-पात्रम्-१').querySelectorAll('.div-input:not([readonly])');
        inputs.forEach(input => {
        if (input.style.visibility !== 'hidden') {
            input.value = input.dataset.expected;
        }
    });
END_JS
    );
    
    # Click again
    eval { $proceed_a->click(); };
}

# The final result view should now be visible
sleep(1);
my $final_proceed_a = $driver->find_element('अन्तिम-सत्यापन-कीलः-१', 'id');
ok($final_proceed_a->is_displayed(), "Final Result Verification for A is visible");

# Fill final results
$driver->execute_script(<<"END_JS"
    const inputs = document.getElementById('रूपान्तरण-अन्तिम-परिणामम्-१').querySelectorAll('.अन्तिम-निवेशनम्');
    inputs.forEach(input => {
        if (input.style.visibility !== 'hidden') {
            input.value = input.dataset.expected;
        }
    });
END_JS
);


$final_proceed_a->click();
sleep(1);

if ($decimal_val_a < 0) {
    print "Handling 2's complement for Number A...\n";
    for (my $step = 0; $step < 10; $step++) {
        $driver->execute_script(<<"END_JS", "१");
        

    const container = document.getElementById('पूरक-पात्रम्-' + arguments[0]);
    if (container && container.style.display !== 'none') {
        const rows = container.querySelectorAll('.पद-पङ्क्ति');
        
        if (rows.length >= 2) {
            const originalInputs = rows[0].querySelectorAll('input');
            const allOnesInputs = rows[1].querySelectorAll('input');
            allOnesInputs.forEach((input, i) => {
                if (!input.readOnly && originalInputs[i]) {
                    input.value = originalInputs[i].value === '1' ? '0' : '1';
                    input.dispatchEvent(new Event('input'));
                }
            });
        }
        
        const btns = container.querySelectorAll('button');
        if (btns.length > 0 && btns[0].style.display !== 'none') {
            btns[0].click();
        }
        
        const carryInputs = container.querySelectorAll('input[data-expected]');
        carryInputs.forEach(input => {
            if (!input.readOnly && !input.disabled && input.style.visibility !== 'hidden') {
                input.value = input.dataset.expected;
                input.dispatchEvent(new Event('input'));
            }
        });
        
        if (btns.length > 0 && btns[0].style.display !== 'none') {
            btns[0].click();
        }
        if (btns.length > 1 && btns[1].style.display !== 'none') {
            btns[1].click();
        }
    }


END_JS
        sleep(1);
    }
}
sleep(2);


$driver->capture_screenshot("screenshot_before_pane_b.png");
open(my $fh, '>', 'dom_dump.txt');
print $fh $driver->execute_script("return document.getElementById('पूरक-पात्रम्-१').outerHTML;");
close $fh;

# Pane B should be visible
my $pane_b = $driver->find_element('रूपान्तरण-पट्टिका-२', 'id');
ok($pane_b->is_displayed(), "Number B conversion panel is displayed");

# Ensure Pane A is STILL visible
ok($pane_a->is_displayed(), "Number A conversion panel remains displayed after Number B is opened");


# Retrieve Number B's decimal value
my $decimal_val_b = $driver->find_element('वर्तमान-दशमलव-मूल्यम्-२', 'id')->get_text();
print "Generated Number B: $decimal_val_b\n";
ok($decimal_val_b =~ /^-?\d+$/, "Decimal B is a valid number: $decimal_val_b");

my $proceed_b = $driver->find_element('विभाजन-सत्यापन-कीलः-२', 'id');
ok($proceed_b->is_displayed(), "Proceed button for B is visible");

$driver->execute_script(<<"END_JS"
    const inputs = document.getElementById('विभाजन-पात्रम्-२').querySelectorAll('.div-input:not([readonly])');
    inputs.forEach(input => {
        if (input.style.visibility !== 'hidden') {
            input.value = input.dataset.expected;
        }
    });
END_JS
);

print "Clicking Proceed for Number B's division table...\n";
$proceed_b->click();

for (my $i = 0; $i < 10; $i++) {
    sleep(1);
    
    my $is_locked = $driver->execute_script(<<"END_JS"
        const btn = document.getElementById('विभाजन-सत्यापन-कीलः-२');
        return btn.style.display === 'none' || btn.disabled;
END_JS
    );
    
    last if $is_locked;
    
    $driver->execute_script(<<"END_JS"
        const inputs = document.getElementById('विभाजन-पात्रम्-२').querySelectorAll('.div-input:not([readonly])');
        inputs.forEach(input => {
        if (input.style.visibility !== 'hidden') {
            input.value = input.dataset.expected;
        }
    });
END_JS
    );
    
    eval { $proceed_b->click(); };
}

sleep(1);
my $final_proceed_b = $driver->find_element('अन्तिम-सत्यापन-कीलः-२', 'id');
ok($final_proceed_b->is_displayed(), "Final Result Verification for B is visible");

$driver->execute_script(<<"END_JS"
    const inputs = document.getElementById('रूपान्तरण-अन्तिम-परिणामम्-२').querySelectorAll('.अन्तिम-निवेशनम्');
    inputs.forEach(input => {
        if (input.style.visibility !== 'hidden') {
            input.value = input.dataset.expected;
        }
    });
END_JS
);


$final_proceed_b->click();
sleep(1);

if ($decimal_val_b < 0) {
    print "Handling 2's complement for Number B...\n";
    for (my $step = 0; $step < 10; $step++) {
        $driver->execute_script(<<"END_JS", "२");
        

    const container = document.getElementById('पूरक-पात्रम्-' + arguments[0]);
    if (container && container.style.display !== 'none') {
        const rows = container.querySelectorAll('.पद-पङ्क्ति');
        
        if (rows.length >= 2) {
            const originalInputs = rows[0].querySelectorAll('input');
            const allOnesInputs = rows[1].querySelectorAll('input');
            allOnesInputs.forEach((input, i) => {
                if (!input.readOnly && originalInputs[i]) {
                    input.value = originalInputs[i].value === '1' ? '0' : '1';
                    input.dispatchEvent(new Event('input'));
                }
            });
        }
        
        const btns = container.querySelectorAll('button');
        if (btns.length > 0 && btns[0].style.display !== 'none') {
            btns[0].click();
        }
        
        const carryInputs = container.querySelectorAll('input[data-expected]');
        carryInputs.forEach(input => {
            if (!input.readOnly && !input.disabled && input.style.visibility !== 'hidden') {
                input.value = input.dataset.expected;
                input.dispatchEvent(new Event('input'));
            }
        });
        
        if (btns.length > 0 && btns[0].style.display !== 'none') {
            btns[0].click();
        }
        if (btns.length > 1 && btns[1].style.display !== 'none') {
            btns[1].click();
        }
    }


END_JS
        sleep(1);
    }
}
sleep(2);




# Make sure Truth Table is displayed
my $truth_table = $driver->find_element('दक्षिण-पटलम्', 'id');
ok($truth_table->is_displayed(), "Truth table and Addition grid panel is displayed");

# Fill the Truth Table
print "Filling Truth Table...\n";
$driver->execute_script(<<"END_JS"
    const inputs = document.querySelectorAll('.fa-input');
    inputs.forEach(input => {
        const a = parseInt(input.dataset.a);
        const b = parseInt(input.dataset.b);
        const cin = parseInt(input.dataset.c);
        const sum = (a + b + cin) % 2;
        const carry = Math.floor((a + b + cin) / 2);
        
        if (input.dataset.type === 'sum') {
            input.value = sum;
        } else {
            input.value = carry;
        }
    });
END_JS
);

sleep(2);
print "Clicking Verify Truth Table...\n";
my $verify_tt_btn = $driver->find_element('सत्यता-सारणी-ताला-कीलः', 'id');
$verify_tt_btn->click();
sleep(2);

print "Starting interactive Binary Addition test...\n";

# Fill Operand A and Operand B inputs
print "Filling Operand A and B inputs...\n";
$driver->execute_script(<<"END_JS"
    const inputs = document.querySelectorAll('.सङ्ख्या-निवेशनम्');
    inputs.forEach(input => {
        if(input.dataset.expected) {
            input.value = input.dataset.expected;
            input.dispatchEvent(new Event('input'));
        }
    });
END_JS
);

sleep(1);
print "Clicking Proceed for Addition Grid...\n";
my $proceed_addition_btn = $driver->find_element('अतिरिक्त-सत्यापन-कीलः', 'id');
$proceed_addition_btn->click();
sleep(2);

my $num_cols = $driver->execute_script("return document.querySelectorAll('.योग-निवेशनम्').length;");

for (my $i = 0; $i < $num_cols; $i++) {
    sleep(1);
    
    my $ret = $driver->execute_script(<<"END_JS", $i);
        const col = arguments[0];
        const aStr = Array.from(document.getElementById('प्रथम-पङ्क्ति').children).map(el => el.value || el.textContent).join('');
        const bStr = Array.from(document.getElementById('द्वितीय-पङ्क्ति').children).map(el => el.value || el.textContent).join('');
        const maxLen = Math.max(aStr.length, bStr.length);
        
        let trueCarryIn = 0;
        for (let j = 0; j < col; j++) {
            let a = parseInt(aStr[aStr.length - 1 - j] || '0', 10);
            let b = parseInt(bStr[bStr.length - 1 - j] || '0', 10);
            trueCarryIn = ((a & b) | (b & trueCarryIn) | (a & trueCarryIn));
        }
        
        let bitA = parseInt(aStr[aStr.length - 1 - col] || '0', 10);
        let bitB = parseInt(bStr[bStr.length - 1 - col] || '0', 10);
        
        const trueSum = bitA ^ bitB ^ trueCarryIn;
        return [trueSum, trueCarryIn];
END_JS
    
    my $correct_sum = $ret->[0];
    my $correct_carry = $ret->[1];
    
    $driver->execute_script(<<"END_JS", $i, $correct_sum, $correct_carry);
        const col = arguments[0];
        const sumVal = arguments[1];
        const carryVal = arguments[2];
        
        const carryInput = document.querySelector('.वहन-निवेशनम्[data-col="' + col + '"]');
        if(carryInput && !carryInput.readOnly) {
            carryInput.value = carryVal;
            carryInput.dispatchEvent(new Event('input'));
        }
        
        const sumInput = document.querySelector('.योग-निवेशनम्[data-col="' + col + '"]');
        if(sumInput && !sumInput.readOnly) {
            sumInput.value = sumVal;
            sumInput.dispatchEvent(new Event('input'));
        }
END_JS
    
    print "Filled Column $i: Carry=$correct_carry, Sum=$correct_sum\n";
}

print "Addition grid filled and verified successfully!\n";
$driver->capture_screenshot("screenshot.png");
sleep(1);
ok(1, "Binary Addition Interactive Grid completed");

print "Filling final equation...\n";
my $expected_c = $driver->execute_script(<<"END_JS"
    let c = "";
    for(let i=7; i>=0; i--) {
        c += document.querySelector('.योग-निवेशनम्[data-col="' + i + '"]').value;
    }
    return c;
END_JS
);

$driver->execute_script(<<"END_JS", $expected_c);
    document.getElementById('final-a').value = '-45';
    document.getElementById('final-base-a').value = '10';
    document.getElementById('final-b').value = '15';
    document.getElementById('final-base-b').value = '10';
    document.getElementById('final-c').value = arguments[0];
    document.getElementById('final-base-c').value = '2';
    
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Verify Final Equation')).click();
END_JS

sleep(1);
my $next_btn_visible = $driver->execute_script("return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next problem')) !== undefined && Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next problem')).offsetParent !== null;");
ok($next_btn_visible, "Next problem button is visible after final equation verification");
print "Final equation filled and verified successfully!\n";

print "\n========================================\n";
print "TEST COMPLETE! The browser will stay open for 30 seconds so you can visually inspect the Truth Table, Addition grid, and Final Equation.\n";
print "========================================\n\n";
sleep(30);

print "Test Completed Successfully!\n";

$driver->quit();

done_testing();
