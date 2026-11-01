document.addEventListener('DOMContentLoaded', () => {
    const विभाजकः = document.getElementById('विभाजकः');
    const वामखण्डः = document.getElementById('वामखण्डः');
    let अस्तिविभाजनम् = false;

    // Resizer logic
    विभाजकः.addEventListener('mousedown', (घटना) => {
        अस्तिविभाजनम् = true;
        document.body.style.cursor = 'col-resize';
        विभाजकः.classList.add('sajje');
        घटना.preventDefault();
    });

    document.addEventListener('mousemove', (घटना) => {
        if (!अस्तिविभाजनम्) return;
        let वामविस्तारः = घटना.clientX;
        if (वामविस्तारः < 25) वामविस्तारः = 25;
        const maxCSS = window.getComputedStyle(वामखण्डः).maxWidth;
        let परमन्तः = parseFloat(maxCSS);
        if (isNaN(परमन्तः)) {
            परमन्तः = window.innerWidth * 0.3;
        }
        if (वामविस्तारः > परमन्तः) वामविस्तारः = परमन्तः;
        वामखण्डः.style.width = `${वामविस्तारः}px`;
    });

    document.addEventListener('mouseup', () => {
        अस्तिविभाजनम् = false;
        document.body.style.cursor = 'default';
        विभाजकः.classList.remove('sajje');
    });

    // Data Model
    const सङ्केतदत्तांशः = [];

    // Dialog logic
    const सङ्केतयोजना = document.getElementById('सङ्केतयोजना');
    const आवरणम् = document.getElementById('आवरणम्');
    const त्यजकः = document.getElementById('त्यजकः');
    const स्थापकः = document.getElementById('स्थापकः');
    
    // Open Dialog
    सङ्केतयोजना.addEventListener('click', () => {
        आवरणम्.style.display = 'flex';
    });

    // Close Dialog on Cancel
    त्यजकः.addEventListener('click', () => {
        आवरणम्.style.display = 'none';
    });

    // Handle Add Signal
    स्थापकः.addEventListener('click', () => {
        const नाम = document.getElementById('सङ्केतनाम').value || 'UNNAMED';
        const विस्तारः = parseInt(document.getElementById('सङ्केतविस्तारः').value) || 1;
        const मूलम् = document.getElementById('सङ्केतमूलम्').value;
        const आयामः = parseInt(document.getElementById('तरङ्गायामः').value) || 10;
        
        const नवीनसङ्केतः = {
            id: 'sig_' + सङ्केतदत्तांशः.length,
            name: नाम,
            width: विस्तारः,
            radix: मूलम्,
            pieces: [{ start: 0, end: आयामः, value: '0' }]
        };
        सङ्केतदत्तांशः.push(नवीनसङ्केतः);
        
        आवरणम्.style.display = 'none';
        document.getElementById('सङ्केतनाम').value = '';
        
        सङ्केतपुनःलेखनम्();
    });

    // Edit Logic
    let वर्तमानसम्पाद्यसङ्केतसूचकः = -1;
    let वर्तमानसम्पाद्यखण्डसूचकः = -1;
    
    window['सम्पादनसंवादमुद्घाटय'] = function(सङ्केतसूचकः, खण्डसूचकः) {
        वर्तमानसम्पाद्यसङ्केतसूचकः = सङ्केतसूचकः;
        वर्तमानसम्पाद्यखण्डसूचकः = खण्डसूचकः;
        const सङ्केतः = सङ्केतदत्तांशः[सङ्केतसूचकः];
        const खण्डः = सङ्केतः.pieces[खण्डसूचकः];
        
        document.getElementById('खण्डसङ्केतनाम').textContent = सङ्केतः.name;
        document.getElementById('खण्डआरम्भः').value = खण्डः.start;
        document.getElementById('खण्डअन्तः').value = खण्डः.end;
        
        if (सङ्केतः.width === 1) {
            document.getElementById('खण्डमूल्यक्षेत्रम्१बिट्').style.display = 'flex';
            document.getElementById('खण्डमूल्यक्षेत्रम्बहुबिट्').style.display = 'none';
            document.getElementById('खण्डमूल्यचयनम्').value = खण्डः.value.toLowerCase();
        } else {
            document.getElementById('खण्डमूल्यक्षेत्रम्१बिट्').style.display = 'none';
            document.getElementById('खण्डमूल्यक्षेत्रम्बहुबिट्').style.display = 'flex';
            document.getElementById('खण्डमूल्यनिवेशनम्').value = खण्डः.value;
        }
        
        document.getElementById('खण्डआवरणम्').style.display = 'flex';
    };
    
    document.getElementById('खण्डत्यजकः').addEventListener('click', () => {
        document.getElementById('खण्डआवरणम्').style.display = 'none';
    });
    
    document.getElementById('खण्डस्थापकः').addEventListener('click', () => {
        const सङ्केतः = सङ्केतदत्तांशः[वर्तमानसम्पाद्यसङ्केतसूचकः];
        const पुरातनखण्डः = सङ्केतः.pieces[वर्तमानसम्पाद्यखण्डसूचकः];
        
        const नवीनआरम्भः = parseFloat(document.getElementById('खण्डआरम्भः').value);
        const नवीनअन्तः = parseFloat(document.getElementById('खण्डअन्तः').value);
        let नवीनमूल्यम् = (सङ्केतः.width === 1) ? document.getElementById('खण्डमूल्यचयनम्').value : document.getElementById('खण्डमूल्यनिवेशनम्').value;
        
        if ( नवीनआरम्भः >= नवीनअन्तः) {
            alert('End time must be greater than start time.');
            return;
        }

        // 1. Remove the old piece
        सङ्केतः.pieces.splice(वर्तमानसम्पाद्यखण्डसूचकः, 1);
        
        // 2. Identify the gaps left behind by moving/shrinking the old piece
        const योज्यखण्डाः = [];
        
        // Gap before the new piece
        if (पुरातनखण्डः.start < नवीनआरम्भः) {
            योज्यखण्डाः.push({
                start: पुरातनखण्डः.start,
                end: Math.min(नवीनआरम्भः, पुरातनखण्डः.end),
                value: पुरातनखण्डः.value
            });
        }
        // Gap after the new piece
        if (पुरातनखण्डः.end > नवीनअन्तः) {
            योज्यखण्डाः.push({
                start: Math.max(नवीनअन्तः, पुरातनखण्डः.start),
                end: पुरातनखण्डः.end,
                value: पुरातनखण्डः.value
            });
        }
        
        // The new piece itself
        योज्यखण्डाः.push({ start: नवीनआरम्भः, end: नवीनअन्तः, value: नवीनमूल्यम् });
        
        // 3. Apply योज्यखण्डाः onto the remaining pieces (overwriting logic)
        for (const वस्तु of योज्यखण्डाः) {
            const अस्थायिखण्डाः = [];
            for (const ख of सङ्केतः.pieces) {
                if (ख.end <= वस्तु.start || ख.start >= वस्तु.end) {
                    अस्थायिखण्डाः.push(ख);
                } else {
                    if (ख.start < वस्तु.start) {
                        अस्थायिखण्डाः.push({ start: ख.start, end: वस्तु.start, value: ख.value });
                    }
                    if (ख.end > वस्तु.end) {
                        अस्थायिखण्डाः.push({ start: वस्तु.end, end: ख.end, value: ख.value });
                    }
                }
            }
            अस्थायिखण्डाः.push(वस्तु);
            सङ्केतः.pieces = अस्थायिखण्डाः;
        }
        
        // 4. Sort and merge identical adjacent pieces
        सङ्केतः.pieces.sort((क, ख) => क.start - ख.start);
        
        const मिलितखण्डाः = [];
        for (let सूचक = 0; सूचक < सङ्केतः.pieces.length; सूचक++) {
            if (मिलितखण्डाः.length === 0) {
                मिलितखण्डाः.push(सङ्केतः.pieces[सूचक]);
            } else {
                const अन्तिमः = मिलितखण्डाः[मिलितखण्डाः.length - 1];
                if (अन्तिमः.end === सङ्केतः.pieces[सूचक].start && अन्तिमः.value === सङ्केतः.pieces[सूचक].value) {
                    अन्तिमः.end = सङ्केतः.pieces[सूचक].end;
                } else {
                    मिलितखण्डाः.push(सङ्केतः.pieces[सूचक]);
                }
            }
        }
        
        सङ्केतः.pieces = मिलितखण्डाः;
        document.getElementById('खण्डआवरणम्').style.display = 'none';
        सङ्केतपुनःलेखनम्();
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (घटना) => {
        // Ignore if user is typing in an input field
        if (घटना.target.tagName === 'INPUT' || घटना.target.tagName === 'SELECT') {
            return;
        }
        
        if (घटना.key === 'a' || घटना.key === 'A') {
            घटना.preventDefault();
            आवरणम्.style.display = 'flex';
        } else if (घटना.key === 'd' || घटना.key === 'D') {
            if (स्पृष्टसङ्केतसूचकः !== -1 && स्पृष्टखण्डसूचकः !== -1) {
                घटना.preventDefault();
                window['सम्पादनसंवादमुद्घाटय'](स्पृष्टसङ्केतसूचकः, स्पृष्टखण्डसूचकः);
            }
        } else if (घटना.key === 'f' || घटना.key === 'F') {
            घटना.preventDefault();
            document.getElementById('दृश्यसमम्').click();
        } else if ((घटना.key === 'z' || घटना.key === 'Z') && घटना.ctrlKey) {
            घटना.preventDefault();
            document.getElementById('सङ्कोचः').click();
        } else if ((घटना.key === 'z' || घटना.key === 'Z') && !घटना.ctrlKey) {
            घटना.preventDefault();
            document.getElementById('वर्धनम्').click();
        }
    });

    // Synchronize Vertical Scrolling
    वामखण्डः.addEventListener('scroll', () => {
        const दक्षिणखण्डः = document.getElementById('दक्षिणखण्डः');
        दक्षिणखण्डः.scrollTop = वामखण्डः.scrollTop;
    });
    const दक्षिणखण्डः = document.getElementById('दक्षिणखण्डः');
    दक्षिणखण्डः.addEventListener('scroll', () => {
        वामखण्डः.scrollTop = दक्षिणखण्डः.scrollTop;
    });

    // Rendering Logic
    let कर्षितसूचकः = -1;
    let स्पृष्टसङ्केतसूचकः = -1;
    let स्पृष्टखण्डसूचकः = -1;
    let प्रतिमानम् = 100; // Pixels per time unit
    
    // Zoom Logic
    document.getElementById('सङ्कोचः').addEventListener('click', () => {
        if (प्रतिमानम् > 20) {
            प्रतिमानम् = प्रतिमानम् - 20;
        } else {
            प्रतिमानम् = Math.max(0.1, प्रतिमानम् / 1.5);
        }
        रेखाङ्कनंकुरु();
        सङ्केतपुनःलेखनम्();
    });
    
    document.getElementById('वर्धनम्').addEventListener('click', () => {
        if (प्रतिमानम् >= 20) {
            प्रतिमानम् = Math.min(500, प्रतिमानम् + 20);
        } else {
            प्रतिमानम् = प्रतिमानम् * 1.5;
            if (प्रतिमानम् > 20 && प्रतिमानम् < 40) प्रतिमानम् = 20;
        }
        रेखाङ्कनंकुरु();
        सङ्केतपुनःलेखनम्();
    });
    
    document.getElementById('दृश्यसमम्').addEventListener('click', () => {
        const दक्षिणखण्डः = document.getElementById('दक्षिणखण्डः');
        const आयामः = parseInt(document.getElementById('तरङ्गायामः').value) || 10;
        // Calculate fit, subtracting a small margin
        प्रतिमानम् = Math.max(0.1, (दक्षिणखण्डः.clientWidth - 10) / आयामः);
        रेखाङ्कनंकुरु();
        सङ्केतपुनःलेखनम्();
    });

    function सङ्केतपुनःलेखनम्() {
        const वामखण्डः = document.getElementById('वामखण्डः');
        const दक्षिणखण्डः = document.getElementById('दक्षिणखण्डः');
        
        const शीर्षपट्टिका = वामखण्डः.querySelector('.शीर्षपट्टिका');
        वामखण्डः.innerHTML = '';
        if (शीर्षपट्टिका) वामखण्डः.appendChild(शीर्षपट्टिका);
        
        const अन्तिमक्षेत्रम् = document.getElementById('अन्तिमक्षेत्रम्');
        const कालरेखा = document.getElementById('कालरेखा');
        दक्षिणखण्डः.innerHTML = '';
        if (अन्तिमक्षेत्रम्) दक्षिणखण्डः.appendChild(अन्तिमक्षेत्रम्);
        if (कालरेखा) दक्षिणखण्डः.appendChild(कालरेखा);
        
        const आयामः = parseInt(document.getElementById('तरङ्गायामः').value) || 10;
        const विस्तारः = आयामः * प्रतिमानम्;

        सङ्केतदत्तांशः.forEach((सङ्केतः, सूचकः) => {
            const नवीनसङ्केतपात्रम् = document.createElement('div');
            नवीनसङ्केतपात्रम्.className = 'सङ्केतनामप्रदर्शनम्';
            नवीनसङ्केतपात्रम्.textContent = सङ्केतः.name;
            
            नवीनसङ्केतपात्रम्.draggable = true;
            नवीनसङ्केतपात्रम्.addEventListener('dragstart', (घटना) => {
                कर्षितसूचकः = सूचकः;
                घटना.target.classList.add('सङ्केतकर्षितः');
            });
            नवीनसङ्केतपात्रम्.addEventListener('dragend', (घटना) => {
                घटना.target.classList.remove('sङ्केतकर्षितः');
            });
            नवीनसङ्केतपात्रम्.addEventListener('dragover', (घटना) => {
                घटना.preventDefault();
            });
            नवीनसङ्केतपात्रम्.addEventListener('drop', (घटना) => {
                घटना.preventDefault();
                if (कर्षितसूचकः !== -1 && कर्षितसूचकः !== सूचकः) {
                    const कर्षितवस्तु = सङ्केतदत्तांशः.splice(कर्षितसूचकः, 1)[0];
                    सङ्केतदत्तांशः.splice(सूचकः, 0, कर्षितवस्तु);
                    सङ्केतपुनःलेखनम्();
                }
            });
            
            वामखण्डः.appendChild(नवीनसङ्केतपात्रम्);
            
            const तरङ्गपङ्क्तिः = document.createElement('div');
            तरङ्गपङ्क्तिः.className = 'तरङ्गपङ्क्तिः';
            तरङ्गपङ्क्तिः.style.width = `${विस्तारः}px`;
            
            const एसवीजीनामक्षेत्रम् = "http://www.w3.org/2000/svg";
            const एसवीजीचित्रम् = document.createElementNS(एसवीजीनामक्षेत्रम्, 'svg');
            एसवीजीचित्रम्.setAttribute('width', विस्तारः);
            एसवीजीचित्रम्.setAttribute('height', '40');
            एसवीजीचित्रम्.setAttribute('class', 'तरङ्गचित्रम्');
            
            सङ्केतः.pieces.forEach((खण्डः, खण्डसूचकः) => {
                const आरम्भएक्स = खण्डः.start * प्रतिमानम्;
                const अन्तएक्स = खण्डः.end * प्रतिमानम्;
                
                const वर्गः = document.createElementNS(एसवीजीनामक्षेत्रम्, 'g');
                वर्गः.style.cursor = 'pointer';
                वर्गः.oncontextmenu = (घटना) => {
                    घटना.preventDefault();
                    window['सम्पादनसंवादमुद्घाटय'](सूचकः, खण्डसूचकः);
                };
                वर्गः.onmouseover = () => {
                    स्पृष्टसङ्केतसूचकः = सूचकः;
                    स्पृष्टखण्डसूचकः = खण्डसूचकः;
                };
                वर्गः.onmouseout = () => {
                    स्पृष्टसङ्केतसूचकः = -1;
                    स्पृष्टखण्डसूचकः = -1;
                };
                
                if (सङ्केतः.width === 1) {
                    if (खण्डः.value === '0') {
                        const रेखा = document.createElementNS(एसवीजीनामक्षेत्रम्, 'line');
                        रेखा.setAttribute('x1', आरम्भएक्स); रेखा.setAttribute('y1', 32);
                        रेखा.setAttribute('x2', अन्तएक्स); रेखा.setAttribute('y2', 32);
                        रेखा.setAttribute('stroke', '#00d4ff'); रेखा.setAttribute('stroke-width', 2);
                        रेखा.setAttribute('class', 'तरङ्गपथः');
                        वर्गः.appendChild(रेखा);
                    } else if (खण्डः.value === '1') {
                        const रेखा = document.createElementNS(एसवीजीनामक्षेत्रम्, 'line');
                        रेखा.setAttribute('x1', आरम्भएक्स); रेखा.setAttribute('y1', 8);
                        रेखा.setAttribute('x2', अन्तएक्स); रेखा.setAttribute('y2', 8);
                        रेखा.setAttribute('stroke', '#00d4ff'); रेखा.setAttribute('stroke-width', 2);
                        रेखा.setAttribute('class', 'तरङ्गपथः');
                        वर्गः.appendChild(रेखा);
                    } else if (खण्डः.value.toLowerCase() === 'z') {
                        const रेखा = document.createElementNS(एसवीजीनामक्षेत्रम्, 'line');
                        रेखा.setAttribute('x1', आरम्भएक्स); रेखा.setAttribute('y1', 20);
                        रेखा.setAttribute('x2', अन्तएक्स); रेखा.setAttribute('y2', 20);
                        रेखा.setAttribute('stroke', '#888'); रेखा.setAttribute('stroke-width', 1);
                        रेखा.setAttribute('class', 'तरङ्गपथः');
                        वर्गः.appendChild(रेखा);
                    } else if (खण्डः.value.toLowerCase() === 'x') {
                        const आयातः = document.createElementNS(एसवीजीनामक्षेत्रम्, 'rect');
                        आयातः.setAttribute('x', आरम्भएक्स); आयातः.setAttribute('y', 8);
                        आयातः.setAttribute('width', Math.max(अन्तएक्स - आरम्भएक्स, 1)); आयातः.setAttribute('height', 24);
                        आयातः.setAttribute('class', 'तरङ्गएक्स');
                        वर्गः.appendChild(आयातः);
                        const पाठः = document.createElementNS(एसवीजीनामक्षेत्रम्, 'text');
                        पाठः.setAttribute('x', आरम्भएक्स + (अन्तएक्स - आरम्भएक्स)/2); पाठः.setAttribute('y', 20);
                        पाठः.setAttribute('class', 'तरङ्गपाठः');
                        पाठः.setAttribute('fill', 'white');
                        पाठः.textContent = 'X';
                        वर्गः.appendChild(पाठः);
                    }
                    
                    const स्पर्शक्षेत्रम् = document.createElementNS(एसवीजीनामक्षेत्रम्, 'rect');
                    स्पर्शक्षेत्रम्.setAttribute('x', आरम्भएक्स); स्पर्शक्षेत्रम्.setAttribute('y', 0);
                    स्पर्शक्षेत्रम्.setAttribute('width', Math.max(अन्तएक्स - आरम्भएक्स, 1)); स्पर्शक्षेत्रम्.setAttribute('height', 40);
                    स्पर्शक्षेत्रम्.setAttribute('fill', 'transparent');
                    वर्गः.appendChild(स्पर्शक्षेत्रम्);
                    
                } else {
                    const बिन्दवः = `${आरम्भएक्स},20 ${आरम्भएक्स+5},8 ${Math.max(अन्तएक्स-5, आरम्भएक्स+5)},8 ${अन्तएक्स},20 ${Math.max(अन्तएक्स-5, आरम्भएक्स+5)},32 ${आरम्भएक्स+5},32`;
                    const बहुभुजः = document.createElementNS(एसवीजीनामक्षेत्रम्, 'polygon');
                    बहुभुजः.setAttribute('points', (अन्तएक्स - आरम्भएक्स > 10) ? बिन्दवः : `${आरम्भएक्स},8 ${अन्तएक्स},8 ${अन्तएक्स},32 ${आरम्भएक्स},32`);
                    बहुभुजः.setAttribute('class', 'तरङ्गबस');
                    वर्गः.appendChild(बहुभुजः);
                    
                    const पाठः = document.createElementNS(एसवीजीनामक्षेत्रम्, 'text');
                    पाठः.setAttribute('x', आरम्भएक्स + (अन्तएक्स - आरम्भएक्स)/2); पाठः.setAttribute('y', 20);
                    पाठः.setAttribute('class', 'तरङ्गपाठः');
                    पाठः.textContent = (खण्डः.value.toLowerCase() === 'x') ? 'X' : खण्डः.value;
                    वर्गः.appendChild(पाठः);
                    
                    const स्पर्शक्षेत्रम् = document.createElementNS(एसवीजीनामक्षेत्रम्, 'rect');
                    स्पर्शक्षेत्रम्.setAttribute('x', आरम्भएक्स); स्पर्शक्षेत्रम्.setAttribute('y', 0);
                    स्पर्शक्षेत्रम्.setAttribute('width', Math.max(अन्तएक्स - आरम्भएक्स, 1)); स्पर्शक्षेत्रम्.setAttribute('height', 40);
                    स्पर्शक्षेत्रम्.setAttribute('fill', 'transparent');
                    वर्गः.appendChild(स्पर्शक्षेत्रम्);
                }
                
                एसवीजीचित्रम्.appendChild(वर्गः);
                
                // Draw vertical transitions
                if (खण्डसूचकः > 0 && सङ्केतः.width === 1) {
                    const पूर्वखण्डः = सङ्केतः.pieces[खण्डसूचकः - 1];
                    const पूर्वमूल्यम् = पूर्वखण्डः.value.toLowerCase();
                    const नवीनमूल्यम् = खण्डः.value.toLowerCase();
                    
                    let शीर्षम् = 8;
                    let अधः = 32;
                    
                    if (पूर्वमूल्यम् !== 'x' && नवीनमूल्यम् !== 'x') {
                        const gety = (v) => v === '1' ? 8 : (v === 'z' ? 20 : 32);
                        const y1 = gety(पूर्वमूल्यम्);
                        const y2 = gety(नवीनमूल्यम्);
                        शीर्षम् = Math.min(y1, y2);
                        अधः = Math.max(y1, y2);
                    }
                    
                    if (शीर्षम् !== अधः) {
                        const लम्बरेखा = document.createElementNS(एसवीजीनामक्षेत्रम्, 'line');
                        लम्बरेखा.setAttribute('x1', आरम्भएक्स); लम्बरेखा.setAttribute('y1', शीर्षम्);
                        लम्बरेखा.setAttribute('x2', आरम्भएक्स); लम्बरेखा.setAttribute('y2', अधः);
                        लम्बरेखा.setAttribute('stroke', (नवीनमूल्यम् === 'x' || पूर्वमूल्यम् === 'x') ? 'var(--accent-blue)' : '#00d4ff');
                        लम्बरेखा.setAttribute('stroke-width', (नवीनमूल्यम् === 'x' || पूर्वमूल्यम् === 'x') ? 1 : 2);
                        एसवीजीचित्रम्.appendChild(लम्बरेखा);
                    }
                }
            });
            
            तरङ्गपङ्क्तिः.appendChild(एसवीजीचित्रम्);
            दक्षिणखण्डः.appendChild(तरङ्गपङ्क्तिः);
        });
    }

    // Timeline logic
    function रेखाङ्कनंकुरु() {
        const कालरेखा = document.getElementById('कालरेखा');
        if (!कालरेखा) return;
        कालरेखा.innerHTML = '';
        
        const आयामः = parseInt(document.getElementById('तरङ्गायामः').value) || 10;
        const मापकः = parseInt(document.getElementById('समयमापकः').value) || 1;
        const विस्तारः = आयामः * प्रतिमानम्;
        
        कालरेखा.style.width = `${विस्तारः}px`;
        
        let सोपानम् = 1;
        if (प्रतिमानम् < 50) {
            सोपानम् = Math.ceil(50 / प्रतिमानम्);
        }
        
        for (let सूचक = 0; सूचक <= आयामः; सूचक++) {
            const वामः = सूचक * प्रतिमानम्;
            
            if (सूचक % सोपानम् === 0 || सूचक === आयामः) {
                const बिन्दुः = document.createElement('div');
                बिन्दुः.className = 'कालबिन्दुः';
                
                const चिह्नम् = document.createElement('div');
                चिह्नम्.className = 'कालचिह्नम्';
                चिह्नम्.textContent = (सूचक * मापकः);

                बिन्दुः.style.left = वामः + 'px';
                चिह्नम्.style.left = (वामः + 4) + 'px';
                
                कालरेखा.appendChild(बिन्दुः);
                कालरेखा.appendChild(चिह्नम्);
            }
        }

        const दक्षिणखण्डः = document.getElementById('दक्षिणखण्डः');
        let अन्तिमक्षेत्रम् = document.getElementById('अन्तिमक्षेत्रम्');
        if (!अन्तिमक्षेत्रम्) {
            अन्तिमक्षेत्रम् = document.createElement('div');
            अन्तिमक्षेत्रम्.id = 'अन्तिमक्षेत्रम्';
            अन्तिमक्षेत्रम्.className = 'अन्तिमक्षेत्रम्';
            दक्षिणखण्डः.insertBefore(अन्तिमक्षेत्रम्, दक्षिणखण्डः.firstChild);
        }
        
        const dakshinaWidth = दक्षिणखण्डः.clientWidth;
        अन्तिमक्षेत्रम्.style.left = `${विस्तारः}px`;
        if (विस्तारः < dakshinaWidth) {
            अन्तिमक्षेत्रम्.style.width = `${dakshinaWidth - विस्तारः}px`;
        } else {
            अन्तिमक्षेत्रम्.style.width = '0px';
        }
        
        खण्डपूरणकर्तनम्(आयामः);
    }
    
    function खण्डपूरणकर्तनम्(आयामः) {
        let परिवर्तितम् = false;
        सङ्केतदत्तांशः.forEach(सङ्केतः => {
            const पुरातनदैर्घ्यम् = सङ्केतः.pieces.length;
            सङ्केतः.pieces = सङ्केतः.pieces.filter(खण्डः => खण्डः.start < आयामः);
            सङ्केतः.pieces.forEach(खण्डः => { if (खण्डः.end > आयामः) खण्डः.end = आयामः; });
            
            const अन्तिमखण्डः = सङ्केतः.pieces[सङ्केतः.pieces.length - 1];
            if (अन्तिमखण्डः && अन्तिमखण्डः.end < आयामः) {
                सङ्केतः.pieces.push({ start: अन्तिमखण्डः.end, end: आयामः, value: '0' });
            } else if (!अन्तिमखण्डः) {
                सङ्केतः.pieces.push({ start: 0, end: आयामः, value: '0' });
            }
            if (सङ्केतः.pieces.length !== पुरातनदैर्घ्यम् || (अन्तिमखण्डः && अन्तिमखण्डः.end !== आयामः)) {
                परिवर्तितम् = true;
            }
        });
        if (परिवर्तितम्) {
            सङ्केतपुनःलेखनम्();
        }
    }

    document.getElementById('तरङ्गायामः').addEventListener('change', () => {
        रेखाङ्कनंकुरु();
        सङ्केतपुनःलेखनम्();
    });
    document.getElementById('समयमापकः').addEventListener('change', रेखाङ्कनंकुरु);
    
    window.addEventListener('resize', रेखाङ्कनंकुरु);
    
    // तरंगरूप दत्तांश प्रयुक्ति (Apply Waveform Object to Diagram)
    function तरंगरूप_दत्तांश_प्रयुक्ति(पार्सित_दत्तांश) {
        if (!पार्सित_दत्तांश) return false;
        const सङ्केत_सूची = पार्सित_दत्तांश.सङ्केताः || पार्सित_दत्तांश.संकेताः || पार्सित_दत्तांश.signals;
        if (!सङ्केत_सूची || !Array.isArray(सङ्केत_सूची)) {
            return false;
        }

        // Set waveform length
        if (पार्सित_दत्तांश.तरंगदैर्घ्यम्) {
            const आयाम_निवेश = document.getElementById('तरङ्गायामः');
            if (आयाम_निवेश) {
                आयाम_निवेश.value = Math.max(10, parseInt(पार्सित_दत्तांश.तरंगदैर्घ्यम्));
            }
        }

        // Set time scale value and unit if present
        if (पार्सित_दत्तांश.समयमापकः) {
            const मापक_चयन = document.getElementById('समयमापकः');
            if (मापक_चयन) मापक_चयन.value = String(पार्सित_दत्तांश.समयमापकः);
        }
        if (पार्सित_दत्तांश.समयैकम्) {
            const इकाई_चयन = document.getElementById('समयैकम्');
            const तरंग_इकाई_चयन = document.getElementById('तरङ्गायामैकम्');
            if (इकाई_चयन) इकाई_चयन.value = पार्सित_दत्तांश.समयैकम्;
            if (तरंग_इकाई_चयन) तरंग_इकाई_चयन.value = पार्सित_दत्तांश.समयैकम्;
        }

        // Clear existing signals and load imported signals
        सङ्केतदत्तांशः.length = 0;
        सङ्केत_सूची.forEach((संकेत, सूचक) => {
            सङ्केतदत्तांशः.push({
                id: संकेत.id || ('sig_' + सूचक),
                name: संकेत.name,
                width: संकेत.width || 1,
                radix: संकेत.radix || 'binary',
                pieces: JSON.parse(JSON.stringify(संकेत.pieces || []))
            });
        });

        // Adjust zoom to fit comfortably in view
        const दक्षिणखण्डः = document.getElementById('दक्षिणखण्डः');
        const आयामः = parseInt(document.getElementById('तरङ्गायामः').value) || 10;
        if (दक्षिणखण्डः && दक्षिणखण्डः.clientWidth > 0) {
            प्रतिमानम् = Math.max(20, Math.min(120, (दक्षिणखण्डः.clientWidth - 40) / आयामः));
        }

        रेखाङ्कनंकुरु();
        सङ्केतपुनःलेखनम्();
        return true;
    }

    // संचिकातः तरंग भारणम् (Load .tr Waveform from File on User's Computer)
    function संचिकातः_तरंग_भारणम्(घटना) {
        const संचिका = घटना.target.files && घटना.target.files[0];
        if (!संचिका) return;

        const पठक = new FileReader();
        पठक.onload = function(ई) {
            try {
                const पाठ = ई.target.result;
                const पार्सित_दत्तांश = JSON.parse(पाठ);
                const परिणाम = तरंगरूप_दत्तांश_प्रयुक्ति(पार्सित_दत्तांश);
                if (!परिणाम) {
                    alert('Invalid .tr file format. Could not parse waveform signals.');
                }
            } catch (दोष) {
                console.error(दोष);
                alert('Error reading .tr file: ' + दोष.message);
            }
            // Reset input so same file can be selected again
            घटना.target.value = '';
        };
        पठक.readAsText(संचिका);
    }
    window.संचिकातः_तरंग_भारणम् = संचिकातः_तरंग_भारणम्;

    // सीपीयू तरंगरूप भारक कार्यप्रणाली (Load Waveform Data Exported from CPU Simulator)
    function सीपीयू_तरंगरूप_भारणम्(दर्शयतु_सूचना = true) {
        try {
            const संगृहीत_दत्तांश = localStorage.getItem('पिभट्_तरंगदत्तांशः');
            if (!संगृहीत_दत्तांश) {
                if (दर्शयतु_सूचना) {
                    alert('No CPU waveform trace found in storage. Please generate or run a program in CPU Simulator and click "Show in Timing Diagram".');
                }
                return false;
            }

            const पार्सित_दत्तांश = JSON.parse(संगृहीत_दत्तांश);
            return तरंगरूप_दत्तांश_प्रयुक्ति(पार्सित_दत्तांश);
        } catch (दोषः) {
            console.error('Error loading CPU waveform:', दोषः);
            return false;
        }
    }

    // Connect Load CPU Button
    const सीपीयू_कुञ्जी = document.getElementById('सीपीयू-तरंग-भारकः');
    if (सीपीयू_कुञ्जी) {
        सीपीयू_कुञ्जी.addEventListener('click', () => {
            सीपीयू_तरंगरूप_भारणम्(true);
        });
    }

    // Auto-load if URL contains query parameter ?load_cpu_waveform=1 or if trace was just exported
    const यूआरएल_प्राचलाः = new URLSearchParams(window.location.search);
    if (यूआरएल_प्राचलाः.get('load_cpu_waveform') === '1') {
        सीपीयू_तरंगरूप_भारणम्(false);
    }

    // Expose for testing
    window.सीपीयू_तरंगरूप_भारणम् = सीपीयू_तरंगरूप_भारणम्;
    window.सङ्केतदत्तांशः = सङ्केतदत्तांशः;
    window.तरंगरूप_दत्तांश_प्रयुक्ति = तरंगरूप_दत्तांश_प्रयुक्ति;

    // Initial draw
    रेखाङ्कनंकुरु();
});
