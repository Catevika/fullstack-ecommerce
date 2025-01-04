import { fetchOrderById } from '@/api/orders';
import { listProducts } from '@/api/products';
import ProductOrderItem from '@/components/ProductOrderItem';
import { useAuth } from '@/store/authStore';
import type { OrderItem, Product } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();

  const user = useAuth.getState().user;
  if (!user) {
    throw new Error('Something went wrong when logging in');
  }

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => fetchOrderById(Number(id)),
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: listProducts,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Orders by Id: {id}</Text>;
  }

  const { items } = order;

  const productDetails = items.map((item: OrderItem) => ({
    id: item.productId,
    product: products.find((product: Product) => product.id === item.productId),
    quantity: item.quantity,
  }));

  return (
    <View>
      <Stack.Screen name="[id]" options={{ title: `Order #${id} - Details` }} />
      <FlatList
        data={productDetails}
        contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
        renderItem={({ item }) => (
          <ProductOrderItem productDetail={item} />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}