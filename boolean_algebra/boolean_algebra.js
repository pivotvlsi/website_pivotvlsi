
function stripWrapper(ast) {
    if (Array.isArray(ast) && (ast[0] === 0 || ast[0] === 1 || ast[0] === 2 || ast[0] === 3)) {
        if (ast.length === 2 && Array.isArray(ast[1]) && typeof ast[1][0] === 'number') {
            return stripWrapper(ast[1]);
        }
    }
    return ast;
}

const formula_map = {
    "Contradiction (विरोधः)": ["A.A'=0"],
    "Zero Property (शून्य_गुण)": ["A.0=0"],
    "Identity AND (तत्समक_अन्)": ["A.1=A"],
    "Tautology (सर्वदा_सत्य)": ["A+A'=1"],
    "One Property (एक_गुण)": ["A+1=1"],
    "Identity OR (तत्समक_अथवा)": ["A+0=A"],
    "De Morgan's Law (डिमॉर्गन_नियमः)": [
        "(A.B)'=A'+B'", "(A+B)'=A'.B'"
    ],
    "Idempotent Law (समशक्ति_नियमः)": ["A+A=A", "A.A=A"],
    "Absorption Law (अवशोषण_नियमः)": [
        "A+A.B=A", "A.(A+B)=A", "A.B+A=A", "(A+B).A=A"
    ],
    "Simplification Theorem (सरलीकरण_प्रमेय)": [
        "A.B+A.B'=A", "(A+B).(A+B')=A", "A.B'+A.B=A", "(A+B').(A+B)=A"
    ]
};


