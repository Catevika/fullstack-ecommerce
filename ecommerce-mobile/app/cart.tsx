import { createOrder } from '@/api/orders';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCart } from '@/store/cartStore';
import { useMutation } from '@tanstack/react-query';
import { Link, Redirect } from 'expo-router';
import { FlatList } from 'react-native';

export default function CartScreen() {
  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);

  const createOrderMutation = useMutation({
    mutationFn: () => createOrder(items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price, // MANAGE FROM SERVER SIDE
    }))),
    onSuccess: (data) => {
      console.log(data);
      resetCart();
    },
    onError: (error) => console.error(error),
  });

  const onCheckout = async () => {
    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    return <Redirect href="/" />;
  }

  return (

    <FlatList
      ListHeaderComponent={() => (
        <Link dismissTo href="/" asChild>
          <Button variant='outline'>
            <ButtonText>Continue shopping</ButtonText>
          </Button>
        </Link>
      )}
      data={items}
      contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
      keyExtractor={(item) => item.product.id.toString()}
      renderItem={({ item }) => (
        <HStack className='bg-white p-3'>
          <VStack space="sm">
            <Text bold>{item.product.name}</Text>
            <Text>${item.product.price}</Text>
          </VStack>
          <Text className='ml-auto'>{item.quantity}</Text>
        </HStack>
      )}
      ListFooterComponent={() => (
        <Button onPress={onCheckout}>
          <ButtonText>Checkout</ButtonText>
        </Button>
      )}
    />
  );
}


