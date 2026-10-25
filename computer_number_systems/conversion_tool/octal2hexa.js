function मध्यवर्ती_प्रवाह_पूरणम्() {
    // 1. Fill Truth Table 1 (Extraction Phase)
    document.querySelectorAll('#सत्यता-सारणी-पात्रम् .सत्यता-सारणी-निवेशनम्').forEach(निवेशनम् => {
        if (!निवेशनम्.readOnly) {
            निवेशनम्.value = निवेशनम्.dataset.expected;
            निवेशनम्.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    // Click Truth Table 1 Verify
    const सत्यता_सारणी_सत्यापनम्_१ = document.getElementById('सत्यापन-कीलः-सत्यता-सारणी-पात्रम्');
    if (सत्यता_सारणी_सत्यापनम्_१ && !सत्यता_सारणी_सत्यापनम्_१.disabled) सत्यता_सारणी_सत्यापनम्_१.click();

    // 2. Fill Extraction Inputs
    document.querySelectorAll('.निष्कर्षण-निवेशनम्').forEach(निवेशनम् => {
        if (!निवेशनम्.readOnly) {
            निवेशनम्.value = निवेशनम्.dataset.expected;
            निवेशनम्.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    // Click Extraction Verify
    const निष्कर्षण_सत्यापनम् = document.getElementById('निष्कर्षण-सत्यापन-कीलः-वाम-पटलम्');
    if (निष्कर्षण_सत्यापनम् && !निष्कर्षण_सत्यापनम्.disabled) निष्कर्षण_सत्यापनम्.click();

    // 3. Fill Truth Table 2 (Substitution Phase)
    document.querySelectorAll('#सत्यता-सारणी-पात्रम्-2 .सत्यता-सारणी-निवेशनम्').forEach(निवेशनम् => {
        if (!निवेशनम्.readOnly) {
            निवेशनम्.value = निवेशनम्.dataset.expected;
            निवेशनम्.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    // Click Truth Table 2 Verify
    const सत्यता_सारणी_सत्यापनम्_२ = document.getElementById('सत्यापन-कीलः-सत्यता-सारणी-पात्रम्-2');
    if (सत्यता_सारणी_सत्यापनम्_२ && !सत्यता_सारणी_सत्यापनम्_२.disabled) सत्यता_सारणी_सत्यापनम्_२.click();

    // 4. Fill Substitution Inputs
    document.querySelectorAll('.प्रतिस्थापन-निवेशनम्').forEach(निवेशनम् => {
        if (!निवेशनम्.readOnly) {
            निवेशनम्.value = निवेशनम्.dataset.expected;
            निवेशनम्.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    // Click Substitution Verify
    const प्रतिस्थापन_सत्यापनम् = document.getElementById('प्रतिस्थापन-सत्यापन-कीलः-वाम-पटलम्-2');
    if (प्रतिस्थापन_सत्यापनम् && !प्रतिस्थापन_सत्यापनम्.disabled) प्रतिस्थापन_सत्यापनम्.click();

    // 5. Fill Final Result Inputs
    document.querySelectorAll('.अन्तिम-निवेशनम्').forEach(निवेशनम् => {
        if (!निवेशनम्.readOnly) {
            निवेशनम्.value = निवेशनम्.dataset.expected;
            निवेशनम्.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}

// Execute the flow
मध्यवर्ती_प्रवाह_पूरणम्();
