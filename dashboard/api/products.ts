import { API_URL } from '@/config';
export async function listProducts() {
  const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
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