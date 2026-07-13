// SAT Vocabulary Web Application - Main Application Controller

class AppController {
    constructor() {
        this.vocabPool = []; // Becomes the copy of the active selected list's words
        this.csvData = null;
        this.localDB = new Map();
        this.authReady = false;
        
        // 📁 NEW STATE ARCHITECTURE FOR SAVED LISTS
        this.savedLists = {
            "Default Deck": [] // Start with one default array lane container
        };
        this.activeListName = "Default Deck";
        this.masterProgressMap = {}; // Global dictionary mapping: word_name -> stage

        // Modules
        this.studyEngine = new StudyEngine(this);
        this.tycoonEngine = new TycoonEngine(this);
    }

    async init() {
        // ── Step 1: Auth gate — show login overlay, wait for resolution ──────
        await this.initAuth();

        // ── Step 2: Load local DB index ───────────────────────────────────────
        await this.loadLocalDB();
        
        // ── Step 3: Load vocab pool (cloud-first if signed in, else localStorage)
        await this.loadVocabPool();
        
        // ── Step 4: Initialize view router ───────────────────────────────────
        this.initRouter();
        
        // ── Step 5: Initialize game engines ──────────────────────────────────
        this.studyEngine.init();
        this.tycoonEngine.init();
        
        // ── Step 6: Sync UI components ────────────────────────────────────────
        this.syncDashboardProgress();
        this.initFileUploader();
        this.initAddWord();
        
        // Wire up reset button
        document.getElementById('reset-app-btn').onclick = () => this.resetAllData();
        // Wire up saved list hooks
        document.getElementById('create-list-btn').onclick = () => this.createNewSavedList();
        document.getElementById('delete-list-btn').onclick = () => this.deleteActiveList();
        document.getElementById('active-list-select').onchange = (e) => this.switchActiveList(e.target.value);
            // Search filter in vocab pool
        document.getElementById('vocab-search').oninput = (e) => this.filterVocabPool(e.target.value);
        // Wire up dynamic vocabulary destruction pipeline
        document.getElementById('wipe-vocab-btn').onclick = () => {
            if (confirm("🚨 WARNING: Are you sure you want to delete ALL vocabulary words from your current pool? This will wipe your active deck completely.")) {
                this.vocabPool = []; // Empty out the core in-memory array database pool
                
                // Save the empty state down to LocalStorage instantly
                this.saveVocabularyPool();
                
                // Force the app to sync the structural metrics numbers across the view panels
                this.syncDashboardProgress();
                
                // Notify the user via your toast notification system
                this.showNotification("Deck Wiped", "All vocabulary words have been removed from your active pool.", "warning");
                
                // Force the learning engine to update so it shows the clean empty fallback displays
                if (this.studyEngine) {
                    this.studyEngine.loadNextStudyQuestion();
                    this.studyEngine.loadFlashcards();
                }
            }
        };
        // Preloaded defaults button
        document.getElementById('load-defaults-btn').onclick = () => {
            if (confirm("Are you sure you want to reload the default SAT word list? This will replace your current vocabulary pool.")) {
                this.loadDefaultPool();
            }
        };

        // Sign-out button (visible only when signed in)
        document.getElementById('signout-btn').onclick = async () => {
            if (confirm('Sign out? Your progress is saved to the cloud.')) {
                await authManager.signOut();
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AUTH LAYER — Login overlay, Google Sign-In, cloud load/save
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Show the login overlay if Firebase is enabled, resolve when the user
     * either signs in with Google or clicks "Continue without signing in".
     * If Firebase is disabled (config not filled in), resolves immediately.
     */
    async initAuth() {
        // Boot Firebase
        const firebaseReady = await authManager.init();

        if (!firebaseReady) {
            // Firebase not configured — skip overlay entirely, run locally
            console.info('[App] Running in local-only mode (Firebase not configured).');
            return;
        }

        // Show the overlay
        const overlay      = document.getElementById('login-overlay');
        const googleBtn    = document.getElementById('google-signin-btn');
        const guestBtn     = document.getElementById('guest-continue-btn');
        const loadingEl    = document.getElementById('login-loading');
        const errorEl      = document.getElementById('login-error');

        // Helper to hide everything and reveal the app
        const dismissOverlay = () => {
            overlay.style.animation = 'loginCardOut 0.3s ease forwards';
            // Add a quick fade-out keyframe dynamically
            const style = document.createElement('style');
            style.textContent = '@keyframes loginCardOut { to { opacity:0; transform:scale(1.03); } }';
            document.head.appendChild(style);
            setTimeout(() => { overlay.style.display = 'none'; }, 320);
        };

        // Return a Promise that resolves when login is complete
        await new Promise((resolve) => {
            let resolved = false; // guard against double-resolve
            const once = (fn) => async (...args) => {
                if (resolved) return;
                resolved = true;
                await fn(...args);
                resolve();
            };

            // Check if user is already signed in (returning visit)
            authManager.onAuthChange(once(async (user) => {
                if (user) {
                    this._applyUserToSidebar(user);
                    dismissOverlay();
                } else {
                    // Not signed in — show the overlay
                    overlay.style.display = 'flex';
                    resolved = false; // reset so buttons can resolve
                }
            }));

            // Google button
            googleBtn.addEventListener('click', once(async () => {
                googleBtn.disabled = true;
                guestBtn.disabled  = true;
                errorEl.style.display   = 'none';
                loadingEl.style.display = 'flex';

                const user = await authManager.signInWithGoogle();

                if (user) {
                    this._applyUserToSidebar(user);
                    await this._loadCloudData();
                    dismissOverlay();
                } else {
                    // Sign-in failed or popup closed — reset so user can retry
                    resolved = false;
                    loadingEl.style.display = 'none';
                    googleBtn.disabled = false;
                    guestBtn.disabled  = false;
                    errorEl.textContent   = 'Sign-in was cancelled or failed. Please try again.';
                    errorEl.style.display = 'block';
                }
            }));

            // Guest button
            guestBtn.addEventListener('click', once(async () => {
                dismissOverlay();
            }));
        });
    }
// Creates a new empty named playlist channel container lane
    createNewSavedList() {
        const titleInput = document.getElementById('new-list-title');
        const title = titleInput.value.trim();
        
        if (!title) return;
        if (this.savedLists[title]) {
            alert("A list with that title already exists.");
            return;
        }

        this.savedLists[title] = [];
        titleInput.value = '';
        
        this.saveAllListsToStorage();
        this.updateListDropdownUI();
        this.switchActiveList(title);
        this.showNotification("List Created", `"${title}" is now active and ready for imports.`, "success");
    }

    // Swaps the primary engine array mapping targets smoothly
    switchActiveList(listName) {
        if (!this.savedLists[listName]) return;
        
        this.activeListName = listName;
        this.vocabPool = this.savedLists[listName];
        
        // Universal Stage Sync: Inject master dictionary tracking stages into words on display swap load
        this.syncVocabPoolWithMasterProgress();
        
        localStorage.setItem('sat_vocab_active_list_name', listName);
        this.updateListDropdownUI();
        this.syncDashboardProgress();
        
        if (this.studyEngine) {
            this.studyEngine.loadNextStudyQuestion();
            this.studyEngine.loadFlashcards();
        }
    }

    // Enforces state consistency across disconnected lists
    syncVocabPoolWithMasterProgress() {
        this.vocabPool.forEach(word => {
            const key = AppController.cleanKey(word.word);
            // If the global map has tracking logs, pull it. Otherwise initialize at 'A'.
            if (this.masterProgressMap[key]) {
                word.stage = this.masterProgressMap[key];
            } else {
                this.masterProgressMap[key] = word.stage || 'A';
                word.stage = this.masterProgressMap[key];
            }
        });
    }

    // Renders matching values inside your drop-down options selection node field
    updateListDropdownUI() {
        const select = document.getElementById('active-list-select');
        if (!select) return;
        
        select.innerHTML = '';
        Object.keys(this.savedLists).forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = `${name} (${this.savedLists[name].length} words)`;
            if (name === this.activeListName) opt.selected = true;
            select.appendChild(opt);
        });
    }

    // Intercepts saveVocabularyPool to serialize structural modifications seamlessly
    saveVocabularyPool() {
        // 1. Keep the active list's array synchronized with the master index records tracking map
        this.vocabPool.forEach(word => {
            const key = AppController.cleanKey(word.word);
            if (word.stage) {
                this.masterProgressMap[key] = word.stage;
            }
        });

        // 2. Commit universal progress map back into the master lists arrays channel collections
        this.savedLists[this.activeListName] = this.vocabPool;
        this.syncVocabPoolWithMasterProgress();

        // 3. Flatten values down to LocalStorage records tracks smoothly
        this.saveAllListsToStorage();
        
        if (authManager.isSignedIn) {
            this._setSyncStatus('syncing');
            authManager.scheduleSave(this._buildCloudSnapshot());
            setTimeout(() => this._setSyncStatus('saved'), 2500);
        }
    }

    saveAllListsToStorage() {
        localStorage.setItem('sat_vocab_saved_lists', JSON.stringify(this.savedLists));
        localStorage.setItem('sat_vocab_master_progress_map', JSON.stringify(this.masterProgressMap));
        localStorage.setItem('sat_vocab_active_list_name', this.activeListName);
        // Fallback backward compatibility insurance matching
        localStorage.setItem('sat_vocab_pool', JSON.stringify(this.vocabPool));
        localStorage.setItem('sat_vocab_version', AppController.DATA_VERSION);
    }
    /** Update sidebar user panel with Google account info. */
    _applyUserToSidebar(user) {
        document.getElementById('sidebar-user-panel').style.display = 'block';
        document.getElementById('user-display-name').textContent = user.displayName || 'Student';
        const avatarEl = document.getElementById('user-avatar');
        if (user.photoURL) {
            avatarEl.src = user.photoURL;
            avatarEl.style.display = 'block';
        } else {
            avatarEl.style.display = 'none';
        }
    }

    /** Load cloud save data and merge into localStorage + in-memory state. */
    async _loadCloudData() {
        const data = await authManager.loadUserData();
        if (!data) return;

        // Vocab pool — cloud wins over localStorage if it exists
        if (Array.isArray(data.vocabPool) && data.vocabPool.length > 0) {
            this.vocabPool = data.vocabPool;
            localStorage.setItem('sat_vocab_pool', JSON.stringify(this.vocabPool));
            localStorage.setItem('sat_vocab_version', AppController.DATA_VERSION);
            console.info(`[Auth] Restored ${this.vocabPool.length} words from cloud save.`);
        }

        // Tycoon state
        if (data.tycoonState) {
            localStorage.setItem('sat_tycoon_state', JSON.stringify(data.tycoonState));
        }

        // Timer high score
        if (typeof data.timerHighScore === 'number') {
            localStorage.setItem('sat_vocab_timer_highscore', String(data.timerHighScore));
        }
    }

    /**
     * Build a snapshot of all saveable state for Firestore.
     * Called by saveVocabularyPool() and by the tycoon engine.
     */
    _buildCloudSnapshot() {
        // Read tycoon state from localStorage (it's managed by tycoon-engine)
        let tycoonState = null;
        try {
            const raw = localStorage.getItem('sat_tycoon_state');
            if (raw) tycoonState = JSON.parse(raw);
        } catch (_) {}

        return {
            vocabPool:      this.vocabPool,
            tycoonState,
            timerHighScore: parseInt(localStorage.getItem('sat_vocab_timer_highscore') || '0', 10),
            vocabVersion:   AppController.DATA_VERSION,
        };
    }

    /** Set sync status indicator in sidebar. */
    _setSyncStatus(status) {
        const el = document.getElementById('user-sync-status');
        if (!el) return;
        if (status === 'syncing') {
            el.className = 'user-sync-status syncing';
            el.innerHTML = '<i class="fa-solid fa-rotate fa-spin"></i> Saving…';
        } else if (status === 'saved') {
            el.className = 'user-sync-status';
            el.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Synced';
        } else if (status === 'error') {
            el.className = 'user-sync-status error';
            el.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Sync error';
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // KEY NORMALIZATION — applied identically to both the Excel input word
    // and every 'word' key inside vocabulary.json so they always match.
    // Handles: BOM, non-breaking spaces (\u00A0), zero-width chars, tabs,
    // mixed unicode whitespace, smart-quotes adjacent to letters, and
    // normalises unicode composed/decomposed forms (NFC).
    // ─────────────────────────────────────────────────────────────────────────
    static cleanKey(raw) {
        if (raw === null || raw === undefined) return '';
        return String(raw)
            .normalize('NFC')                         // unify composed/decomposed chars
            .replace(/[\u200B-\u200D\uFEFF]/g, '')    // strip zero-width / BOM chars
            .replace(/[\u00A0\u202F\u2009\u2002\u2003]/g, ' ')  // non-breaking → normal space
            .replace(/[\u2018\u2019\u201C\u201D]/g, '') // strip smart quotes
            .replace(/\t/g, ' ')                       // tabs → space
            .trim()                                    // leading/trailing whitespace
            .toLowerCase()                             // force lowercase
            .replace(/\s+/g, ' ');                     // collapse internal runs of spaces
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SLASH-VARIANT EXTRACTOR — Excel cells often contain multi-form entries
    // like "ascribe / ascribed" or "affect/effect". vocabulary.json only stores
    // the base form. This extracts the first segment so the lookup succeeds.
    //   "ascribe / ascribed"  →  "ascribe"
    //   "affect/effect"       →  "affect"
    //   "alleviate"           →  "alleviate"   (unchanged)
    // ─────────────────────────────────────────────────────────────────────────
    static extractBaseWord(raw) {
        if (!raw) return raw;
        const str = String(raw);
        if (str.includes('/')) {
            // Take the first segment before any slash and strip surrounding spaces
            return str.split('/')[0].trim().toLowerCase();
        }
        return str.toLowerCase();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FIELD SANITIZER — run on every DB entry after a successful hit.
    // Guarantees all required fields exist and are structurally valid.
    // Returns a safe, deep-copied object — never mutates the shared localDB.
    // ─────────────────────────────────────────────────────────────────────────
    static sanitizeDBEntry(entry, canonicalWord) {
        const word = String(entry.word || canonicalWord || '').trim() || canonicalWord;

        // ── definition ──────────────────────────────────────────────────────
        let definition = String(entry.definition || '').trim();
        if (!definition ||
            definition.toLowerCase().includes('condition of being') ||
            definition.toLowerCase().startsWith('the property') ||
            definition.toLowerCase().startsWith('a vocabulary word') ||
            definition.length < 5) {
            definition = `Used in collegiate and SAT-level reading to describe a specific quality, action, or state related to "${word}".`;
            console.warn(`[Sanitize] ⚠ Weak definition for "${word}" — using fallback.`);
        }

        // ── synonyms ─────────────────────────────────────────────────────────
        const JUNK_SYNS = new Set([
            'equivalent','related term','related word','point elasticity',
            'alternate term','correlative','analogue','substitute',
        ]);
        let synonyms = Array.isArray(entry.synonyms)
            ? entry.synonyms
                .map(s => String(s).trim())
                .filter(s => s && s.length > 1 && !s.endsWith('-like') && !JUNK_SYNS.has(s))
            : [];
        if (synonyms.length === 0) {
            console.warn(`[Sanitize] ⚠ No valid synonyms for "${word}" — field will be empty.`);
        }

        // ── sentence ─────────────────────────────────────────────────────────
        let sentence = String(entry.sentence || '').trim();
        const hasBlank = sentence.includes('______');

        // Comprehensive placeholder / generic-fallback detection.
        // If the sentence is missing or is any kind of generic template,
        // leave it BLANK so the study engine uses synonym-only mastery (3-streak).
        const sl = sentence.toLowerCase();
        const isPlaceholder =
            !hasBlank ||
            sl.includes('vocabulary word') ||
            sl.includes('helps improve your sat') ||
            sl.includes('is a word encountered in') ||
            sl.includes('encountered in collegiate') ||
            sl.includes('appears in many academic') ||
            sl.includes('application to the complex argument') ||
            sl.includes('a word used in sat') ||
            sl.includes('is used in academic') ||
            (hasBlank && sentence.trim().split(/\s+/).length < 8);

        if (!sentence || isPlaceholder) {
            // No real sentence — leave blank so synonym-only path kicks in
            sentence = '';
            console.warn(`[Sanitize] ⚠ No valid sentence for "${word}" — synonym-only mastery will apply.`);
        }

        // ── distractors ──────────────────────────────────────────────────────
        let distractors = Array.isArray(entry.distractors)
            ? entry.distractors.map(d => String(d).trim()).filter(d => d && d !== word)
            : [];
        if (distractors.length < 3) {
            const defaults = ['tenuous', 'speculative', 'fallible', 'ambivalent', 'incipient'];
            while (distractors.length < 3) {
                const d = defaults[distractors.length % defaults.length];
                if (!distractors.includes(d)) distractors.push(d);
                else distractors.push(defaults[(distractors.length + 2) % defaults.length]);
            }
            console.warn(`[Sanitize] ⚠ Padded distractors for "${word}" to 3.`);
        }
        distractors = distractors.slice(0, 3);

        // ── difficulty ───────────────────────────────────────────────────────
        const VALID_DIFFS = new Set(['easy', 'medium', 'hard']);
        const difficulty = VALID_DIFFS.has(entry.difficulty) ? entry.difficulty : 'medium';

        return { word, synonyms, definition, sentence, difficulty, distractors };
    }

    /** Fetch vocabulary.json once and index it into a Map for O(1) import lookups.
     *  Keys are ultra-normalized via cleanKey() so casing/whitespace/unicode
     *  differences between the JSON file and an Excel import never cause mismatches.
     */
    async loadLocalDB() {
        try {
            const res = await fetch('vocabulary.json');
            if (!res.ok) throw new Error('vocabulary.json not found');
            const data = await res.json();

            this.localDB = new Map();
            let duplicates = 0;

            for (const entry of data) {
                const primaryKey = AppController.cleanKey(entry.word);
                if (!primaryKey) continue;

                if (this.localDB.has(primaryKey)) {
                    duplicates++;
                } else {
                    this.localDB.set(primaryKey, entry);
                }

                // Secondary key: hyphens → spaces (e.g., "non-plussed" also matches "non plussed")
                const dehyphenated = primaryKey.replace(/-/g, ' ');
                if (dehyphenated !== primaryKey && !this.localDB.has(dehyphenated)) {
                    this.localDB.set(dehyphenated, entry);
                }
            }

            console.info(
                `[LocalDB] ✅ Indexed ${this.localDB.size} keys from ${data.length} entries` +
                (duplicates > 0 ? ` (${duplicates} duplicate keys skipped)` : '') + '.'
            );
        } catch (err) {
            console.error('[LocalDB] ❌ Could not load vocabulary.json:', err);
        }
    }

    /** Live-search "Add Word" feature — autocomplete from localDB + preview panel. */
    initAddWord() {
        const input      = document.getElementById('add-word-input');
        const dropdown   = document.getElementById('add-word-dropdown');
        const preview    = document.getElementById('add-word-preview');
        const nomatch    = document.getElementById('add-word-nomatch');
        const statusMsg  = document.getElementById('add-word-status');
        const confirmBtn = document.getElementById('add-word-confirm-btn');
        const clearBtn   = document.getElementById('add-word-clear-btn');

        // Max dropdown items to show
        const MAX_RESULTS = 10;
        let activeIndex = -1;      // keyboard navigation cursor
        let selectedEntry = null;  // the entry currently shown in the preview
        let debounceTimer = null;

        // ── Helpers ───────────────────────────────────────────────────
        const hideAll = () => {
            dropdown.style.display = 'none';
            preview.style.display  = 'none';
            nomatch.style.display  = 'none';
            statusMsg.style.display = 'none';
            dropdown.innerHTML = '';
            activeIndex = -1;
        };

        const highlightQuery = (word, query) => {
            // Wrap the matched portion in <mark> for green styling
            const idx = word.toLowerCase().indexOf(query.toLowerCase());
            if (idx === -1) return word;
            return word.slice(0, idx)
                 + '<mark>' + word.slice(idx, idx + query.length) + '</mark>'
                 + word.slice(idx + query.length);
        };

        const showPreview = (entry) => {
            selectedEntry = entry;
            dropdown.style.display = 'none';
            nomatch.style.display  = 'none';
            statusMsg.style.display = 'none';

            // Fill word name
            document.getElementById('preview-word-name').textContent = entry.word;

            // Difficulty badge
            const diffEl = document.getElementById('preview-difficulty');
            diffEl.textContent = entry.difficulty || 'medium';
            diffEl.className = 'preview-difficulty-badge ' + (entry.difficulty || 'medium');

            // Definition
            document.getElementById('preview-definition').textContent = entry.definition || '—';

            // Synonym chips
            const synContainer = document.getElementById('preview-synonyms');
            const syns = (entry.synonyms || []).filter(s => s && !s.endsWith('-like'));
            if (syns.length > 0) {
                synContainer.innerHTML = syns
                    .map(s => `<span class="preview-chip">${s}</span>`)
                    .join('');
            } else {
                synContainer.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem">None on file</span>';
            }

            // Example sentence
            const sentEl = document.getElementById('preview-sentence');
            sentEl.textContent = entry.sentence ? `"${entry.sentence}"` : '—';

            preview.style.display = 'flex';
        };

        const buildDropdown = (query) => {
            if (!query || query.length < 1) { hideAll(); return; }

            // Strip slash variants ("ascribe / ascribed" → "ascribe") then normalize
            const q = AppController.cleanKey(AppController.extractBaseWord(query));
            const allWords = [...this.localDB.keys()];
            const startsWith = allWords.filter(w => w.startsWith(q));
            const contains   = allWords.filter(w => !w.startsWith(q) && w.includes(q));
            const results = [...startsWith, ...contains].slice(0, MAX_RESULTS);

            preview.style.display  = 'none';
            statusMsg.style.display = 'none';
            selectedEntry = null;

            if (results.length === 0) {
                dropdown.style.display = 'none';
                dropdown.innerHTML = '';
                nomatch.style.display = 'flex';
                
                // 1. Change textContent to innerHTML and append the styling layout button
                const textEl = document.getElementById('add-word-nomatch-text');
                textEl.innerHTML = `
                    No matches for "${query}" in the local database (${this.localDB.size} words).
                    <button id="fallback-add-btn" style="background: #6366F1; color: white; border: none; padding: 6px 12px; margin-left: 12px; border-radius: 6px; cursor: pointer; font-weight: 500; font-family: inherit; transition: background 0.2s;">
                        ✨ Generate with Cloud AI
                    </button>
                `;
                
                // 2. Clear any previous event listener by cloning the button (prevents double-clicks)
                const newBtn = document.getElementById('fallback-add-btn');
                
                // 3. Attach the click event listener to run the Render backend pipeline
                newBtn.addEventListener('click', () => {
                    generateAndAddWordFromAPI(query);
                });
                
                return;
            }

            nomatch.style.display = 'none';
            activeIndex = -1;
            dropdown.innerHTML = '';

            results.forEach((word, i) => {
                const entry = this.localDB.get(word);
                const li = document.createElement('li');
                // Short definition hint (first 40 chars)
                const hint = (entry.definition || '').slice(0, 42) + (entry.definition?.length > 42 ? '…' : '');

                li.innerHTML = `
                    <span class="dropdown-word">${highlightQuery(word, query)}</span>
                    <span class="dropdown-hint">${hint}</span>
                `;

                li.addEventListener('mouseenter', () => {
                    document.querySelectorAll('#add-word-dropdown li').forEach(el => el.classList.remove('dropdown-active'));
                    li.classList.add('dropdown-active');
                    activeIndex = i;
                });

                li.addEventListener('click', () => {
                    input.value = word;
                    showPreview(entry);
                });

                dropdown.appendChild(li);
            });

            dropdown.style.display = 'block';
        };

        // ── Input event: debounce 120ms ───────────────────────────────
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const val = input.value.trim();
            if (!val) { hideAll(); return; }
            debounceTimer = setTimeout(() => buildDropdown(val), 120);
        });

        // ── Keyboard navigation ───────────────────────────────────────
        input.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('li');
            if (!items.length) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, items.length - 1);
                items.forEach((el, i) => el.classList.toggle('dropdown-active', i === activeIndex));
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });

            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
                items.forEach((el, i) => el.classList.toggle('dropdown-active', i === activeIndex));
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });

            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0 && items[activeIndex]) {
                    items[activeIndex].click();
                } else if (items.length === 1) {
                    // Only one result — auto-select it
                    items[0].click();
                }

            } else if (e.key === 'Escape') {
                hideAll();
                input.value = '';
            }
        });

        // ── Dismiss dropdown when clicking outside ────────────────────
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.add-word-search-wrapper')) {
                dropdown.style.display = 'none';
            }
        });

        // ── Add to Pool button ────────────────────────────────────────
