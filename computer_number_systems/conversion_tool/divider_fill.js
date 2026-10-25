const divisionInterval = setInterval(() => {
    let filledAny = false;

    // Fill all currently unlocked textboxes with their expected answers
    document.querySelectorAll('.div-input:not([readonly])').forEach(input => {
        if (input.dataset.expected) {
            input.value = input.dataset.expected;
            filledAny = true;
        }
    });

    // Click the "Proceed" verify button if we filled anything
    if (filledAny) {
        const verifyBtn = document.getElementById('विभाजन-सत्यापन-कीलः');
        if (verifyBtn && verifyBtn.style.display !== 'none') {
            verifyBtn.click();
        }
    } else {
        // If there are no more unlocked inputs, we are done
        if (document.querySelectorAll('.div-input:not([readonly])').length === 0) {
            clearInterval(divisionInterval);
            console.log("Division process completed!");
        }
    }
}, 500); // 500ms delay between steps so you can watch it solve!
