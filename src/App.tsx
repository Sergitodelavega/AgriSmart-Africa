import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Home, Camera, ShoppingBag, User as UserIcon, MessageSquare, ChevronLeft, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './services/data';

// Screens
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import DiagnosticIA from './screens/DiagnosticIA';
import DiagnosticResult from './screens/DiagnosticResult';
import Marketplace from './screens/Marketplace';
import AddProduct from './screens/AddProduct';
import Chat from './screens/Chat';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const location = useLocation();
  const lang = profile?.language || 'fr';
  const t = translations[lang];

  const hideNav = ['/login', '/splash'].includes(location.pathname);

  const navItems = [
    { path: '/', icon: Home, label: t.dashboard },
    { path: '/diagnostic', icon: Camera, label: t.ia_diagnostic },
    { path: '/marketplace', icon: ShoppingBag, label: t.marketplace },
    { path: '/chat', icon: MessageSquare, label: t.community },
    { path: '/profile', icon: UserIcon, label: t.profile },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden shadow-2xl relative">
      {/* Header */}
      {!hideNav && (
        <header className="bg-emerald-600 text-white p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            {location.pathname !== '/' && (
              <Link to={-1 as any}>
                <ChevronLeft className="w-6 h-6" />
              </Link>
            )}
            <h1 className="text-xl font-bold font-sans tracking-tight">
              {navItems.find(i => i.path === location.pathname)?.label || 'AgriSmart'}
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500 overflow-hidden border-2 border-emerald-400">
            {profile?.displayName?.[0] || 'A'}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      {!hideNav && (
        <nav className="bg-white border-t border-gray-100 flex justify-around p-3 pb-6 sticky bottom-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                location.pathname === item.path ? 'text-emerald-600 font-medium' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/diagnostic" element={<ProtectedRoute><DiagnosticIA /></ProtectedRoute>} />
            <Route path="/diagnostic/result" element={<ProtectedRoute><DiagnosticResult /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/marketplace/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/splash" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
