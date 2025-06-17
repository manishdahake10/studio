'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth as firebaseAuthModule } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This check is a safeguard. If firebase.ts threw an error during its initialization
    // (e.g., due to missing .env config), firebaseAuthModule might not be correctly imported or available.
    // In such a scenario, an "Internal Server Error" would likely originate from the failed module load.
    if (!firebaseAuthModule) {
      console.error(
        'AuthContext: Firebase auth object (firebaseAuthModule) is not available. ' +
        'This usually indicates a problem with Firebase initialization, potentially due to missing ' +
        'NEXT_PUBLIC_FIREBASE_... variables in your .env file or an error in src/lib/firebase.ts. ' +
        'Please check your server console logs for detailed error messages.'
      );
      setUser(null);
      setLoading(false);
      return; // Early exit if auth module isn't properly loaded
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthModule, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
