import products from '@/assets/products.json';
import ProductListItem from '@/components/ProductListItem';
import "@/global.css";
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, useWindowDimensions } from 'react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    const updateLayout = () => {
      width > 1200 ?
        setNumColumns(4) :
        width > 768 ?
          setNumColumns(3) :
          setNumColumns(2);
    };

    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => subscription.remove();
  }, [width]);

  return (
    <FlatList
      data={products}
      columnWrapperClassName='gap-2'
      contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
      key={numColumns}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <ProductListItem product={item} />
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}
