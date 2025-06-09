import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, signInAnonymously } from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';

// Optional: Set persistence to keep user logged in after browser close
setPersistence(firebaseAuth, browserLocalPersistence);

interface LoginFormValues {
  email: string;
  password: string;
}

interface UserFormValues {
  email: string;
  password: string;
  // displayName: string; // Uncomment if you want to add display name during signup
}

// Sign in with Email and Password
export const firebaseSignIn = async ({ email, password }: LoginFormValues) => {
  const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return result;
};

// Sign up with Email and Password
export const firebaseSignUp = async ({ email, password }: UserFormValues) => {
  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return result;
};

// Sign in Anonymously
export const firebaseSignInAnonymously = async () => {
  const result = await signInAnonymously(firebaseAuth);
  return result;
};

// Sign out
export const firebaseSignOut = async () => {
  await signOut(firebaseAuth);
}; 