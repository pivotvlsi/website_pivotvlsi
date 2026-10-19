/**
 * सरलीकरणम् (Simplification)
 * 
 * Rules:
 * 1. Contradiction (विरोधः): A . A' = 0
 * 2. Zero Property (शून्य_गुण): A . 0 = 0
 * 3. Identity AND (तत्समक_अन्): A . 1 = A
 * 4. Tautology (सर्वदा_सत्य): A + A' = 1
 * 5. One Property (एक_गुण): A + 1 = 1
 * 6. Identity OR (तत्समक_अथवा): A + 0 = A
 * 7. De Morgan's Law (डिमॉर्गन_नियमः): (A.B)' = A'+B', (A+B)' = A'.B'
 */

function createConstantNode(dimension, value) {
    let node = Array(dimension).fill(2);
    node.push(value);
    return node;
}

// -------------------------------------------------------------
// 1. Contradiction (विरोधः): A . A' = 0
// -------------------------------------------------------------
function अन्वेषण_विरोध(शाखा, संकारकः) {
    if (संकारकः !== 0 && संकारकः !== 2) return null;
    let l = शाखा.length - 1;
    for (let k = 0; k < l; k++) {
        if (शाखा[k] === 3) return [संकारकः, शाखा];
    }
    return null;
}
function सरलीकरण_विरोध(सन्दर्भः) {
    let [op, शाखा] = सन्दर्भः;
    return createConstantNode(शाखा.length - 1, 0);
}

// -------------------------------------------------------------
// 2. Zero Property (शून्य_गुण): A . 0 = 0
// -------------------------------------------------------------
function अन्वेषण_शून्य_गुण(शाखा, संकारकः) {
    if (संकारकः !== 0 && संकारकः !== 2) return null;
    let l = शाखा.length - 1;
    if (शाखा[l] === 0 || शाखा[l] === 3) return [संकारकः, शाखा];
    return null;
}
function सरलीकरण_शून्य_गुण(सन्दर्भः) {
    let [op, शाखा] = सन्दर्भः;
    return createConstantNode(शाखा.length - 1, 0);
}

// -------------------------------------------------------------
// 3. Identity AND (तत्समक_अन्): A . 1 = A
// -------------------------------------------------------------
function अन्वेषण_तत्समक_अन्(शाखा, संकारकः) {
    if (संकारकः !== 0 && संकारकः !== 2) return null;
    let l = शाखा.length - 1;
    if (शाखा[l] === 1 || शाखा[l] === 3) return [संकारकः, शाखा];
    return null;
}
function सरलीकरण_तत्समक_अन्(सन्दर्भः) {
    let [op, शाखा] = सन्दर्भः;
    let navya_shakha = [...शाखा];
    let l = navya_shakha.length - 1;
    if (navya_shakha[l] === 3) navya_shakha[l] = 0; // Removing 1 from {0,1} leaves {0}
    else navya_shakha[l] = 2;
    return navya_shakha;
}

// -------------------------------------------------------------
// 4. Tautology (सर्वदा_सत्य): A + A' = 1
// -------------------------------------------------------------
function अन्वेषण_सर्वदा_सत्य(शाखा, संकारकः) {
    if (संकारकः !== 1 && संकारकः !== 3) return null;
    let l = शाखा.length - 1;
    for (let k = 0; k < l; k++) {
        if (शाखा[k] === 3) return [संकारकः, शाखा];
    }
    return null;
}
function सरलीकरण_सर्वदा_सत्य(सन्दर्भः) {
    let [op, शाखा] = सन्दर्भः;
    return createConstantNode(शाखा.length - 1, 1);
}

// -------------------------------------------------------------
// 5. One Property (एक_गुण): A + 1 = 1
// -------------------------------------------------------------
function अन्वेषण_एक_गुण(शाखा, संकारकः) {
    if (संकारकः !== 1 && संकारकः !== 3) return null;
    let l = शाखा.length - 1;
    if (शाखा[l] === 1 || शाखा[l] === 3) return [संकारकः, शाखा];
    return null;
}
function सरलीकरण_एक_गुण(सन्दर्भः) {
    let [op, शाखा] = सन्दर्भः;
    return createConstantNode(शाखा.length - 1, 1);
}

