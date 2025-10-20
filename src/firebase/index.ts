import {initializeApp, getApps, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';

import {firebaseConfig} from './config';

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

// Note: This is a client-side only initializer.
// Do not use this in server-side code.
export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (getApps().length) {
    const app = getApps()[0];
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return {app, auth, firestore};
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return {app, auth, firestore};
}
