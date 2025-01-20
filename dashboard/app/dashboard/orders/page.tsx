import { fetchOrders } from '@/api/orders';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { Order } from '@/types/types';
import dayjs from 'dayjs';
import Link from 'next/link';
export default async function OrdersPage() {
  const orders = await fetchOrders();
  const sortedOrders = orders.sort((a: Order, b: Order) => b.id - a.id);

  return (
    <Card className='max-w-screen m-4'>
      <HStack className='p-4 border-b border-gray-200 gap-4'>
        <Text className='font-bold'>id</Text>
        <Text className='font-bold'>Date</Text>
        <Text className='font-bold ml-auto'>Status</Text>
      </HStack>
      {sortedOrders.map((order: Order) => (
        <Link href={`/dashboard/orders/${order.id}`} key={order.id}>
          <HStack key={order.id} className='p-4 border-b border-gray-200 gap-4'>
            <Text>{order.id}</Text>
            <Text>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
            <Text className='ml-auto'>{order.status}</Text>
          </HStack>
        </Link>
      ))}
    </Card>
  );
}
