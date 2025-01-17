import CustomStripeProvider from '@/components/CustomStripeProvider';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { queryClient } from '@/store/authStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomStripeProvider>
        <GluestackUIProvider>
          <StatusBar style='auto' />
          <Stack screenOptions={{ headerShown: false }} />
        </GluestackUIProvider>
      </CustomStripeProvider>
    </QueryClientProvider>
  );
}