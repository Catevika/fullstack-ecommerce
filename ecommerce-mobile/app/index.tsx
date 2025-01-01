import products from '@/assets/products.json';
import ProductListItem from '@/components/ProductListItem';
import "@/global.css";
import { FlatList } from 'react-native';

export default function HomeScreen() {
  return (
    <FlatList
      data={products}
      columnWrapperClassName='gap-2'
      contentContainerClassName='gap-2'
      numColumns={2}
      renderItem={({ item }) => (
        <ProductListItem product={item} />
      )}
      keyExtractor={item => item.id.toString()}
    />
  );

}
