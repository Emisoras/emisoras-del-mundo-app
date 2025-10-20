'use client';

import {useEffect, useState, useRef} from 'react';
import type {
  DocumentReference,
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import {onSnapshot} from 'firebase/firestore';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const refRef = useRef(ref);
  useEffect(() => {
    if (ref) {
      refRef.current = ref;
    }
  }, [ref]);

  useEffect(() => {
    if (!refRef.current) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      refRef.current,
      (snapshot: DocumentSnapshot<T>) => {
        setData((snapshot.data() as T) || null);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {data, loading, error};
}
