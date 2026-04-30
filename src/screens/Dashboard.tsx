import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { weatherService, WeatherData, translations } from '../services/data';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, MapPin, Search, Plus, AlertTriangle, CheckCircle, ArrowRight, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Diagnostic } from '../types';

export default function Dashboard() {
  const { profile } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [lastDiagnostics, setLastDiagnostics] = useState<Diagnostic[]>([]);
  const lang = profile?.language || 'fr';
  const t = translations[lang];

  useEffect(() => {
    async function init() {
      if (profile?.location) {
        const w = await weatherService.getWeather(profile.location);
        setWeather(w);
      } else {
        const w = await weatherService.getWeather('Abidjan, CI');
        setWeather(w);
      }

      if (profile?.uid) {
        const q = query(
          collection(db, 'diagnostics'),
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snap = await getDocs(q);
        setLastDiagnostics(snap.docs.map(d => ({ id: d.id, ...d.data() } as Diagnostic)));
      }
    }
    init();
  }, [profile]);

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'warning': return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
      case 'critical': return <AlertTriangle className="text-red-500 w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Weather Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden"
      >
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-100 text-sm mb-1">
              <MapPin className="w-4 h-4" />
              {weather?.location || 'Localisation...'}
            </div>
            <h3 className="text-4xl font-bold font-sans">{weather?.temp}°C</h3>
            <p className="text-emerald-100 italic">{weather?.condition}</p>
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sun className="w-16 h-16 text-yellow-400" />
          </motion.div>
        </div>
        <div className="mt-4 flex gap-6 text-sm text-emerald-50 relative z-10">
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4" />
            {weather?.humidity}% Humidité
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="w-4 h-4" />
            Ressenti {weather ? weather.temp + 2 : '--'}°C
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </motion.div>

      {/* Quick Actions */}
      <section>
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{t.ia_diagnostic}</h4>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/diagnostic"
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">{t.ia_diagnostic}</span>
          </Link>
          <Link
            to="/marketplace/add"
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">{t.add_product}</span>
          </Link>
        </div>
      </section>

      {/* Recent Diagnostics */}
      <section>
        <div className="flex justify-between items-center mb-3 px-1">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.recent_diagnostics}</h4>
          <Link to="/diagnostic" className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {lastDiagnostics.length > 0 ? (
            lastDiagnostics.map((d) => (
              <div key={d.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img src={d.imageUrl} alt={d.cropType} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 text-sm capitalize">{d.cropType}</h5>
                    <p className="text-xs text-gray-500 line-clamp-1">{d.issueDetected}</p>
                  </div>
                </div>
                <StatusIcon status={d.status} />
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-100">
              <p className="text-emerald-700 text-sm">Finissez votre premier diagnostic IA !</p>
            </div>
          )}
        </div>
      </section>

      {/* Advice Section */}
      <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-800 mb-2">Conseil du jour</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          "C'est la période idéale pour semer le maïs dans votre région. Assurez-vous que le sol est bien drainé."
        </p>
        <button className="mt-4 text-emerald-600 text-sm font-bold flex items-center gap-1">
          En savoir plus <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
