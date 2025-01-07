"use client";

import { createProduct } from '@/app/dashboard/products/create/actions';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
export default function CreatePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('errorMessage');

  return (
    <Box className='flex-1 justify-center items-center min-h-screen'>
      <FormControl isInvalid={errorMessage ? true : false} className="bg-white m-3 p-4 max-w-[960px] w-full mx-auto border rounded-lg border-outline-300">
        <VStack space="xl">
          <Heading className="text-typography-900">Create Product:</Heading>
          <VStack space="xs">
            <Text className="text-typography-500">Name</Text>
            <Input className="min-w-[250px]">
              <InputField value={name} onChangeText={setName} type="text" className='h-60 text-xl' />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text className="text-typography-500">Description</Text>
            <Input className="min-w-[250px]">
              <InputField value={description} onChangeText={setDescription} type="text" className='h-60 text-xl' />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text className="text-typography-500">Price</Text>
            <Input className="min-w-[250px]">
              <InputField value={price} onChangeText={setPrice} type="text" className='h-60 text-xl' />
            </Input>
          </VStack>
          {errorMessage ? <Text className="text-red-500">{errorMessage}</Text> : null}
          <HStack space="sm">
            <Button
              className='flex-1'
              onPress={() => createProduct(name, description, Number(price))}
            >
              <ButtonText>Save Product</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </FormControl>
    </Box>
  );
}