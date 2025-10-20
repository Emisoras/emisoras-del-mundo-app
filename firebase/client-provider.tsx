'use client';

import React, {useMemo} from 'react';

import {initializeFirebase, FirebaseProvider} from '.';

export function FirebaseClientProvider({children}: {children: React.ReactNode}) {
  const {app, auth, firestore} = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
