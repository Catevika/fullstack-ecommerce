import { login, signup } from '@/api/auth';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMutation } from '@tanstack/react-query';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useState } from 'react';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signupMutation = useMutation({
    mutationFn: () => signup(email, password),
    onSuccess: (data) => console.log('Successfully signed up', data),
    onError: (error) => console.log('Error signing up', error),
  });

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => console.log('Successfully logged in'),
    onError: () => console.log('Error logging in'),
  });

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  return (
    <FormControl className="bg-white m-3 p-4 max-w-[960px] mx-auto border rounded-lg border-outline-300">
      <VStack space="xl">
        <Heading className="text-typography-900">Login</Heading>
        <VStack space="xs">
          <Text className="text-typography-500">Email</Text>
          <Input className="min-w-[250px]">
            <InputField value={email} onChangeText={setEmail} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500">Password</Text>
          <Input className="text-center">
            <InputField value={password} onChangeText={setPassword} type={showPassword ? "text" : "password"} />
            <InputSlot className="pr-3" onPress={handleState}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
              />
            </InputSlot>
          </Input>
        </VStack>
        <HStack space="sm">
          <Button
            className="flex-1"
            variant='outline'
            onPress={() => signupMutation.mutate()}
          >
            <ButtonText>Sign Up</ButtonText>
          </Button>
          <Button
            className="flex-1"
            onPress={() => loginMutation.mutate()}
          >
            <ButtonText>Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormControl>
  );
}
