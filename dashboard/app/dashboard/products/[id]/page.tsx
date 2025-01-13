import { fetchProductById } from '@/api/products';
import ProductListItem from '@/app/dashboard/products/ProductListItem';

export default async function ProductPage({ params: { id } }: { params: { id: string; }; }) {
  const product = await fetchProductById(Number(id));

  return (
    <div className='max-w-screen-lg mx-auto w-full'>
      <div className='p-4'>
        <ProductListItem product={product} />
      </div>
    </div>
  );
}

