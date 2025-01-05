import { listOrders } from '@/api/orders';
import OrderListItem from '@/components/OrderListItem';
import { useAuth } from '@/store/authStore';
import type { Order } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Text } from 'react-native';

export default function OrdersScreen() {
  const user = useAuth.getState().user;
  if (!user) {
    throw new Error('Something went wrong when logging in');
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: listOrders,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Orders</Text>;
  }

  const ordersByUserId = data.filter(
    (order: Order) => order.userId === user.id
  );

  return (
    <FlatList
      data={ordersByUserId}
      contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
      renderItem={({ item }) => (
        <OrderListItem order={item} />
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}