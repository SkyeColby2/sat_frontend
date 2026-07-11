// auth.js — Firebase Auth + Firestore sync layer
// Exports: AuthManager (singleton)

class AuthManager {
    constructor() {
        this.user = null;           // Current Firebase user object (null = signed out)
        this.db = null;             // Firestore instance
        this.auth = null;           // Firebase Auth instance
        this.enabled = false;       // Whether Firebase is configured and active
        this._syncDebounceTimer = null;
        this._onAuthChangeCallbacks = [];
    }

    /** Initialize Firebase. Returns true if Firebase is enabled and ready. */
    async init() {
        if (typeof FIREBASE_ENABLED === 'undefined' || !FIREBASE_ENABLED) {
            console.info('[Auth] Firebase disabled — running in local-only mode.');
            this.enabled = false;
            return false;
        }

        if (!FIREBASE_CONFIG || FIREBASE_CONFIG.apiKey === 'PASTE_YOUR_API_KEY_HERE') {
            console.warn('[Auth] Firebase config not filled in — running in local-only mode.');
            this.enabled = false;
            return false;
        }

        try {
            // Dynamically load Firebase ESM modules from CDN
            const { initializeApp }     = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
            const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
                                         = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
            const { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp }
                                         = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

            const app    = initializeApp(FIREBASE_CONFIG);
            this.auth    = getAuth(app);
            this.db      = getFirestore(app);
            this.enabled = true;

            // Expose Firestore helpers on the instance for use in sync methods
            this._firestoreHelpers = { doc, getDoc, setDoc, updateDoc, serverTimestamp };
            this._authHelpers      = { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged };

            // Listen for auth state changes
            onAuthStateChanged(this.auth, (user) => {
                this.user = user;
                this._onAuthChangeCallbacks.forEach(cb => cb(user));
            });

            console.info('[Auth] Firebase initialized successfully.');
            return true;
        } catch (err) {
            console.error('[Auth] Firebase initialization failed:', err);
            this.enabled = false;
            return false;
        }
    }

    /** Register a callback for auth state changes (sign in / sign out). */
    onAuthChange(callback) {
        this._onAuthChangeCallbacks.push(callback);
        // Only immediately call if we already know the user is signed in.
        // If user is null, we wait for onAuthStateChanged to confirm (avoids
        // a flash where the overlay briefly shows for a returning signed-in user).
        if (this.user !== null) {
            callback(this.user);
        }
    }

    /** Trigger Google Sign-In popup. */
    async signInWithGoogle() {
        if (!this.enabled) return null;
        const { GoogleAuthProvider, signInWithPopup } = this._authHelpers;
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider);
            return result.user;
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                console.error('[Auth] Google sign-in failed:', err);
            }
            return null;
        }
    }

    /** Sign the current user out. */
    async signOut() {
        if (!this.enabled) return;
        const { signOut } = this._authHelpers;
        await signOut(this.auth);
    }

    /** Load all saved data for the current user from Firestore. */
    async loadUserData() {
        if (!this.enabled || !this.user) return null;
        const { doc, getDoc } = this._firestoreHelpers;

        try {
            const ref  = doc(this.db, 'users', this.user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                console.info('[Auth] Loaded cloud save for:', this.user.displayName);
                return snap.data();
            }
            console.info('[Auth] No cloud save found — starting fresh for:', this.user.displayName);
            return null;
        } catch (err) {
            console.error('[Auth] Failed to load user data:', err);
            return null;
        }
    }

    /**
     * Save a partial data object for the current user.
     * Debounced by 1500ms to batch rapid changes (e.g., during quiz answering).
     * @param {object} data - Partial object to merge into the user's Firestore document.
     */
    scheduleSave(data) {
        if (!this.enabled || !this.user) return;

        clearTimeout(this._syncDebounceTimer);
        this._syncDebounceTimer = setTimeout(() => {
            this._saveNow(data);
        }, 1500);
    }

    /** Immediately write data to Firestore (bypasses debounce). */
    async _saveNow(data) {
        if (!this.enabled || !this.user) return;
        const { doc, setDoc, serverTimestamp } = this._firestoreHelpers;

        try {
            const ref = doc(this.db, 'users', this.user.uid);
            await setDoc(ref, {
                ...data,
                lastSaved: serverTimestamp(),
                profile: {
                    displayName: this.user.displayName,
                    email:       this.user.email,
                    photoURL:    this.user.photoURL,
                    uid:         this.user.uid,
                }
            }, { merge: true });
            console.debug('[Auth] Cloud save OK.');
        } catch (err) {
            console.error('[Auth] Cloud save failed:', err);
        }
    }

    /** Force an immediate save (e.g., on page unload). */
    async flushSave(data) {
        clearTimeout(this._syncDebounceTimer);
        await this._saveNow(data);
    }

    get isSignedIn() {
        return this.enabled && this.user !== null;
    }
}

// Singleton
const authManager = new AuthManager();
