// firebase-config.js
// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS (takes ~5 minutes):
//
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → give it any name (e.g., "sat-vocab-quest")
// 3. Disable Google Analytics if you don't need it → Create project
// 4. In the left sidebar → Build → Authentication → Get started
//    → Sign-in method → Google → Enable → Save
// 5. In the left sidebar → Build → Firestore Database → Create database
//    → Start in production mode → pick any region → Enable
// 6. In Firestore → Rules tab → paste this rule and Publish:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /users/{userId}/{document=**} {
//          allow read, write: if request.auth != null && request.auth.uid == userId;
//        }
//      }
//    }
//
// 7. In the left sidebar → Project Overview (gear icon) → Project settings
//    → Your apps → click "</>" (web) → register your app → copy the config below
// 8. Replace the PLACEHOLDER values below with your real config values
//
// ─────────────────────────────────────────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCfr4cZcIvj4coL0hRTgUg7hfyRXdNLguM",
  authDomain: "vocab-2ffa3.firebaseapp.com",
  projectId: "vocab-2ffa3",
  storageBucket: "vocab-2ffa3.firebasestorage.app",
  messagingSenderId: "428284803973",
  appId: "1:428284803973:web:344bafb78e1db0662122ec"
};

// Set to true once you have filled in the config above.
// While false, the app runs in "local only" mode (no Google login, no cloud save).
const FIREBASE_ENABLED = true;
