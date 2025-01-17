import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'SignIn / Sign Up' }} />
    </Stack>
  );
};

