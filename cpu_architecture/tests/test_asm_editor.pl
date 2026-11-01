use strict;
use warnings;
use utf8;
binmode(STDOUT, ":utf8");
binmode(STDERR, ":utf8");

use Test::More;
use Selenium::Chrome;
use File::Spec;
use Cwd 'abs_path';

my $root_dir = abs_path(File::Spec->catdir(__FILE__, '..', '..'));
my $html_file = File::Spec->catfile($root_dir, 'asm_editor.html');
my $file_url = "file:///" . $html_file;
$file_url =~ s{\\}{/}g;

my $driver_path = 'C:\Users\rnish\vscode\Pasupathi\pivotvlsi\truth_table\chromedriver.exe';

diag("Starting Selenium Chrome Driver for Assembly Editor Verification...");

my $driver = eval {
    Selenium::Chrome->new(
        binary => $driver_path,
        extra_capabilities => {
            'goog:chromeOptions' => {
                args => [
                    '--headless=new',
                    '--disable-gpu',
                    '--no-sandbox',
                    '--window-size=1600,1000'
                ]
            }
        }
    );
};

if (!$driver) {
    plan skip_all => "Could not start ChromeDriver: $@";
    exit;
}

$driver->get($file_url);
sleep(1);

subtest "१. सम्पादक पटल घटक उपस्थिति (Editor UI Component Presence)" => sub {
    my $textarea = eval { $driver->find_element('संहिता-पाठ-क्षेत्र', 'id') };
    ok($textarea, "Source code textarea (\#संहिता-पाठ-क्षेत्र) is present");

    my $line_nums = eval { $driver->find_element('पंक्ति-क्रमांक-स्तम्भ', 'id') };
    ok($line_nums, "Line numbers column (\#पंक्ति-क्रमांक-स्तम्भ) is present");

    my $new_btn = eval { $driver->find_element('नूतन-संचिका-कुञ्जी', 'id') };
    ok($new_btn, "New File button (\#नूतन-संचिका-कुञ्जी) is present");

    my $filename_input = eval { $driver->find_element('संचिका-नाम-निवेश', 'id') };
    ok($filename_input, "Filename input field (\#संचिका-नाम-निवेश) is present");

    my $save_btn = eval { $driver->find_element('संचिका-सञ्चय-कुञ्जी', 'id') };
    ok($save_btn, "Save button (\#संचिका-सञ्चय-कुञ्जी) is present");

    my $validate_btn = eval { $driver->find_element('कार्यक्रम-सत्यापन-कुञ्जी', 'id') };
    ok($validate_btn, "Validate button (\#कार्यक्रम-सत्यापन-कुञ्जी) is present");
};

subtest "२. सम्पादक सत्यापन एवं नमूना भारण (Editor Validation & Template Loading)" => sub {
    my $textarea = $driver->find_element('संहिता-पाठ-क्षेत्र', 'id');
    my $validate_btn = $driver->find_element('कार्यक्रम-सत्यापन-कुञ्जी', 'id');
    my $banner = $driver->find_element('सत्यापन-फलक', 'id');

    # Validate default loaded code
    $validate_btn->click();
    sleep(0.3);
    like($banner->get_text(), qr/Validated Successfully/i, "Initial template code validates successfully");

    # Test error detection: insert invalid instruction
    $textarea->clear();
    $textarea->send_keys("LOADI #5\nBADOPCODE\nHALT");
    $validate_btn->click();
    sleep(0.3);
    like($banner->get_text(), qr/Validation Failed/i, "Editor catches invalid instruction syntax");

    # Test template loading function via JS (using ASCII alias 'alu' to avoid encoding issues in script eval)
    $driver->execute_script(q{ window.नमूना_भारणम्('alu'); });
    sleep(0.3);
    my $content = $driver->execute_script(q{ return document.getElementById('संहिता-पाठ-क्षेत्र').value; });
    ok($content =~ /ALU/i, "ALU Math template loads into editor");
    like($banner->get_text(), qr/Validated Successfully/i, "Loaded ALU template automatically passes validation");
};

subtest "३. संचिका सञ्चय कार्यप्रणाली (Save Function Call Verification)" => sub {
    # Call save function and check feedback banner
    $driver->execute_script("window.संचिका_सञ्चयम्();");
    sleep(0.3);
    my $banner = $driver->find_element('सत्यापन-फलक', 'id');
    like($banner->get_text(), qr/Saved .* to your computer successfully/i, "Save to computer creates download link and confirms success");
};

subtest "४. नूतन संचिका निर्माणम् (New File Creation Functionality)" => sub {
    # Call new file creation via JS directly with custom filename argument
    my $content = $driver->execute_script(q{
        window.नूतन_संचिका_निर्माणम्('my_new_test.asm');
        return document.getElementById('संहिता-पाठ-क्षेत्र').value;
    });
    sleep(0.3);

    my $fname = $driver->execute_script(q{ return document.getElementById('संचिका-नाम-निवेश').value; });
    is($fname, 'my_new_test.asm', "Filename updated to 'my_new_test.asm'");

    ok($content =~ /MY_NEW_TEST.ASM/i, "Editor initialized with clean template for new file");

    my $banner = $driver->find_element('सत्यापन-फलक', 'id');
    like($banner->get_text(), qr/Created new assembly file/i, "Confirmation banner displayed for new file");
};

$driver->quit();
done_testing();
