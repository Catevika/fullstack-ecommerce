import { listOrders } from '@/api/orders';
import OrderListItem from '@/components/OrderListItem';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/store/authStore';
import type { Order, OrderComparison } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function OrdersScreen() {
  const token = useAuth.getState().token;
  const user = useAuth.getState().user;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: listOrders,
    enabled: !!token && !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0
  });

  if (!token || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Please login to view your orders</Text>
        <Link href='/login' asChild>
          <Button className='mt-2'>
            <ButtonText>login</ButtonText>
          </Button>
        </Link>
      </View>);
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Failed to fetch Orders</Text>
        <Button onPress={() => refetch()}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </View>
    );
  }

  if (!data) {
    return <Text>No orders found</Text>;
  }

  const ordersByUserId: Order[] = data.filter(
    (order: Order) => order.userId === user.id).sort(
      (a: OrderComparison, b: OrderComparison) => b.id - a.id
    );

  return (
    <FlatList
      data={ordersByUserId}
      contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
      renderItem={({ item }) => (
        <OrderListItem order={item} />
      )}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={<Text>No orders found</Text>}
    />
  );
}