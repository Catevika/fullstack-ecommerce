import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/store/authStore';
import { useCart } from '@/store/cartStore';
import { router, Tabs } from 'expo-router';
import { ListIcon, LogOut, ShoppingCart, Store, User } from 'lucide-react-native';
import { Pressable } from 'react-native';

export default function RootLayout() {
  const cartItemsNum = useCart((state) => state.items.map(item => item.quantity).reduce((a, b) => a + b, 0));
  const isLoggedIn = useAuth(s => !!s.token);

  const setUser = useAuth(s => s.setUser);
  const setToken = useAuth(s => s.setToken);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

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
        headerLeft: () => !isLoggedIn ? (
          <Pressable className='flex-row items-center gap-2 ml-4' onPressIn={() => { router.push('/login'); }}>
            <Icon as={User} color={'black'} />
          </Pressable>
        ) : (
          <Pressable className='flex-row items-center gap-2 ml-4' onPressIn={handleLogout}>
            <Icon as={LogOut} color={'black'} />
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