import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebaseConfig';

interface IAuth {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  // Add other auth methods here if needed (e.g., signIn, signUp)
}

export const AuthContext = createContext<IAuth>({
  user: null,
  loading: true, // Initially true while checking auth state
  signInAnonymously: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignInAnonymously = async () => {
    setIsLoading(true);
    try {
      const result = await signInAnonymously(firebaseAuth);
      setCurrentUser(result.user);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    signInAnonymously: handleSignInAnonymously,
  };

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 