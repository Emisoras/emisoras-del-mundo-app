
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

// This component is a client-side component that listens for
// 'permission-error' events and throws them as uncaught exceptions.
// This is useful for displaying the error in the Next.js development overlay.
export default function FirebaseErrorListener() {
  useEffect(() => {
    const handler = (error: FirestorePermissionError) => {
      // Throw the error so that the Next.js overlay can pick it up.
      // This is only for development, and should not be used in production.
      setTimeout(() => {
        throw error;
      }, 0);
    };

    errorEmitter.on('permission-error', handler);

    return () => {
      errorEmitter.off('permission-error', handler);
    };
  }, []);

  return null;
}
