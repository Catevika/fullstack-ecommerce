import { useAuth } from '@/store/authStore';
import type { OrderItem } from '@/types/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(items: OrderItem[]) {
  const token = useAuth.getState().token;

  if (!token) {
    throw new Error('Something went wrong when logging in');
  }

  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({ order: {}, items }),
  });

  if (!res.ok) {
    throw new Error('Failed to create order');
  }
  const data = await res.json();
  console.log(data);
  return data;
}