// -------------------------------------------------------------
// 6. Identity OR (तत्समक_अथवा): A + 0 = A
// -------------------------------------------------------------
function अन्वेषण_तत्समक_अथवा(शाखा, संकारकः) {
    if (संकारकः !== 1 && संकारकः !== 3) return null;
    let l = शाखा.length - 1;
    if (शाखा[l] === 0 || शाखा[l] === 3) return [संकारकः, शाखा];
    return null;
}
function सरलीकरण_तत्समक_अथवा(सन्दर्भः) {
    let [op, शाखा] = सन्दर्भः;
    let navya_shakha = [...शाखा];
    let l = navya_shakha.length - 1;
    if (navya_shakha[l] === 3) navya_shakha[l] = 1; // Removing 0 from {0,1} leaves {1}
    else navya_shakha[l] = 2;
    return navya_shakha;
}

// -------------------------------------------------------------
// 7. De Morgan's Law (डिमॉर्गन_नियमः)
// -------------------------------------------------------------
function अन्वेषण_डिमॉर्गन(शाखा, संकारकः) {
    if (Array.isArray(शाखा) && typeof शाखा[0] === 'number') {
        let isLeaf = true;
        for (let item of शाखा) {
            if (typeof item !== 'number') {
                isLeaf = false; break;
            }
        }
        if (!isLeaf) {
            let childOp = शाखा[0];
            if (childOp === 2 || childOp === 3) {
                return शाखा;
            }
        }
    }
    return null;
}

function सरलीकरण_डिमॉर्गन(सन्दर्भः) {
    let old_op = सन्दर्भः[0];
    let new_op = (old_op === 2) ? 1 : 0;
    let new_node = [new_op];
    
    function invert_child(child) {
        if (Array.isArray(child)) {
            let isLeaf = true;
            for (let item of child) {
                if (typeof item !== 'number') {
                    isLeaf = false; break;
                }
            }
            if (isLeaf) {
                return child.map(val => {
                    if (val === 0) return 1;
                    if (val === 1) return 0;
                    return val;
                });
            } else {
                let nested_op = child[0];
                let inverted_op = nested_op;
                if (nested_op === 0) inverted_op = 2;
                else if (nested_op === 1) inverted_op = 3;
                else if (nested_op === 2) inverted_op = 0;
                else if (nested_op === 3) inverted_op = 1;
                
                let inverted_node = [inverted_op];
                for (let i = 1; i < child.length; i++) {
                    inverted_node.push(child[i]);
                }
                return inverted_node;
            }
        }
        return child;
    }
    
    for (let i = 1; i < सन्दर्भः.length; i++) {
        new_node.push(invert_child(सन्दर्भः[i]));
    }
    return new_node;
}
function isLeafNode(node) {
    if (!Array.isArray(node)) return false;
    for (let i = 0; i < node.length; i++) {
        if (typeof node[i] !== 'number') return false;
    }
    return true;
}

function isSubset(leafA, leafB) {
    if (leafA.length !== leafB.length) return false;
    for (let i = 0; i < leafA.length; i++) {
        if (leafA[i] !== 2 && leafA[i] !== leafB[i]) return false;
    }
    return true;
}

