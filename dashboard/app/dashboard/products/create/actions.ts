'use server';

import { deleteToken, getToken } from '@/api/orders';
import { API_URL } from '@/config';
import { redirect } from 'next/navigation';

export async function createProduct(
  name: string,
  description: string,
  price: number
) {
  let redirectUrl = '/dashboard/products';
  try {
    const token = await getToken();

    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price }),
    });

    if (!res.ok) {
      console.log(res);
      if (res.status === 401) {
        await deleteToken();
        redirectUrl = '/login';
      } else {
        throw new Error('Failed to create product: ');
      }
    }

    redirect(redirectUrl);
  } catch (error) {
    console.log(error);
    redirectUrl = `/dashboard/products/create?errorMessage=${encodeURIComponent(
      'Failed to create product'
    )}`;
  }
}