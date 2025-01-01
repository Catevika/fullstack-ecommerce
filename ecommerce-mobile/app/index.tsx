import { Button, ButtonText } from '@/components/ui/button';
import "@/global.css";

export default function HomeScreen() {
  // return (
  //   <FlatList
  //     data={products}
  //     renderItem={({ item }) => (
  //       <ProductListItem product={item} />
  //     )}
  //     keyExtractor={item => item.id.toString()}
  //   />
  // );

  return (
    <Button>
      <ButtonText>Click me</ButtonText>
    </Button>
  );
}
