import { createOrder, updateOrderStatus } from '@/api/orders';
import { createPaymentIntent } from '@/api/stripe';
import { CustomAlert } from '@/components/CustomAlert';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/store/authStore';
import { useCart } from '@/store/cartStore';
import { resetPaymentSheetCustomer, useStripe } from '@stripe/stripe-react-native';
import { useMutation } from '@tanstack/react-query';
import { Link, Redirect, Stack, useRouter } from 'expo-router';
import { CheckCircleIcon, CirclePlus, CircleX, MinusCircle } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';

export default function CartScreen() {
  const token = useAuth?.getState().token;

  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [orderId, setOrderId] = useState('');

  const updateOrderStatusMutation = useMutation({
    mutationFn: () => updateOrderStatus(Number(orderId), 'Canceled'),
    onSuccess: () => {
      resetCart();
      resetPaymentSheetCustomer();
      setShowAlertError(true);
    },
    onError: () => {
      console.log('Error updating order status');
    },
  });

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === 'Canceled') {
        updateOrderStatusMutation.mutate();
      } else {
        console.log(error);
      }
    } else {
      resetCart();
      setShowAlertDialog(true);
    }
  };

  const paymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: async (data) => {
      const { paymentIntent, ephemeralKey, customer } = data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Catevika",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        // allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        }
      });

      if (error) {
        console.log(error);
      }
      openPaymentSheet();
    },
    onError: (error) => console.error(error)
  });

  const router = useRouter();

  const createOrderMutation = useMutation({
    mutationFn: () => createOrder(items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }))),
    onSuccess: (data) => {
      setOrderId(data.id);
      paymentIntentMutation.mutate({ orderId: data.id });
    },
    onError: (error) => console.error(error),
  });

  const increaseItemQuantity = useCart((state) => state.increaseItemQuantity);
  const decreaseItemQuantity = useCart((state) => state.decreaseItemQuantity);

  if (showAlertError) {
    return (
      <CustomAlert
        icon={CircleX}
        iconClassName='color-red-600 background-white'
        message="Payment & order canceled"
        showAlertError={showAlertError}
        handleClose={() => {
          setShowAlertError(false);
          resetPaymentSheetCustomer();
          router.replace('/');
        }}
      />
    );
  }
  if (showAlertDialog) {
    return (
      <CustomAlert
        icon={CheckCircleIcon}
        iconClassName='color-green-600 background-white'
        message="Order confirmed"
        showAlertDialog={showAlertDialog}
        handleClose={() => {
          setShowAlertDialog(false);
          router.replace('/');
        }}
      />
    );
  }

  if (items.length === 0) {
    return <Redirect href="/" />;
  }

  return (
    <View>
      <Stack.Screen options={{ headerShown: true, title: 'Cart' }} />

      {token ? <FlatList
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
            {item.product.image ? <Image
              source={{
                uri: item.product.image,
              }}
              className='h-[80px] rounded-md aspect-[4/3]'
              alt={`${item.product.name}`}
              resizeMode="contain"
            /> : <View className='h-[80px] rounded-md aspect-[4/3] ml-1 mr-4 bg-gray-300'></View>}
            <VStack space="sm" className='mr-auto'>
              <Heading size="md">{item.product.name}</Heading>
              <Text className="text-sm font-bold text-typography-700">
                <Text className="text-sm font-normal text-typography-700">Unit price:</Text> ${item.product.price.toFixed(2)}
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
              {items.length > 1 && item.quantity > 1 ? <Text className="text-sm font-bold text-typography-700 mb-4"><Text className='text-sm font-bold text-typography-700'>Sub-total: </Text> ${(item.product.price * item.quantity).toFixed(2)}</Text> : null}
            </VStack>
          </HStack>
        )}
        ListFooterComponent={() => (
          <VStack space="sm">
            <Text className='p-4'>Total: </Text>
            <Button variant='outline'>
              <ButtonText className="text-typography-900">${items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</ButtonText>
            </Button>

            <Pressable
              onPressIn={() => createOrderMutation.mutateAsync()}
              className="bg-black p-3 rounded-md items-center"
            >
              <Text className="text-white font-bold">Checkout</Text>
            </Pressable>
          </VStack>
        )}
      /> : <View className="flex h-full justify-center items-center">
        <Text>Please login to view your cart</Text>
        <Link href='/login' asChild>
          <Button className='mt-2'>
            <ButtonText>login</ButtonText>
          </Button>
        </Link>
      </View>
      }
    </View >
  );
}


