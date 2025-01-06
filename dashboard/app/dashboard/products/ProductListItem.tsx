import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import type { Product } from '@/types/types';
import Link from 'next/link';
const ProductListItem = ({ product }: { product: Product; }) => {
  return (
    <Link href={`/dashboard/products/${product.id}`}>
      <Card className="p-5 rounded-lg flex-1">
        <Image
          source={{
            uri: product.image,
          }}
          className="mb-6 h-[240px] w-full rounded-md aspect-[4/3]"
          alt={`${product.name}`}
          resizeMode="contain"
        />
        <Text className="text-sm font-normal mb-2 text-typography-700">
          {product.name}
        </Text>
        <Heading size="md" className="mb-4">
          ${product.price}
        </Heading>
      </Card>
    </Link>
  );
};
export default ProductListItem;
