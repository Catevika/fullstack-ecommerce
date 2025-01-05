import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { ProductDetail } from '@/types/types';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { HStack } from './ui/hstack';
const ProductOrderItem = ({ productDetail }: { productDetail: ProductDetail; }) => {
  return (
    <Link href={`/product/${productDetail.id}`} asChild>
      <Pressable className="flex-1">
        <HStack className="bg-white p-5 rounded-lg flex-1">
          <Image
            source={{
              uri: productDetail.product.image,
            }}
            className="mb-6 h-[80px] rounded-md aspect-[4/3]"
            alt={`${productDetail.product.name}`}
            resizeMode="contain"
          />
          <VStack space="sm" className='pl-4'>
            <Text className="text-sm font-normal mb-2 text-typography-700">
              {productDetail.product.name}
            </Text>
            <Heading size="md" className="mb-4">
              ${productDetail.product.price * productDetail.quantity}
            </Heading>
          </VStack>
          <Text className='text-sm font-normal text-typography-700 ml-auto'>Quantity: {productDetail.quantity}</Text>
        </HStack>
      </Pressable>
    </Link>
  );
};
export default ProductOrderItem;
