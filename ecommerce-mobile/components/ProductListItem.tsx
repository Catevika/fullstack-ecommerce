import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import type { Product } from '@/types/types';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
const ProductListItem = ({ product }: { product: Product; }) => {
  return (
    <Link href={`/products/${product.id}`} asChild>
      <Pressable className="flex-1">
        <Card className="p-5 rounded-lg flex-1">
          <Image
            source={{
              uri: product.image || 'https://via.placeholder.com/300x200',
            }}
            className={product.image === undefined ? 'h-[80px] rounded-md aspect-[4/3] bg-gray-300' : 'h-[80px] rounded-md aspect-[4/3]'}
            alt={`${product.name}`}
            resizeMode="contain"
          />
          <Text className="text-sm font-normal mb-2 text-typography-700">
            {product.name}
          </Text>
          <Heading size="md" className="mb-4">
            ${product.price.toFixed(2)}
          </Heading>
        </Card>
      </Pressable>
    </Link>
  );
};
export default ProductListItem;
