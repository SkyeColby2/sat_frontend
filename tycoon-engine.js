// SAT Vocabulary Web Application - Restaurant Tycoon Incremental Engine

class TycoonEngine {
    constructor(appInstance) {
        this.app = appInstance;
        
        // Base structures & upgrades config
        this.state = {
            cash: 0.00,
            multiplierLevel: 1,  // Level 1: +0% (base), Level 2: +50%, Level 3: +100%
            tablesCount: 4,      // Base 4 tables, max 8 tables
            staffLevel: 0,       // chefs/waiters
            tipJarLevel: 1,      // passive tip level
            currentFloor: 1,     // Floor expansions 1 to 4
            lastTickTime: Date.now()
        };
        
        // Timer for passive loop ticks
        this.tickInterval = null;
        
        // Active serving state
        this.activeServingQuestion = null;
        
        // Emojis lists
        this.customerEmojis = ["😀", "👨‍💼", "👩‍⚕️", "🧑‍🎨", "👩‍🎓", "🧔", "👵", "👶", "👮", "👩‍🍳"];
        this.staffEmojis = ["👨‍🍳", "👩‍🍳", "🤵", "💁‍♀️", "💁‍♂️"];
    }

    init() {
        this.loadState();
        this.startPassiveEarnings();
        this.renderVisuals();
        this.updateUI();
        this.bindEvents();
    }

    loadState() {
        const saved = localStorage.getItem('sat_vocab_tycoon_state');
        if (saved) {
            try {
                this.state = { ...this.state, ...JSON.parse(saved) };
                // Keep time ticks linear
                this.state.lastTickTime = Date.now();
            } catch(e) {
                console.error("Failed to parse tycoon state:", e);
            }
        }
    }

    saveState() {
        localStorage.setItem('sat_vocab_tycoon_state', JSON.stringify(this.state));
        this.app.syncSidebarTycoon();
    }

    getUpgradeCost(type) {
        switch(type) {
            case 'multiplier':
                return Math.round(50 * Math.pow(1.5, this.state.multiplierLevel - 1));
            case 'tables':
                if (this.state.tablesCount >= 8) return Infinity;
                return Math.round(150 * Math.pow(2.0, this.state.tablesCount - 4));
            case 'staff':
                return Math.round(300 * Math.pow(1.8, this.state.staffLevel));
            case 'tipjar':
                return Math.round(100 * Math.pow(1.6, this.state.tipJarLevel - 1));
            case 'floor':
                if (this.state.currentFloor >= 4) return Infinity;
                const floorCosts = [0, 1000, 5000, 25000];
                return floorCosts[this.state.currentFloor];
            default:
                return 0;
        }
    }

    getPassiveIncomeRate() {
        // formula: tables * tipRate * staffEfficiency * floorBonus
        const tipRate = 0.25 * this.state.tipJarLevel;
        const staffEfficiency = 1.0 + (this.state.staffLevel * 0.15);
        const floorMultiplier = Math.pow(2.5, this.state.currentFloor - 1);
        
        return this.state.tablesCount * tipRate * staffEfficiency * floorMultiplier;
    }

    getActiveServeBonus() {
        const baseBonus = 100.00;
        const multiplier = 1.0 + (this.state.multiplierLevel - 1) * 0.5;
        const floorMultiplier = Math.pow(3.0, this.state.currentFloor - 1);
        
        return baseBonus * multiplier * floorMultiplier;
    }

    startPassiveEarnings() {
        if (this.tickInterval) clearInterval(this.tickInterval);
        
        this.state.lastTickTime = Date.now();
        
        this.tickInterval = setInterval(() => {
            const now = Date.now();
            const elapsedSeconds = (now - this.state.lastTickTime) / 1000;
            this.state.lastTickTime = now;
            
            const incomeRate = this.getPassiveIncomeRate();
            const earned = incomeRate * elapsedSeconds;
            
            if (earned > 0) {
                this.state.cash += earned;
                this.updateUI();
                
                // Randomly seat customers based on income ticking (purely visual)
                if (Math.random() < 0.08) {
                    this.seatRandomCustomers();
                }
            }
        }, 200);
    }

