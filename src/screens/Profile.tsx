import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { LogOut, Globe, Shield, User, MapPin, Briefcase, Leaf, Save, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    location: profile?.location || '',
    farmerType: profile?.farmerType || 'smallholder',
    language: profile?.language || 'fr'
  });

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => auth.signOut();

  return (
    <div className="p-6 space-y-8 bg-white min-h-full">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-4 border-emerald-50 mb-4 text-3xl font-bold">
          {profile?.displayName?.[0] || 'A'}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{profile?.displayName}</h3>
        <p className="text-sm text-gray-400">{profile?.email}</p>
      </div>

      <div className="space-y-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Informations Personnelles</h4>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Nom complet</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Localisation</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Type d'agriculteur</label>
            <div className="relative">
              <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <select 
                value={formData.farmerType}
                onChange={(e) => setFormData({...formData, farmerType: e.target.value as any})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm outline-none"
              >
                <option value="smallholder">Petit Exploitant</option>
                <option value="commercial">Commercial</option>
                <option value="hobbyist">Amateur</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Langue</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <select 
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value as any})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
            saved ? 'bg-green-500' : 'bg-emerald-600'
          }`}
        >
          {loading ? <Save className="animate-spin w-5 h-5" /> : (saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />)}
          {saved ? 'Enregistré !' : 'Enregistrer les modifications'}
        </button>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full py-4 rounded-xl border border-red-100 text-red-500 font-bold flex items-center justify-center gap-2 active:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" /> Déconnexion
        </button>
      </div>
    </div>
  );
}
