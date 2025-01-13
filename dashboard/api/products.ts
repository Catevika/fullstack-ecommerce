"use server";

import { deleteToken, getToken } from '@/api/orders';
import { API_URL } from '@/config';
import { redirect } from 'next/navigation';

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

export async function updateProduct(
  id: number,
  updatedFields: {
    name?: string;
    description?: string;
    price?: number;
  }
) {
  let redirectUrl = '/dashboard/products';
  try {
    const token = await getToken();

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
      console.log(res);
      if (res.status === 401) {
        await deleteToken();
        redirectUrl = '/login';
      } else {
        throw new Error('Failed to update product: ');
      }
    }
  } catch (error) {
    console.log(error);
    redirectUrl = `/dashboard/products/update?errorMessage=${encodeURIComponent(
      'Failed to update product'
    )}`;
  }

  redirect(redirectUrl);
}