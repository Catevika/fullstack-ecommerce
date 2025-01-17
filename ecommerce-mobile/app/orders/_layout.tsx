import { Stack, useLocalSearchParams } from 'expo-router';

export default function OrderLayout() {
  const { id } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: `Order #${id} Details` }} />
    </Stack>
  );
};

