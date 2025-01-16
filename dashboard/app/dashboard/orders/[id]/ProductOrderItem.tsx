import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { ProductDetail } from '@/types/types';

export default function ProductOrderItem({ productDetail }: { productDetail: ProductDetail; }) {
  return (
    <HStack className='p-4 gap-4'>
      <Image
        source={{
          uri: productDetail.product.image,
        }}
        className={productDetail.product.image ? 'mb-6 w-[150px] h-full rounded-md aspect-[4/3]' : 'mb-6 w-[150px] h-full rounded-md aspect-[4/3] bg-neutral-300'}
        alt={`${productDetail.product.name}`}
        resizeMode="contain"
      />
      <VStack>
        <Text className='font-bold'>{productDetail.product.name}</Text>
        <Text>{productDetail.product.description}</Text>
        <Text>{productDetail.quantity} x <Text className='font-bold'>${productDetail.product.price.toFixed(2)}</Text></Text>
        {productDetail.quantity > 1 ? <Text> - Sub-total: <Text className='text-sm text-typography-700 font-bold'>${(productDetail.product.price * productDetail.quantity).toFixed(2)}</Text></Text> : null}
      </VStack>
    </HStack>
  );
}
