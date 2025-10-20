
'use client';

import {useEffect, useState, useRef} from 'react';
import type {
  Query,
  DocumentData,
  QuerySnapshot,
  FirestoreError,
} from 'firebase/firestore';
import {onSnapshot} from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const queryRef = useRef(query);
  useEffect(() => {
    if (query) {
      queryRef.current = query;
    }
  }, [query]);

  useEffect(() => {
    if (!queryRef.current) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      queryRef.current,
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map((doc) => ({ ...(doc.data() as T), id: doc.id }));
        setData(docs);
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
