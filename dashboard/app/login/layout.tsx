import { getToken } from '@/api/orders';
import { redirect } from 'next/navigation';

export default async function LoginLayout({ children }: { children: React.ReactNode; }) {

  const token = await getToken();

  if (!!token) {
    redirect('/dashboard/products');
  }

  return <div>{children}</div>;
}
