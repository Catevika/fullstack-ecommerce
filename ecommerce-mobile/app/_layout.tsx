import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient();
export default function TabLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <StatusBar style='auto' />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ title: 'Cart' }} />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}