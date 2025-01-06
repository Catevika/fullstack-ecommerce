import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { ProductDetail } from '@/types/types';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { HStack } from './ui/hstack';
const ProductOrderItem = ({ productDetail }: { productDetail: ProductDetail; }) => {
  return (
    <Link href={`/products/${productDetail.id}`} asChild>
      <Pressable className="flex-1">
        <HStack className="bg-white pt-5 rounded-lg flex-1">
          <Image
            source={{
              uri: productDetail.product.image,
            }}
            className="mb-6 h-[80px] rounded-md aspect-[4/3]"
            alt={`${productDetail.product.name}`}
            resizeMode="contain"
          />
          <VStack space="sm" className='pl-4'>
            <Text className="text-sm font-bold text-typography-700">
              {productDetail.product.name}
            </Text>
            <Text className="text-sm font-bold text-typography-700">
              <Text className="text-sm font-normal text-typography-700">Unit price:</Text> ${productDetail.product.price}
            </Text>
            <Text className="text-sm font-bold text-typography-700 mb-4"><Text className='text-sm font-normal text-typography-700'>Quantity: </Text> {productDetail.quantity}</Text>
            {productDetail.quantity > 1 ? <Text className="text-sm font-bold text-typography-700 mb-4"><Text className='text-sm font-bold text-typography-700'>Sub-total: </Text> ${productDetail.product.price * productDetail.quantity}</Text> : null}
          </VStack>
        </HStack>
      </Pressable>
    </Link>
  );
};
export default ProductOrderItem;
