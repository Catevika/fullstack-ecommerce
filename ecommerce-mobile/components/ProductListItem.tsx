import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import type { Product } from '@/types/types';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
const ProductListItem = ({ product }: { product: Product; }) => {
  return (
    <Link href={`/products/${product.id}`} asChild>
      <Pressable className="flex-1">
        <Card className="p-5 rounded-lg flex-1 items-center">
          {product.image ? <Image
            source={{
              uri: product.image,
            }}
            className='h-[80px] rounded-md aspect-[4/3]'
            alt={`${product.name}`}
            resizeMode="contain"
          /> : <View className='h-[80px] rounded-md aspect-[4/3] bg-gray-300'></View>}
          <Text isTruncated className="text-sm text-center font-normal my-2 text-typography-700 max-w-[200px]">
            {product.name}
          </Text>
          <Heading size="md" className="mb-4 mt-auto">
            ${product.price.toFixed(2)}
          </Heading>
        </Card>
      </Pressable>
    </Link>
  );
};
export default ProductListItem;
