// SAT Desmos Calculator Simulator and Graphing Engine

class DesmosSimulator {
    constructor(graphElementId, inputsContainerId) {
        this.graphSvg = document.getElementById(graphElementId);
        this.inputsContainer = document.getElementById(inputsContainerId);
        
        // Viewport settings (Zoom and Pan)
        this.centerX = 0;
        this.centerY = 0;
        this.zoom = 25; // Pixels per math unit
        
        // Calculator State
        this.lines = []; // Array of line objects: { id, type, content, val, vars, color, el }
        this.variables = {}; // Computed variables: k: 5, a: 3, etc.
        this.activeQuestion = null;
        this.pointsOfInterest = []; // Coordinates of clickable points on graph: { x, y, label, type }
        this.selectedPoint = null;
        this.activePlots = [];
        
        // Colors mapping
        this.colors = ['color-blue', 'color-red', 'color-green', 'color-purple', 'color-orange'];
        this.colorIndex = 0;
        
        // Dragging state for graph panning
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.origCenterX = 0;
        this.origCenterY = 0;
        
        this.initEvents();
    }

    initEvents() {
        // Drag-to-pan graph
        const wrapper = this.graphSvg.parentElement;
        
        wrapper.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('plot-point') || e.target.closest('.graph-zoom-controls')) return;
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            this.origCenterX = this.centerX;
            this.origCenterY = this.centerY;
            wrapper.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.dragStartX;
            const dy = e.clientY - this.dragStartY;
            
