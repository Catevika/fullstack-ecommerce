import { listProducts } from '@/api/products';
import ProductListItem from '@/components/ProductListItem';
import { Text } from '@/components/ui/text';
import "@/global.css";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, useWindowDimensions } from 'react-native';

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: listProducts,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Products</Text>;
  }

  return (
    <FlatList
      data={data}
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
