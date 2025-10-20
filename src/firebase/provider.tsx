
'use client';

import React, {createContext, useContext} from 'react';
import {FirebaseApp} from 'firebase/app';
import {Auth} from 'firebase/auth';
import {Firestore} from 'firebase/firestore';
import FirebaseErrorListener from '@/components/providers/firebase-error-listener';

type FirebaseContextValue = {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
};

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export function FirebaseProvider({
  children,
  ...value
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseContext.Provider value={value}>
        {children}
        {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => {
  const {app} = useFirebase();
  if (!app) {
    throw new Error('Firebase app not available');
  }
  return app;
};

export const useAuth = () => {
  const {auth} = useFirebase();
  if (!auth) {
    throw new Error('Firebase Auth not available');
  }
  return auth;
};

export const useFirestore = () => {
  const {firestore} = useFirebase();
  if (!firestore) {
    throw new Error('Firestore not available');
  }
  return firestore;
};
