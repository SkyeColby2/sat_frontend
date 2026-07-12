// SAT Vocabulary Web Application - Study & Games Engine (Study, Flashcards, Beat the Timer)

class StudyEngine {
    constructor(appInstance) {
        this.app = appInstance;
        
        // Active learning states
        this.activeStudyWord = null;
        this.activeStudyQuestion = null;
        
        // Active flashcard state
        this.flashcardIndex = 0;
        this.isFlashcardFlipped = false;
        
        // Beat the Timer state
        this.timerGameActive = false;
        this.timerStreak = 0;
        this.timerLimit = 10.00; // starts at 10.0s
        this.timerRemaining = 10.00;
        this.timerInterval = null;
        this.timerQuestion = null;
        this.timerLastTimestamp = null;
        this.timerHighScore = parseInt(localStorage.getItem('sat_vocab_timer_highscore') || '0');
    }

    init() {
        this.updateHighScoreDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Study mode next button
        document.getElementById('study-next-btn').onclick = () => {
            document.getElementById('study-feedback-box').style.display = 'none';
            this.loadNextStudyQuestion();
        };

        // Flashcards click to flip
        const cardItem = document.getElementById('flashcard-item');
        cardItem.onclick = () => {
            this.isFlashcardFlipped = !this.isFlashcardFlipped;
            if (this.isFlashcardFlipped) {
                cardItem.querySelector('.flashcard-card').classList.add('flipped');
            } else {
                cardItem.querySelector('.flashcard-card').classList.remove('flipped');
            }
        };

        // Flashcards controls
        document.getElementById('card-prev-btn').onclick = () => this.navigateFlashcards(-1);
        document.getElementById('card-next-btn').onclick = () => this.navigateFlashcards(1);

        // Flashcards difficulty rate buttons
        const rateButtons = document.querySelectorAll('.btn-rate');
        rateButtons.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation(); // prevent card flip
                const difficulty = btn.getAttribute('data-difficulty');
                this.rateCurrentWordDifficulty(difficulty);
            };
        });

        // Beat the Timer buttons
        document.getElementById('start-timer-game-btn').onclick = () => this.startTimerGame();
        document.getElementById('restart-timer-game-btn').onclick = () => this.startTimerGame();
        document.getElementById('exit-timer-game-btn').onclick = () => this.exitTimerGame();
    }

    // ==========================================
    // STUDY COMPONENT (LEARNING LOOP)
    // ==========================================
    loadNextStudyQuestion() {
        const pool = this.app.getVocabularyPool();
        if (pool.length === 0) {
            document.getElementById('study-target-word').textContent = "No Words Loaded";
            document.getElementById('study-phonetic').textContent = "";
            document.getElementById('study-instruction').textContent = "Please import a CSV file or load defaults.";
            document.getElementById('study-mcq-options').innerHTML = '';
            return;
        }

        // Find words that are not mastered yet
        const unmastered = pool.filter(w => !w.stage || w.stage !== 'Mastered');
        
        // If all words are mastered, show complete screen
        if (unmastered.length === 0) {
            document.getElementById('study-target-word').textContent = "All Words Mastered!";
            document.getElementById('study-phonetic').textContent = "🎉 Excellent Work!";
            document.getElementById('study-instruction').innerHTML = "You have successfully mastered every word in your vocabulary pool. You can reset progress in the sidebar to start over, or import a new word list!";
            document.getElementById('study-mcq-options').innerHTML = '';
            document.getElementById('badge-stage-a').className = "stage-badge";
            document.getElementById('badge-stage-b').className = "stage-badge";
            document.getElementById('badge-stage-c').className = "stage-badge";
            return;
        }

        // Pick a word (prioritize those in progress, or choose randomly)
        // We can sort so that words at Stage B or C come first, or select randomly from unmastered
        const randomWord = unmastered[Math.floor(Math.random() * unmastered.length)];
        this.activeStudyWord = randomWord;
        
        const stage = randomWord.stage || 'A';
        this.renderStageBadges(stage);
        
        // Load target details
        document.getElementById('study-target-word').textContent = randomWord.word;
        document.getElementById('study-phonetic').textContent = randomWord.phonetic || "";
        
        // Build question elements based on Stage
        if (stage === 'A') {
            this.generateStageAQuestion(randomWord);
        } else if (stage === 'B') {
            this.generateStageBQuestion(randomWord);
        } else if (stage === 'C') {
            this.generateStageCQuestion(randomWord);
        }
    }

    renderStageBadges(activeStage) {
        const a = document.getElementById('badge-stage-a');
        const b = document.getElementById('badge-stage-b');
        const c = document.getElementById('badge-stage-c');
        
        a.className = "stage-badge" + (activeStage === 'A' ? " active" : "");
        b.className = "stage-badge" + (activeStage === 'B' ? " active" : "");
        c.className = "stage-badge" + (activeStage === 'C' ? " active" : "");
    }

    // Synonym MCQ (Stage A)
    generateStageAQuestion(word) {
        document.getElementById('study-instruction').textContent = "Identify the SYNONYM of the word below:";
        document.getElementById('study-context-sentence').style.display = 'none';
        document.getElementById('study-mcq-options').style.display = 'grid';
        document.getElementById('study-bank-area').style.display = 'none';
        // Show the target word — students MUST see it to know which synonym to pick
        document.querySelector('#study-view .word-info').style.display = 'flex';
        
        // Junk terms that should never appear as a synonym answer
        const JUNK_TERMS = new Set([
            'equivalent', 'related term', 'related word', 'point elasticity',
            'alternate term', 'correlative', 'analogue', 'substitute',
        ]);
        
        // Find the first real (non-junk) synonym to use as the correct answer
        const realSynonyms = (word.synonyms || []).filter(s => !JUNK_TERMS.has(s));
        
        // If the word has NO real synonyms, fall back to context question for this word
        if (realSynonyms.length === 0) {
            this.generateStageBQuestion(word);
            return;
        }
        
        const correctSynonym = realSynonyms[0];
        
        // Step 1: Use preloaded distractors if they exist and are clean
        let selectedDistractors = (word.distractors || [])
            .filter(s => !JUNK_TERMS.has(s) && s !== correctSynonym && !realSynonyms.includes(s));
        
        // Step 2: If we don't have 3 clean distractors, pull from other words' distractors
        if (selectedDistractors.length < 3) {
            const pool = this.app.getVocabularyPool();
            const otherWords = pool.filter(w => w.word !== word.word);
            
            let fallbackDistractors = [];
            otherWords.forEach(w => {
                // Use the other word's first real synonym as a distractor (sounds like a synonym)
                const otherRealSyns = (w.synonyms || []).filter(s => !JUNK_TERMS.has(s));
                if (otherRealSyns.length > 0) fallbackDistractors.push(otherRealSyns[0]);
                // Also try their distractors
                (w.distractors || []).forEach(d => {
                    if (!JUNK_TERMS.has(d)) fallbackDistractors.push(d);
                });
            });
            
            // Deduplicate and filter out the correct answer and target's own synonyms
            fallbackDistractors = [...new Set(fallbackDistractors)]
                .filter(syn => !realSynonyms.includes(syn) && syn !== correctSynonym);
            
            this.shuffleArray(fallbackDistractors);
            
            const needed = 3 - selectedDistractors.length;
            selectedDistractors = selectedDistractors.concat(fallbackDistractors.slice(0, needed));
        }
        
        // Final safety: ensure we always have exactly 3 distractors
        while (selectedDistractors.length < 3) {
            selectedDistractors.push("contrary");
        }
        selectedDistractors = selectedDistractors.slice(0, 3);
        
        const options = [correctSynonym, ...selectedDistractors];
        this.shuffleArray(options);
        
        this.activeStudyQuestion = {
            answer: correctSynonym,
            explanation: `<strong>${word.word}</strong> means "${word.definition}".<br>Its synonyms include: <em>${realSynonyms.join(', ')}</em>.`
        };
        
        const container = document.getElementById('study-mcq-options');
        container.innerHTML = '';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = opt;
            btn.onclick = () => this.submitStudyAnswer(btn, opt);
            container.appendChild(btn);
        });
    }

    // Contextual MCQ (Stage B)
    generateStageBQuestion(word) {
        document.getElementById('study-instruction').textContent = "Select the correct word to fill in the blank in this sentence:";
        // Hide the word — the sentence blank IS the question; showing the word gives it away
        document.querySelector('#study-view .word-info').style.display = 'none';
        
        const sentenceBox = document.getElementById('study-context-sentence');
        sentenceBox.innerHTML = word.sentence || "";
        sentenceBox.style.display = 'block';
        
        document.getElementById('study-mcq-options').style.display = 'grid';
        document.getElementById('study-bank-area').style.display = 'none';
        
        const correctWord = word.word;
        
        // Distractors: use pre-calculated or select from pool
        let selectedDistractors = [...(word.distractors || [])];
        if (selectedDistractors.length < 3) {
            const pool = this.app.getVocabularyPool();
            const otherWords = pool.filter(w => w.word !== word.word).map(w => w.word);
            this.shuffleArray(otherWords);
            selectedDistractors = otherWords.slice(0, 3);
        }
        
        const options = [correctWord, ...selectedDistractors];
        this.shuffleArray(options);
        
        const explanationSentence = (word.sentence || "").replace(/______+/g, `<strong>${word.word}</strong>`);
        this.activeStudyQuestion = {
            answer: correctWord,
            explanation: `Sentence: "<em>${explanationSentence}</em>"<br><br><strong>${word.word}</strong> fits best because it means: "${word.definition}".`
        };
        
        const container = document.getElementById('study-mcq-options');
        container.innerHTML = '';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = opt;
            btn.onclick = () => this.submitStudyAnswer(btn, opt);
            container.appendChild(btn);
        });
    }

    // Advanced Word Bank (Stage C)
    generateStageCQuestion(word) {
        document.getElementById('study-instruction').textContent = "Select the correct word from the bank below to fill the sentence blank:";
        // Hide the word — same reason as Stage B: showing it reveals the answer
        document.querySelector('#study-view .word-info').style.display = 'none';
        
        const sentenceBox = document.getElementById('study-context-sentence');
        sentenceBox.innerHTML = word.sentence || "";
        sentenceBox.style.display = 'block';
        
        document.getElementById('study-mcq-options').style.display = 'none';
        const bankArea = document.getElementById('study-bank-area');
        bankArea.style.display = 'block';
        
        const correctWord = word.word;
        
        // Gather 9 distractors: starting with preloaded ones
        let selectedDistractors = [...(word.distractors || [])];
        const pool = this.app.getVocabularyPool();
        
        // Fill up to 9 with other random words (excluding correct word and synonyms)
        const otherWords = pool.filter(w => {
            return w.word !== word.word && 
                   !(word.synonyms || []).includes(w.word) && 
                   !selectedDistractors.includes(w.word);
        }).map(w => w.word);
        
        this.shuffleArray(otherWords);
        selectedDistractors = selectedDistractors.concat(otherWords.slice(0, 9 - selectedDistractors.length));
        
        // Safeguard if pool is small
        while (selectedDistractors.length < 9) {
            selectedDistractors.push("distrac-" + Math.random().toString(36).substr(2, 4));
        }
        
        const bankOptions = [correctWord, ...selectedDistractors];
        this.shuffleArray(bankOptions);
        
        const explanationSentence = (word.sentence || "").replace(/______+/g, `<strong>${word.word}</strong>`);
        this.activeStudyQuestion = {
            answer: correctWord,
            explanation: `Sentence: "<em>${explanationSentence}</em>"<br><br><strong>${word.word}</strong> fits best. Definition: "${word.definition}".`
        };
        
        const bankContainer = document.getElementById('study-word-bank');
        bankContainer.innerHTML = '';
        
        bankOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-bank-item';
            btn.textContent = opt;
            btn.onclick = () => this.submitStudyStageCAnswer(btn, opt);
            bankContainer.appendChild(btn);
        });

        document.getElementById('clear-bank-selection-btn').onclick = () => {
            bankContainer.querySelectorAll('.btn-bank-item').forEach(btn => {
                btn.disabled = false;
                btn.className = 'btn-bank-item';
            });
        };
    }

    submitStudyAnswer(buttonEl, selectedOption) {
        // Disable other options to prevent multiple clicks
        const container = document.getElementById('study-mcq-options');
        container.querySelectorAll('button').forEach(btn => btn.disabled = true);
        
        const correct = selectedOption === this.activeStudyQuestion.answer;
        this.handleStudyFeedback(correct, buttonEl);
    }

    submitStudyStageCAnswer(buttonEl, selectedOption) {
        // For Stage C, evaluate immediately on click
        const bank = document.getElementById('study-word-bank');
        bank.querySelectorAll('.btn-bank-item').forEach(btn => btn.disabled = true);
        
        const correct = selectedOption === this.activeStudyQuestion.answer;
        this.handleStudyFeedback(correct, buttonEl);
    }

    handleStudyFeedback(correct, selectedBtn) {
        const feedbackBox = document.getElementById('study-feedback-box');
        const titleEl = document.getElementById('study-feedback-title');
        const descEl = document.getElementById('study-feedback-text');
        
        feedbackBox.style.display = 'block';
        
        if (correct) {
            selectedBtn.classList.add('correct');
            feedbackBox.className = "study-feedback success";
            titleEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Correct!`;
            
            // Advance Stage: A -> B -> C -> Mastered
            const currStage = this.activeStudyWord.stage || 'A';
            let nextStage = 'A';
            if (currStage === 'A') nextStage = 'B';
            else if (currStage === 'B') nextStage = 'C';
            else if (currStage === 'C') nextStage = 'Mastered';
            
            this.activeStudyWord.stage = nextStage;
            
            descEl.innerHTML = `Great work! ${this.activeStudyQuestion.explanation}`;
            
            // Add cash reward in tycoon if tycoon view is running
            if (this.app.tycoonEngine) {
                const bonus = 10.00 * this.app.tycoonEngine.state.currentFloor;
                this.app.tycoonEngine.state.cash += bonus;
                this.app.tycoonEngine.saveState();
                this.app.tycoonEngine.updateUI();
                descEl.innerHTML += `<br><span class="text-amber" style="font-weight:700;">+$${bonus.toFixed(2)} Tycoon Cash awarded!</span>`;
            }
        } else {
            selectedBtn.classList.add('incorrect');
            feedbackBox.className = "study-feedback error";
            titleEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Incorrect!`;
            
            // Highlight correct option
            const mcqContainer = document.getElementById('study-mcq-options');
            if (mcqContainer.style.display !== 'none') {
                mcqContainer.querySelectorAll('.btn-option').forEach(btn => {
                    if (btn.textContent === this.activeStudyQuestion.answer) {
                        btn.classList.add('correct');
                    }
                });
            }
            const bankContainer = document.getElementById('study-word-bank');
            if (bankContainer.style.display !== 'none') {
                bankContainer.querySelectorAll('.btn-bank-item').forEach(btn => {
                    if (btn.textContent === this.activeStudyQuestion.answer) {
                        btn.classList.add('correct');
                    }
                });
            }
            
            // Reset word back to Stage A
            this.activeStudyWord.stage = 'A';
            
            descEl.innerHTML = `Word resets back to Stage A. The correct answer was: <strong>${this.activeStudyQuestion.answer}</strong>.<br><br>${this.activeStudyQuestion.explanation}`;
        }
        
        // Save the updated pool to LocalStorage
        this.app.saveVocabularyPool();
        this.app.syncDashboardProgress();
    }

    // ==========================================
    // FLASHCARD REVIEW COMPONENT
    // ==========================================
    loadFlashcards() {
        const pool = this.app.getVocabularyPool();
        if (pool.length === 0) {
            document.getElementById('card-word-display').textContent = "Empty Deck";
            document.getElementById('card-phonetic-display').textContent = "";
            document.getElementById('card-definition-display').textContent = "Please import vocabulary words first.";
            document.getElementById('card-synonyms-display').textContent = "";
            document.getElementById('card-example-display').textContent = "";
            return;
        }
        
        // Cap index range
        if (this.flashcardIndex >= pool.length) this.flashcardIndex = 0;
        if (this.flashcardIndex < 0) this.flashcardIndex = pool.length - 1;
        
        const word = pool[this.flashcardIndex];
        
        // Reset card flip visual state
        this.isFlashcardFlipped = false;
        document.getElementById('flashcard-item').querySelector('.flashcard-card').classList.remove('flipped');
        
        // Populate Front Info
        document.getElementById('card-word-display').textContent = word.word;
        document.getElementById('card-phonetic-display').textContent = word.phonetic || `/${word.word}/`;
        
        // Populate Back Info
        document.getElementById('card-definition-display').textContent = word.definition;
        document.getElementById('card-synonyms-display').textContent = (word.synonyms || []).join(', ');
        
        const exampleSentenceHtml = (word.sentence || "").replace(/______+/g, `<strong>${word.word}</strong>`);
        document.getElementById('card-example-display').innerHTML = `"${exampleSentenceHtml}"`;
        
        // Render current difficulty active button style
        const activeDiff = word.difficulty || 'medium';
        document.querySelectorAll('.difficulty-rate-buttons .btn-rate').forEach(btn => {
            const diffType = btn.getAttribute('data-difficulty');
            if (diffType === activeDiff) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    navigateFlashcards(dir) {
        this.flashcardIndex += dir;
        this.loadFlashcards();
    }

    rateCurrentWordDifficulty(difficulty) {
        const pool = this.app.getVocabularyPool();
        if (pool.length === 0) return;
        
        const word = pool[this.flashcardIndex];
        word.difficulty = difficulty;
        this.app.saveVocabularyPool();
        
        // Update active rate button outline
        document.querySelectorAll('.difficulty-rate-buttons .btn-rate').forEach(btn => {
            if (btn.getAttribute('data-difficulty') === difficulty) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        this.app.syncDashboardProgress();
        this.app.showNotification("Difficulty Rated!", `"${word.word}" rated as ${difficulty}.`, "success");
    }

    // ==========================================
    // GAME #1: BEAT THE TIMER GAME
    // ==========================================
    startTimerGame() {
        const pool = this.app.getVocabularyPool();
        if (pool.length < 4) {
            alert("Please load at least 4 words in the vocabulary pool before playing Beat the Timer!");
            return;
        }

        // Setup views
        document.getElementById('timer-menu').style.display = 'none';
        document.getElementById('timer-gameover').style.display = 'none';
        document.getElementById('timer-gameplay').style.display = 'block';
        
        // Reset streak variables
        this.timerGameActive = true;
        this.timerStreak = 0;
        this.timerLimit = 10.00;
        this.timerRemaining = 10.00;
        
        this.updateStreakDisplay();
        this.loadTimerQuestion();
    }

    updateStreakDisplay() {
        document.getElementById('timer-current-streak').textContent = this.timerStreak;
        document.getElementById('timer-limit-val').textContent = `${this.timerLimit.toFixed(2)}s`;
    }

    loadTimerQuestion() {
        if (!this.timerGameActive) return;

        // Generate a random MCQ or fill-in-blank question
        const q = this.generateRandomQuestionFromPool();
        this.timerQuestion = q;
        
        document.getElementById('timer-target-word').textContent = q.word.word;
        document.getElementById('timer-prompt').innerHTML = q.prompt;
        
        // Show the word for synonym questions; hide it for fill-in-the-blank
        document.getElementById('timer-target-word').style.display =
            (q.type === 'synonym') ? 'block' : 'none';
        
        const sentenceEl = document.getElementById('timer-sentence');
        if (q.sentence) {
            sentenceEl.innerHTML = q.sentence;
            sentenceEl.style.display = 'block';
        } else {
            sentenceEl.style.display = 'none';
        }
        
        // Populate options grid
        const container = document.getElementById('timer-options-grid');
        container.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = opt;
            btn.onclick = () => this.submitTimerAnswer(btn, opt);
            container.appendChild(btn);
        });

        // Initialize Timer countdown loops
        this.timerRemaining = this.timerLimit;
        this.timerLastTimestamp = Date.now();
        
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - this.timerLastTimestamp) / 1000;
            this.timerLastTimestamp = now;
            
            this.timerRemaining -= elapsed;
            
            // Render progress bar fill
            const pct = Math.max(0, (this.timerRemaining / this.timerLimit) * 100);
            document.getElementById('timer-bar').style.width = `${pct}%`;
            
            if (this.timerRemaining <= 0) {
                this.endTimerGame("You ran out of time!");
            }
        }, 50);
    }

    generateRandomQuestionFromPool() {
        const pool = this.app.getVocabularyPool();
        
        // Junk synonyms that should never be used as an answer
        const JUNK_TERMS = new Set([
            'equivalent', 'related term', 'related word', 'point elasticity',
            'alternate term', 'correlative', 'analogue', 'substitute',
        ]);

        const getRealSynonyms = (word) =>
            (word.synonyms || []).filter(s => s && !s.endsWith('-like') && !JUNK_TERMS.has(s));
        
        // 50/50 split, but only use synonym type if a word with real synonyms exists
        const wordsWithSynonyms = pool.filter(w => getRealSynonyms(w).length > 0);
        const canDoSynonym = wordsWithSynonyms.length >= 4;
        const type = (canDoSynonym && Math.random() < 0.5) ? 'synonym' : 'context';
        
        if (type === 'synonym') {
            // Pick a random word that has at least one real synonym
            const word = wordsWithSynonyms[Math.floor(Math.random() * wordsWithSynonyms.length)];
            const realSynonyms = getRealSynonyms(word);
            const answer = realSynonyms[0];
            
            // Build distractors: prefer word.distractors, then other words' real synonyms
            let distractors = (word.distractors || [])
                .filter(s => !JUNK_TERMS.has(s) && s !== answer && !realSynonyms.includes(s));
            
            if (distractors.length < 3) {
                const fallback = [];
                pool.forEach(w => {
                    if (w.word === word.word) return;
                    const syns = getRealSynonyms(w);
                    if (syns.length > 0) fallback.push(syns[0]);
                    (w.distractors || []).forEach(d => { if (!JUNK_TERMS.has(d)) fallback.push(d); });
                });
                const extra = [...new Set(fallback)]
                    .filter(s => !realSynonyms.includes(s) && s !== answer);
                this.shuffleArray(extra);
                distractors = distractors.concat(extra.slice(0, 3 - distractors.length));
            }
            while (distractors.length < 3) distractors.push('contrary');
            distractors = distractors.slice(0, 3);

            const finalOptions = [answer, ...distractors];
            this.shuffleArray(finalOptions);
            
            return {
                type: 'synonym',
                word,
                prompt: "Identify the SYNONYM of the word above:",
                options: finalOptions,
                answer
            };
        } else {
            // Context sentence fill-in-the-blank
            const word = pool[Math.floor(Math.random() * pool.length)];
            const answer = word.word;
            let distractors = pool.filter(w => w.word !== word.word).map(w => w.word);
            while (distractors.length < 3) {
                distractors.push("dummy-" + Math.random().toString(36).substr(2, 3));
            }
            this.shuffleArray(distractors);
            const finalOptions = [answer, ...distractors.slice(0, 3)];
            this.shuffleArray(finalOptions);
            
            return {
                type: 'context',
                word,
                prompt: "Select the word that correctly fills the blank:",
                sentence: word.sentence,
                options: finalOptions,
                answer
            };
        }
    }

    submitTimerAnswer(buttonEl, selectedOption) {
        if (!this.timerGameActive) return;
        
        // ⏱️ Stop the timer loop immediately so the player can read the breakdown
        clearInterval(this.timerInterval);
        
        const container = document.getElementById('timer-options-grid');
        const correct = selectedOption === this.timerQuestion.answer;
        
        if (correct) {
            buttonEl.classList.add('correct');
            this.timerStreak++;
            this.timerLimit = this.timerLimit * 0.90;
            this.updateStreakDisplay();
            
            // Disable all buttons to prevent double clicking
            container.querySelectorAll('button').forEach(btn => btn.disabled = true);
            
            setTimeout(() => {
                this.loadTimerQuestion();
            }, 800);
        } else {
            // 🛑 WRONG ANSWER: Reveal correct details and require a manual click to end game
            buttonEl.classList.add('incorrect');
            
            // Highlight the correct option in green
            container.querySelectorAll('button').forEach(btn => {
                if (btn.textContent === this.timerQuestion.answer) {
                    btn.classList.add('correct');
                }
                btn.disabled = true;
            });
            
            // Inject context explanation block directly into the prompt panel area
            const promptEl = document.getElementById('timer-prompt');
            const targetWord = this.timerQuestion.word.word;
            const definition = this.timerQuestion.word.definition;
            const rawSentence = this.timerQuestion.word.sentence || "";
            
            let feedbackHtml = `
                <div style="margin-top: 16px; padding: 14px; background: rgba(248, 113, 113, 0.08); border: 1px solid rgba(248, 113, 113, 0.2); border-radius: 12px; text-align: left;">
                    <span style="color: #F87171; font-weight: 700; display: block; font-size: 0.9rem; margin-bottom: 6px;">
                        ⚠️ Streak Broken on "${targetWord}"
                    </span>
                    <span style="color: var(--text-secondary); display: block; font-size: 0.8rem; margin-bottom: 8px; line-height: 1.4;">
                        <strong>Definition:</strong> ${definition}
                    </span>
            `;

            if (rawSentence) {
                const filledSentence = rawSentence.replace(/______+/g, `<strong style="color:#F87171; text-decoration:underline;">${targetWord}</strong>`);
                feedbackHtml += `
                    <span style="color: var(--text-muted); display: block; font-size: 0.75rem; border-left: 2px solid #F87171; padding-left: 8px; font-style: italic; line-height: 1.4;">
                        "${filledSentence}"
                    </span>
                `;
            }
            feedbackHtml += `</div>`;
            promptEl.innerHTML += feedbackHtml;

            // 🛑 THE FIX: Append a manual "Proceed" action button at the bottom of the card list area
            const actionWrapper = document.createElement('div');
            actionWrapper.style.cssText = "width: 100%; text-align: center; margin-top: 16px;";
            actionWrapper.innerHTML = `
                <button id="timer-proceed-failure-btn" class="btn btn-indigo" style="width: 100%; padding: 12px; font-weight: 600; border-radius: 8px; cursor: pointer;">
                    Proceed to Game Over Screen ➔
                </button>
            `;
            container.after(actionWrapper);

            // Handle manual redirection exit click event
            document.getElementById('timer-proceed-failure-btn').onclick = () => {
                actionWrapper.remove(); // Clean up dynamic element button layout safely
                this.endTimerGame(`Stumbled on "${targetWord}". Correct: "${this.timerQuestion.answer}"`);
            };
        }
    }

    endTimerGame(reason) {
        this.timerGameActive = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        document.getElementById('timer-gameplay').style.display = 'none';
        
        const gameoverCard = document.getElementById('timer-gameover');
        gameoverCard.style.display = 'block';
        
        document.getElementById('timer-gameover-reason').textContent = reason;
        document.getElementById('timer-final-streak').textContent = this.timerStreak;
        
        // Check new high score
        if (this.timerStreak > this.timerHighScore) {
            this.timerHighScore = this.timerStreak;
            localStorage.setItem('sat_vocab_timer_highscore', this.timerHighScore.toString());
            this.updateHighScoreDisplay();
            document.getElementById('timer-new-high-indicator').textContent = "YES! 🎉";
            document.getElementById('timer-new-high-indicator').className = "text-emerald";
        } else {
            document.getElementById('timer-new-high-indicator').textContent = "No";
            document.getElementById('timer-new-high-indicator').className = "text-muted";
        }
    }

    exitTimerGame() {
        this.timerGameActive = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        document.getElementById('timer-gameplay').style.display = 'none';
        document.getElementById('timer-gameover').style.display = 'none';
        document.getElementById('timer-menu').style.display = 'block';
    }

    updateHighScoreDisplay() {
        document.getElementById('timer-high-score').textContent = this.timerHighScore;
    }

    // Helper: Shuffles an array in place
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