function पदान्तर_सरलीकरणम्(op, children, debug, singleStep = false) {
    let changed = false;
    let valid = true;
    let childOp = null;
    
    for (let child of children) {
        if (!Array.isArray(child) || child.length !== 2 || !isLeafNode(child[1])) {
            valid = false;
            break;
        }
        if (childOp === null) childOp = child[0];
        else if (childOp !== child[0]) {
            valid = false;
            break;
        }
    }
    
    if (!valid || children.length < 2) return { children, changed };
    let isSOP = (op === 1 || op === 3) && (childOp === 0 || childOp === 2);
    let isPOS = (op === 0 || op === 2) && (childOp === 1 || childOp === 3);
    
    if (!isSOP && !isPOS) return { children, changed };
    
    let leaves = children.map(c => c[1]);
    let local_changed = true;

    
    while(local_changed) {
        local_changed = false;
        
        // 1. Idempotence & Absorption (वर्गसम_गुण & अवशोषण_नियमः)
        for (let i = 0; i < leaves.length; i++) {
            for (let j = 0; j < leaves.length; j++) {
                if (i === j) continue;
                if (isSubset(leaves[i], leaves[j])) {
                    if (debug) console.log(`    => Applied [Absorption/Idempotence (अवशोषण/वर्गसम)] ${JSON.stringify(leaves[i])} absorbs ${JSON.stringify(leaves[j])}`);
                    leaves.splice(j, 1);
                    if (j < i) i--;
                    j--;
                    local_changed = true;
                    changed = true;
                    if (singleStep) break;
                }
            }
            if (singleStep && local_changed) break;
        }
        if (singleStep && changed) break;
        if (local_changed) continue;
        
        // 2. Adjacency / Consensus (सामीप्य_नियमः)
        for (let i = 0; i < leaves.length; i++) {
            for (let j = i + 1; j < leaves.length; j++) {
                let diff_idx = -1;
                let is_adjacent = true;
                let leafA = leaves[i];
                let leafB = leaves[j];
                
                for (let k = 0; k < leafA.length - 1; k++) {
                    if (leafA[k] !== leafB[k]) {
                        if (diff_idx === -1 && ((leafA[k] === 0 && leafB[k] === 1) || (leafA[k] === 1 && leafB[k] === 0))) {
                            diff_idx = k;
                        } else {
                            is_adjacent = false;
                            break;
                        }
                    }
                }
                
                if (leafA[leafA.length - 1] !== leafB[leafB.length - 1]) is_adjacent = false;
                
                if (is_adjacent && diff_idx !== -1) {
                    if (debug) console.log(`    => Applied [Adjacency (सामीप्य_नियमः)] on ${JSON.stringify(leafA)} and ${JSON.stringify(leafB)}`);
                    let merged = [...leafA];
                    merged[diff_idx] = 2;
                    leaves[i] = merged;
                    leaves.splice(j, 1);
                    local_changed = true;
                    changed = true;
                    break;
                }
            }
            if (local_changed) break;
        }
        if (singleStep && changed) break;
        if (local_changed) continue;
        
        // 3. Simplification Theorem (सरलीकरण_प्रमेय)
        for (let i = 0; i < leaves.length; i++) {
            for (let j = 0; j < leaves.length; j++) {
                if (i === j) continue;
                let leafA = leaves[i];
                let leafB = leaves[j];
                
                let diff_idx = -1;
                let is_simp = true;
                for (let k = 0; k < leafA.length - 1; k++) {
                    if (leafA[k] !== 2) {
                        if (leafA[k] !== leafB[k]) {
                            if (diff_idx === -1 && ((leafA[k] === 0 && leafB[k] === 1) || (leafA[k] === 1 && leafB[k] === 0))) {
                                diff_idx = k;
                            } else {
                                is_simp = false;
                                break;
                            }
                        }
                    }
                }
                
                if (leafA[leafA.length - 1] !== 2 && leafA[leafA.length - 1] !== leafB[leafB.length - 1]) is_simp = false;
                
                if (is_simp && diff_idx !== -1) {
                    if (debug) console.log(`    => Applied [Simplification Theorem (सरलीकरण_प्रमेय)] on ${JSON.stringify(leafA)} and ${JSON.stringify(leafB)}`);
                    leafB[diff_idx] = 2;
                    local_changed = true;
                    changed = true;
                    break;
                }
            }
            if (local_changed) break;
        }
        if (singleStep && changed) break;
        if (local_changed) continue;

        // 4. Generalized Consensus Theorem (व्यापक_सम्मति_नियमः)
        for (let i = 0; i < leaves.length; i++) {
            for (let j = i + 1; j < leaves.length; j++) {
                let leafA = leaves[i];
                let leafB = leaves[j];
                
                let conflict_idx = -1;
                let can_consensus = true;
                let expected = new Array(leafA.length).fill(2);
                
                for (let k = 0; k < leafA.length; k++) {
                    if (k === leafA.length - 1) {
                        if (leafA[k] !== leafB[k]) {
                            can_consensus = false; 
                            break;
                        }
                        expected[k] = leafA[k];
                        continue;
                    }
                    
                    if (leafA[k] === leafB[k]) {
                        expected[k] = leafA[k];
                    } else if (leafA[k] === 2) {
                        expected[k] = leafB[k];
                    } else if (leafB[k] === 2) {
                        expected[k] = leafA[k];
                    } else {
                        if (conflict_idx === -1) {
                            conflict_idx = k;
                            expected[k] = 2;
                        } else {
                            can_consensus = false;
                            break;
                        }
                    }
                }
                
                if (can_consensus && conflict_idx !== -1) {
                    for (let k = 0; k < leaves.length; k++) {
                        if (k === i || k === j) continue;
                        if (isSubset(expected, leaves[k])) {
                            if (debug) console.log(`    => Applied [Generalized Consensus (व्यापक_सम्मति_नियमः)] on ${JSON.stringify(leafA)} & ${JSON.stringify(leafB)} -> Removed redundant ${JSON.stringify(leaves[k])}`);
                            leaves.splice(k, 1);
                            if (k < i) i--;
                            if (k < j) j--;
                            local_changed = true;
                            changed = true;
                            break;
                        }
                    }
                }
                if (local_changed) break;
            }
            if (local_changed) break;
        }
    }

    
    let newChildren = leaves.map(l => [childOp, l]);
    return { children: newChildren, changed };
}


