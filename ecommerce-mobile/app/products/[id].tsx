import { fetchProductById } from '@/api/products';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from "@/components/ui/text";
import { VStack } from '@/components/ui/vstack';
import { useCart } from '@/store/cartStore';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const addProduct = useCart((state) => state.addProduct);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(Number(id)),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Product: {id} </Text>;
  }

  const addToCart = () => {
    addProduct(product);
    router.push('/cart');
  };

  return (
    <Box className='flex-1 items-center p-3'>
      <Stack.Screen options={{ title: product.name }} />
      <Card className="p-5 rounded-lg max-w-[560px] w-full flex-1">
        {product.image ? <Image
          source={{
            uri: product.image,
          }}
          className='h-[80px] rounded-md aspect-[4/3]'
          alt={`${product.name}`}
          resizeMode="contain"
        /> : <View className='h-[80px] rounded-md aspect-[4/3] ml-4 bg-gray-300'></View>}
        <Text className="text-sm font-normal mb-2 text-typography-700">
          {product.name}
        </Text>
        <VStack className="mb-6">
          <Heading size="md" className="mb-4">
            ${product.price.toFixed(2)}
          </Heading>
          <Text size="sm">
            {product.description}
          </Text>
        </VStack>
        <Box className="flex-col sm:flex-row">
          {product.name.includes('PRODUCT OUT OF STOCK') ? null : <Button onPress={addToCart} className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1">
            <ButtonText size="sm">Add to cart</ButtonText>
          </Button>}
          <Button
            variant="outline"
            className="px-4 py-2 border-outline-300 sm:flex-1"
          >
            <ButtonText size="sm" className="text-typography-600">
              Wishlist
            </ButtonText>
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
export default ProductDetailScreen;
