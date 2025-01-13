"use client";

import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import type { Product } from '@/types/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const ProductListItem = ({ product }: { product: Product; }) => {
  const pathname = usePathname();
  const isProductDetailsPage = pathname === `/dashboard/products/${product.id}`;

  return (
    <Link href={`/dashboard/products/${product.id}`}>
      <Card className="p-5 rounded-lg flex-1">
        <Image
          source={{
            uri: product.image || 'https://placehold.co//200x200',
          }}
          className={product.image ? 'mb-6 h-[240px] w-full rounded-md aspect-[4/3]' : 'mb-6 h-[240px] w-full rounded-md aspect-[4/3] bg-neutral-300'}
          alt={`${product.name}`}
          resizeMode="contain"
        />
        <Text className="text-sm font-normal mb-2 text-typography-700">
          {product.name}
        </Text>
        {isProductDetailsPage ? <Text className="text-sm font-normal mb-2 text-typography-700">
          {product.description}
        </Text> : null}
        <Heading size="md" className="mb-4">
          ${product.price.toFixed(2)}
        </Heading>
        <Link href={`/dashboard/products/${product.id}/update`}>
          <Button>
            <ButtonText>Update</ButtonText>
          </Button>
        </Link>
      </Card>
    </Link>
  );
};
export default ProductListItem;
