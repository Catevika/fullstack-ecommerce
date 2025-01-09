import { getToken } from '@/api/orders';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { House, List, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
  // For production, add a validation of the token and a regenerate if expired...
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  return (
    <div className='h-screen overflow-hidden'>
      <Header />
      <HStack className='h-full'>
        <SideBar />
        <Box className='flex-1 overflow-y-auto mb-36 md:mb-20'>{children}</Box>
      </HStack>
      <MobileNavbar />
    </div>
  );
}
function Header() {
  return (
    <HStack className='bg-gray-50 p-3 border-b-2 border-slate-300 shadow-md shadow-slate-300 flex flex-1 justify-between items-center'>
      <Heading>Dashboard</Heading>
      <Avatar>
        <AvatarFallbackText>DB</AvatarFallbackText>
      </Avatar>
    </HStack>
  );
}
function SideBar() {
  return (
    <VStack className='bg-gray-50 p-3 border-r-2 border-slate-300 hidden md:flex'>
      <Link href={'/dashboard'}>
        <HStack className='w-full mb-4'>
          <House color="black" size={24} />
          <Text className='ml-2'>Dashboard</Text>
        </HStack>
      </Link>
      <Link href={'/dashboard/products'}>
        <HStack className='w-full mb-4'>
          <ShoppingBag color="black" size={24} />
          <Text className='ml-2'>Products</Text>
        </HStack>
      </Link>
      <Link href={'/dashboard/orders'}>
        <HStack className='w-full mb-4'>
          <List color="black" size={24} />
          <Text className='ml-2'>Orders</Text>
        </HStack>
      </Link>
    </VStack>
  );
}

function MobileNavbar() {
  return (
    <HStack className='bg-gray-50 pt-6 border-t-2 border-slate-300 shadow-md shadow-slate-300 flex flex-1 justify-around items-center absolute bottom-0 left-0 right-0 md:hidden'>
      <Link href={'/dashboard'}>
        <HStack className='w-full mb-4'>
          <House color="black" size={24} />
        </HStack>
      </Link>
      <Link href={'/dashboard/products'}>
        <HStack className='w-full mb-4'>
          <ShoppingBag color="black" size={24} />
        </HStack>
      </Link>
      <Link href={'/dashboard/orders'}>
        <HStack className='w-full mb-4'>
          <List color="black" size={24} />
        </HStack>
      </Link>
    </HStack >
  );
}
