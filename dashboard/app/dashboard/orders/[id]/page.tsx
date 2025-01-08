import { fetchOrderById } from '@/api/orders';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { OrderItem } from '@/types/types';
import dayjs from 'dayjs';

export default async function OrderPage({ params }: { params: { id: string; }; }) {
  const { id } = params;
  const order = await fetchOrderById(Number(id));

  console.log(order);
  return (
    <Card>
      <HStack key={order.id} className='p-4 border-b border-gray-200 gap-4'>
        <Text className='font-bold'>Order #{order.id}</Text>
        <Text>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
        <Text className='ml-auto'>{order.status}</Text>
      </HStack>
      <VStack className='p-4'>
        <Text className='mt-4 font-bold'>Items</Text>
        {order.items.map((orderItem: OrderItem) => (
          <HStack key={orderItem.id} className='p-4 gap-4'>
            <Text>{orderItem.quantity} x ${orderItem.price}</Text>
          </HStack>
        ))}
      </VStack>
    </Card>
  );
}