import { fetchOrderById } from '@/api/orders';
import { listProducts } from '@/api/products';
import ProductOrderItem from '@/components/ProductOrderItem';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { useAuth } from '@/store/authStore';
import type { OrderItem, Product } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();

  const user = useAuth.getState().user;
  if (!user) {
    <View className="flex-1 items-center justify-center">
      <Text>Please login to view your orders</Text>
      <Link href='/login' asChild>
        <Button>
          <ButtonText>login</ButtonText>
        </Button>
      </Link>
    </View>;
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

  const total = order.items.reduce((total: number, item: OrderItem) => total + item.price * item.quantity, 0);

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
      <HStack className='mb-4 items-center'>
        <Text className='p-4'>Total: </Text>
        <Button variant='outline'>
          <ButtonText className="text-typography-900">${total.toFixed(2)}</ButtonText>
        </Button>
      </HStack>
    </View>
  );
}