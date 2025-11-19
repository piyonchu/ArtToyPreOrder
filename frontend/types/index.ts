export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface ArtToy {
  _id: string;
  sku: string;
  name: string;
  description: string;
  arrivalDate: Date;
  availableQuota: number;
  posterPicture: string;
}

export interface Order {
  _id: string;
  user: User;
  artToy: ArtToy;
  orderAmount: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