// ── Add to Pool button inside initAddWord() ──
        confirmBtn.addEventListener('click', () => {
            if (!selectedEntry) return;

            const key = AppController.cleanKey(selectedEntry.word);

            // Duplicate check against the active deck container
            if (this.vocabPool.some(w => AppController.cleanKey(w.word) === key)) {
                statusMsg.style.display = 'block';
                statusMsg.className = 'import-status text-amber';
                statusMsg.textContent = `"${selectedEntry.word}" is already in your active pool.`;
                return;
            }

            // Sanitize record format copy safely
            const entry = AppController.sanitizeDBEntry(selectedEntry, key);
            
            // 🚀 THE FIX: Push word directly to both tracking variables seamlessly
            this.vocabPool.push({ ...entry, stage: 'A' });
            this.savedLists[this.activeListName] = this.vocabPool; 

            // Save state, update storage layers, and rebuild dashboard views
            this.saveVocabularyPool();
            this.syncDashboardProgress();
            this.updateListDropdownUI();

            this.showNotification(
                'Word Added',
                `"${selectedEntry.word}" has been added to your active deck.`,
                'success'
            );

            // Reset selection frame widgets
            input.value = '';
            hideAll();
            selectedEntry = null;
        });

        // ── Clear button ──────────────────────────────────────────────
        clearBtn.addEventListener('click', () => {
            input.value = '';
            selectedEntry = null;
            hideAll();
            input.focus();
        });
    }

    // View router controller
    initRouter() {
        const navItems = document.querySelectorAll('.nav-item');
        const viewPanels = document.querySelectorAll('.view-panel');
        
        navItems.forEach(item => {
            item.onclick = () => {
                const target = item.getAttribute('data-target');
                
                // Toggle active menu class
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Toggle views
                viewPanels.forEach(panel => {
                    if (panel.id === target) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });

                // Custom view triggers
                if (target === 'study-view') {
                    this.studyEngine.loadNextStudyQuestion();
                } else if (target === 'flashcard-view') {
                    this.studyEngine.loadFlashcards();
                } else if (target === 'tycoon-view') {
                    this.tycoonEngine.renderVisuals();
                    this.tycoonEngine.updateUI();
                }
                
                // Stop timer game if leaving timer view
                if (target !== 'timer-view') {
                    this.studyEngine.exitTimerGame();
                }
            };
        });
    }

    // Vocabulary pool getters/setters
    getVocabularyPool() {
        return this.vocabPool;
    }

    // Current data version — bump this whenever vocabulary.json is rebuilt
    // so stale LocalStorage caches are automatically invalidated.
    static get DATA_VERSION() { return "2"; }

    async loadVocabPool() {
        const savedListsRaw = localStorage.getItem('sat_vocab_saved_lists');
        const savedMapRaw = localStorage.getItem('sat_vocab_master_progress_map');
        const savedActiveName = localStorage.getItem('sat_vocab_active_list_name');

        if (savedListsRaw && savedMapRaw) {
            try {
                this.savedLists = JSON.parse(savedListsRaw);
                this.masterProgressMap = JSON.parse(savedMapRaw);
                this.activeListName = savedActiveName || Object.keys(this.savedLists)[0];
                this.vocabPool = this.savedLists[this.activeListName] || [];

                this.syncVocabPoolWithMasterProgress();
                this.updateListDropdownUI();
                console.info(`[Load] Hydrated saved collections successfully across lists.`);
                return;
            } catch(e) {
                console.error("Failed parsing composite structural deck maps layouts:", e);
            }
        }
        // Fallback default setup route if fresh cache block initialization pass catches
        this.savedLists = { "Default Deck": [] };
        this.activeListName = "Default Deck";
        this.masterProgressMap = {};
        await this.loadDefaultPool();
        this.updateListDropdownUI();
    }

    /** Quick check: does the JSON string contain a known bad placeholder sentence? */
    _hasPlaceholderData(jsonStr) {
        if (!jsonStr) return false;
        return jsonStr.includes("vocabulary word ______ was perfectly suited") ||
               jsonStr.includes("condition of being") ||
               jsonStr.includes('"point elasticity"');
    }

    async loadDefaultPool() {
        // 🧼 Force the default pool list array to initialize completely empty
        this.vocabPool = [];
        
        // Save the clean slate down to LocalStorage and refresh metrics
        this.saveVocabularyPool();
        this.syncDashboardProgress();
        
        this.showNotification("Default Pool Reset", "The vocabulary pool has been initialized to empty.", "success");
        
        // Refresh active views to show the blank layout fallbacks
        if (this.studyEngine) {
            this.studyEngine.loadNextStudyQuestion();
            this.studyEngine.loadFlashcards();
        }
    }

    saveVocabularyPool() {
        // Always save locally first (instant, works offline)
        localStorage.setItem('sat_vocab_pool', JSON.stringify(this.vocabPool));
        localStorage.setItem('sat_vocab_version', AppController.DATA_VERSION);

        // Then schedule a debounced cloud sync if signed in
        if (authManager.isSignedIn) {
            this._setSyncStatus('syncing');
            authManager.scheduleSave(this._buildCloudSnapshot());
            // Optimistically show synced after the debounce window
            setTimeout(() => this._setSyncStatus('saved'), 2500);
        }
    }

    // CSV Spreadsheet Uploader
    initFileUploader() {
        const dropzone = document.getElementById('csv-dropzone');
        const fileInput = document.getElementById('csv-file-input');
        const columnSelectorArea = document.getElementById('column-selector-area');
        const columnSelect = document.getElementById('word-column-select');
        const importBtn = document.getElementById('process-csv-btn');

        // Click trigger file browser
        dropzone.onclick = () => fileInput.click();

        // Drag events styling
        dropzone.ondragover = (e) => {
            e.preventDefault();
            dropzone.style.borderColor = "var(--color-indigo)";
            dropzone.style.background = "rgba(99, 102, 241, 0.05)";
        };
        
        dropzone.ondragleave = () => {
            dropzone.style.borderColor = "rgba(99, 102, 241, 0.25)";
            dropzone.style.background = "rgba(99, 102, 241, 0.02)";
        };

        dropzone.ondrop = (e) => {
            e.preventDefault();
            dropzone.style.borderColor = "rgba(99, 102, 241, 0.25)";
            dropzone.style.background = "rgba(99, 102, 241, 0.02)";
            
            const file = e.dataTransfer.files[0];
            if (file) this.handleSelectedFile(file);
        };

        fileInput.onchange = () => {
            const file = fileInput.files[0];
            if (file) this.handleSelectedFile(file);
        };

        importBtn.onclick = () => this.importWordsFromMappedColumn();
    }

    handleSelectedFile(file) {
        const reader = new FileReader();
        const statusMsg = document.getElementById('import-status-message');
        
        statusMsg.style.display = 'block';
        statusMsg.className = "import-status";
        statusMsg.textContent = "Scanning file...";
        
        reader.onload = (e) => {
            const text = e.target.result;
            const parsed = this.parseCSVText(text);
            
            if (parsed && parsed.headers.length > 0) {
                this.csvData = parsed;
                
                // Show column selection
                const selectEl = document.getElementById('word-column-select');
                selectEl.innerHTML = '';
                
                parsed.headers.forEach((h, idx) => {
                    const opt = document.createElement('option');
                    opt.value = idx;
                    opt.textContent = `${h} (Column ${idx + 1})`;
                    selectEl.appendChild(opt);
                });
                
                document.getElementById('column-selector-area').style.display = 'block';
                statusMsg.textContent = `File loaded. Select the column containing your words above. Found ${parsed.rows.length} vocabulary rows.`;
            } else {
                statusMsg.className = "import-status text-danger";
                statusMsg.textContent = "Error parsing file. Ensure it is a valid comma-separated CSV file.";
            }
        };
        
        reader.readAsText(file);
    }

    parseCSVText(text) {
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length === 0) return null;
        
        // Simple cells splitter handling quotes
        const parseLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        };

        const headers = parseLine(lines[0]);
        const rows = [];
        
        for (let i = 1; i < lines.length; i++) {
            const cells = parseLine(lines[i]);
            if (cells.length > 0) {
                rows.push(cells);
            }
        }
        
        return { headers, rows };
    }

