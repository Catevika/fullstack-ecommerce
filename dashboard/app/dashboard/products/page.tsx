import { listProducts } from '@/api/products';
import ProductListItem from '@/app/dashboard/products/ProductListItem';
import { Card } from '@/components/ui/card';
import { AddIcon, Icon } from '@/components/ui/icon';
import { Product } from '@/types/types';
import Link from 'next/link';

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <div className='flex flex-row flex-wrap gap-4 max-w-[1200px] justify-center w-full mx-auto py-4'>
      <Link href={`/dashboard/products/create`}>
        <Card className='w-[360px] h-full justify-center items-center flex'>
          <Icon as={AddIcon} className='w-10 h-10 color-slate-600' />
        </Card>
      </Link>
      {products.map((product: Product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
}