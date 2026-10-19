/**
 * सारणीतः_सूत्रम् (सरणी_से_सूत्र): Converts the array representation back to a boolean string.
 * 
 * Array Structure Reference:
 * 
 * 1. Operator Nodes (First element of array):
 *    0 : AND (.)
 *    1 : OR (+)
 *    2 : NAND (.')
 *    3 : NOR (+')
 * 
 * 2. Leaf Nodes (Variable arrays like [1, 0, 2, 3]):
 *    a) Variable Elements (Indices 0 to L-1):
 *       0 : Inverted variable (e.g., A')
 *       1 : Normal variable (e.g., A)
 *       2 : Variable is absent
 *       3 : Both normal and inverted present (e.g., A and A')
 *    b) Constant Trailing Element (Index L):
 *       0 : Contains constant 0
 *       1 : Contains constant 1
 *       2 : Constant is absent
 *       3 : Contains both constant 0 and 1
 */
function सारणीतः_सूत्रम्(ग्रन्थिः, चरसूची = null) {
    if (!चरसूची) {
        function getDimension(node) {
            if (Array.isArray(node)) {
                let isVarArray = true;
                for (let i = 0; i < node.length; i++) {
                    if (typeof node[i] !== 'number') {
                        isVarArray = false;
                        break;
                    }
                }
                if (isVarArray) return node.length - 1;
                
                for (let i = 1; i < node.length; i++) {
                    let d = getDimension(node[i]);
                    if (d !== null) return d;
                }
            }
            return null;
        }

        let temp_aayamah = getDimension(ग्रन्थिः);
        चरसूची = [];
        if (temp_aayamah !== null) {
            for (let i = 0; i < temp_aayamah; i++) {
                चरसूची.push(String.fromCharCode(65 + i)); // A, B, C...
            }
        }
    }

    let आयामः = चरसूची.length;
    let संकारकमानचित्रम् = { 0: '.', 1: '+', 2: '.', 3: '+' }; 

    if (Array.isArray(ग्रन्थिः)) {
        let चरसरणी = true;
        for (let i = 0; i < ग्रन्थिः.length; i++) {
            if (typeof ग्रन्थिः[i] !== 'number') {
                चरसरणी = false;
                break;
            }
        }
        
        if (चरसरणी) {
            return ''; 
        }
        
        let संकारकः = ग्रन्थिः[0];
        let संकारकचिह्नम् = संकारकमानचित्रम्[संकारकः];
        let विपरीतम् = (संकारकः === 2 || संकारकः === 3);
        
        let शाखाः = ग्रन्थिः.slice(1);
        let शाखासूत्रम् = [];
        
        for (let शाखा of शाखाः) {
            let शाखाचरसरणी = true;
            for (let i = 0; i < शाखा.length; i++) {
                if (typeof शाखा[i] !== 'number') {
                    शाखाचरसरणी = false;
                    break;
                }
            }
            
            if (शाखाचरसरणी) {
                let पदम् = [];
                for (let i = 0; i < आयामः; i++) {
                    if (शाखा[i] === 1) पदम्.push(चरसूची[i]);
                    else if (शाखा[i] === 0) पदम्.push(चरसूची[i] + "'");
                    else if (शाखा[i] === 3) {
                        पदम्.push(चरसूची[i]);
                        पदम्.push(चरसूची[i] + "'");
                    }
                }
                
                let अन्तिमः = शाखा[आयामः];
                if (अन्तिमः === 0) पदम्.push('0');
                else if (अन्तिमः === 1) पदम्.push('1');
                else if (अन्तिमः === 3) {
                    पदम्.push('0');
                    पदम्.push('1');
                }
                
                let संयुक्तम् = पदम्.join(संकारकचिह्नम्);
                if (पदम्.length > 1) {
                    संयुक्तम् = '(' + संयुक्तम् + ')';
                }
                शाखासूत्रम्.push(संयुक्तम्);
            } else {
                शाखासूत्रम्.push(सारणीतः_सूत्रम्(शाखा, चरसूची));
            }
        }
        
        let परिणामः = शाखासूत्रम्.join(संकारकचिह्नम्);
        
        if (शाखासूत्रम्.length > 1) {
            परिणामः = '(' + परिणामः + ')';
        } else if (विपरीतम्) {
            let एकलसमूहः = false;
            if (परिणामः.startsWith('(') && परिणामः.endsWith(')')) {
                let कोष्ठकगणना = 0;
                एकलसमूहः = true;
                for(let i=0; i<परिणामः.length-1; i++) {
                    if (परिणामः[i] === '(') कोष्ठकगणना++;
                    else if (परिणामः[i] === ')') कोष्ठकगणना--;
                    if (कोष्ठकगणना === 0 && i !== 0) { एकलसमूहः = false; break; }
                }
            }
            if (!एकलसमूहः && !/^[A-Za-z01]'?$/.test(परिणामः)) {
                परिणामः = '(' + परिणामः + ')';
            }
        }
        
        if (विपरीतम्) {
            परिणामः += "'";
        }
        return परिणामः;
    }
    return '';
}

module.exports = {
    सारणीतः_सूत्रम्,
    सरणी_से_सूत्र: सारणीतः_सूत्रम् // Alias for compatibility during transition
};
