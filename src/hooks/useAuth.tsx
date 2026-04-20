import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = undefined;
      }

      if (authUser) {
        try {
          // First check if profile exists, if not create it
          const docRef = doc(db, 'users', authUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            const newProfile = {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,
              role: 'seeker',
              skills: [],
              bio: '',
              createdAt: serverTimestamp(),
              averageRating: 0,
              totalReviews: 0,
            };
            await setDoc(docRef, newProfile);
          }

          // Set up real-time listener for profile
          unsubscribeProfile = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
              setProfile(doc.data());
            }
            setLoading(false);
          }, (error) => {
            console.error("Profile listener error:", error);
            setLoading(false);
          });
        } catch (error) {
          console.error("Failed to initialize user profile:", error);
          toast.error("Could not load your profile. Please check your connection.");
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // Silently handle popup closure by user
        console.log('Sign-in popup closed by user.');
        return;
      }
      
      if (error.code === 'auth/cancelled-popup-request') {
        // Handle overlapping popup requests
        return;
      }

      if (error.code === 'auth/popup-blocked') {
        toast.error('The sign-in popup was blocked by your browser. Please allow popups for this site.');
        return;
      }

      if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized in Firebase. Please add this URL to your Firebase Console Authorized Domains.');
        console.error('Unauthorized domain error. Please add your current domain to Firebase Console > Authentication > Settings > Authorized Domains.');
        return;
      }

      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during sign-in.');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
