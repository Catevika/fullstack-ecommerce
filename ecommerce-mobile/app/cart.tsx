import { createOrder } from '@/api/orders';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCart } from '@/store/cartStore';
import { useMutation } from '@tanstack/react-query';
import { Link, Redirect } from 'expo-router';
import { CirclePlus, MinusCircle } from 'lucide-react-native';
import { FlatList, Image, Pressable } from 'react-native';

export default function CartScreen() {
  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);

  const createOrderMutation = useMutation({
    mutationFn: () => createOrder(items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
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
        <HStack className='bg-white p-3 items-center'>
          <Image
            source={{
              uri: item.product.image || 'https://via.placeholder.com/200x200',
            }}
            className={item.product.image === undefined ? 'h-[80px] rounded-md aspect-[4/3] bg-gray-300' : 'h-[80px] rounded-md aspect-[4/3]'}
            alt={`${item.product.name}`}
            resizeMode="contain"
          />
          <VStack space="sm" className='mr-auto'>
            <Heading size="md">{item.product.name}</Heading>
            <Text className="text-sm font-bold text-typography-700">
              <Text className="text-sm font-normal text-typography-700">Unit price:</Text> ${item.product.price}
            </Text>
            <HStack space="sm" className='justify-start items-center'>
              <Text className='text-sm font-normal text-typography-700'>Quantity: </Text>
              <Pressable onPress={() => decreaseItemQuantity(item.product)}>
                <Icon as={MinusCircle} size="lg" />
              </Pressable>
              <Text className='p-2'>{item.quantity}</Text>
              <Pressable onPress={() => increaseItemQuantity(item.product)}>
                <Icon as={CirclePlus} size="lg" />
              </Pressable>
            </HStack>
            {items.length > 1 && item.quantity > 1 ? <Text className="text-sm font-bold text-typography-700 mb-4"><Text className='text-sm font-bold text-typography-700'>Sub-total: </Text> ${item.product.price * item.quantity}</Text> : null}
          </VStack>
        </HStack>
      )}
      ListFooterComponent={() => (
        <VStack space="sm">
          <Text className='p-4'>Total: </Text>
          <Button variant='outline'>
            <ButtonText className="text-typography-900">${items.reduce((total, item) => total + item.product.price * item.quantity, 0)}</ButtonText>
          </Button>

          <Button onPress={onCheckout}>
            <ButtonText>Checkout</ButtonText>
          </Button>
        </VStack>
      )}
    />
  );
}


