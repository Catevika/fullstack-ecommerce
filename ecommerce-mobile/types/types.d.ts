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
  setUser: (user: User) => void;
  setToken: (token: string) => void;
};