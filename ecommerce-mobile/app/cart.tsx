import { createOrder } from '@/api/orders';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCart } from '@/store/cartStore';
import { useMutation } from '@tanstack/react-query';
import { Link, Redirect } from 'expo-router';
import { CirclePlus, MinusCircle } from 'lucide-react-native';
import { FlatList, Pressable } from 'react-native';

export default function CartScreen() {
  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);

  const createOrderMutation = useMutation({
    mutationFn: () => createOrder(items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price, // MANAGED FROM SERVER SIDE
    }))),
    onSuccess: () => {
      resetCart();
    },
    onError: (error) => console.error(error),
  });

  const increaseItemQuantity = useCart((state) => state.increaseItemQuantity);
  const decreaseItemQuantity = useCart((state) => state.decreaseItemQuantity);


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
          <Button variant='outline' className='mb-4'>
            <ButtonText>Continue shopping</ButtonText>
          </Button>
        </Link>
      )}
      data={items}
      contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
      keyExtractor={(item) => item.product.id.toString()}
      renderItem={({ item }) => (
        <HStack className='bg-white p-3'>
          <VStack space="sm" className='mr-auto'>
            <Text bold isTruncated>{item.product.name}</Text>
            <Text>${item.product.price}</Text>
          </VStack>
          <HStack space="sm" className='justify-end items-center'>
            <Pressable onPress={() => decreaseItemQuantity(item.product)}>
              <Icon as={MinusCircle} size="lg" />
            </Pressable>
            <Text className='p-2'>{item.quantity}</Text>
            <Pressable onPress={() => increaseItemQuantity(item.product)}>
              <Icon as={CirclePlus} size="lg" />
            </Pressable>
          </HStack>
        </HStack>
      )}
      ListFooterComponent={() => (
        <VStack space="sm">
          <HStack className='mx-auto mb-4'>
            <Text>Total: </Text>
            <Text className="text-typography-900">${items.reduce((total, item) => total + item.product.price * item.quantity, 0)}</Text>
          </HStack>
          <Button onPress={onCheckout}>
            <ButtonText>Checkout</ButtonText>
          </Button>
        </VStack>
      )}
    />
  );
}


