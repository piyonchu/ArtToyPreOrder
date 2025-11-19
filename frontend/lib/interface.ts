export interface ICategory {
  _id: string;
  value: string;
  label: string;
  icon: string;
}

export interface ITag {
  _id: string;
  value: string;
  label: string;
}

export interface IColor {
  name: string;
  hexCode: string;
}

export interface ISize {
  name: string;
  measurement: string;
}

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  type?: string;
  stock?: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  colors?: IColor[];
  sizes?: ISize[];
  highlights?: string[];
  discountPrice?: number;
}

// IArtToy Interface with discountedPrice field
export interface IArtToy {
  _id: string;
  sku: string;
  name: string;
  description: string;
  arrivalDate: string;
  availableQuota: number;
  posterPicture: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number; // Virtual field for discounted price
  rating: number;
  images: string[];
  tags: string[];
}

// IAllArtToys Interface
export interface IAllArtToys {
  page: number;
  totalPages: number;
  totalProducts: number;
  products: IArtToy[];
}

export interface IOrderItem {
  artToy: IArtToy;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface IOrder {
  _id: string;
  user: IUser;
  items: IOrderItem[];  // Array of items ordered
  totalQuantity: number;
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';  // Example statuses
  createdAt: string;  // Date when the order was created
  updatedAt: string;  // Date when the order was last updated
}


export interface IAllProducts {
  page: number;
  totalPages: number;
  totalProducts: number;
  products: IProduct[];
}

export interface Cart {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  img: string;
  userID?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}
