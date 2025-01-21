import { CustomAlert } from '@/components/CustomAlert';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/store/authStore';
import { useCart } from '@/store/cartStore';
import { resetPaymentSheetCustomer } from '@stripe/stripe-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, Tabs } from 'expo-router';
import { CheckCircleIcon, ListIcon, LogOut, ShoppingCart, Store, User } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';

export default function TabsLayout() {
  const queryClient = useQueryClient();
  const cartItemsNum = useCart((state) => state.items.map(item => item.quantity).reduce((a, b) => a + b, 0));
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const isLoggedIn = useAuth(s => !!s.token);

  const logout = useAuth(s => s.logout);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.invalidateQueries();
      queryClient.clear();
      setShowAlertDialog(true);
    }
  });

  if (showAlertDialog) {
    return (
      <CustomAlert
        icon={CheckCircleIcon}
        iconClassName='color-green-600 background-white'
        message="Successful logout"
        showAlertDialog={showAlertDialog}
        handleClose={() => {
          setShowAlertDialog(false);
          resetPaymentSheetCustomer();
          router.replace('/');
        }}
      />
    );
  }

  return (
    <Tabs screenOptions={{
      headerTitleAlign: 'center',
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
        display: 'flex',
        alignItems: 'center',
      }
    }}>
      <Tabs.Screen name="index" options={{
        headerLeft: () => isLoggedIn ? (
          <Pressable className='flex-row items-center gap-2 ml-4 border border-color-gray-200 rounded-lg p-2' onPressIn={() => { logoutMutation.mutate(); }}>
            <Icon as={LogOut} color={'black'} size="md" />
          </Pressable>
        ) : (
          <Pressable className='flex-row items-center gap-2 ml-4 bg-gray-200 rounded-full p-4' onPressIn={() => { router.push('/login'); }}>
            <Icon as={User} color={'black'} size="md" />
          </Pressable>
        ), tabBarIcon: (currentColor) => <Icon as={Store} size='md' color={currentColor.color} />,
        title: 'Shop',
        headerRight: () => (
          <Pressable className='flex-row items-center gap-2 mr-4' onPressIn={() => { router.push('/cart'); }} disabled={cartItemsNum === 0}>
            <ShoppingCart color={'black'} />
            <Text>{cartItemsNum}</Text>
          </Pressable>
        ),
      }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: (currentColor) => <Icon as={ListIcon} size='md' color={currentColor.color} /> }} />
    </Tabs>
  );
}