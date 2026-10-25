document.querySelectorAll('#सारणीशरीरम् tr').forEach((tr, index) => {
    // The decimal number for this row
    let decimalNum = index + 1;

    // 1. Fill Binary Column (2nd column)
    let binaryInput = tr.querySelector('td:nth-child(2) input');
    if (binaryInput) {
        binaryInput.value = decimalNum.toString(2).padStart(5, '0');
        binaryInput.dispatchEvent(new Event('input'));
    }

    // 2. Fill Gray Code Column (3rd column)
    let grayNum = decimalNum ^ (decimalNum >> 1);
    let grayInput = tr.querySelector('td:nth-child(3) input');

    if (grayInput) {
        // Set the value as a binary string
        grayInput.value = grayNum.toString(2).padStart(5, '0');
        // Trigger the input event to automatically clear any red error borders
        grayInput.dispatchEvent(new Event('input'));
    }
});
