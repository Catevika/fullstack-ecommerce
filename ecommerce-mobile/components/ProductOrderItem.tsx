import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { ProductDetail } from '@/types/types';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
const ProductOrderItem = ({ productDetail }: { productDetail: ProductDetail; }) => {
  return (
    <Link href={`/products/${productDetail.id}`} asChild>
      <Pressable className="flex-1">
        <HStack className="bg-white pt-5 rounded-lg flex-1">
          {productDetail.product.image ? <Image
            source={{
              uri: productDetail.product.image,
            }}
            className='h-[80px] rounded-md aspect-[4/3]'
            alt={`${productDetail.product.name}`}
            resizeMode="contain"
          /> : <View className='h-[80px] rounded-md aspect-[4/3] ml-4 bg-gray-300'></View>}
          <VStack space="sm" className='pl-4'>
            <Text isTruncated className="text-sm font-bold text-typography-700 max-w-[200px]">
              {productDetail.product.name}
            </Text>
            <Text className="text-sm font-bold text-typography-700">
              <Text className="text-sm font-normal text-typography-700">Unit price:</Text> ${productDetail.product.price.toFixed(2)}
            </Text>
            <Text className="text-sm font-bold text-typography-700 mb-4"><Text className='text-sm font-normal text-typography-700'>Quantity: </Text> {productDetail.quantity}</Text>
            {productDetail.quantity > 1 ? <Text className="text-sm font-bold text-typography-700 mb-4"><Text className='text-sm font-bold text-typography-700'>Sub-total: </Text> ${(productDetail.product.price * productDetail.quantity).toFixed(2)}</Text> : null}
          </VStack>
        </HStack>
      </Pressable>
    </Link>
  );
};
export default ProductOrderItem;