// -------------------------------------------------------------
// Identification Function (सूत्र_अभिज्ञानम्)
// -------------------------------------------------------------
function सूत्र_अभिज्ञानम्(ग्रन्थिः) {
    if (!Array.isArray(ग्रन्थिः)) return null;

    let simplification_rules = [
        { name: "Contradiction (विरोधः)", find: अन्वेषण_विरोध },
        { name: "Zero Property (शून्य_गुण)", find: अन्वेषण_शून्य_गुण },
        { name: "Identity AND (तत्समक_अन्)", find: अन्वेषण_तत्समक_अन् },
        { name: "Tautology (सर्वदा_सत्य)", find: अन्वेषण_सर्वदा_सत्य },
        { name: "One Property (एक_गुण)", find: अन्वेषण_एक_गुण },
        { name: "Identity OR (तत्समक_अथवा)", find: अन्वेषण_तत्समक_अथवा },
        { name: "De Morgan's Law (डिमॉर्गन_नियमः)", find: अन्वेषण_डिमॉर्गन }
    ];

    function searchRecursive(node) {
        if (isLeafNode(node)) return null;
        let op = node[0];
        
        let operatorChildren = [];
        let leafChildren = [];
        
        for (let i = 1; i < node.length; i++) {
            let child = node[i];
            let childIdent = isLeafNode(child) ? null : searchRecursive(child);
            if (childIdent) return childIdent;
            
            if (isLeafNode(child)) {
                leafChildren.push(child);
            } else {
                operatorChildren.push(child);
            }
        }
        
        // Single leaf rules
        for (let leaf of leafChildren) {
            for (let rule of simplification_rules) {
                if (rule.find(leaf, op) !== null) {
                    return { rule: rule.name, terms: [leaf], op: op };
                }
            }
        }
        
        // Padantar rules
        let all_leaves = [...leafChildren];
        for (let child of operatorChildren) {
            if (child.length === 2 && isLeafNode(child[1])) {
                all_leaves.push(child[1]);
            }
        }
        
        // 1. Idempotent Law (समशक्ति_नियमः)
        for (let i = 0; i < all_leaves.length; i++) {
            for (let j = i + 1; j < all_leaves.length; j++) {
                if (JSON.stringify(all_leaves[i]) === JSON.stringify(all_leaves[j])) {
                    return { rule: "Idempotent Law (समशक्ति_नियमः)", terms: [all_leaves[i], all_leaves[j]], op: op };
                }
            }
        }
        
        // 2. Absorption Law (अवशोषण_नियमः)
        for (let i = 0; i < all_leaves.length; i++) {
            for (let j = 0; j < all_leaves.length; j++) {
                if (i === j) continue;
                if (isSubset(all_leaves[i], all_leaves[j])) {
                    return { rule: "Absorption Law (अवशोषण_नियमः)", terms: [all_leaves[i], all_leaves[j]], op: op };
                }
            }
        }
        
        // 3. Simplification Theorem (सरलीकरण_प्रमेय)
        for (let i = 0; i < all_leaves.length; i++) {
            for (let j = i + 1; j < all_leaves.length; j++) {
                let leafA = all_leaves[i];
                let leafB = all_leaves[j];
                let diff_count = 0;
                let diff_idx = -1;
                let compatible = true;
                for (let k = 0; k < leafA.length; k++) {
                    if (k === leafA.length - 1) {
                        if (leafA[k] !== leafB[k]) compatible = false;
                        continue;
                    }
                    if (leafA[k] !== leafB[k]) {
                        diff_count++;
                        diff_idx = k;
                        if ((leafA[k] === 0 && leafB[k] === 1) || (leafA[k] === 1 && leafB[k] === 0) || (leafA[k] === 3 && leafB[k] !== 3) || (leafA[k] !== 3 && leafB[k] === 3)) {
                            // Valid difference
                        } else {
                            compatible = false;
                        }
                    }
                }
                if (compatible && diff_count === 1) {
                    return { rule: "Simplification Theorem (सरलीकरण_प्रमेय)", terms: [leafA, leafB], op: op };
                }
            }
        }
        
        return null;
    }
    
    let root_demorgan = अन्वेषण_डिमॉर्गन(ग्रन्थिः, null);
    if (root_demorgan) {
        return { rule: "De Morgan's Law (डिमॉर्गन_नियमः)", terms: [ग्रन्थिः], op: null };
    }
    
    return searchRecursive(ग्रन्थिः);
}

