export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
};

export type CartState = {
  items: CartItem[];
  addProduct: (product: Product) => void;
  resetCart: () => void;
};

export type User = {
  id: number;
  email: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
};

export type Order = {
  id: number;
  createdAt: Date;
  status: string;
  userId: number;
};

export type MergedOrder = {
  items: ({
    id: number;
    orderId: number;
    price: number;
    productId: number;
    quantity: number;
  } | null)[];
  id: number;
  createdAt: Date;
  status: string;
  userId: number;
};