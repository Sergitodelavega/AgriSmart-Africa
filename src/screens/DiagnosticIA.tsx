import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { useAuth } from '../hooks/useAuth';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function DiagnosticIA() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState('Maïs');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const result = await geminiService.diagnoseCrop(base64, cropType, profile?.language || 'fr');

      const diagnosticData = {
        userId: profile?.uid,
        imageUrl: image,
        cropType,
        issueDetected: result.issueDetected,
        recommendations: result.recommendations,
        status: result.status,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'diagnostics'), diagnosticData);
      navigate('/diagnostic/result', { state: { ...diagnosticData, id: docRef.id } });
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 flex flex-col h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Diagnostic Intelligent</h2>
        <p className="text-gray-500 text-sm mt-1">Prenez une photo claire des feuilles ou de la plante pour un diagnostic précis.</p>
      </div>

      {/* Image Preview / Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`flex-1 min-h-[300px] border-2 border-dashed rounded-3xl overflow-hidden relative cursor-pointer transition-all ${
          image ? 'border-emerald-500' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {image ? (
          <img src={image} alt="Crop" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <p className="font-medium text-gray-700">Appuyez pour prendre une photo</p>
            <p className="text-xs text-gray-400 mt-2">Format supporté: JPG, PNG</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          className="hidden" 
          accept="image/*" 
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Quel type de culture ?</label>
          <select 
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:border-emerald-500 transition-colors"
          >
            {['Maïs', 'Cacao', 'Manioc', 'Café', 'Riz', 'Tomate', 'Autre'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleDiagnose}
          disabled={!image || loading}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            !image || loading ? 'bg-gray-300' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Lancer le diagnostic'
          )}
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Note de confidentialité :</strong> Vos photos aident à améliorer le modèle pour toute la communauté. Elles sont stockées de manière sécurisée.
        </p>
      </div>
    </div>
  );
}
