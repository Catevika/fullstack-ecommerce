import { fetchStripeKeys } from '@/api/stripe';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';

export default function CustomStripeProvider({ children }: { children: React.ReactElement | React.ReactElement[]; }): React.JSX.Element {
  const { data: stripeKeys, isLoading, isError } = useQuery({
    queryKey: ['stripe', 'keys'],
    queryFn: fetchStripeKeys,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !stripeKeys.publishableKey) {
    console.log('Unable to initialize Stripe');
  }

  console.log(stripeKeys);

  return (
    <StripeProvider publishableKey={stripeKeys.publishableKey}>
      {children}
    </StripeProvider>);
}