    updateUI() {
        // Update top stats
        document.getElementById('tycoon-cash').textContent = this.state.cash.toFixed(2);
        document.getElementById('tycoon-income-rate').textContent = this.getPassiveIncomeRate().toFixed(2);
        document.getElementById('tycoon-floor-display').textContent = `Floor ${this.state.currentFloor}`;
        document.getElementById('tycoon-seating-ratio').textContent = `Capacity: ${this.state.tablesCount * 4} seats`;
        
        // Update Serve Active order box
        document.getElementById('serve-bonus-val').textContent = this.getActiveServeBonus().toFixed(2);

        // Update Shop Upgrade prices & levels
        this.updateShopItem('multiplier', this.state.multiplierLevel);
        this.updateShopItem('tables', this.state.tablesCount);
        this.updateShopItem('staff', this.state.staffLevel);
        this.updateShopItem('tipjar', this.state.tipJarLevel);
        this.updateShopItem('floor', this.state.currentFloor);
    }

    updateShopItem(type, level) {
        const itemEl = document.getElementById(`upgrade-${type}`);
        if (!itemEl) return;
        
        const cost = this.getUpgradeCost(type);
        const buyBtn = itemEl.querySelector('.upgrade-buy-btn');
        
        // Level display
        const levelVal = itemEl.querySelector('.level-val');
        if (levelVal) levelVal.textContent = level;
        
        // Custom subtitle labels
        if (type === 'tables') {
            const countVal = itemEl.querySelector('.count-val');
            if (countVal) countVal.textContent = level;
        }
        
        if (cost === Infinity) {
            buyBtn.innerHTML = "MAXED";
            buyBtn.disabled = true;
            buyBtn.className = "btn upgrade-buy-btn disabled";
        } else {
            buyBtn.querySelector('.price-val').textContent = cost.toFixed(0);
            
            // Check if player has enough cash
            if (this.state.cash >= cost) {
                buyBtn.disabled = false;
                buyBtn.className = "btn btn-amber upgrade-buy-btn";
                if (type === 'floor') buyBtn.className = "btn btn-gold upgrade-buy-btn";
            } else {
                buyBtn.disabled = true;
                buyBtn.className = "btn upgrade-buy-btn disabled";
            }
        }
    }