function createNewRow(padPatram) {
    let newRow = document.createElement("div");
    newRow.className = "तर्क-पङ्क्तिः";
    newRow.style.display = "flex";
    newRow.style.gap = "10px";
    newRow.style.marginBottom = "15px";
    newRow.style.alignItems = "center";

    let input1 = document.createElement("input");
    input1.type = "text";
    input1.className = "समस्या-निवेशनम्";
    input1.style.flex = "1";
    input1.style.padding = "10px";

    let input2 = document.createElement("input");
    input2.type = "text";
    input2.className = "समस्या-निवेशनम्";
    input2.style.flex = "1";
    input2.style.padding = "10px";

    let verifyBtn = document.createElement("button");
    verifyBtn.className = "उपकरणकीलः";
    verifyBtn.innerHTML = '<i class="fas fa-check"></i> Verify';
    verifyBtn.addEventListener("click", function () {
        window.did_execute = true;
        input1.style.border = "";
        input2.style.border = "";
        let isEmpty = false;

        if (input1.value.trim() === "") {
            input1.style.border = "2px solid red";
            isEmpty = true;
        }
        if (input2.value.trim() === "") {
            input2.style.border = "2px solid red";
            isEmpty = true;
        }

        if (isEmpty) {
            alert("expression and identity must be filled before verifying this step");
            return;
        }

        // Get previous equation
        let prevRow = newRow.previousElementSibling;
        let prevEq = "";
        if (prevRow) {
            let prevInput = prevRow.querySelector('input:first-of-type');
            prevEq = prevInput ? prevInput.value.replace(/\s+/g, '') : "";
        } else {
            prevEq = document.getElementById("सङ्ख्या-प्रदर्शनम्").value.replace(/\s+/g, '');
        }

        let currEq = input1.value.replace(/\s+/g, '');
        let identity = input2.value.replace(/\s+/g, '');

        if (!/^[A-C\+\.\'\=\(\)]+$/.test(identity)) {
            alert("Identity formula must only contain A, B, C, +, ., ', = and ()");
            return;
        }

        try {
            let combined = prevEq + currEq;
            let extracted = Array.from(new Set(combined.match(/[A-Z]/g) || [])).sort();
            let activeVars = (Array.isArray(चरसरणी) && चरसरणी.length >= extracted.length && extracted.every(v => चरसरणी.includes(v)))
                ? चरसरणी
                : (extracted.length > 0 ? extracted : ['A', 'B', 'C', 'D']);

            let prevAst = window.सत्यता_सारणी_प्रारंभ(window.सूत्र_विभाजन(prevEq), activeVars);
            let currAst = window.सत्यता_सारणी_प्रारंभ(window.सूत्र_विभाजन(currEq), activeVars);

            // Mathematical equivalence check
            if (JSON.stringify(window.सूत्र_सरलीकरणम्(prevAst)) !== JSON.stringify(window.सूत्र_सरलीकरणम्(currAst))) {
                input1.style.border = "2px solid red";
                document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "Mathematically incorrect step!";
                return;
            }

            let expectedHint = window.सूत्र_अभिज्ञानम्(prevAst);
            if (!expectedHint) {
                // If it is already fully simplified, shouldn't happen usually but just in case
                input1.style.border = "2px solid red";
                document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "Equation is already fully simplified!";
                return;
            }

            let validFormulas = formula_map[expectedHint.rule] || [];

            // Check if identity formula matches one of the valid formulas, allowing LHS=RHS or RHS=LHS
            let isFormulaMatch = false;
            for (let vf of validFormulas) {
                if (identity === vf) isFormulaMatch = true;
                if (identity.includes('=')) {
                    let parts = identity.split('=');
                    if (parts[1] + '=' + parts[0] === vf) isFormulaMatch = true;
                }
            }

            if (!isFormulaMatch) {
                input2.style.border = "2px solid red";
                document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "Formula does not match the required transformation!";
                return;
            }

            let expectedNextAst = window.सूत्र_एकपद_सरलीकरणम्(prevAst);

            if (JSON.stringify(stripWrapper(currAst)) !== JSON.stringify(stripWrapper(expectedNextAst))) {
                input1.style.border = "2px solid red";
                document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "Only one change as per equation is allowed!";
                return;
            }

            // PASS
            document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "";
            input1.disabled = true;
            input2.disabled = true;
            verifyBtn.disabled = true;

            // Check if fully simplified
            let currAstCopy = JSON.parse(JSON.stringify(currAst));
            let s1 = JSON.stringify(currAst);
            let s2 = JSON.stringify(window.सूत्र_सरलीकरणम्(currAstCopy));
            window.debug_ast1 = s1;
            window.debug_ast2 = s2;
            let stepSection = document.getElementById("step-section");
            let padPatramEl = document.getElementById("पद-पात्रम्");
            if (s1 === s2) {
                document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "Ready for Check Result";
                if (stepSection && padPatramEl) {
                    let targetTop = newRow.offsetTop - padPatramEl.offsetTop;
                    stepSection.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                }
            } else {
                createNewRow(padPatram);
                // Keep the previous verified step aligned at the top of the scrollbox
                if (stepSection && padPatramEl) {
                    setTimeout(() => {
                        let targetTop = newRow.offsetTop - padPatramEl.offsetTop;
                        stepSection.scrollTo({
                            top: targetTop,
                            behavior: 'smooth'
                        });
                    }, 50);
                }
            }

        } catch (e) {
            console.error(e);
            input1.style.border = "2px solid red";
            document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "Error: " + e.message;
        }

    });

    newRow.appendChild(input1);
    newRow.appendChild(input2);
    newRow.appendChild(verifyBtn);

    padPatram.appendChild(newRow);
}

let चरसंख्या;
let पदसंख्या;
let चरसरणी = [];
let द्विमीयपदम् = [];
let धारितपदम्;
let पदम् = [];
let द्विमीयसमीकरणम् = "";
let फलद्विमीयसमीकरणम् = [];
let पूर्णद्विमीयसमीकरणम् = [];
let लघुतमपदानि = [];

const प्रारूपविकल्पः = document.getElementById("format-select");
const लक्ष्यप्रारूपविकल्पः = document.getElementById("target-format-select");
let चितप्रारूपम् = प्रारूपविकल्पः.value;
let लक्ष्यप्रारूपम् = लक्ष्यप्रारूपविकल्पः.value;

// Get the text box element
const सूत्रप्रदर्शनम् = document.getElementById("सङ्ख्या-प्रदर्शनम्");

// Check if it is empty or filled
if (सूत्रप्रदर्शनम्.value.trim() !== "") {
    //console.log("Filled");
} else {
    द्विमीयसमीकरणम् = नामरूपान्तरणम्(द्विमीयपदम्);
    //console.log(द्विमीयसमीकरणम्);
}





document.getElementById("चालन-गुण्डिका").addEventListener("click", function () {
    द्विमीयसमीकरणम् = "";
    चितप्रारूपम् = प्रारूपविकल्पः.value;
    लक्ष्यप्रारूपम् = लक्ष्यप्रारूपविकल्पः.value;

    if (चितप्रारूपम् === "select" && लक्ष्यप्रारूपम् !== "select") {
        if (लक्ष्यप्रारूपम् === "POS" || लक्ष्यप्रारूपम् === "MIN") {
            चितप्रारूपम् = "SOP";
            प्रारूपविकल्पः.value = "SOP";
        } else if (लक्ष्यप्रारूपम् === "SOP" || लक्ष्यप्रारूपम् === "MAX") {
            चितप्रारूपम् = "POS";
            प्रारूपविकल्पः.value = "POS";
        }
    }

    // Reset previous highlights if any
    लक्ष्यप्रारूपविकल्पः.style.border = "";
    प्रारूपविकल्पः.style.border = "";

    let hasError = false;

    if (चितप्रारूपम् === "select") {
        प्रारूपविकल्पः.style.border = "2px solid red";
        hasError = true;
    }

    if (लक्ष्यप्रारूपम् === "select") {
        लक्ष्यप्रारूपविकल्पः.style.border = "2px solid red";
        hasError = true;
    }

    if (hasError) {
        // Small delay to allow border colors to render before alert blocks UI
        setTimeout(() => alert("Please select the required formats first!"), 10);
        return;
    }

    // (Generation logic follows...)

    चरसंख्या = Math.floor(Math.random() * 3) + 4; // 4 to 6 vars

    if (चरसंख्या == 4) {
        चरसरणी = ['A', 'B', 'C', 'D'];
    } else if (चरसंख्या == 5) {
        चरसरणी = ['A', 'B', 'C', 'D', 'E'];
    } else if (चरसंख्या == 6) {
        चरसरणी = ['A', 'B', 'C', 'D', 'E', 'F'];
    } else {
        चरसरणी = ['A', 'B', 'C'];
    }

    let numTerms = Math.floor(Math.random() * 4) + 3; // 3 to 6 terms

    // Generate Equation via Prabandhaka master orchestrator
    if (typeof window !== "undefined" && window.प्रबन्धक && typeof window.प्रबन्धक.समीकरण_जननम् === "function") {
        let जनितम् = window.प्रबन्धक.समीकरण_जननम्({
            प्रारूप: चितप्रारूपम्,
            चरसंख्या: चरसंख्या,
            चरसरणी: चरसरणी,
            पदसंख्या: numTerms
        });
        if (जनितम् && जनितम्.समीकरणम्) {
            चरसरणी = जनितम्.चरसरणी || चरसरणी;
            द्विमीयसमीकरणम् = जनितम्.समीकरणम्;
        }
    }
    
    if (!द्विमीयसमीकरणम्) {
        // Fallback generation logic
        let isSOP = (चितप्रारूपम् === "SOP");
        let formatCode = isSOP ? 1 : 0;
        let randomArr = window.यादृच्छिक_सूचि_निर्माण(चरसंख्या, 0, 1, (चितप्रारूपम् === "ANY" ? null : चितप्रारूपम्), numTerms);
        if (typeof window.सारणीतः_सूत्रम् === "function") {
            द्विमीयसमीकरणम् = window.सारणीतः_सूत्रम्(randomArr, चरसरणी, formatCode);
        } else if (typeof window.सूचितः_सूत्रम् === "function") {
            द्विमीयसमीकरणम् = window.सूचितः_सूत्रम्(randomArr, चरसरणी);
        }
    }

    सूत्रप्रदर्शनम्.value = द्विमीयसमीकरणम्;
});

/**
 * Converts a 2D array representation of a boolean expression into a string equation.
 * Maps 0 to complemented variable (e.g., A'), 1 to normal variable (e.g., A), and 2 to missing variable.
 * @param {Array} द्विमीयपदम् - 2D array representing the terms.
 * @returns {string} The formatted boolean equation as a string.
 */
function नामरूपान्तरणम्(द्विमीयपदम्) {
    द्विमीयसमीकरणम् = "";
    let अस्थायी = ""; // Added declaration

    for (let र = 0; र < द्विमीयपदम्.length; र++) {
        for (let स = 0; स < द्विमीयपदम्[र].length; स++) {
            if (द्विमीयपदम्[र][स] == 0) {
                अस्थायी = चरसरणी[स] + "'";
            } else if (द्विमीयपदम्[र][स] == 1) {
                अस्थायी = चरसरणी[स];
            } else if (द्विमीयपदम्[र][स] == 2) {
                अस्थायी = "";
            } else {
                throw new Error("Error in generating equation");
            }
            if (चितप्रारूपम् == "SOP") {
                if (स < द्विमीयपदम्[र].length - 1) {
                    द्विमीयसमीकरणम् = द्विमीयसमीकरणम् + "." + अस्थायी;
                } else {
                    द्विमीयसमीकरणम् = द्विमीयसमीकरणम् + अस्थायी;
                }
            } else if (चितप्रारूपम् == "POS") {
                if (स < द्विमीयपदम्[र].length - 1) {
                    द्विमीयसमीकरणम् = द्विमीयसमीकरणम् + "." + अस्थायी;
                } else {
                    द्विमीयसमीकरणम् = द्विमीयसमीकरणम् + अस्थायी;
                }
            }
        }
        if (र != द्विमीयपदम्.length - 1) {
            if (चितप्रारूपम् == "SOP") {
                द्विमीयसमीकरणम् += "+";
            } else if (चितप्रारूपम् == "POS") {
                द्विमीयसमीकरणम् += ".";
            }
        }
    }
    return द्विमीयसमीकरणम्;
}

/**
 * Removes duplicate terms from the 2D array representation of the equation.
 * @param {Array} द्विमीयपदम् - 2D array representing the terms.
 * @returns {Array} The unique set of terms.
 */
function पुनरावृत्तिनिवारणम्(द्विमीयपदम्) {
    for (let र = 0; र < द्विमीयपदम्.length; र++) {
        let प = द्विमीयपदम्[र].join("");
        for (let स = र + 1; स < द्विमीयपदम्.length; स++) {
            let द = द्विमीयपदम्[स].join("");
            if (द == प) {
                द्विमीयपदम्.splice(स, 1);
                स--;
            }
        }
    }
    return द्विमीयपदम्;
}

document.getElementById("बन्धन-गुण्डिका").addEventListener("click", function () {
    लक्ष्यप्रारूपम् = लक्ष्यप्रारूपविकल्पः.value;

    // Reset borders
    लक्ष्यप्रारूपविकल्पः.style.border = "";
    सूत्रप्रदर्शनम्.style.border = "";

    if (लक्ष्यप्रारूपम् === "select") {
        लक्ष्यप्रारूपविकल्पः.style.border = "2px solid red";
        setTimeout(() => alert("Please select the target format before locking!"), 10);
        return;
    }

    // Toggle lock logic
    let lockIcon = this.querySelector('i');
    if (lockIcon && lockIcon.classList.contains('fa-unlock')) {
        let eqValue = सूत्रप्रदर्शनम्.value.trim();
        let isImproper = false;

        if (!eqValue) isImproper = true;
        if (/[^A-Fa-f\+\.\'\(\)\s]/.test(eqValue)) isImproper = true;
        if (/[\+\.]{2,}/.test(eqValue)) isImproper = true;

        let extractedInEq = Array.from(new Set(eqValue.match(/[A-Fa-f]/g) || [])).map(c => c.toUpperCase()).sort();
        let maxChar = extractedInEq.length ? extractedInEq[extractedInEq.length - 1] : 'D';
        let neededCount = Math.max(चरसंख्या || 4, maxChar.charCodeAt(0) - 65 + 1);
        let allowedVars = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, Math.min(neededCount, 6));

        // Sync चरसरणी and चरसंख्या
        if (!Array.isArray(चरसरणी) || चरसरणी.length < allowedVars.length) {
            चरसरणी = allowedVars;
            चरसंख्या = allowedVars.length;
        }

        for (let i = 0; i < eqValue.length; i++) {
            let char = eqValue[i].toUpperCase();
            if (char >= 'A' && char <= 'F') {
                if (!allowedVars.includes(char)) {
                    isImproper = true;
                    break;
                }
            }
        }

        let openParens = 0;
        for (let i = 0; i < eqValue.length; i++) {
            if (eqValue[i] === '(') openParens++;
            if (eqValue[i] === ')') openParens--;
            if (openParens < 0) { isImproper = true; break; }
        }
        if (openParens !== 0) isImproper = true;

        if (isImproper) {
            सूत्रप्रदर्शनम्.style.border = "2px solid red";
            सूत्रप्रदर्शनम्.readOnly = false;
            setTimeout(() => alert("The equation is improper. Please correct it before locking!"), 10);
            return;
        }

        this.innerHTML = '<i class="fas fa-lock"></i> Locked';
        this.style.backgroundColor = "rgba(220, 53, 69, 0.8)";
        this.disabled = true;
        प्रारूपविकल्पः.disabled = true;
        लक्ष्यप्रारूपविकल्पः.disabled = true;
        सूत्रप्रदर्शनम्.readOnly = true;

        document.getElementById("step-section").style.display = "flex";
        document.getElementById("control-section").style.display = "block";

        let padPatram = document.getElementById("पद-पात्रम्");
        padPatram.innerHTML = '';
        createNewRow(padPatram);
    }
});

/**
 * Expands a single 1D term that contains missing variables (represented by 2) 
 * into all its corresponding full minterms.
 * @param {Array} द्विमीयपदम् - 1D array representing a single term.
 * @returns {Array} Expanded terms replacing missing variables with 0s and 1s.
 */
function पूर्णएकायामनिर्माणम्(द्विमीयपदम्) {
    let प्राप्तसाम्यम् = 0;
    let द्विरुक्तद्विमीयपदम् = [[], []];
    for (let र = 0; र < द्विमीयपदम्.length; र++) {
        if (द्विमीयपदम्[र] == 2) {
            प्राप्तसाम्यम् = 1;
            break;
        }
    }
    if (प्राप्तसाम्यम् == 0) {
        return द्विमीयपदम्;
    } else {
        द्विरुक्तद्विमीयपदम्[0] = [];
        द्विरुक्तद्विमीयपदम्[1] = [];
        for (let र = 0; र < द्विमीयपदम्.length; र++) {
            द्विरुक्तद्विमीयपदम्[0][र] = द्विमीयपदम्[र];
            द्विरुक्तद्विमीयपदम्[1][र] = द्विमीयपदम्[र];
        }
        return पूर्णद्विमीयनिर्माणम्(द्विरुक्तद्विमीयपदम्);
    }
}

/**
 * Expands the entire 2D equation into its standard Sum of Products (SOP) form.
 * Replaces all missing variables (2s) in every term with both 0 and 1 recursively,
 * and removes duplicate expanded terms.
 * @param {Array} द्विमीयपदम् - 2D array representing the boolean equation.
 * @returns {Array} 2D array of the fully expanded minterms.
 */
function पूर्णद्विमीयनिर्माणम्(द्विमीयपदम्) {
    let द्विरुक्तद्विमीयपदम् = [];
    for (let र = 0; र < द्विमीयपदम्.length; र++) {
        द्विरुक्तद्विमीयपदम्[र] = [];
        for (let स = 0; स < द्विमीयपदम्[र].length; स++) {
            द्विरुक्तद्विमीयपदम्[र][स] = द्विमीयपदम्[र][स];
        }
    }
    for (let र = 0; र < द्विरुक्तद्विमीयपदम्.length; र++) {
        for (let स = 0; स < द्विरुक्तद्विमीयपदम्[र].length; स++) {
            if (द्विरुक्तद्विमीयपदम्[र][स] == 2) {
                let अस्थायीद्विमीयपदम्_1 = [];
                let अस्थायीद्विमीयपदम्_2 = [];
                for (let प = 0; प < द्विरुक्तद्विमीयपदम्[र].length; प++) {
                    अस्थायीद्विमीयपदम्_1[प] = द्विरुक्तद्विमीयपदम्[र][प];
                    अस्थायीद्विमीयपदम्_2[प] = द्विरुक्तद्विमीयपदम्[र][प];
                }
                अस्थायीद्विमीयपदम्_1[स] = 1;
                द्विरुक्तद्विमीयपदम्.push(अस्थायीद्विमीयपदम्_1);
                अस्थायीद्विमीयपदम्_2[स] = 0;
                द्विरुक्तद्विमीयपदम्.push(अस्थायीद्विमीयपदम्_2);
                break;
            }
        }
    }
    for (let र = 0; र < द्विरुक्तद्विमीयपदम्.length; र++) {
        for (let स = 0; स < द्विरुक्तद्विमीयपदम्[र].length; स++) {
            if (द्विरुक्तद्विमीयपदम्[र][स] == 2) {
                द्विरुक्तद्विमीयपदम्.splice(र, 1);
                र--;
                break;
            }
        }
    }
    for (let र = 0; र < द्विरुक्तद्विमीयपदम्.length; र++) {
        let प = द्विरुक्तद्विमीयपदम्[र].join("");
        for (let स = र + 1; स < द्विरुक्तद्विमीयपदम्.length; स++) {
            let द = द्विरुक्तद्विमीयपदम्[स].join("");
            if (द == प) {
                द्विरुक्तद्विमीयपदम्.splice(स, 1);
                स--;
            }
        }
    }
    return द्विरुक्तद्विमीयपदम्;
}

/**
 * Converts the fully expanded binary terms into their decimal minterm values.
 * @param {Array} पूर्णद्विमीयसमीकरणम् - 2D array of fully expanded binary minterms.
 * @returns {Array} Array of integer minterms.
 */
function लघुतमपदानिनिर्माणम्(पूर्णद्विमीयसमीकरणम्) {
    let लघुतमपदानि = []; // Added declaration locally
    for (let र = 0; र < पूर्णद्विमीयसमीकरणम्.length; र++) { // Added let
        लघुतमपदानि.push(parseInt(पूर्णद्विमीयसमीकरणम्[र].join(""), 2));
    }
    return लघुतमपदानि;
}

/**
 * Applies the Quine-McCluskey (Tabulation) method to simplify the boolean expression.
 * Iteratively compares terms and groups those that differ by exactly one bit, 
 * replacing the differing bit with a 'don't care' (2).
 * @param {Array} द्विमीयपदम् - 2D array of terms.
 * @returns {Array} The prime implicants after grouping.
 */
function एकपरिवर्तनपरीक्षणम्(द्विमीयपदम्) {
    let भेदसूची = [];
    let द्विरुक्तद्विमीयपदम् = [];
    let प्राप्तसाम्यम् = 1;
    let भेदः = 0;
    let भेदस्थानम् = 0;

    for (let र = 0; र < द्विमीयपदम्.length; र++) {
        द्विरुक्तद्विमीयपदम्[र] = [];
        for (let स = 0; स < द्विमीयपदम्[र].length; स++) {
            द्विरुक्तद्विमीयपदम्[र][स] = द्विमीयपदम्[र][स];
        }
    }

    while (प्राप्तसाम्यम् == 1) {
        let अस्थायीद्विमीयपदम् = [];
        भेदसूची = [];
        for (let र = 0; र < द्विरुक्तद्विमीयपदम्.length; र++) {
            for (let स = र + 1; स < द्विरुक्तद्विमीयपदम्.length; स++) {
                भेदः = 0;
                let अस्थायीपदम् = [];
                for (let प = 0; प < द्विरुक्तद्विमीयपदम्[र].length; प++) {
                    अस्थायीपदम्[प] = द्विरुक्तद्विमीयपदम्[र][प];
                    if (द्विरुक्तद्विमीयपदम्[र][प] !== द्विरुक्तद्विमीयपदम्[स][प]) {
                        भेदः++;
                        भेदस्थानम् = प;
                        if (भेदः > 1) {
                            break;
                        }
                    }
                }
                if (भेदः == 1) {
                    भेदसूची.push(र);
                    भेदसूची.push(स);
                    अस्थायीपदम्[भेदस्थानम्] = 2;
                    अस्थायीद्विमीयपदम्.push([...अस्थायीपदम्]);
                }
            }
        }

        if (भेदसूची.length == 0) {
            प्राप्तसाम्यम् = 0;
        } else {
            प्राप्तसाम्यम् = 1;
        }

        भेदसूची.sort((प, द) => द - प);
        // Remove duplicates using Set, then sort descending
        let अद्वितीयभेदसूची = [...new Set(भेदसूची)].sort((प, द) => द - प);
        for (let र = 0; र < अद्वितीयभेदसूची.length; र++) {
            द्विरुक्तद्विमीयपदम्.splice(अद्वितीयभेदसूची[र], 1);
        }

        द्विरुक्तद्विमीयपदम्.push(...अस्थायीद्विमीयपदम्);
        अस्थायीद्विमीयपदम् = [];

        for (let र = 0; र < द्विरुक्तद्विमीयपदम्.length; र++) {
            let प = द्विरुक्तद्विमीयपदम्[र].join("");
            for (let स = र + 1; स < द्विरुक्तद्विमीयपदम्.length; स++) {
                let द = द्विरुक्तद्विमीयपदम्[स].join("");
                if (द == प) {
                    द्विरुक्तद्विमीयपदम्.splice(स, 1);
                    स--;
                }
            }
        }
    }
    return द्विरुक्तद्विमीयपदम्;
}

/**
 * Implements the Prime Implicant Chart selection step of the Quine-McCluskey method.
 * Selects the essential and minimal prime implicants required to cover all minterms.
 * @param {Array} द्विमीयपदम् - 2D array of prime implicants.
 * @param {Array} लघुतमपदानि - Array of required minterms to cover.
 * @returns {Array} The final minimized boolean expression in 2D array format.
 */
function पूर्णफलसमीकरणनिर्माणम्(द्विमीयपदम्, लघुतमपदानि) {
    let एकफलपूर्णसमीकरणम् = [];
    let द्विमीयफलम् = [];
    let अस्थायीएकफलपूर्णसमीकरणम् = [];
    let द्विरुक्तलघुतमपदानि = [...लघुतमपदानि];
    let द्विरुक्तद्विमीयपदम् = [...द्विमीयपदम्];
    let द्विमीयएकफलपूर्णसमीकरणम् = [];

    for (let र = 0; र < द्विरुक्तद्विमीयपदम्.length; र++) {
        अस्थायीएकफलपूर्णसमीकरणम् = पूर्णएकायामनिर्माणम्(द्विरुक्तद्विमीयपदम्[र]);
        द्विमीयएकफलपूर्णसमीकरणम्[र] = [];
        एकफलपूर्णसमीकरणम्[र] = 0;

        if (Array.isArray(अस्थायीएकफलपूर्णसमीकरणम्[0])) {
            for (let स = 0; स < अस्थायीएकफलपूर्णसमीकरणम्.length; स++) {
                for (let म = 0; म < लघुतमपदानि.length; म++) {
                    if (parseInt(अस्थायीएकफलपूर्णसमीकरणम्[स].join(""), 2) == लघुतमपदानि[म]) {
                        द्विमीयएकफलपूर्णसमीकरणम्[र].push(parseInt(अस्थायीएकफलपूर्णसमीकरणम्[स].join(""), 2));
                        एकफलपूर्णसमीकरणम्[र]++;
                    }
                }
            }
        } else {
            if (Array.isArray(लघुतमपदानि)) {
                for (let म = 0; म < लघुतमपदानि.length; म++) {
                    if (parseInt(अस्थायीएकफलपूर्णसमीकरणम्.join(""), 2) == लघुतमपदानि[म]) {
                        द्विमीयएकफलपूर्णसमीकरणम्[र].push(parseInt(अस्थायीएकफलपूर्णसमीकरणम्.join(""), 2));
                        एकफलपूर्णसमीकरणम्[र]++;
                    }
                }
            } else {
                if (parseInt(अस्थायीएकफलपूर्णसमीकरणम्.join(""), 2) == लघुतमपदानि) {
                    द्विमीयएकफलपूर्णसमीकरणम्[र].push(parseInt(अस्थायीएकफलपूर्णसमीकरणम्.join(""), 2));
                    एकफलपूर्णसमीकरणम्[र]++;
                }
            }
        }
    }

    while (द्विरुक्तलघुतमपदानि.length > 0) {
        let अत्यधिकदीर्घता = 0;
        let अतिविशालः = -1;

        for (let र = 0; र < एकफलपूर्णसमीकरणम्.length; र++) {
            if (एकफलपूर्णसमीकरणम्[र] > अत्यधिकदीर्घता) {
                अत्यधिकदीर्घता = एकफलपूर्णसमीकरणम्[र];
                अतिविशालः = र;
            }
        }

        if (अतिविशालः == -1 || अत्यधिकदीर्घता == 0) break;

        for (let स = 0; स < द्विमीयएकफलपूर्णसमीकरणम्[अतिविशालः]; स++) {
            for (let द = 0; द < द्विरुक्तलघुतमपदानि.length; द++) {
                if (द्विरुक्तलघुतमपदानि[द] == द्विमीयएकफलपूर्णसमीकरणम्[अतिविशालः][स]) {
                    द्विरुक्तलघुतमपदानि.splice(द, 1);
                    द--;
                }
            }
        }

        if (Array.isArray(द्विमीयएकफलपूर्णसमीकरणम्[अतिविशालः])) {
            for (let स = 0; स < द्विमीयएकफलपूर्णसमीकरणम्[अतिविशालः].length; स++) {
                for (let र = 0; र < द्विमीयएकफलपूर्णसमीकरणम्.length; र++) {
                    for (let द = 0; द < द्विमीयएकफलपूर्णसमीकरणम्[र].length && र != अतिविशालः; द++) {
                        if (द्विमीयएकफलपूर्णसमीकरणम्[र][द] == द्विमीयएकफलपूर्णसमीकरणम्[अतिविशालः][स]) {
                            द्विमीयएकफलपूर्णसमीकरणम्[र].splice(द, 1);
                            द--;
                            break;
                        }
                    }
                }
            }
        } else {
            if (अतिविशालः != 0) {
                console.warn("Algorithmic edge case met: अतिविशालः logic fallback executed.");
            } else {
                द्विमीयफलम्.push(द्विरुक्तद्विमीयपदम्[अतिविशालः]);
                break;
            }
        }

        एकफलपूर्णसमीकरणम्[अतिविशालः] = 0;
        द्विमीयफलम्.push(द्विरुक्तद्विमीयपदम्[अतिविशालः]);
        द्विरुक्तद्विमीयपदम्.splice(अतिविशालः, 1);
        एकफलपूर्णसमीकरणम्.splice(अतिविशालः, 1);
        द्विमीयएकफलपूर्णसमीकरणम्.splice(अतिविशालः, 1);
    }
    return द्विमीयफलम्;
}

document.getElementById("परीक्षण-गुण्डिका").addEventListener("click", function () {
    if (this.innerText.includes("Next Problem")) {
        document.getElementById("चालन-गुण्डिका").click();
        this.innerHTML = '<i class="fas fa-check-circle"></i> Check Result';
        document.getElementById("संकेत-गुण्डिका").disabled = false;

        document.getElementById("step-section").style.display = "none";
        document.getElementById("control-section").style.display = "none";

        let lockBtn = document.getElementById("बन्धन-गुण्डिका");
        lockBtn.disabled = false;
        lockBtn.innerHTML = '<i class="fas fa-unlock"></i> Lock';

        document.getElementById("परिणाम-प्रमाणीकरणम्").innerText = "";
        return;
    }

    const परिणामसन्देशः = document.getElementById("परिणाम-प्रमाणीकरणम्");

    let verifiedInputs = document.querySelectorAll('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type:disabled');
    let firstInput = document.querySelector('#पद-पात्रम् .तर्क-पङ्क्तिः input:first-of-type');

    let beforeRowEq = document.getElementById("सङ्ख्या-प्रदर्शनम्").value.replace(/\s+/g, '');
    let currentRowEq = "";

    if (verifiedInputs.length > 0) {
        currentRowEq = verifiedInputs[verifiedInputs.length - 1].value.replace(/\s+/g, '');
    } else if (firstInput && firstInput.value.trim() !== "") {
        currentRowEq = firstInput.value.replace(/\s+/g, '');
    } else {
        // If the generated equation is already fully simplified, currentRowEq is beforeRowEq
        currentRowEq = beforeRowEq;
    }

    try {
        let combined = beforeRowEq + currentRowEq;
        let extracted = Array.from(new Set(combined.match(/[A-Z]/g) || [])).sort();
        let activeVars = (Array.isArray(चरसरणी) && चरसरणी.length >= extracted.length && extracted.every(v => चरसरणी.includes(v)))
            ? चरसरणी
            : (extracted.length > 0 ? extracted : ['A', 'B', 'C', 'D']);

        let a_string = window.सूत्र_विभाजन(beforeRowEq);
        let b_string = window.सूत्र_विभाजन(currentRowEq);

        let a_ast = window.सत्यता_सारणी_प्रारंभ(a_string, activeVars);
        let b_ast = window.सत्यता_सारणी_प्रारंभ(b_string, activeVars);

        let a_simplified = window.सूत्र_सरलीकरणम्(a_ast);
        let b_simplified = window.सूत्र_सरलीकरणम्(b_ast);

        if (JSON.stringify(a_simplified) === JSON.stringify(b_ast)) {
            परिणामसन्देशः.innerText = "successfully simplified";
            document.getElementById("परीक्षण-गुण्डिका").innerText = "Next Problem";
            document.getElementById("संकेत-गुण्डिका").disabled = true;
        } else if (JSON.stringify(a_simplified) === JSON.stringify(b_simplified)) {
            परिणामसन्देशः.innerText = "further simplification exists";
        } else {
            परिणामसन्देशः.innerText = "Wrong answer";
        }
    } catch (e) {
        console.error(e);
        परिणामसन्देशः.innerText = "Wrong characters in output or invalid syntax";
    }
});

document.getElementById("संकेत-गुण्डिका").addEventListener("click", function () {
    const परिणामसन्देशः = document.getElementById("परिणाम-प्रमाणीकरणम्");

    // The hint should be based on the latest valid/verified state:
    // If there is a verified (disabled) step row, use the latest verified one.
    // If no row is verified, use the original equation in #सङ्ख्या-प्रदर्शनम्.
    // However, if the current row has a fully valid expression, we can use it.
    let expr = "";
    let stepRows = document.querySelectorAll('#पद-पात्रम् .तर्क-पङ्क्तिः');
    let latestVerifiedExpr = "";

    for (let i = 0; i < stepRows.length; i++) {
        let input = stepRows[i].querySelector('input:first-of-type');
        if (input && input.disabled && input.value.trim()) {
            latestVerifiedExpr = input.value.replace(/\s+/g, '');
        }
    }

    if (latestVerifiedExpr) {
        expr = latestVerifiedExpr;
    } else {
        expr = document.getElementById("सङ्ख्या-प्रदर्शनम्").value.replace(/\s+/g, '');
    }

    if (!expr) {
        परिणामसन्देशः.innerText = "No expression found.";
        return;
    }

    try {
        // Automatically determine variables from the active expression to guarantee safety
        let extractedVars = Array.from(new Set(expr.match(/[A-Z]/g) || [])).sort();
        let activeVars = (Array.isArray(चरसरणी) && चरसरणी.length >= extractedVars.length && extractedVars.every(v => चरसरणी.includes(v)))
            ? चरसरणी
            : (extractedVars.length > 0 ? extractedVars : ['A', 'B', 'C', 'D']);

        // Update global चरसरणी and चरसंख्या if uninitialized or smaller
        if (!Array.isArray(चरसरणी) || चरसरणी.length < activeVars.length) {
            चरसरणी = activeVars;
            चरसंख्या = activeVars.length;
        }

        let expr_string = window.सूत्र_विभाजन(expr);
        let ast = window.सत्यता_सारणी_प्रारंभ(expr_string, activeVars);

        // 1. Try prabandhaka anveshana to find applicable rule and next step
        let step = null;
        if (typeof window !== "undefined" && window.प्रबन्धक && typeof window.प्रबन्धक.पद_चालनम् === "function") {
            try {
                let fmt = (typeof चितप्रारूपम् !== "undefined" && चितप्रारूपम् && चितप्रारूपम् !== "select") ? चितप्रारूपम् : "SOP";
                step = window.प्रबन्धक.पद_चालनम्(ast, { प्रारूप: fmt });
            } catch (e) {
                console.warn("Prabandhaka step search error:", e);
            }
        }

        let identified = null;
        if (window.सूत्र_अभिज्ञानम्) {
            try {
                identified = window.सूत्र_अभिज्ञानम्(ast);
            } catch (e) {
                console.warn("सूत्र_अभिज्ञानम् error:", e);
            }
        }

        function formatTerms(terms, op) {
            if (!terms || !terms.length) return "";
            let termsStrs = terms.map(t => {
                let isLeaf = true;
                for (let i = 0; i < t.length; i++) {
                    if (typeof t[i] !== 'number') { isLeaf = false; break; }
                }
                let str = isLeaf ? window.सारणीतः_सूत्रम्([(op === 0 || op === 2) ? 1 : 0, t], activeVars) : window.सारणीतः_सूत्रम्(t, activeVars);
                if (str.startsWith('(') && str.endsWith(')')) str = str.substring(1, str.length - 1);
                return str;
            });
            return termsStrs.join(", ");
        }

        if (step && step.नियम) {
            let nextExpr = "";
            try {
                if (typeof window.सूचितः_सूत्रम् === "function") {
                    nextExpr = window.सूचितः_सूत्रम्(step.नव_ast, activeVars);
                } else if (typeof window.सारणीतः_सूत्रम् === "function") {
                    nextExpr = window.सारणीतः_सूत्रम्(step.नव_ast, activeVars);
                }
            } catch (e) {
                console.warn("Next expression format error:", e);
            }

            let termStr = "";
            if (identified && identified.terms && identified.terms.length > 0) {
                termStr = formatTerms(identified.terms, identified.op);
            }

            if (termStr) {
                let nextStr = nextExpr ? ` -> Next: ${nextExpr}` : "";
                परिणामसन्देशः.innerText = `Hint: Focus on the terms [ ${termStr} ] using ${step.नियम.नाम} (${step.नियम.समीकरण})${nextStr}`;
            } else {
                let nextStr = nextExpr ? ` -> Next: ${nextExpr}` : "";
                परिणामसन्देशः.innerText = `Hint: Apply ${step.नियम.नाम} (${step.नियम.समीकरण})${nextStr}`;
            }
        } else if (identified && identified.terms && identified.terms.length > 0) {
            let termStr = formatTerms(identified.terms, identified.op);
            परिणामसन्देशः.innerText = `Hint: Focus on the terms [ ${termStr} ]`;
        } else {
            let simplified = window.सूत्र_सरलीकरणम् ? window.सूत्र_सरलीकरणम्(ast) : ast;
            if (JSON.stringify(simplified) === JSON.stringify(ast)) {
                परिणामसन्देशः.innerText = "Equation is already fully simplified.";
            } else {
                परिणामसन्देशः.innerText = "Further simplification is possible.";
            }
        }
    } catch (e) {
        console.error("Hint Generation Error:", e);
        परिणामसन्देशः.innerText = "Invalid syntax for hint generation: " + (e.message || e);
    }
});



// You can then add logic based on these values
if (चितप्रारूपम् === "SOP") {
    // Generate SOP equation
    // द्विमीयसमीकरणम् = नामरूपान्तरणम्(द्विमीयपदम्);
} else if (चितप्रारूपम् === "POS") {
    // Generate POS equation
    // द्विमीयसमीकरणम् = नामरूपान्तरणम्_POS(द्विमीयपदम्);
}
