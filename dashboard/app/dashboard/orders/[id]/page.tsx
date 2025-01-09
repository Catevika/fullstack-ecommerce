import { fetchOrderById } from '@/api/orders';
import { listProducts } from '@/api/products';
import ProductOrderItem from '@/app/dashboard/orders/[id]/ProductOrderItem';
import StatusSelector from '@/app/dashboard/orders/[id]/StatusSelector';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { OrderItem, ProductDetail } from '@/types/types';
import { Product } from '@/types/types';
import dayjs from 'dayjs';

export default async function OrderPage({ params }: { params: { id: string; }; }) {
  const { id } = params;
  const order = await fetchOrderById(Number(id));
  const products = await listProducts();

  if (!order) {
    return <div>Order not found</div>;
  }

  const productDetails = order.items.map((orderItem: OrderItem) => ({
    id: orderItem.productId,
    product: products.find((product: Product) => product.id === orderItem.productId),
    quantity: orderItem.quantity,
  }));

  const total = order.items.reduce((total: number, item: OrderItem) => total + item.price * item.quantity, 0);

  return (
    <Card className='max-w-screen m-4'>
      <HStack key={order.id} className='p-4 border-b border-gray-200 gap-4'>
        <Text className='font-bold'>Order #{order.id}</Text>
        <Text>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
        <StatusSelector status={order.status} id={order.id} />
      </HStack>
      <VStack className='p-4'>
        <Text className='mt-4 font-bold'>{order.quantity = 1 ? 'Item' : 'Items'}</Text>
        {productDetails.map((productDetail: ProductDetail) => (
          <ProductOrderItem key={productDetail.id} productDetail={productDetail} />
        ))}
      </VStack>
      <VStack className='p-4'>
        <Text>Total: <Text className='mt-4 font-bold'>${total}</Text></Text>
      </VStack>
    </Card>
  );
}