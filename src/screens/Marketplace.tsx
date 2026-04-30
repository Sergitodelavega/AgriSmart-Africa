import React, { useEffect, useState } from 'react';
import { marketplaceService } from '../services/marketplace';
import { MarketplaceItem } from '../types';
import { ShoppingBag, MapPin, Tag, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      let data = await marketplaceService.getItems();
      if (data.length === 0) {
        await marketplaceService.seedItems();
        data = await marketplaceService.getItems();
      }
      setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, []);

  return (
    <div className="p-4 flex flex-col h-full bg-gray-50">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Rechercher des produits..." 
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:border-emerald-500 transition-colors"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-50 text-emerald-600 rounded-xl">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chargement des produits...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
            >
              <div className="h-32 bg-gray-100 relative">
                <img src={item.imageUrl || 'https://images.unsplash.com/photo-1592919016327-5136ed982f0a?q=80&w=400'} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-gray-900 shadow-sm border border-gray-100">
                  {item.price} CFA
                </div>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h5 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h5>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </div>
                <div className="mt-auto pt-3 flex justify-between items-center">
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {item.quantity} {item.unit}
                  </span>
                  <button className="p-1.5 bg-emerald-600 text-white rounded-lg active:scale-95 transition-all">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <Link 
        to="/marketplace/add"
        className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <Plus className="w-8 h-8" />
      </Link>
    </div>
  );
}
