import { listProducts } from '@/api/products';
import ProductListItem from '@/components/ProductListItem';
import { Text } from '@/components/ui/text';
import "@/global.css";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, View } from 'react-native';

export default function HomeScreen() {
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      width > 1200 ?
        setNumColumns(4) :
        width > 768 ?
          setNumColumns(3) :
          setNumColumns(2);
    };

    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => subscription.remove();
  }, []);

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

  if (numColumns === 1) {
    <FlatList
      data={data}
      contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
      renderItem={({ item }) => (
        <View>
          {!item.name.includes('PRODUCT OUT OF STOCK') ? <ProductListItem key={item.id.toString()} product={item} /> : null}
        </View>
      )}
      keyExtractor={item => item.id.toString()}
    />;
  } else {
    return (
      <FlatList
        data={data}
        numColumns={numColumns}
        key={numColumns}
        columnWrapperClassName='gap-2'
        contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
        renderItem={({ item }) => (
          <View style={{ width: `${100 / numColumns}%` }}>
            {!item.name.includes('PRODUCT OUT OF STOCK') ? <ProductListItem product={item} /> : null}
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    );
  }
}
