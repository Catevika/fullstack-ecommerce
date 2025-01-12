import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { ProductDetail } from '@/types/types';
import Image from 'next/image';

export default function ProductOrderItem({ productDetail }: { productDetail: ProductDetail; }) {
  return (
    <HStack className='p-4 gap-4'>
      <Image src={productDetail.product?.image || 'https://placehold.co//100x100'} alt={productDetail.product.name} width={100}
        height={0} style={{ width: 'auto', height: 'auto', borderRadius: '10px' }} priority />
      <Text>{productDetail.quantity} x <Text className='font-bold'>${productDetail.product.price.toFixed(2)}</Text></Text>
      {productDetail.quantity > 1 ? <Text> - Sub-total: <Text className='text-sm text-typography-700 font-bold'>${(productDetail.product.price * productDetail.quantity).toFixed(2)}</Text></Text> : null}
    </HStack>
  );
}
