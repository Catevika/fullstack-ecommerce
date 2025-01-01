import { Text, View } from "react-native";
import type { Product } from '../types/types';
const ProductListItem = ({ product }: { product: Product; }) => {
  return (
    <View>
      <Text>{product.name}</Text>
    </View>
  );
};
export default ProductListItem;
