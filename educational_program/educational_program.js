function पाठ्यक्रमान्_दर्शयतु() {
    const पात्रम् = document.getElementById('पाठ्यक्रम-पात्रम्');
    if (!पात्रम्) return;

    const पाठ्यक्रमसूची = [
        {
            शीर्षकम्: "ASIC Design & Verification",
            विवरणम्: "Complete flow from specs to tape-out, verification methodologies (UVM/SystemVerilog).",
            अवधिः: "12 Weeks"
        },
        {
            शीर्षकम्: "FPGA Prototyping",
            विवरणम्: "Hands-on implementation of digital architectures on Xilinx/Intel FPGAs.",
            अवधिः: "8 Weeks"
        },
        {
            शीर्षकम्: "RTL Design (Verilog/VHDL)",
            विवरणम्: "Learn synthesis-friendly RTL design patterns, FSM logic, and clock domain crossing.",
            अवधिः: "10 Weeks"
        }
    ];

    setTimeout(() => {
        पात्रम्.innerHTML = पाठ्यक्रमसूची.map(पाठ्यक्रमः => `
            <div class="कार्यक्रम-पत्रकम्">
                <div class="पत्रक-चिह्नम्"><i class="fa-solid fa-graduation-cap"></i></div>
                <h3 class="पत्रक-शीर्षकम्">${पाठ्यक्रमः.शीर्षकम्}</h3>
                <p class="पत्रक-विवरणम्">${पाठ्यक्रमः.विवरणम्}</p>
                <div class="पत्रक-अवधिः">
                    <i class="fa-regular fa-clock"></i> ${पाठ्यक्रमः.अवधिः}
                </div>
                <a href="#" class="प्रारम्भ-कुञ्जिका">Register Now</a>
            </div>
        `).join('');
    }, 1500);
}

window.onload = पाठ्यक्रमान्_दर्शयतु;