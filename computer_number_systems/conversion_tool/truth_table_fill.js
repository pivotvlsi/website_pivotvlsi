document.querySelectorAll('.सत्यता-सारणी-निवेशनम्').forEach(निवेशनम् => {
    निवेशनम्.value = निवेशनम्.dataset.expected;
});

document.querySelectorAll('.निष्कर्षण-निवेशनम्').forEach(निवेशनम् => {
    निवेशनम्.value = निवेशनम्.dataset.expected;
});

document.querySelectorAll('.अन्तिम-निवेशनम्').forEach(निवेशनम् => {
    निवेशनम्.value = निवेशनम्.dataset.expected;
});

document.querySelectorAll('.div-input').forEach(निवेशनम् => {
    if (!निवेशनम्.readOnly) {
        निवेशनम्.value = निवेशनम्.dataset.expected;
        निवेशनम्.dispatchEvent(new Event('input'));
    }
});
