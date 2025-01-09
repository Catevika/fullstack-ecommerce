import { API_URL } from '@/config';
import { cookies } from 'next/headers';

export async function getToken() {
  const token = cookies().get('token')?.value;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(token);
    }, 1000)
  );
}

export async function deleteToken() {
  const isDeleted = cookies().delete('token');
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(isDeleted);
    }, 1000)
  );
}
export async function fetchOrders() {
  try {
    const token = await getToken();

    const res = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchOrderById(id: number) {

  try {
    const token = await getToken();

    const res = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch the order');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}