// -------------------------------------------------------------
// Main Simplifier (सूत्र_सरलीकरणम्)
// -------------------------------------------------------------
function सूत्र_सरलीकरणम्(ग्रन्थिः, debug = false) {
    if (!Array.isArray(ग्रन्थिः)) return ग्रन्थिः;

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

    let आयामः = getDimension(ग्रन्थिः);
    if (आयामः === null) return ग्रन्थिः;

    let simplification_rules = [
        { name: "Contradiction (विरोधः)", find: अन्वेषण_विरोध, apply: सरलीकरण_विरोध },
        { name: "Zero Property (शून्य_गुण)", find: अन्वेषण_शून्य_गुण, apply: सरलीकरण_शून्य_गुण },
        { name: "Identity AND (तत्समक_अन्)", find: अन्वेषण_तत्समक_अन्, apply: सरलीकरण_तत्समक_अन् },
        { name: "Tautology (सर्वदा_सत्य)", find: अन्वेषण_सर्वदा_सत्य, apply: सरलीकरण_सर्वदा_सत्य },
        { name: "One Property (एक_गुण)", find: अन्वेषण_एक_गुण, apply: सरलीकरण_एक_गुण },
        { name: "Identity OR (तत्समक_अथवा)", find: अन्वेषण_तत्समक_अथवा, apply: सरलीकरण_तत्समक_अथवा },
        { name: "De Morgan's Law (डिमॉर्गन_नियमः)", find: अन्वेषण_डिमॉर्गन, apply: सरलीकरण_डिमॉर्गन }
    ];

    function simplifyRecursive(node) {
        if (isLeafNode(node)) return node;
        let op = node[0];
        
        let operatorChildren = [];
        let leafChildren = [];
        
        for (let i = 1; i < node.length; i++) {
            let child = node[i];
            let simplifiedChild = isLeafNode(child) ? child : simplifyRecursive(child);
            
            if (isLeafNode(simplifiedChild)) {
                leafChildren.push(simplifiedChild);
            } else {
                operatorChildren.push(simplifiedChild);
            }
        }
        
        function processLeaf(current_leaf) {
            let changed = true;
            while (changed) {
                changed = false;
                for (let rule of simplification_rules) {
                    let context = rule.find(current_leaf, op);
                    if (context !== null) {
                        let new_leaf = rule.apply(context);
                        if (JSON.stringify(current_leaf) !== JSON.stringify(new_leaf)) {
                            if (debug) console.log(`    => Applied [${rule.name}] on leaf ${JSON.stringify(current_leaf)} -> ${JSON.stringify(new_leaf)}`);
                            current_leaf = new_leaf;
                            changed = true;
                            break;
                        }
                    }
                }
            }
            
            let constant = current_leaf[current_leaf.length - 1];
            let isJustConst = true;
            for (let k = 0; k < current_leaf.length - 1; k++) {
                if (current_leaf[k] !== 2) isJustConst = false;
            }
            
            if (isJustConst && constant === 0) {
                if (op === 0) {
                    if (debug) console.log(`    => Parent AND node collapses to 0 due to Zero Property`);
                    return createConstantNode(आयामः, 0);
                }
                if (op === 2) {
                    if (debug) console.log(`    => Parent NAND node collapses to 1 due to Zero Property`);
                    return createConstantNode(आयामः, 1);
                }
                if (op === 1 || op === 3) { return null; }
                else return current_leaf;
            } else if (isJustConst && constant === 1) {
                if (op === 1) {
                    if (debug) console.log(`    => Parent OR node collapses to 1 due to One Property`);
                    return createConstantNode(आयामः, 1);
                }
                if (op === 3) {
                    if (debug) console.log(`    => Parent NOR node collapses to 0 due to One Property`);
                    return createConstantNode(आयामः, 0);
                }
                if (op === 0 || op === 2) { return null; }
                else return current_leaf;
            }
            return current_leaf;
        }

        let finalChildren = [];
        if (op === 0 || op === 2) {
            let mergedLeaf = null;
            if (leafChildren.length > 0) {
                mergedLeaf = [...leafChildren[0]];
                for (let i = 1; i < leafChildren.length; i++) {
                    let sibling = leafChildren[i];
                    for (let j = 0; j < mergedLeaf.length; j++) {
                        if (mergedLeaf[j] === 2) mergedLeaf[j] = sibling[j];
                        else if (sibling[j] !== 2 && mergedLeaf[j] !== sibling[j]) mergedLeaf[j] = 3;
                    }
                }
            }
            if (mergedLeaf !== null) {
                let res = processLeaf(mergedLeaf);
                if (res !== null && isLeafNode(res) && res[res.length-1] !== 2) {
                    let isC = true; for(let k=0; k<res.length-1; k++) if(res[k]!==2) isC=false;
                    if(isC) return res;
                }
                if (res !== null) finalChildren.push(res);
            }
        } else {
            for (let leaf of leafChildren) {
                let res = processLeaf(leaf);
                if (res !== null && isLeafNode(res) && res[res.length-1] !== 2) {
                    let isC = true; for(let k=0; k<res.length-1; k++) if(res[k]!==2) isC=false;
                    if(isC) return res;
                }
                if (res !== null) finalChildren.push(res);
            }
        }
        
        finalChildren.push(...operatorChildren);
        
        let padantar_result = पदान्तर_सरलीकरणम्(op, finalChildren, debug);
        if (padantar_result.changed) {
            finalChildren = padantar_result.children;
        }
        
        if (finalChildren.length === 0) {
            if (op === 0) return createConstantNode(आयामः, 1);
            if (op === 2) return createConstantNode(आयामः, 0);
            if (op === 1) return createConstantNode(आयामः, 0);
            if (op === 3) return createConstantNode(आयामः, 1);
        }
        if (finalChildren.length === 1 && op !== 2 && op !== 3) {
            // Only bubble up if the child is NOT a leaf node.
            // If it is a leaf node, bubbling it up changes its evaluation semantics (AND vs OR).
            if (!isLeafNode(finalChildren[0])) {
                return finalChildren[0];
            }
        }
        
        return [op, ...finalChildren];
    }

    let simplified = simplifyRecursive(ग्रन्थिः);
    
    // Apply De Morgan's to root if applicable
    let root_demorgan = अन्वेषण_डिमॉर्गन(simplified, null);
    if (root_demorgan) {
        let root_new = सरलीकरण_डिमॉर्गन(root_demorgan);
        if (debug) console.log(`    => Applied [De Morgan's Law (डिमॉर्गन_नियमः)] on root ${JSON.stringify(root_demorgan)} -> ${JSON.stringify(root_new)}`);
        simplified = simplifyRecursive(root_new);
    }
    
    if (isLeafNode(simplified)) {
        return [0, simplified];
    }
    
    return simplified;
}


