import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, getDocs, addDoc, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ChatMessage } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Send, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Chat() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global simulated community chat
    const q = query(
      collection(db, 'chats', 'community', 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage)));
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return unsubscribe;
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      senderId: user?.uid,
      senderName: profile?.displayName || 'Anonyme',
      text: inputText,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'chats', 'community', 'messages'), messageData);
      setInputText('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Community Banner */}
      <div className="bg-white p-3 border-bottom shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <UserIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Communauté AgriSmart</h3>
          <p className="text-[10px] text-emerald-600 font-medium">124 agriculteurs en ligne</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 mb-1">
               <span className="text-[9px] font-bold text-gray-400 uppercase">{msg.senderName}</span>
            </div>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.senderId === user?.uid 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[8px] text-gray-400 mt-1">
              {msg.createdAt && formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: fr })}
            </span>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Posez votre question..." 
          className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:bg-gray-300"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
