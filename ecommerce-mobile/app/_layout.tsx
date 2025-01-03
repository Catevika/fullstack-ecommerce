import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Text } from '@/components/ui/text';
import { useCart } from '@/store/cartStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { Pressable } from 'react-native';

const queryClient = new QueryClient();
export default function RootLayout() {
  const cartItemsNum = useCart((state) => state.items.length);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack screenOptions={{
          headerRight: () => (
            <Pressable className='flex-row items-center gap-2 mr-4' onPressIn={() => { router.push('/cart'); }}>
              <ShoppingCart color={'black'} />
              <Text>{cartItemsNum}</Text>
            </Pressable>
          ),
          headerTitleAlign: 'center',
        }}>
          <Stack.Screen name="index" options={{ title: 'Shop' }} />
          <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
          <Stack.Screen name="cart" options={{ title: 'Cart' }} />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}