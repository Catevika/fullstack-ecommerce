import { listOrders } from '@/api/orders';
import OrderListItem from '@/components/OrderListItem';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/store/authStore';
import type { Order } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function OrdersScreen() {
  const token = useAuth.getState().token;
  const user = useAuth.getState().user;

  if (!token || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Please login to view your orders</Text>
        <Link href='/login' asChild>
          <Button>
            <ButtonText>login</ButtonText>
          </Button>
        </Link>
      </View>);
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: listOrders,
    enabled: !!token && !!user,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Orders</Text>;
  }

  if (!data) {
    return null;
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