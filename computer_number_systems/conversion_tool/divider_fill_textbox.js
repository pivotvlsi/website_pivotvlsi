// Fill in the final result textboxes
document.querySelectorAll('.अन्तिम-निवेशनम्').forEach(input => {
    if (input.dataset.expected && !input.readOnly) {
        input.value = input.dataset.expected;
    }
});

// Click the final Verify button
const finalVerifyBtn = document.getElementById('अन्तिम-सत्यापन-कीलः');
if (finalVerifyBtn && finalVerifyBtn.style.display !== 'none') {
    finalVerifyBtn.click();
}
