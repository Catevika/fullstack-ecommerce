const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function listProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = res.json();
  return data;
}

export async function fetchProductById(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  const data = res.json();
  return data;
}