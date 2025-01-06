import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  // For production, add a validation of the token and a regenerate if expired...
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/login');
  }
  return <div>{children}</div>;
}
