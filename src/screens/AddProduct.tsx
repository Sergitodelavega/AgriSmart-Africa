import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Package, DollarSign, MapPin, Loader2, Check } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

export default function AddProduct() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: profile?.location || ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'marketplace'), {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        sellerId: profile?.uid,
        sellerName: profile?.displayName,
        imageUrl: image,
        createdAt: new Date().toISOString()
      });
      navigate('/marketplace');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'marketplace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-full">
      <h2 className="text-2xl font-bold mb-6">Mettre en vente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square max-w-[200px] mx-auto bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden relative"
        >
          {image ? (
            <img src={image} alt="Produit" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-[10px] text-gray-400 font-medium">Ajouter une photo</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              required
              type="text" 
              placeholder="Nom du produit" 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                required
                type="number" 
                placeholder="Prix (CFA)" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500 transition-colors"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="relative w-32">
              <input 
                required
                type="number" 
                placeholder="Qté" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 outline-none focus:border-emerald-500 transition-colors"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
              <select 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="absolute right-0 top-0 bottom-0 bg-transparent px-2 text-xs font-semibold text-emerald-600 outline-none"
              >
                <option value="kg">kg</option>
                <option value="sac">sac</option>
                <option value="t">t</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              required
              type="text" 
              placeholder="Localisation" 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500 transition-colors"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg disabled:bg-gray-300"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          Publier l'annonce
        </button>
      </form>
    </div>
  );
}
