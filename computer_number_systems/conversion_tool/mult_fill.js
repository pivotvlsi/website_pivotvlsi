const multInterval = setInterval(() => {
    let filledAny = false;

    // Fill all currently unlocked textboxes with their expected answers
    document.querySelectorAll('.mult-input:not([readonly])').forEach(input => {
        if (input.dataset.expected) {
            input.value = input.dataset.expected;
            filledAny = true;
        }
    });

    // Click the "Proceed" verify button if we filled anything
    if (filledAny) {
        const verifyBtn = document.getElementById('गुणन-सत्यापन-कीलः');
        if (verifyBtn && verifyBtn.style.display !== 'none') {
            verifyBtn.click();
        }
    } else {
        // If there are no more unlocked inputs, we are done
        if (document.querySelectorAll('.mult-input:not([readonly])').length === 0) {
            clearInterval(multInterval);
            console.log("Multiplication process completed!");
        }
    }
}, 200);