function सूत्र_एकपद_सरलीकरणम्(ग्रन्थिः) {
    if (!Array.isArray(ग्रन्थिः)) return ग्रन्थिः;

    let आयामः = 0;
    function getDimension(node) {
        if (!Array.isArray(node)) return null;
        if (node[0] === 0 || node[0] === 1 || node[0] === 2 || node[0] === 3) {
            for (let i = 1; i < node.length; i++) {
                let d = getDimension(node[i]);
                if (d !== null) return d;
            }
        }
        return node.length - 1;
    }
    आयामः = getDimension(ग्रन्थिः) || 0;

    let simplification_rules = [
        { name: "Contradiction (विरोधः)", find: अन्वेषण_विरोध, apply: सरलीकरण_विरोध },
        { name: "Zero Property (शून्य_गुण)", find: अन्वेषण_शून्य_गुण, apply: सरलीकरण_शून्य_गुण },
        { name: "Identity AND (तत्समक_अन्)", find: अन्वेषण_तत्समक_अन्, apply: सरलीकरण_तत्समक_अन् },
        { name: "Tautology (सर्वदा_सत्य)", find: अन्वेषण_सर्वदा_सत्य, apply: सरलीकरण_सर्वदा_सत्य },
        { name: "One Property (एक_गुण)", find: अन्वेषण_एक_गुण, apply: सरलीकरण_एक_गुण },
        { name: "Identity OR (तत्समक_अथवा)", find: अन्वेषण_तत्समक_अथवा, apply: सरलीकरण_तत्समक_अथवा },
        { name: "De Morgan's Law (डिमॉर्गन_नियमः)", find: अन्वेषण_डिमॉर्गन, apply: सरलीकरण_डिमॉर्गन }
    ];

    let applied = false;

    function simplifySingleStep(node) {
        if (applied || isLeafNode(node)) return node;
        let op = node[0];
        
        let operatorChildren = [];
        let leafChildren = [];
        
        for (let i = 1; i < node.length; i++) {
            let child = node[i];
            if (!applied) {
                let simplifiedChild = isLeafNode(child) ? child : simplifySingleStep(child);
                if (isLeafNode(simplifiedChild)) {
                    leafChildren.push(simplifiedChild);
                } else {
                    operatorChildren.push(simplifiedChild);
                }
            } else {
                if (isLeafNode(child)) leafChildren.push(child);
                else operatorChildren.push(child);
            }
        }
        
        if (applied) {
            let f = [];
            if (op === 0 || op === 2) {
                let mergedLeaf = null;
                if (leafChildren.length > 0) {
                    mergedLeaf = [...leafChildren[0]];
                    for (let i = 1; i < leafChildren.length; i++) {
                        let sibling = leafChildren[i];
                        for (let j = 0; j < mergedLeaf.length; j++) {
                            if (mergedLeaf[j] === 2) mergedLeaf[j] = sibling[j];
                            else if (sibling[j] !== 2 && mergedLeaf[j] !== sibling[j]) mergedLeaf[j] = 3;
                        }
                    }
                }
                if (mergedLeaf !== null) f.push(mergedLeaf);
            } else {
                f.push(...leafChildren);
            }
            f.push(...operatorChildren);
            if (f.length === 1 && !isLeafNode(f[0])) return f[0];
            return [op, ...f];
        }

        // Try single leaf rules
        let newLeafChildren = [];
        for (let leaf of leafChildren) {
            if (applied) {
                newLeafChildren.push(leaf);
                continue;
            }
            let changed_local = false;
            for (let rule of simplification_rules) {
                let context = rule.find(leaf, op);
                if (context !== null) {
                    let new_leaf = rule.apply(context);
                    if (JSON.stringify(leaf) !== JSON.stringify(new_leaf)) {
                        newLeafChildren.push(new_leaf);
                        applied = true;
                        changed_local = true;
                        break;
                    }
                }
            }
            if (!changed_local) newLeafChildren.push(leaf);
        }
        leafChildren = newLeafChildren;

        if (!applied) {
            let padantar_result = पदान्तर_सरलीकरणम्(op, [...leafChildren, ...operatorChildren], false, true);
            if (padantar_result.changed) {
                applied = true;
                return [op, ...padantar_result.children];
            }
        }

        let finalChildren = [];
        if (op === 0 || op === 2) {
            let mergedLeaf = null;
            if (leafChildren.length > 0) {
                mergedLeaf = [...leafChildren[0]];
                for (let i = 1; i < leafChildren.length; i++) {
                    let sibling = leafChildren[i];
                    for (let j = 0; j < mergedLeaf.length; j++) {
                        if (mergedLeaf[j] === 2) mergedLeaf[j] = sibling[j];
                        else if (sibling[j] !== 2 && mergedLeaf[j] !== sibling[j]) mergedLeaf[j] = 3;
                    }
                }
            }
            if (mergedLeaf !== null) finalChildren.push(mergedLeaf);
        } else {
            finalChildren.push(...leafChildren);
        }
        finalChildren.push(...operatorChildren);
        
        if (finalChildren.length === 1 && op !== 2 && op !== 3) {
            if (!isLeafNode(finalChildren[0])) return finalChildren[0];
        }
        return [op, ...finalChildren];
    }

    let root_demorgan = अन्वेषण_डिमॉर्गन(ग्रन्थिः, null);
    if (root_demorgan) {
        return सरलीकरण_डिमॉर्गन(root_demorgan);
    }
    
    let res = simplifySingleStep(ग्रन्थिः);
    if (isLeafNode(res)) return [0, res];
    return res;
}

module.exports = {
    सूत्र_एकपद_सरलीकरणम्,
    सूत्र_सरलीकरणम्,
    सूत्र_अभिज्ञानम्
};