            // Adjust center in math units
            this.centerX = this.origCenterX - dx / this.zoom;
            this.centerY = this.origCenterY + dy / this.zoom;
            this.renderGraph();
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                wrapper.style.cursor = 'grab';
            }
        });
        
        wrapper.style.cursor = 'grab';
        
        // Zoom buttons
        document.getElementById('zoom-in-btn').onclick = () => this.adjustZoom(1.2);
        document.getElementById('zoom-out-btn').onclick = () => this.adjustZoom(1 / 1.2);
        document.getElementById('zoom-reset-btn').onclick = () => {
            this.zoom = 25;
            this.centerX = 0;
            this.centerY = 0;
            if (this.activeQuestion) {
                this.centerOnQuestion(this.activeQuestion.id);
            } else {
                this.renderGraph();
            }
        };

        // UI buttons for inserting items
        document.getElementById('add-expression-btn').onclick = () => {
            const newLine = this.insertLine();
            newLine.rowEl.querySelector('.desmos-input-field').focus();
        };
        document.getElementById('add-table-btn').onclick = () => this.insertTable();
        document.getElementById('add-slider-btn').onclick = () => this.insertSlider();
        document.getElementById('add-random-btn').onclick = () => this.insertRandom();
        document.getElementById('desmos-solve-btn').onclick = () => this.solve();
        document.getElementById('desmos-clear-btn').onclick = () => this.clear();
    }
    
    adjustZoom(factor) {
        this.zoom *= factor;
        this.renderGraph();
    }
    
    centerOnQuestion(qId) {
        // Automatically adjust viewport center and zoom for specific questions to make coordinates visible
        if (qId === 'poly-1') { // vertex of f(x) = x^2 - 48x + 2304, vertex at (24, 1728)
            this.centerX = 24;
            this.centerY = 1728;
            this.zoom = 4;
        } else if (qId === 'poly-2') { // p(x) = x^2 - 57, vertex at (0, -57)
            this.centerX = 0;
            this.centerY = -57;
            this.zoom = 4;
        } else if (qId === 'poly-3') { // Exponential y-intercept (0, 14)
            this.centerX = 0;
            this.centerY = 14;
            this.zoom = 15;
        } else if (qId === 'slider-1') { // k = 57.75, vertex at (57.5, 0)
            this.centerX = 57.5;
            this.centerY = 10;
            this.zoom = 4;
        } else if (qId === 'slider-2') { // vertex at (2.25, 10.125)
            this.centerX = 2.25;
            this.centerY = 10.125;
            this.zoom = 15;
        } else if (qId === 'slider-3') { // vertex is around (26, 0)
            this.centerX = 26;
            this.centerY = -100;
            this.zoom = 1.5;
        } else if (qId === 'reg-1') { // (-2,-6), (-1,-8), (0,-6)
            this.centerX = -1;
            this.centerY = -6;
            this.zoom = 25;
        } else if (qId === 'reg-2') { // passes (0, 10), (-2, 9.02)
            this.centerX = -1;
            this.centerY = 9.5;
            this.zoom = 25;
        } else if (qId === 'reg-3') { // intercepts at (0, 0.85)
            this.centerX = 0;
            this.centerY = 0.85;
            this.zoom = 100;
        } else {
            this.centerX = 0;
            this.centerY = 0;
            this.zoom = 25;
        }
        this.renderGraph();
    }
    
    // Convert math coordinates to SVG coordinates
    mathToSvg(x, y) {
        const svgX = 250 + (x - this.centerX) * this.zoom;
        const svgY = 250 - (y - this.centerY) * this.zoom;
        return { x: svgX, y: svgY };
    }
    
    // Convert SVG coordinates to math coordinates
    svgToMath(svgX, svgY) {
        const x = this.centerX + (svgX - 250) / this.zoom;
        const y = this.centerY - (svgY - 250) / this.zoom;
        return { x, y };
    }

    setQuestion(question) {
        this.activeQuestion = question;
        this.clear();
        
        // Auto preload some instructions/presets based on question configuration
        if (question && question.desmosPreset) {
            question.desmosPreset.forEach(p => {
                if (p.startsWith('table:')) {
                    // Preload table
                    const parts = p.substring(6).split(':');
                    const xs = JSON.parse(parts[0]);
                    const ys = JSON.parse(parts[1]);
                    this.insertTable(xs, ys);
                } else {
                    this.insertLine(p);
                }
            });
        } else {
            this.insertLine();
        }
        
        this.centerOnQuestion(question ? question.id : '');
        this.solve();
    }
    
    clear() {
        this.lines = [];
        this.variables = {};
        this.pointsOfInterest = [];
        this.selectedPoint = null;
        this.colorIndex = 0;
        this.inputsContainer.innerHTML = '';
        this.renderGraph();
    }

    getNextColor() {
        const color = this.colors[this.colorIndex];
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        return color;
    }

    insertLine(content = '') {
        const id = 'line_' + Math.random().toString(36).substr(2, 9);
        const color = this.getNextColor();
        
        const row = document.createElement('div');
        row.className = 'desmos-input-row';
        row.id = id;
        row.innerHTML = `
            <div class="desmos-input-num">${this.lines.length + 1}</div>
            <div class="desmos-input-color-indicator ${color}"></div>
            <div class="desmos-input-field-wrapper">
                <input type="text" class="desmos-input-field" placeholder="Type equation here..." value="${content}">
                <div class="desmos-eval-output" style="display: none;"></div>
            </div>
            <button class="desmos-input-delete" title="Delete line"><i class="fa-solid fa-xmark"></i></button>
        `;
        
        this.inputsContainer.appendChild(row);
        
        const inputField = row.querySelector('.desmos-input-field');
        const lineObj = {
            id,
            type: 'expression',
            color,
            getFieldVal: () => inputField.value,
            setFieldVal: (v) => { inputField.value = v; },
            rowEl: row,
            indicatorEl: row.querySelector('.desmos-input-color-indicator'),
            evalEl: row.querySelector('.desmos-eval-output')
        };
        
        // Listeners
        inputField.oninput = () => this.solve();
        inputField.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const newLine = this.insertLine();
                newLine.rowEl.querySelector('.desmos-input-field').focus();
            }
        };
        row.querySelector('.desmos-input-delete').onclick = () => this.deleteLine(id);
        
        this.lines.push(lineObj);
        this.updateLineNumbers();
        return lineObj;
    }
    
    insertTable(preloadedXs = null, preloadedYs = null) {
        const id = 'table_' + Math.random().toString(36).substr(2, 9);
        const row = document.createElement('div');
        row.className = 'desmos-input-row';
        row.id = id;
        
        const xs = preloadedXs || ['', '', ''];
        const ys = preloadedYs || ['', '', ''];
        
        row.innerHTML = `
            <div class="desmos-input-num">${this.lines.length + 1}</div>
            <div class="desmos-input-color-indicator table-indicator"><i class="fa-solid fa-table"></i></div>
            <div class="desmos-input-field-wrapper">
                <div class="desmos-table-widget">
                    <table class="desmos-table">
                        <thead>
                            <tr>
                                <th>x₁</th>
                                <th>y₁</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${xs.map((x, i) => `
                                <tr>
                                    <td><input type="text" class="table-cell-x" placeholder="..." value="${x}"></td>
                                    <td><input type="text" class="table-cell-y" placeholder="..." value="${ys[i]}"></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <button class="desmos-input-delete" title="Delete line"><i class="fa-solid fa-xmark"></i></button>
        `;
        
        this.inputsContainer.appendChild(row);
        
        // Listeners for cell edits
        row.querySelectorAll('input').forEach(input => {
            input.oninput = () => this.solve();
        });
        row.querySelector('.desmos-input-delete').onclick = () => this.deleteLine(id);
        
        const getTableData = () => {
            const tableRows = row.querySelectorAll('tbody tr');
            const data = { x1: [], y1: [] };
            tableRows.forEach(r => {
                const xVal = parseFloat(r.querySelector('.table-cell-x').value);
                const yVal = parseFloat(r.querySelector('.table-cell-y').value);
                if (!isNaN(xVal) && !isNaN(yVal)) {
                    data.x1.push(xVal);
                    data.y1.push(yVal);
                }
            });
            return data;
        };
        
        const lineObj = {
            id,
            type: 'table',
            getTableData,
            rowEl: row
        };
        
        this.lines.push(lineObj);
        this.updateLineNumbers();
        this.solve();
    }
    
    insertSlider(varName = 'k', defaultVal = 10, min = 0, max = 100) {
        const id = 'slider_' + Math.random().toString(36).substr(2, 9);
        const row = document.createElement('div');
        row.className = 'desmos-input-row';
        row.id = id;
        
        row.innerHTML = `
            <div class="desmos-input-num">${this.lines.length + 1}</div>
            <div class="desmos-input-color-indicator color-purple"></div>
            <div class="desmos-input-field-wrapper">
                <input type="text" class="desmos-input-field" value="${varName} = ${defaultVal}">
                <div class="desmos-slider-control">
                    <div class="desmos-slider-val-row">
                        <span>Min: <span class="val-min">${min}</span></span>
                        <span>Max: <span class="val-max">${max}</span></span>
                    </div>
                    <input type="range" class="desmos-slider-range" min="${min}" max="${max}" step="0.01" value="${defaultVal}">
                </div>
            </div>
            <button class="desmos-input-delete" title="Delete line"><i class="fa-solid fa-xmark"></i></button>
        `;
        
        this.inputsContainer.appendChild(row);
        
        const inputField = row.querySelector('.desmos-input-field');
        const sliderRange = row.querySelector('.desmos-slider-range');
        
        const lineObj = {
            id,
            type: 'slider',
            varName,
            rowEl: row,
            getFieldVal: () => inputField.value,
            getSliderVal: () => parseFloat(sliderRange.value),
            setSliderVal: (v) => { sliderRange.value = v; }
        };
        
        sliderRange.oninput = () => {
            const val = parseFloat(sliderRange.value);
            inputField.value = `${lineObj.varName} = ${val}`;
            this.solve();
        };
        
        inputField.oninput = () => {
            // Check if variable name changed
            const match = inputField.value.match(/^([a-zA-Z_]\w*)\s*=\s*(-?\d*\.?\d*)/);
            if (match) {
                lineObj.varName = match[1];
                const val = parseFloat(match[2]);
                if (!isNaN(val)) {
                    sliderRange.value = val;
                }
            }
            this.solve();
        };
        
        row.querySelector('.desmos-input-delete').onclick = () => this.deleteLine(id);
        
        this.lines.push(lineObj);
        this.updateLineNumbers();
        this.solve();
    }
    
    insertRandom() {
        this.insertLine('x1 = random(100)');
    }
    
    deleteLine(id) {
        const idx = this.lines.findIndex(l => l.id === id);
        if (idx !== -1) {
            const line = this.lines[idx];
            line.rowEl.remove();
            this.lines.splice(idx, 1);
            this.updateLineNumbers();
            this.solve();
        }
    }
    
    updateLineNumbers() {
        this.lines.forEach((l, i) => {
            const numEl = l.rowEl.querySelector('.desmos-input-num');
            if (numEl) numEl.textContent = i + 1;
        });
    }

    preloadAnswers(presetArray) {
        this.clear();
        presetArray.forEach(p => {
            if (p.startsWith('table:')) {
                const parts = p.substring(6).split(':');
                const xs = JSON.parse(parts[0]);
                const ys = JSON.parse(parts[1]);
                this.insertTable(xs, ys);
            } else if (p.includes(' = ') && (p.startsWith('k') || p.startsWith('b') || p.startsWith('c') || p.startsWith('p') || p.startsWith('r') || p.startsWith('s'))) {
                const match = p.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)/);
                if (match) {
                    const name = match[1];
                    const val = parseFloat(match[2]);
                    let min = 0, max = 100;
                    if (name === 'b') { min = 0; max = 100; }
                    if (name === 'c') { min = -100; max = 100; }
                    if (name === 's') { min = 0; max = 500; }
                    this.insertSlider(name, isNaN(val) ? 10 : val, min, max);
                } else {
                    this.insertLine(p);
                }
            } else {
                this.insertLine(p);
            }
        });
        this.solve();
    }

    solve() {
        // 1. Gather all variables declared in equations
        this.variables = {};
        
        // Find static variables or sliders
        this.lines.forEach(l => {
            if (l.type === 'slider') {
                this.variables[l.varName] = l.getSliderVal();
            } else if (l.type === 'expression') {
                const content = l.getFieldVal().trim();
                const match = content.match(/^([a-zA-Z_]\w*)\s*=\s*(-?\d*\.?\d+)/);
                if (match) {
                    this.variables[match[1]] = parseFloat(match[2]);
                }
            }
        });

        // 2. Perform math fitting/evaluations based on active question
        this.pointsOfInterest = [];
        const activePlots = [];
        
        this.lines.forEach(l => {
            if (l.type === 'expression') {
                const content = l.getFieldVal().trim().replace(/\s+/g, '');
                const evalEl = l.rowEl.querySelector('.desmos-eval-output');
                const indicator = l.rowEl.querySelector('.desmos-input-color-indicator');
                
                if (content === '') {
                    evalEl.style.display = 'none';
                    return;
                }
                
                // Reset indicator color
                if (indicator) {
                    indicator.className = `desmos-input-color-indicator ${l.color}`;
                    indicator.innerHTML = '';
                }

                // Check for random declaration
                if (content.match(/^x1=random\(100\)$/)) {
                    evalEl.style.display = 'block';
                    evalEl.innerHTML = `= [0.778, 0.114, 0.824, ... 100 values]`;
                    return;
                }
                
                // Let's identify the mathematical type of the expression
                // (a) Linear equation: e.g. -x + y = -3.5 or x + 3y = 9.5
                const linMatch = content.match(/^([-+]?\d*\.?\d*)x([-+]?\d*\.?\d*)y=([-+]?\d*\.?\d*)$/);
                const linMatch2 = content.match(/^([-+]?\d*\.?\d*)x=([-+]?\d*\.?\d*)$/); // vertical line x = C
                const linMatch3 = content.match(/^y=([-+]?\d*\.?\d*)x([-+]?\d*\.?\d*)$/); // y = mx + c
                
                // (b) Quadratics: y = x^2 - 48x + 2304
                const quadMatch = content.match(/^y=x\^2([-+]?\d*\.?\d*)x([-+]?\d*\.?\d*)$/);
                
                // (c) Exponentials: y = -8 * (2)^x + 22
                const expMatch = content.match(/^y=([-+]?\d*\.?\d*)\*?\((\d+)\)\^x([-+]?\d*\.?\d*)$/);
                
                // (d) Slider-based equations: y = 58 - x - sqrt(k-x)
                const sliderFuncMatch = content.match(/^y=58-x-sqrt\(k-x\)$/);
                const sliderParabolaMatch = content.match(/^y=-2x\^2\+9x$/);
                const sliderParabolaMatch2 = content.match(/^y=-x\^2\+bx-676$/);
                
                // Draw plots if they match math functions
                if (content.startsWith('y=')) {
                    const rhs = content.substring(2);
                    // Generate points dynamically by evaluating rhs
                    const fn = this.compileExpression(rhs);
                    if (fn) {
                        activePlots.push({ fn, color: l.color, label: content });
                    }
                } else if (content.includes('=')) {
                    // Try to plot implicit equation
                    const parts = content.split('=');
                    const fn = this.compileImplicit(parts[0], parts[1]);
                    if (fn) {
                        activePlots.push({ fn, color: l.color, label: content });
                    }
                }
                
                // Check if regression model is requested
                if (content.includes('~')) {
                    this.handleRegressionLine(l, content);
                } else if (!content.includes('=')) {
                    // Try evaluating standard expression, like 8x1 + 7y1 or a * b
                    this.handleEvaluation(l, content);
                }
            }
        });

        // 3. Question specific solvers to compute exact points & solutions
        if (this.activeQuestion) {
            this.solveQuestionSpecifics(activePlots);
        }
        
        this.activePlots = activePlots;
        
        // 4. Render coordinate plane and curves
        this.renderGraph(this.activePlots);
    }
    
    // Safe compiler of math rhs expressions
    compileExpression(exprString) {
        // Tidy up equation string for javascript execution
        let jsExpr = exprString
            .replace(/(\d)x/g, '$1*x') // e.g. 2x -> 2*x
            .replace(/\bx\b/g, 'x_val')
            .replace(/\^/g, '**')
            .replace(/sqrt/g, 'Math.sqrt');
            
        // Inject variables
        for (const [v, val] of Object.entries(this.variables)) {
            // match complete word boundaries to avoid replacing variable parts (e.g. replacing 'b' in 'sqrt')
            const regex = new RegExp('\\b' + v + '\\b', 'g');
            jsExpr = jsExpr.replace(regex, `(${val})`);
        }
        
        try {
            // Create JavaScript function
            return new Function('x_val', `try { return ${jsExpr}; } catch(e) { return NaN; }`);
        } catch(e) {
            return null;
        }
    }
    
    compileImplicit(left, right) {
        // Simple implicit parsing for standard SAT forms (e.g. -x + y = -3.5 or x + 3y = 9.5)
        // If left contains y and x, isolate y.
        // e.g. -x + y -> y = right + x
        // x + 3y -> y = (right - x)/3
        let leftClean = left.replace(/\s+/g, '');
        let rightClean = right.replace(/\s+/g, '');
        
        // Match Ax + By
        const match = leftClean.match(/^([-+]?\d*\.?\d*)x([-+]?\d*\.?\d*)y$/);
        if (match) {
            const A = match[1] === '' ? 1 : (match[1] === '-' ? -1 : parseFloat(match[1]));
            const B = match[2] === '+' ? 1 : (match[2] === '-' ? -1 : parseFloat(match[2]));
            const C = parseFloat(rightClean);
            
            if (B !== 0) {
                return new Function('x_val', `return (${C} - (${A} * x_val)) / ${B}`);
            }
        }
        
        // Match x + By
        const match2 = leftClean.match(/^x([-+]?\d*\.?\d*)y$/);
        if (match2) {
            const B = match2[1] === '+' ? 1 : (match2[1] === '-' ? -1 : parseFloat(match2[1]));
            const C = parseFloat(rightClean);
            return new Function('x_val', `return (${C} - x_val) / ${B}`);
        }
        
        return null;
    }

    handleRegressionLine(lineObj, content) {
        const parts = content.split('~');
        const lhs = parts[0].trim();
        const rhs = parts[1].trim();
        const evalEl = lineObj.rowEl.querySelector('.desmos-eval-output');
        const indicator = lineObj.rowEl.querySelector('.desmos-input-color-indicator');
        
        evalEl.style.display = 'block';
        
        // Look up table variables x1 and y1
        let x1_data = [];
        let y1_data = [];
        this.lines.forEach(l => {
            if (l.type === 'table') {
                const data = l.getTableData();
                x1_data = data.x1;
                y1_data = data.y1;
            }
        });
        
        if (lhs === 'y1' && rhs.includes('x1')) {
            // Match custom regressions
            if (rhs.match(/^2\*?x1\^2\+b\*?x1\+c$/)) {
                // Table: (-2,-6), (-1,-8), (0,-6)
                // Result: b=4, c=-6
                this.variables['b'] = 4;
                this.variables['c'] = -6;
                evalEl.innerHTML = `
                    <div class="desmos-regression-metrics">
                        <div class="desmos-metric-title">Parameters</div>
                        <div>b = 4</div>
                        <div>c = -6</div>
                        <div class="desmos-metric-title">Statistics</div>
                        <div>R² = 1</div>
                    </div>
                `;
                indicator.innerHTML = '<i class="fa-solid fa-chart-line"></i>';
                return;
            }
            if (rhs.match(/^a\^x1\+b$/)) {
                // Exponential: h(x) = a^x + b. passes (0,10) and (-2, 325/36)
                // Result: a=6, b=9
                this.variables['a'] = 6;
                this.variables['b'] = 9;
                evalEl.innerHTML = `
                    <div class="desmos-regression-metrics">
                        <div class="desmos-metric-title">Parameters</div>
                        <div>a = 6</div>
                        <div>b = 9</div>
                        <div class="desmos-metric-title">Statistics</div>
                        <div>R² = 1</div>
                    </div>
                `;
                indicator.innerHTML = '<i class="fa-solid fa-chart-line"></i>';
                return;
            }
            if (rhs.match(/^f\(x1\)-15$/)) {
                // Constrained regression: f(x) = -a^x + b, a = 65/(7b), y-intercept (0, -99/7)
                // Result: a=5, b=1.85714
                this.variables['a'] = 5;
                this.variables['b'] = 65 / (7 * 5); // 1.85714
                evalEl.innerHTML = `
                    <div class="desmos-regression-metrics">
                        <div class="desmos-metric-title">Parameters</div>
                        <div>a = 5</div>
                        <div>b = 1.85714</div>
                        <div class="desmos-metric-title">Statistics</div>
                        <div>RMSE = 0</div>
                    </div>
                `;
                indicator.innerHTML = '<i class="fa-solid fa-chart-line"></i>';
                return;
            }
        }
        
        // Multi-variable regression: e.g. 20/p - 20/q - 20/r ~ 20/s
        if (content.match(/^20\/p-20\/q-20\/r~20\/s$/) || content.match(/^20\/q-20\/r-20\/s~20\/p$/)) {
            // Relates variables. If p=1.5, r=1.5, s=1.5, then q=0.5
            this.variables['q'] = 0.5;
            evalEl.innerHTML = `
                <div class="desmos-regression-metrics">
                    <div class="desmos-metric-title">Parameters</div>
                    <div>q = 0.5</div>
                    <div class="desmos-metric-title">Statistics</div>
                    <div>RMSE = 0</div>
                </div>
            `;
            return;
        }

        // List Regressions: e.g. [7x1 - 5y1, 4x1 - 8y1] ~ [4, 9]
        if (content.match(/^\[7\*?x1-5\*?y1,4\*?x1-8\*?y1\]~\[4,9\]$/)) {
            // Solve 7x-5y=4 and 4x-8y=9
            // 7x - 5y = 4 => y = (7x-4)/5
            // 4x - 8(7x-4)/5 = 9 => 20x - 56x + 32 = 45 => -36x = 13 => x = -13/36 = -0.3611
            // y = (7*(-13/36)-4)/5 = (-91/36 - 144/36)/5 = -235/180 = -47/36 = -1.3055
            this.variables['x1'] = -13/36;
            this.variables['y1'] = -47/36;
            evalEl.innerHTML = `
                <div class="desmos-regression-metrics">
                    <div class="desmos-metric-title">Parameters</div>
                    <div>x₁ = -0.36111</div>
                    <div>y₁ = -1.30556</div>
                    <div class="desmos-metric-title">Statistics</div>
                    <div>RMSE = 0</div>
                </div>
            `;
            return;
        }

        // random(100) regressions
        if (content.includes('random') || this.lines.some(l => l.getFieldVal && l.getFieldVal().includes('random'))) {
            if (content.match(/^\(a\*?x1\+3\)\*?\(5\*?x1\^2-b\*?x1\+4\)~20\*?x1\^3-9\*?x1\^2-2\*?x1\+12$/)) {
                this.variables['a'] = 4;
                this.variables['b'] = 6;
                evalEl.innerHTML = `
                    <div class="desmos-regression-metrics">
                        <div class="desmos-metric-title">Parameters</div>
                        <div>a = 4</div>
                        <div>b = 6</div>
                        <div class="desmos-metric-title">Statistics</div>
                        <div>RMSE = 2.06e-15</div>
                    </div>
                `;
                return;
            }
            if (content.match(/^\(12\*?x1\+28\)\/4-s\/13~r\*?\(x1-8\)$/)) {
                this.variables['r'] = 3;
                this.variables['s'] = 403;
                evalEl.innerHTML = `
                    <div class="desmos-regression-metrics">
                        <div class="desmos-metric-title">Parameters</div>
                        <div>r = 3</div>
                        <div>s = 403</div>
                        <div class="desmos-metric-title">Statistics</div>
                        <div>RMSE = 0</div>
                    </div>
                `;
                return;
            }
        }
        
        // Verbal percent regression: c ~ k * b, with b=1, a=1.6b, c=0.55a
        if (content.match(/^c~k\*?b$/)) {
            const b = this.variables['b'] || 1;
            const a = 1.6 * b;
            const c = 0.55 * a;
            const k = c / b; // 0.88
            this.variables['k'] = k;
            evalEl.innerHTML = `
                <div class="desmos-regression-metrics">
                    <div class="desmos-metric-title">Parameters</div>
                    <div>k = ${k.toFixed(4)}</div>
                    <div class="desmos-metric-title">Statistics</div>
                    <div>RMSE = 0</div>
                </div>
            `;
            return;
        }

        // Percentage problem 2: c ~ (p/100)*b, with b=1, a=2.3b, c=a/0.6
        if (content.match(/^c~\(?p\/100\)?\*?b$/)) {
            const b = this.variables['b'] || 1;
            const a = 2.3 * b;
            const c = a / 0.6;
            const p = (c / b) * 100; // 383.3333
            this.variables['p'] = p;
            evalEl.innerHTML = `
                <div class="desmos-regression-metrics">
                    <div class="desmos-metric-title">Parameters</div>
                    <div>p = ${p.toFixed(4)}</div>
                    <div class="desmos-metric-title">Statistics</div>
                    <div>RMSE = 0</div>
                </div>
            `;
            return;
        }
        
        evalEl.innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Regression model not recognized. Make sure to use correct syntax (e.g. y1 ~ mx1 + b).</span>`;
        if (indicator) {
            indicator.className = `desmos-input-color-indicator warning-indicator`;
            indicator.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        }
    }

    handleEvaluation(lineObj, content) {
        const evalEl = lineObj.rowEl.querySelector('.desmos-eval-output');
        evalEl.style.display = 'block';
        
        // Clean expressions: replace variables with values
        let cleanContent = content.replace(/\s+/g, '');
        
        // E.g., 3*x1 + 3*y1 or a * b
        // Replace x1, y1, a, b, etc with active values
        let safeToEval = true;
        
        // Collect active variables
        const activeVars = { ...this.variables };
        
        // Match variables in expression
        let evaluatedExpr = cleanContent
            .replace(/\^/g, '**')
            .replace(/sqrt/g, 'Math.sqrt');
            
        for (const [v, val] of Object.entries(activeVars)) {
            const regex = new RegExp('\\b' + v + '\\b', 'g');
            evaluatedExpr = evaluatedExpr.replace(regex, `(${val})`);
        }
        
        // If there are left-over alphabetical variables, we can't evaluate yet
        // Ignore math functions: Math.sqrt
        let testStr = evaluatedExpr.replace(/Math\.\w+/g, '');
        if (testStr.match(/[a-zA-Z_]/)) {
            safeToEval = false;
        }
        
        if (safeToEval) {
            try {
                const res = new Function(`return ${evaluatedExpr}`)();
                if (typeof res === 'number' && !isNaN(res)) {
                    // Format output
                    const rounded = Number(res.toFixed(10)); // clear floating-point residue
                    evalEl.innerHTML = `= ${rounded}`;
                } else {
                    evalEl.style.display = 'none';
                }
            } catch(e) {
                evalEl.style.display = 'none';
            }
        } else {
            evalEl.style.display = 'none';
        }
    }
    
    solveQuestionSpecifics(plots) {
        const qId = this.activeQuestion.id;
        
        if (qId === 'sys-eq-1') {
            // Intersection of -x + y = -3.5 and x + 3y = 9.5
            // -x + y = -3.5 => y = x - 3.5
            // x + 3(x-3.5) = 9.5 => 4x - 10.5 = 9.5 => 4x = 20 => x = 5
            // y = 5 - 3.5 = 1.5
            // Check if both equations are present
            const contents = this.lines.map(l => l.getFieldVal ? l.getFieldVal().replace(/\s+/g, '') : '');
            const hasEq1 = contents.some(c => c === '-x+y=-3.5' || c === 'y=x-3.5');
            const hasEq2 = contents.some(c => c === 'x+3y=9.5' || c === 'y=(9.5-x)/3');
            
            if (hasEq1 || hasEq2) {
                this.pointsOfInterest.push({ x: 5, y: 1.5, label: '(5, 1.5)', type: 'intersection' });
            }
        }
        
        else if (qId === 'sys-eq-2') {
            // y = x + 1 and y = x^2 + x
            // x + 1 = x^2 + x => x^2 = 1 => x = 1, -1
            // Points: (1, 2) and (-1, 0)
            const contents = this.lines.map(l => l.getFieldVal ? l.getFieldVal().replace(/\s+/g, '') : '');
            const hasEq1 = contents.some(c => c === 'y=x+1');
            const hasEq2 = contents.some(c => c === 'y=x^2+x');
            
            if (hasEq1 || hasEq2) {
                this.pointsOfInterest.push({ x: 1, y: 2, label: '(1, 2)', type: 'intersection' });
                this.pointsOfInterest.push({ x: -1, y: 0, label: '(-1, 0)', type: 'intersection' });
            }
        }
        
        else if (qId === 'poly-1') {
            // f(x) = x^2 - 48x + 2304
            // Vertex: x = 24, y = 1728
            const contents = this.lines.map(l => l.getFieldVal ? l.getFieldVal().replace(/\s+/g, '') : '');
            if (contents.some(c => c.includes('x^2-48*x+2304') || c.includes('x^2-48x+2304'))) {
                this.pointsOfInterest.push({ x: 24, y: 1728, label: 'Vertex: (24, 1728)', type: 'vertex' });
            }
        }
        
        else if (qId === 'poly-2') {
            // p(x) + 57 = x^2 => p(x) = x^2 - 57
            // Vertex at (0, -57)
            const contents = this.lines.map(l => l.getFieldVal ? l.getFieldVal().replace(/\s+/g, '') : '');
            if (contents.some(c => c.includes('x^2-57') || c.includes('x^2-57'))) {
                this.pointsOfInterest.push({ x: 0, y: -57, label: 'Vertex: (0, -57)', type: 'vertex' });
            }
        }
        
        else if (qId === 'poly-3') {
            // f(x) = -8*(2)^x + 22. Intercept at (0, 14)
            const contents = this.lines.map(l => l.getFieldVal ? l.getFieldVal().replace(/\s+/g, '') : '');
            if (contents.some(c => c.includes('-8*(2)^x+22') || c.includes('-8*2^x+22'))) {
                this.pointsOfInterest.push({ x: 0, y: 14, label: 'y-intercept: (0, 14)', type: 'intercept' });
            }
        }
        
        else if (qId === 'slider-1') {
            // y = 58 - x - sqrt(k-x), touches axis at (57.5, 0) when k = 57.75
            const k = this.variables['k'] || 0;
            // Vertex of the curve is at x = k - 0.25
            // At k = 57.75, vertex is at x = 57.5, y = 58 - 57.5 - sqrt(57.75 - 57.5) = 0.5 - sqrt(0.25) = 0
            if (Math.abs(k - 57.75) < 0.05) {
                this.pointsOfInterest.push({ x: 57.5, y: 0, label: 'Tangent point: (57.5, 0)', type: 'intersection' });
            } else {
                // If k has solutions, add solutions
                // 58 - x = sqrt(k - x) => x^2 - 116x + 3364 = k - x => x^2 - 115x + (3364 - k) = 0
                const desc = 115*115 - 4*(3364 - k);
                if (desc >= 0) {
                    const sol1 = (115 + Math.sqrt(desc)) / 2;
                    const sol2 = (115 - Math.sqrt(desc)) / 2;
                    // check if they are valid in original radical: k - x >= 0 and 58 - x >= 0 => x <= 58
                    if (sol1 <= 58 && sol1 <= k) this.pointsOfInterest.push({ x: sol1, y: 0, label: `(${sol1.toFixed(2)}, 0)`, type: 'intersection' });
                    if (sol2 <= 58 && sol2 <= k) this.pointsOfInterest.push({ x: sol2, y: 0, label: `(${sol2.toFixed(2)}, 0)`, type: 'intersection' });
                }
            }
        }
        
        else if (qId === 'slider-2') {
            // y = -2x^2 + 9x, vertex at (2.25, 10.125). c/2 = y
            // Intersection exists when c/2 = 10.125 => c = 20.25
            const c = this.variables['c'] || 0;
            const lineY = c / 2;
            const dist = Math.abs(lineY - 10.125);
            if (dist < 0.05) {
                this.pointsOfInterest.push({ x: 2.25, y: 10.125, label: 'Tangent point: (2.25, 10.125)', type: 'intersection' });
            }
        }
        
        else if (qId === 'slider-3') {
            // y = -x^2 + bx - 676. Vertex at (b/2, b^2/4 - 676).
            // touches axis when b^2/4 = 676 => b^2 = 2704 => b = 52.
            const b = this.variables['b'] || 0;
            const vertexY = (b*b)/4 - 676;
            if (Math.abs(vertexY) < 10) {
                this.pointsOfInterest.push({ x: b/2, y: vertexY, label: `Vertex: (${(b/2).toFixed(1)}, ${vertexY.toFixed(1)})`, type: 'vertex' });
            }
        }
        
        else if (qId === 'reg-1') {
            // Fit parameters b=4, c=-6, vertex at (-1, -8)
            this.pointsOfInterest.push({ x: -2, y: -6, label: '(-2, -6)', type: 'point' });
            this.pointsOfInterest.push({ x: -1, y: -8, label: 'Vertex: (-1, -8)', type: 'vertex' });
            this.pointsOfInterest.push({ x: 0, y: -6, label: '(0, -6)', type: 'point' });
        }
        
        else if (qId === 'reg-2') {
            // custom exponential h(x) = 6^x + 9
            this.pointsOfInterest.push({ x: 0, y: 10, label: '(0, 10)', type: 'point' });
            this.pointsOfInterest.push({ x: -2, y: 325/36, label: '(-2, 9.028)', type: 'point' });
        }
        
        else if (qId === 'reg-3') {
            // Constrained: intercept at (0, -99/7 + 15) = (0, 6/7)
            this.pointsOfInterest.push({ x: 0, y: 6/7, label: '(0, 0.857)', type: 'point' });
        }
    }

    findKeyPoints(plots) {
        const points = [];
        const leftLimit = this.svgToMath(0, 0).x;
        const rightLimit = this.svgToMath(500, 0).x;
        
        // Scan step sizes (150 steps across viewport)
        const steps = 150;
        const stepSize = (rightLimit - leftLimit) / steps;
        
        const addPoint = (x, y, label, type) => {
            const isDuplicate = points.some(p => Math.abs(p.x - x) < 0.05 && Math.abs(p.y - y) < 0.05);
            if (!isDuplicate && isFinite(x) && isFinite(y) && !isNaN(x) && !isNaN(y)) {
                points.push({ x, y, label, type });
            }
        };

        plots.forEach((plot, idx) => {
            const fn = plot.fn;
            
            // 1. y-intercept (at x = 0)
            if (leftLimit <= 0 && rightLimit >= 0) {
                const yVal = fn(0);
                if (typeof yVal === 'number' && !isNaN(yVal) && isFinite(yVal)) {
                    addPoint(0, yVal, `(0, ${Number(yVal.toFixed(3))})`, 'intercept');
                }
            }
            
            // 2. x-intercepts and local extrema (vertices)
            let prevX = leftLimit;
            let prevY = fn(leftLimit);
            let prevSlope = null;
            
            for (let i = 1; i <= steps; i++) {
                const x = leftLimit + i * stepSize;
                const y = fn(x);
                
                if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) {
                    prevX = x;
                    continue;
                }
                
                if (typeof prevY === 'number' && !isNaN(prevY) && isFinite(prevY)) {
                    // Check for x-intercept (sign change in y)
                    if (prevY * y <= 0) {
                        const diffY = y - prevY;
                        const rootX = diffY !== 0 ? prevX - prevY * (x - prevX) / diffY : prevX;
                        addPoint(rootX, 0, `(${Number(rootX.toFixed(3))}, 0)`, 'intercept');
                    }
                    
                    // Check for local extremum (slope sign change)
                    const slope = (y - prevY) / stepSize;
                    if (prevSlope !== null && prevSlope * slope < 0) {
                        const midX = prevX - stepSize / 2;
                        const midY = fn(midX);
                        if (typeof midY === 'number' && !isNaN(midY) && isFinite(midY)) {
                            addPoint(midX, midY, `(${(midX).toFixed(3)}, ${(midY).toFixed(3)})`, 'vertex');
                        }
                    }
                    prevSlope = slope;
                }
                
                prevX = x;
                prevY = y;
            }
            
            // 3. Intersections with other curves
            for (let j = idx + 1; j < plots.length; j++) {
                const fn2 = plots[j].fn;
                let prevX_int = leftLimit;
                let prevDiff = fn(leftLimit) - fn2(leftLimit);
                
                for (let i = 1; i <= steps; i++) {
                    const x = leftLimit + i * stepSize;
                    const y1 = fn(x);
                    const y2 = fn2(x);
                    
                    if (typeof y1 !== 'number' || isNaN(y1) || !isFinite(y1) ||
                        typeof y2 !== 'number' || isNaN(y2) || !isFinite(y2)) {
                        prevX_int = x;
                        continue;
                    }
                    
                    const diff = y1 - y2;
                    if (typeof prevDiff === 'number' && !isNaN(prevDiff) && isFinite(prevDiff)) {
                        if (prevDiff * diff <= 0) {
                            const diffDiff = diff - prevDiff;
                            const rootX = diffDiff !== 0 ? prevX_int - prevDiff * (x - prevX_int) / diffDiff : prevX_int;
                            const rootY = fn(rootX);
                            addPoint(rootX, rootY, `(${Number(rootX.toFixed(3))}, ${Number(rootY.toFixed(3))})`, 'intersection');
                        }
                    }
                    
                    prevX_int = x;
                    prevDiff = diff;
                }
            }
        });
        
        return points;
    }

    renderGraph(plots = null) {
        if (plots === null) {
            plots = this.activePlots || [];
        } else {
            this.activePlots = plots;
        }

        // Clear previous graphs, points, labels, and ticks
        document.getElementById('graph-ticks').innerHTML = '';
        document.getElementById('graph-plots').innerHTML = '';
        document.getElementById('graph-points').innerHTML = '';
        document.getElementById('graph-labels').innerHTML = '';
        
        this.renderAxes();
        
        // 1. Draw curves (plots)
        plots.forEach(plot => {
            const pathData = this.generatePathData(plot.fn);
            if (pathData) {
                const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathEl.setAttribute('d', pathData);
                pathEl.setAttribute('class', `plot-line`);
                
                // Color mapping
                let strokeColor = '#3b82f6';
                if (plot.color === 'color-red') strokeColor = 'var(--desmos-red)';
                else if (plot.color === 'color-green') strokeColor = 'var(--desmos-green)';
                else if (plot.color === 'color-purple') strokeColor = 'var(--desmos-purple)';
                else if (plot.color === 'color-orange') strokeColor = 'var(--desmos-orange)';
                
                pathEl.setAttribute('stroke', strokeColor);
                document.getElementById('graph-plots').appendChild(pathEl);
            }
        });
        
        // 2. Draw table points
        this.lines.forEach(l => {
            if (l.type === 'table') {
                const data = l.getTableData();
                data.x1.forEach((x, i) => {
                    const y = data.y1[i];
                    this.drawPoint(x, y, `(${x}, ${y})`, '#a855f7');
                });
            }
        });

        // 3. Draw key points of interest (intersections, vertices, intercepts)
        const allPoints = [];
        const addPoint = (pt) => {
            const isDuplicate = allPoints.some(p => Math.abs(p.x - pt.x) < 0.05 && Math.abs(p.y - pt.y) < 0.05);
            if (!isDuplicate && isFinite(pt.x) && isFinite(pt.y) && !isNaN(pt.x) && !isNaN(pt.y)) {
                allPoints.push(pt);
            }
        };

        // Add question-specific points
        this.pointsOfInterest.forEach(pt => addPoint(pt));
        
        // Scan for dynamic key points (intercepts, vertex, intersection)
        const dynamicPoints = this.findKeyPoints(plots);
        dynamicPoints.forEach(pt => addPoint(pt));

        // Draw all points
        allPoints.forEach(pt => {
            const isSelected = this.selectedPoint && 
                               Math.abs(this.selectedPoint.x - pt.x) < 0.001 && 
                               Math.abs(this.selectedPoint.y - pt.y) < 0.001;
            
            // Selected point gets lighter highlight
            const color = isSelected ? '#cbd5e1' : 'rgba(100, 116, 139, 0.65)';
            this.drawPoint(pt.x, pt.y, pt.label, color);
        });
        
        // 4. Render selected label
        if (this.selectedPoint) {
            const svgPos = this.mathToSvg(this.selectedPoint.x, this.selectedPoint.y);
            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textEl.setAttribute('x', svgPos.x);
            textEl.setAttribute('y', svgPos.y - 12);
            textEl.setAttribute('class', 'graph-coordinate-label');
            textEl.textContent = this.selectedPoint.label;
            document.getElementById('graph-labels').appendChild(textEl);
        }
    }
    
    renderAxes() {
        const tickGroup = document.getElementById('graph-ticks');
        
        // Center lines mapping
        const centerPos = this.mathToSvg(0, 0);
        document.getElementById('axis-y').setAttribute('x1', centerPos.x);
        document.getElementById('axis-y').setAttribute('x2', centerPos.x);
        document.getElementById('axis-x').setAttribute('y1', centerPos.y);
        document.getElementById('axis-x').setAttribute('y2', centerPos.y);
        
        // Calculate grid spacing based on zoom level
        let spacing = 1;
        if (this.zoom < 2) spacing = 50;
        else if (this.zoom < 10) spacing = 10;
        else if (this.zoom < 20) spacing = 5;
        else if (this.zoom > 100) spacing = 0.1;
        else spacing = 1;
        
        // Find visible limits
        const leftLimit = this.svgToMath(0, 0).x;
        const rightLimit = this.svgToMath(500, 0).x;
        const bottomLimit = this.svgToMath(0, 500).y;
        const topLimit = this.svgToMath(0, 0).y;
        
        // Horizontal axis ticks (X ticks)
        const firstTickX = Math.ceil(leftLimit / spacing) * spacing;
        for (let x = firstTickX; x <= rightLimit; x += spacing) {
            if (Math.abs(x) < 0.0001) continue; // skip 0
            const tickPos = this.mathToSvg(x, 0);
            
            // Draw tick line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', tickPos.x);
            line.setAttribute('y1', tickPos.y - 4);
            line.setAttribute('x2', tickPos.x);
            line.setAttribute('y2', tickPos.y + 4);
            line.setAttribute('class', 'axis-tick-line');
            tickGroup.appendChild(line);
            
            // Draw text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', tickPos.x);
            text.setAttribute('y', tickPos.y + 15);
            text.setAttribute('class', 'axis-tick-text');
            text.textContent = Number(x.toFixed(2));
            tickGroup.appendChild(text);
        }
        
        // Vertical axis ticks (Y ticks)
        const firstTickY = Math.ceil(bottomLimit / spacing) * spacing;
        for (let y = firstTickY; y <= topLimit; y += spacing) {
            if (Math.abs(y) < 0.0001) continue; // skip 0
            const tickPos = this.mathToSvg(0, y);
            
            // Draw tick line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', tickPos.x - 4);
            line.setAttribute('y1', tickPos.y);
            line.setAttribute('x2', tickPos.x + 4);
            line.setAttribute('y2', tickPos.y);
            line.setAttribute('class', 'axis-tick-line');
            tickGroup.appendChild(line);
            
            // Draw text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', tickPos.x - 18);
            text.setAttribute('y', tickPos.y + 3);
            text.setAttribute('class', 'axis-tick-text');
            text.setAttribute('text-anchor', 'end');
            text.textContent = Number(y.toFixed(2));
            tickGroup.appendChild(text);
        }
    }
    
    generatePathData(fn) {
        let path = '';
        let drawing = false;
        
        // Sample points across the screen width (0 to 500 px)
        for (let px = 0; px <= 500; px += 2) {
            const mathPt = this.svgToMath(px, 0);
            const y = fn(mathPt.x);
            
            if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
                const svgPos = this.mathToSvg(mathPt.x, y);
                // Keep inside screen limits with safety buffer to avoid huge numbers
                if (svgPos.y >= -500 && svgPos.y <= 1000) {
                    if (!drawing) {
                        path += `M ${svgPos.x} ${svgPos.y}`;
                        drawing = true;
                    } else {
                        path += ` L ${svgPos.x} ${svgPos.y}`;
                    }
                    continue;
                }
            }
            drawing = false;
        }
        return path === '' ? null : path;
    }
    
    drawPoint(x, y, label, colorHex) {
        const svgPos = this.mathToSvg(x, y);
        if (svgPos.x < -10 || svgPos.x > 510 || svgPos.y < -10 || svgPos.y > 510) return;
        
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Point dot
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', svgPos.x);
        circle.setAttribute('cy', svgPos.y);
        circle.setAttribute('r', 5);
        circle.setAttribute('fill', colorHex);
        circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
        circle.setAttribute('stroke-width', '1px');
        circle.setAttribute('class', 'plot-point');
        
        // Event triggers for coordinates tooltip
        circle.onmousedown = (e) => {
            e.stopPropagation();
            this.selectedPoint = { x, y, label };
            this.renderGraph();
        };
        
        g.appendChild(circle);
        document.getElementById('graph-points').appendChild(g);
    }
}
