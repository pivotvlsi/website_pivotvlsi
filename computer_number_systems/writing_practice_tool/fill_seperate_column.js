document.querySelectorAll('input.अभ्यासनिवेशनम्[data-स्तम्भ="1"]').forEach(input => {
    const rowNumber = parseInt(input.dataset.पङ्क्ति) + 1;
    input.value = rowNumber.toString(8); // Convert to Hexadecimal

});
document.querySelectorAll('input.अभ्यासनिवेशनम्[data-स्तम्भ="2"]').forEach(input => {
    const rowNumber = parseInt(input.dataset.पङ्क्ति) + 1;
    input.value = rowNumber.toString(2); // Convert to Hexadecimal

});
document.querySelectorAll('input.अभ्यासनिवेशनम्[data-स्तम्भ="3"]').forEach(input => {
    const rowNumber = parseInt(input.dataset.पङ्क्ति) + 1;
    input.value = rowNumber.toString(16); // Convert to Hexadecimal 

});