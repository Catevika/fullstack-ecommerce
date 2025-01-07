"use client";

import { handleLogin, handleSignup } from '@/app/login/actions';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('errorMessage');

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  return (
    <Box className='flex-1 justify-center items-center min-h-screen'>
      <FormControl isInvalid={errorMessage ? true : false} className="bg-white m-3 p-4 max-w-[960px] w-full mx-auto border rounded-lg border-outline-300">
        <VStack space="xl">
          <Heading className="text-typography-900">Account details:</Heading>
          <VStack space="xs">
            <Text className="text-typography-500">Email</Text>
            <Input className="min-w-[250px]">
              <InputField value={email} onChangeText={setEmail} type="text" className='h-60 text-xl' />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text className="text-typography-500">Password</Text>
            <Input className="text-center">
              <InputField value={password} onChangeText={setPassword} type={showPassword ? "text" : "password"} className='h-60 text-xl' />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                />
              </InputSlot>
            </Input>
          </VStack>
          {errorMessage ? <Text className="text-red-500">{errorMessage}</Text> : null}
          <HStack space="sm">
            <Button
              className="flex-1"
              variant='outline'
              onPress={() => handleSignup(email, password)}
            >
              <ButtonText>Sign Up</ButtonText>
            </Button>
            <Button
              className="flex-1"
              onPress={() => handleLogin(email, password)}
            >
              <ButtonText>Sign In</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </FormControl>
    </Box>
  );
};