import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { LogIn, UserPlus } from 'lucide-react';
import { UserProfile } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if profile exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create initial profile
        const newProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Utilisateur',
          email: user.email || '',
          location: '',
          farmerType: 'smallholder',
          crops: [],
          language: 'fr',
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
      }

      navigate('/');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold text-gray-900 font-sans mb-2">Bienvenue</h2>
        <p className="text-gray-500 mb-8">Connectez-vous pour accéder à vos outils agricoles.</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95"
          id="google-login-btn"
        >
          <LogIn className="w-5 h-5" />
          Se connecter avec Google
        </button>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 italic text-gray-400 text-sm">
          "AgriSmart : Pour une agriculture africaine plus intelligente."
        </div>
      </div>
    </div>
  );
}
