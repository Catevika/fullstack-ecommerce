"use server";
import { deleteToken, getToken } from '@/api/orders';
import { API_URL } from '@/config';
import { redirect } from 'next/navigation';

export async function deleteProduct(id: number) {
  let redirectUrl = '/dashboard/products';
  try {
    const token = await getToken();

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        await deleteToken();
        redirectUrl = '/login';
      } else {
        throw new Error('Failed to delete product');
      }
    }
  } catch (error) {
    console.log(error);
    redirectUrl = `/dashboard/products?errorMessage=${encodeURIComponent(
      'Failed to delete product'
    )}`;
  }
  redirect(redirectUrl);
}