    bindEvents() {
        // Upgrade button click listeners
        const upgradeItems = ['multiplier', 'tables', 'staff', 'tipjar', 'floor'];
        
        upgradeItems.forEach(type => {
            const itemEl = document.getElementById(`upgrade-${type}`);
            if (!itemEl) return;
            
            const btn = itemEl.querySelector('.upgrade-buy-btn');
            btn.onclick = () => this.buyUpgrade(type);
        });

        // Serve customer order button
        const serveBtn = document.getElementById('serve-customer-btn');
        serveBtn.onclick = () => this.launchServeQuestion();
    }

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (this.state.cash >= cost) {
            this.state.cash -= cost;
            
            if (type === 'multiplier') this.state.multiplierLevel++;
            else if (type === 'tables') this.state.tablesCount = Math.min(8, this.state.tablesCount + 1);
            else if (type === 'staff') this.state.staffLevel++;
            else if (type === 'tipjar') this.state.tipJarLevel++;
            else if (type === 'floor') this.state.currentFloor = Math.min(4, this.state.currentFloor + 1);
            
            this.saveState();
            this.renderVisuals();
            this.updateUI();
            
            this.app.showNotification("Upgrade Purchased!", `Your restaurant has been upgraded.`, "success");
        }
    }

    renderVisuals() {
        const visualGrid = document.getElementById('floor-visualizer');
        if (!visualGrid) return;
        
        visualGrid.innerHTML = '';
        
        // Render slots for active dining tables
        for (let i = 0; i < 8; i++) {
            const tableSlot = document.createElement('div');
            tableSlot.className = 'table-slot';
            
            const tableIndex = i + 1;
            const isPurchased = tableIndex <= this.state.tablesCount;
            
            if (isPurchased) {
                tableSlot.classList.add('active');
                tableSlot.innerHTML = `
                    <i class="fa-solid fa-square-envelope table-icon"></i>
                    <span style="font-size:0.65rem;font-weight:700;">Table ${tableIndex}</span>
                    <div class="slot-customers" id="table-customers-${tableIndex}"></div>
                `;
            } else {
                tableSlot.innerHTML = `
                    <i class="fa-solid fa-lock table-icon" style="opacity:0.3;"></i>
                    <span style="font-size:0.65rem;color:var(--text-muted);">Locked</span>
                `;
            }
            
            visualGrid.appendChild(tableSlot);
        }
        
        // Render Floating Chefs (representing staff upgrades)
        for (let s = 0; s < this.state.staffLevel; s++) {
            const staffEmoji = this.staffEmojis[s % this.staffEmojis.length];
            const staffEl = document.createElement('div');
            staffEl.className = 'visual-staff-member';
            staffEl.textContent = staffEmoji;
            
            // Randomly position them inside dining visualizer
            staffEl.style.left = `${10 + Math.random() * 80}%`;
            staffEl.style.top = `${20 + Math.random() * 60}%`;
            visualGrid.appendChild(staffEl);
        }
        
        this.seatRandomCustomers();
    }

    seatRandomCustomers() {
        // Seat visual customer emojis at active tables
        for (let t = 1; t <= this.state.tablesCount; t++) {
            const tableCustContainer = document.getElementById(`table-customers-${t}`);
            if (!tableCustContainer) continue;
            
            // 70% chance a table has some customers eating
            tableCustContainer.innerHTML = '';
            if (Math.random() < 0.7) {
                const dinersCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 customers
                for (let c = 0; c < dinersCount; c++) {
                    const cEmoji = this.customerEmojis[Math.floor(Math.random() * this.customerEmojis.length)];
                    const diner = document.createElement('span');
                    diner.className = 'customer-emoji';
                    diner.textContent = cEmoji;
                    tableCustContainer.appendChild(diner);
                }
            }
        }
    }

    launchServeQuestion() {
        // Check if there are words in the vocab pool
        const pool = this.app.getVocabularyPool();
        if (pool.length === 0) {
            alert("No words available in the vocabulary pool. Please import some or reload defaults first!");
            return;
        }

        // Display Serving order question modal
        const modal = document.getElementById('serving-modal');
        modal.style.display = 'flex';
        
        // Reset modal layout
        document.getElementById('serve-modal-feedback').style.display = 'none';
        document.getElementById('serve-modal-footer').style.display = 'none';
        
        // Setup a random question
        const q = this.app.studyEngine.generateRandomQuestionFromPool();
        this.activeServingQuestion = q;
        
        document.getElementById('serve-modal-word').textContent = q.word.word;
        document.getElementById('serve-modal-prompt').innerHTML = q.prompt;
        
        // Show the word for synonym questions; hide it for fill-in-the-blank
        document.getElementById('serve-modal-word').style.display =
            (q.type === 'synonym') ? 'block' : 'none';
        
        const sentenceEl = document.getElementById('serve-modal-sentence');
        if (q.sentence) {
            sentenceEl.innerHTML = q.sentence;
            sentenceEl.style.display = 'block';
        } else {
            sentenceEl.style.display = 'none';
        }
        
        // Generate options buttons
        const optionsContainer = document.getElementById('serve-modal-options');
        optionsContainer.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = opt;
            btn.onclick = () => this.submitServeAnswer(btn, opt);
            optionsContainer.appendChild(btn);
        });

        // Close button modal
        document.getElementById('close-serving-modal-btn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    submitServeAnswer(buttonEl, selectedOption) {
        // Disable other options to prevent multiple clicks
        const container = document.getElementById('serve-modal-options');
        container.querySelectorAll('button').forEach(btn => btn.disabled = true);
        
        const correct = selectedOption === this.activeServingQuestion.answer;
        const feedback = document.getElementById('serve-modal-feedback');
        const footer = document.getElementById('serve-modal-footer');
        
        feedback.style.display = 'block';
        footer.style.display = 'flex';
        
        if (correct) {
            buttonEl.classList.add('correct');
            feedback.className = "serving-feedback success";
            
            // Calculate active serve cash bonus
            const bonus = this.getActiveServeBonus();
            this.state.cash += bonus;
            this.saveState();
            this.updateUI();
            
            document.getElementById('serve-modal-feedback-title').innerHTML = `<i class="fa-solid fa-circle-check"></i> Order Served Successfully!`;
            document.getElementById('serve-modal-feedback-text').textContent = `The customer was pleased! You earned a massive cash tip of $${bonus.toFixed(2)}.`;
            
            // Trigger confetti or success sound placeholder if desired
            this.seatRandomCustomers();
        } else {
            buttonEl.classList.add('incorrect');
            feedback.className = "serving-feedback error";
            
            // Highlight correct one
            container.querySelectorAll('button').forEach(btn => {
                if (btn.textContent === this.activeServingQuestion.answer) {
                    btn.classList.add('correct');
                }
            });
            
            document.getElementById('serve-modal-feedback-title').innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Wrong Dish Served!`;
            document.getElementById('serve-modal-feedback-text').textContent = `Incorrect definition. The customer left without tipping. The correct answer was: "${this.activeServingQuestion.answer}".`;
        }
        
        // Handle continue button
        document.getElementById('serve-modal-continue-btn').onclick = () => {
            document.getElementById('serving-modal').style.display = 'none';
        };
    }

    stop() {
        if (this.tickInterval) clearInterval(this.tickInterval);
    }
}
