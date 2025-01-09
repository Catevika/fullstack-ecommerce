"use server";

import { getToken } from '@/api/orders';
import { API_URL } from '@/config';
import { redirect } from 'next/navigation';

export async function updateOrderStatus(id: number, status: string) {
  const redirectUrl = `/dashboard/orders/${id}`;

  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    return redirect(redirectUrl);
  }
}