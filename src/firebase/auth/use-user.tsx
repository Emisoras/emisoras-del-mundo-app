'use client';

import React from 'react';
import type {User} from 'firebase/auth';
import {onAuthStateChanged} from 'firebase/auth';

import {useAuth} from '..';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return {user, loading};
}
