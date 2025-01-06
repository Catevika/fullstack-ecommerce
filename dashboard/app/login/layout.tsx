import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default function LoginLayout({ children }: { children: React.ReactNode; }) {

  const token = cookies().get('token')?.value;
  if (!!token) {
    redirect('/dashboard');
  }
  return <div>{children}</div>;
}
