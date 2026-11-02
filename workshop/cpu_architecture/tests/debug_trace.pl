use strict;
use warnings;
use Selenium::Chrome;

my $driver = Selenium::Chrome->new(
    binary => 'C:\Users\rnish\vscode\Pasupathi\pivotvlsi\truth_table\chromedriver.exe',
    custom_args => '--headless --disable-gpu'
);

$driver->get('file:///C:/Users/rnish/vscode/Pasupathi/pivotvlsi/truth_table/cpu_architecture/basic_cpu_gui.html');

my $lines = [
    "LOADIB #1",
    "LOADI #10",
    "MOV R2, R0",
    "SET1 0",
    "NOP",
    "SET0 0",
    "MOV R0, R2",
    "SUB",
    "MOV R2, R0",
    "JMPNZ 0",
    "HALT"
];
my $asm = join("\\n", @$lines);

my $trace = $driver->execute_script("
    window.संयोजन_व_भारणम्('$asm');
    window.कूर्दन_सारणी_दत्त[0] = 3;
    let log = [];
    for (let i = 0; i < 30; i++) {
        let pc = window.कार्यक्रम_गणक;
        let ir = window.स्मृति_दत्त[pc] ? window.स्मृति_दत्त[pc].प्रकार : 'NULL';
        let r2 = window.पंजिका_दत्त[2];
        let pin = (window.पिन_स्थिति_पंजिका & 1);
        let zf = window.शून्य_ध्वजा ? 1 : 0;
        window.पद_चालनम्();
        log.push({ step: i, pc: pc, ir: ir, r2: r2, pin: pin, zf: zf });
    }
    return log;
");

for my $entry (@$trace) {
    print "Step $entry->{step}: PC=$entry->{pc} IR=$entry->{ir} R2=$entry->{r2} Pin=$entry->{pin} ZF=$entry->{zf}\n";
}

$driver->quit();
