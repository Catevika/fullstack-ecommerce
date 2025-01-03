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

export type CartState = {
  items: CartItem[];
  addProduct: (product: Product) => void;
  resetCart: () => void;
};