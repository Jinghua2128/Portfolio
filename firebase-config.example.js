// SETUP TEMPLATE ONLY: copy to firebase-config.js and replace the placeholders.
// Copy the completed file to editorial-portfolio/firebase-config.js as well.
// Both completed files are ignored by Git. Never use a service-account key here.
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_WEB_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_WEB_APP_ID"
};

const firebaseAvailable = typeof firebase !== "undefined"
    && typeof firebase.initializeApp === "function"
    && typeof firebase.auth === "function"
    && typeof firebase.firestore === "function";

if (firebaseAvailable) {
    firebase.initializeApp(firebaseConfig);
} else {
    console.warn("Firebase SDK unavailable. Local portfolio content will remain available.");
}

const auth = firebaseAvailable ? firebase.auth() : null;
const db = firebaseAvailable ? firebase.firestore() : null;

// Keep admin editing restricted; use the existing project's authorized account.
const ALLOW_ANY_SIGNED_IN_USER_TO_EDIT = false;
const ADMIN_EMAILS = ["YOUR_ADMIN_EMAIL"];
const ADMIN_UIDS = ["YOUR_FIREBASE_AUTH_ADMIN_UID"];
