export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  location?: string;
  farmerType: 'smallholder' | 'commercial' | 'hobbyist';
  crops: string[];
  language: 'fr' | 'en';
  createdAt: string;
}

export interface Diagnostic {
  id: string;
  userId: string;
  imageUrl: string;
  cropType: string;
  issueDetected: string;
  recommendations: string;
  status: 'healthy' | 'warning' | 'critical';
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  imageUrl: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export type Language = 'fr' | 'en';
