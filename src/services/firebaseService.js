// Firebase Authentication Setup for Taxigo Mobility
// Replace the config object below with your keys from console.firebase.google.com

export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "taxigo-app.firebaseapp.com",
  projectId: "taxigo-app",
  storageBucket: "taxigo-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

/*
=== STEP-BY-STEP FIREBASE SETUP GUIDE ===

1. GO TO FIREBASE CONSOLE:
   Open https://console.firebase.google.com/ in your browser.

2. CREATE / SELECT PROJECT:
   Click "Add project" (or open an existing project) and name it "Taxigo".

3. REGISTER YOUR WEB APP:
   Click the Web icon ( </> ) on the Project Overview page.
   Enter App Nickname: "Taxigo Web & Mobile" -> Click "Register app".

4. COPY YOUR FIREBASE CONFIG:
   Firebase will show your `const firebaseConfig = { ... }` object.
   Copy those values and paste them into the object above in this file.

5. ENABLE GOOGLE AUTHENTICATION:
   In Firebase Console sidebar, go to: Build -> Authentication.
   Click "Get Started".
   Under "Sign-in method" tab, click "Google" -> Click "Enable" -> Save.
*/

export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";
};
