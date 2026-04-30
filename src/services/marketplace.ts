import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { MarketplaceItem } from '../types';

export const marketplaceService = {
  async getItems() {
    try {
      const q = query(collection(db, 'marketplace'), orderBy('createdAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceItem));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'marketplace');
      return [];
    }
  },

  async addItem(item: Omit<MarketplaceItem, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'marketplace'), {
        ...item,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'marketplace');
    }
  },

  async seedItems() {
    const items = [
      {
        name: 'Sacs de Maïs Jaune',
        price: 15000,
        quantity: 50,
        unit: 'sac',
        location: 'Abidjan, CI',
        imageUrl: 'https://images.unsplash.com/photo-1551727041-5b347d65b633?q=80&w=400',
        sellerId: 'system',
        sellerName: 'Ferme Bio'
      },
      {
        name: 'Tomates Fraîches',
        price: 500,
        quantity: 100,
        unit: 'kg',
        location: 'Bouaké',
        imageUrl: 'https://images.unsplash.com/photo-1592919016327-5136ed982f0a?q=80&w=400',
        sellerId: 'system',
        sellerName: 'Maraîcher Local'
      }
    ];

    for (const item of items) {
      await this.addItem(item);
    }
  }
};
