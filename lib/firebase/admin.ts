// SECURITY: Firebase Admin SDK for server-side operations with service account credentials
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;

// Initialize Firebase Admin only on server-side
if (typeof window === "undefined") {
  try {
    if (
      process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ) {
      adminApp =
        getApps().length === 0
          ? initializeApp({
              credential: cert({
                projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
                clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
              }),
            })
          : getApps()[0];

      adminDb = getFirestore(adminApp);
      adminAuth = getAuth(adminApp);
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
}

export { adminApp, adminDb, adminAuth };

