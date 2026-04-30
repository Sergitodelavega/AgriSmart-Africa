import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, AlertTriangle, XCircle, ArrowLeft, Share2, ClipboardList, Info } from 'lucide-react';
import { Diagnostic } from '../types';

export default function DiagnosticResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as Diagnostic;
  
  console.log("DiagnosticResult received data:", data);

  if (!data) return (
    <div className="p-10 text-center flex flex-col items-center gap-4">
      <p className="text-gray-500">Aucun résultat trouvé.</p>
      <Link to="/diagnostic" className="text-emerald-600 font-bold">Retour au diagnostic</Link>
    </div>
  );

  const StatusHeader = () => {
    switch (data.status) {
      case 'healthy':
        return (
          <div className="bg-green-50 border border-green-100 p-6 rounded-3xl text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
            <h3 className="text-xl font-bold text-green-800 uppercase tracking-tight">Culture Saine</h3>
            <p className="text-green-700 text-sm">Bon travail ! Continuez votre entretien régulier.</p>
          </div>
        );
      case 'warning':
        return (
          <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl text-center flex flex-col items-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mb-2" />
            <h3 className="text-xl font-bold text-yellow-800 uppercase tracking-tight">Attention Requise</h3>
            <p className="text-yellow-700 text-sm">Quelques signes de stress détectés.</p>
          </div>
        );
      case 'critical':
        return (
          <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-center flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-2" />
            <h3 className="text-xl font-bold text-red-800 uppercase tracking-tight">État Critique</h3>
            <p className="text-red-700 text-sm">Action immédiate recommandée pour sauver la récolte.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <StatusHeader />

      <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img src={data.imageUrl} alt="Analyse" className="w-full h-full object-cover" />
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
              <Info className="w-4 h-4" /> Problème Détecté
            </h4>
            <p className="text-lg font-bold text-gray-900 mt-1">{data.issueDetected}</p>
          </div>
          
          <div className="h-px bg-gray-100 w-full"></div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Solutions recommandées
            </h4>
            <div className="mt-2 text-gray-700 text-sm space-y-2 leading-relaxed">
              {(data.recommendations || "Aucune recommandation disponible.").split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        <button 
          onClick={() => window.print()}
          className="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Share2 className="w-5 h-5" /> Partager
        </button>
        <Link 
          to="/"
          className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
        >
          Terminer
        </Link>
      </div>
    </div>
  );
}