async importWordsFromMappedColumn() {
        const select = document.getElementById('word-column-select');
        const colIndex = parseInt(select.value);
        const statusMsg = document.getElementById('import-status-message');
        
        if (!this.csvData || isNaN(colIndex)) return;
        
        // ── Step 0: Extract and deduplicate words from the chosen column ──────
        const rawWords = this.csvData.rows
            .map(row => row[colIndex])
            .filter(word => word && String(word).trim() !== '');
        const words = [...new Set(rawWords)];
        
        if (words.length === 0) {
            statusMsg.className = "import-status text-danger";
            statusMsg.textContent = "No valid words found in the mapped column.";
            return;
        }

        statusMsg.style.display = 'block';
        statusMsg.className = "import-status";
        statusMsg.textContent = `Matching ${words.length} word(s) against local database…`;
        console.groupCollapsed(`[Import] Starting lookup for ${words.length} word(s)`);
        
        const importedPool = [];
        let dbHits   = 0;
        let apiHits  = 0;
        let misses   = 0;
        
        for (let i = 0; i < words.length; i++) {
            const raw = words[i];

            // ── Step A: Extract base word from slash variants ──────────────────
            const baseRaw = AppController.extractBaseWord(raw);
            if (baseRaw !== raw) {
                console.log(`[Import] Slash variant detected: "${raw}" → using base word "${baseRaw}"`);
            }

            // ── Step B: Normalize string targets ──
            const key = AppController.cleanKey(baseRaw);

            if (!key) {
                console.warn(`[Import] ⚠ Skipping blank/whitespace-only value at row ${i + 1}.`);
                misses++;
                continue;
            }

            statusMsg.textContent = `[${i + 1}/${words.length}] Looking up "${key}"…`;

            // ── Step 1: Local DB lookup (O(1) exact key match check) ────────────────────
            let rawEntry = null;
            if (this.localDB.has(key)) {
                rawEntry = this.localDB.get(key);
            } else {
                // Case-Insensitive fallback search variant check across your entire indexing map
                for (let [dbKey, dbValue] of this.localDB.entries()) {
                    if (dbKey.toLowerCase() === key.toLowerCase()) {
                        rawEntry = dbValue;
                        break;
                    }
                }
            }

            if (rawEntry) {
                // Sanitize fields — apply clear fallbacks on broken records
                const entry = AppController.sanitizeDBEntry(rawEntry, key);

                importedPool.push(entry);
                dbHits++;
                console.log(`[Import] ✅ Found match for: "${key}" (definition: ${entry.definition.slice(0,50)}…)`);
                statusMsg.textContent = `[${i + 1}/${words.length}] ✅ "${key}" matched in background database cache.`;
                continue;
            }

            // ── Step 2: No DB match — try the cloud cache/dictionary API ──────────────────
            console.warn(`[Import] ❌ No database entry found for: "${key}" — calling Render Backend Proxy.`);
            statusMsg.textContent = `[${i + 1}/${words.length}] 🧠 Syncing "${key}" through Cloud Pipeline…`;
            
            try {
                // Point this to your live Render public endpoint
                const backendUrl = "https://sat-vocab-backend-fnrv.onrender.com/api/generate-word";

                // Send the missing word data to your Render backend proxy
                const backendResponse = await fetch(backendUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ key: key, baseRaw: baseRaw })
                });

                if (!backendResponse.ok) throw new Error("Backend server rejected the layout payload.");
                
                const generatedCard = await backendResponse.json();

                // Sanitize fields and build the cards safely
                const entry = AppController.sanitizeDBEntry(generatedCard, key);

                importedPool.push(entry);
                apiHits++;
                
                // Cache into local database map so it persists for this session
                this.localDB.set(key, entry);
                statusMsg.textContent = `[${i + 1}/${words.length}] ✨ "${key}" auto-generated safely via backend proxy.`;

            } catch (err) {
                console.error(`[Import] ❌ Secure proxy fallback failed for "${key}". Reverting to secondary fallback:`, err);
                
                // Fallback to secondary dictionary API if your backend drops or hits limits
                try {
                    const backupRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);
                    let realDefinition = "An important contextual academic term.";
                    let discoveredSynonyms = [key];

                    if (backupRes.ok) {
                        const apiData = await backupRes.json();
                        const primaryMeaning = apiData[0]?.meanings?.[0];
                        realDefinition = primaryMeaning?.definitions?.[0]?.definition || realDefinition;
                        discoveredSynonyms = primaryMeaning?.synonyms?.slice(0, 3) || discoveredSynonyms;
                    }

                    const fallbackCard = AppController.sanitizeDBEntry({
                        word: baseRaw,
                        definition: realDefinition,
                        synonyms: discoveredSynonyms.length > 0 ? discoveredSynonyms : [key],
                        sentence: `The author's arguments highlights how the definition of ______ can be interpreted in multiple ways.`,
                        distractors: ["simple", "ordinary", "constant"]
                    }, key);

                    importedPool.push(fallbackCard);
                    apiHits++; 

                } catch (backupErr) {
                    console.error(`[Import] ❌ Critical fallback chain failure for "${key}":`, backupErr);
                    misses++;
                }
            }
        }

        console.groupEnd();
        
        // ── Persist and refresh ───────────────────────────────────────────────
        this.vocabPool = importedPool;
        this.saveVocabularyPool();
        this.syncDashboardProgress();
        
        const summaryParts = [`${dbHits} from local DB`];
        if (apiHits > 0) summaryParts.push(`${apiHits} from API`);
        if (misses  > 0) summaryParts.push(`${misses} skipped (not found)`);
        
        const summaryText = `Imported ${importedPool.length} words — ${summaryParts.join(', ')}.`;
        statusMsg.className = "import-status text-emerald";
        statusMsg.textContent = summaryText;
        console.info(`[Import] Done. ${summaryText}`);
        
        // Clear uploader view
        document.getElementById('column-selector-area').style.display = 'none';
        this.csvData = null;
        
        this.showNotification(
            "Import Complete",
            `Loaded ${importedPool.length} words (${dbHits} from local DB${apiHits > 0 ? ', ' + apiHits + ' from API' : ''}).`,
            "success"
        );
        
        // Refresh active views
        this.studyEngine.loadNextStudyQuestion();
        this.studyEngine.loadFlashcards();
    }
    // Sync views
    syncDashboardProgress() {
        const total = this.vocabPool.length;
        
        let mastered = 0;
        let progress = 0;
        let unstarted = 0;
        
        this.vocabPool.forEach(w => {
            if (w.stage === 'Mastered') mastered++;
            else if (w.stage === 'B' || w.stage === 'C') progress++;
            else unstarted++;
        });

        // Update radial progress percentage
        const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
        const radialBar = document.querySelector('.radial-progress-item');
        if (radialBar) {
            radialBar.style.background = `radial-gradient(closest-side, #0a0e19 79%, transparent 80% 100%), conic-gradient(var(--color-emerald) ${pct}%, rgba(255, 255, 255, 0.05) ${pct}% 100%)`;
        }

        document.getElementById('mastery-percent').textContent = `${pct}%`;
        document.getElementById('total-words-count').textContent = total;
        document.getElementById('mastered-count').textContent = mastered;
        document.getElementById('progress-count').textContent = progress;
        document.getElementById('unstarted-count').textContent = unstarted;

        // Render Pool Table rows
        this.renderPoolTableRows();
    }

    renderPoolTableRows(filteredPool = null) {
        const rowsContainer = document.getElementById('vocab-pool-rows');
        rowsContainer.innerHTML = '';
        
        const pool = filteredPool || this.vocabPool;
        
        if (pool.length === 0) {
            rowsContainer.innerHTML = `<tr><td colspan="5" class="text-center" style="color:var(--text-muted);">No words found in pool.</td></tr>`;
            return;
        }

        pool.forEach((word) => {
            const tr = document.createElement('tr');
            
            const stage = word.stage || 'A';
            const diff = word.difficulty || 'medium';
            
            let stageBadgeClass = "badge badge-stage";
            if (stage === 'Mastered') stageBadgeClass += " mastered";
            
            let diffBadgeClass = "badge";
            if (diff === 'easy') diffBadgeClass += " text-emerald";
            else if (diff === 'medium') diffBadgeClass += " text-amber";
            else if (diff === 'hard') diffBadgeClass += " text-danger";
            
            tr.innerHTML = `
                <td><strong>${word.word}</strong></td>
                <td><span style="font-size:0.8rem;color:var(--text-secondary);">${word.definition}</span></td>
                <td><span class="${stageBadgeClass}">${stage === 'Mastered' ? 'Mastered' : 'Stage ' + stage}</span></td>
                <td><span class="${diffBadgeClass}">${diff}</span></td>
                <td><button class="btn btn-sm btn-secondary delete-word-btn" data-word="${word.word}"><i class="fa-solid fa-trash-can text-danger"></i></button></td>
            `;
            
            tr.querySelector('.delete-word-btn').onclick = () => this.deleteWord(word.word);
            
            rowsContainer.appendChild(tr);
        });
    }

    filterVocabPool(query) {
        const q = query.toLowerCase().trim();
        if (q === '') {
            this.renderPoolTableRows();
            return;
        }
        
        const filtered = this.vocabPool.filter(w => {
            return w.word.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q);
        });
        
        this.renderPoolTableRows(filtered);
    }

    deleteWord(wordName) {
        const idx = this.vocabPool.findIndex(w => w.word === wordName);
        if (idx !== -1) {
            this.vocabPool.splice(idx, 1);
            this.saveVocabularyPool();
            this.syncDashboardProgress();
            this.showNotification("Word Deleted", `Removed "${wordName}" from vocab pool.`, "warning");
        }
    }

    syncSidebarTycoon() {
        if (this.tycoonEngine) {
            document.getElementById('sidebar-cash').textContent = this.tycoonEngine.state.cash.toFixed(2);
            document.getElementById('sidebar-income-rate').textContent = this.tycoonEngine.getPassiveIncomeRate().toFixed(2);
            document.getElementById('widget-floor-badge').textContent = `Floor ${this.tycoonEngine.state.currentFloor}`;
        }
    }

    // Reset app state
    async resetAllData() {
        if (confirm("Are you sure you want to RESET all data? This will clear all tycoon earnings, vocabulary list, and high scores.")) {
            localStorage.clear();
            
            // Reload default
            await this.loadVocabPool();
            
            // Reload tycoon state
            this.tycoonEngine.state = {
                cash: 0.00,
                multiplierLevel: 1,
                tablesCount: 4,
                staffLevel: 0,
                tipJarLevel: 1,
                currentFloor: 1,
                lastTickTime: Date.now()
            };
            this.tycoonEngine.saveState();
            this.tycoonEngine.renderVisuals();
            this.tycoonEngine.updateUI();
            
            // Reload study states
            this.studyEngine.flashcardIndex = 0;
            this.studyEngine.timerHighScore = 0;
            this.studyEngine.updateHighScoreDisplay();
            
            this.studyEngine.loadNextStudyQuestion();
            this.studyEngine.loadFlashcards();
            
            this.syncDashboardProgress();
            this.showNotification("Reset Complete", "All progress has been wiped.", "warning");
        }
    }
    deleteActiveList() {
        if (this.activeListName === "Default Deck") {
            alert("The 'Default Deck' cannot be deleted. You can clear its words instead using 'Delete All Words'.");
            return;
        }

        if (confirm(`❌ Are you sure you want to completely delete the list "${this.activeListName}"? All words within this specific deck will be removed.`)) {
            // Unlink current playlist target from your deck mapping lists collection entirely
            delete this.savedLists[this.activeListName];
            
            // Auto fallback straight back down onto your master Default Deck baseline
            this.activeListName = "Default Deck";
            this.vocabPool = this.savedLists["Default Deck"] || [];
            
            // Commit mutations, force updates, and draw clean views elements boards instantly
            this.saveAllListsToStorage();
            this.updateListDropdownUI();
            this.syncVocabPoolWithMasterProgress();
            this.syncDashboardProgress();
            
            if (this.studyEngine) {
                this.studyEngine.loadNextStudyQuestion();
                this.studyEngine.loadFlashcards();
            }
            
            this.showNotification("List Deleted", "Switched back to default deck baseline profile cleanly.", "warning");
        }
    }
    // Trigger toast notification
    showNotification(title, text, type = "success") {
        // Create dynamic toast overlay
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        let icon = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'warning') icon = '<i class="fa-solid fa-circle-exclamation"></i>';
        else if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark"></i>';
        
        toast.innerHTML = `
            ${icon}
            <div class="toast-body">
                <strong>${title}</strong>
                <span>${text}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
    window.app.init().catch(err => {
        console.error('[App] Fatal init error:', err);
    });

    // Flush a final save to cloud on tab close (best-effort)
    window.addEventListener('beforeunload', () => {
        if (authManager.isSignedIn && window.app) {
            authManager.flushSave(window.app._buildCloudSnapshot());
        }
    });
});

async function generateAndAddWordFromAPI(wordToTrack) {
    const backendUrl = "https://sat-vocab-backend-fnrv.onrender.com/api/generate-word";
    const textEl = document.getElementById('add-word-nomatch-text');
    
    try {
        if (textEl) {
            textEl.innerHTML = `🧠 Cloud AI is building a profile for "${wordToTrack}"...`;
        }
        
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: wordToTrack })
        });

        if (!response.ok) throw new Error("Backend server error mapping card.");
        const generatedCard = await response.json();
        
        // Ensure app variables are reachable
        if (window.app) {
            const key = AppController.cleanKey(generatedCard.word);
            const entry = AppController.sanitizeDBEntry(generatedCard, key);
            
            // Push directly onto active deck and active collection lane arrays
            window.app.vocabPool.push({ ...entry, stage: 'A' });
            window.app.savedLists[window.app.activeListName] = window.app.vocabPool;
            
            // Sync down instantly to storage layers
            window.app.saveVocabularyPool();
            window.app.syncDashboardProgress();
            window.app.updateListDropdownUI();
        }
        
        if (textEl) {
            textEl.style.color = "#34D399"; // Success Green
            textEl.innerHTML = `🎯 Added "${generatedCard.word}" to your study pool!`;
        }

    } catch (err) {
        console.error("API Integration Error:", err);
        if (textEl) {
            textEl.style.color = "#F87171"; // Error Red
            textEl.innerHTML = "❌ Failed to fetch cloud word structure.";
        }
    }
}
// ⚡ FIX: Remove imports and pull standard auth straight from your project's instance
// (Assumes authManager or a global firebase/auth instance is already working in your project environment)

// 1. Handle Existing User Sign-In
document.getElementById('btn-email-signin')?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorBanner = document.getElementById('login-error'); // Updated to target your existing login error div

    if (!email || !password) {
        if (errorBanner) errorBanner.textContent = "Please fill in all fields.";
        return;
    }

    try {
        // Accessing the auth instance managed inside your authManager wrapper
        const authInstance = firebase.auth ? firebase.auth() : window.auth; 
        const userCredential = await authInstance.signInWithEmailAndPassword(email, password);
        console.log("🔒 User logged in with email successfully:", userCredential.user);
        
        // Let the controller know auth changed and hide the card overlay
        if (window.app && typeof window.app.initAuth === 'function') {
            window.location.reload(); // Quick reset to sync app state cleanly
        }
    } catch (error) {
        console.error("Login failure:", error);
        if (errorBanner) {
            errorBanner.style.display = 'block';
            errorBanner.textContent = "Invalid email credentials or password. Please try again.";
        }
    }
});

// 2. Handle New Account Registration
document.getElementById('btn-email-signup')?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorBanner = document.getElementById('login-error');

    if (password.length < 6) {
        if (errorBanner) {
            errorBanner.style.display = 'block';
            errorBanner.textContent = "Password must be at least 6 characters long.";
        }
        return;
    }

    try {
        const authInstance = firebase.auth ? firebase.auth() : window.auth;
        const userCredential = await authInstance.createUserWithEmailAndPassword(email, password);
        console.log("✨ New account created successfully:", userCredential.user);
        
        window.location.reload(); 
    } catch (error) {
        console.error("Registration failure:", error);
        if (errorBanner) {
            errorBanner.style.display = 'block';
            errorBanner.textContent = error.message.includes("email-already-in-use") 
                ? "Registration failed. Account already exists."
                : "Failed to create account. Verify email format.";
        }
    }
});