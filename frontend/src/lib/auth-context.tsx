"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

interface ProfileUpdate {
  displayName?: string;
  photoURL?: string;
}

interface AuthContextValue {
  user: User | null;
  /** True until the initial auth state has resolved. */
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (data: ProfileUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Bumped after a profile update so consumers re-read the mutated user.
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    setUser(cred.user);
    setTick((t) => t + 1);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: ProfileUpdate) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, data);
    setUser(auth.currentUser);
    setTick((t) => t + 1);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// Map common Firebase auth error codes to friendly, translatable messages.
export function authErrorMessage(err: unknown): string | null {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-email":
      return "auth.err_invalid_email";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "auth.err_invalid_credential";
    case "auth/email-already-in-use":
      return "auth.err_email_in_use";
    case "auth/weak-password":
      return "auth.err_weak_password";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return null; // user dismissed — not an error worth surfacing
    case "auth/too-many-requests":
      return "auth.err_too_many";
    default:
      return "auth.error_generic";
  }
}
