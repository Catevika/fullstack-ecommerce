import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import type { Order } from '@/types/types';
import daysjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'expo-router';
import { Pressable, Text } from "react-native";

daysjs.extend(relativeTime);

const OrderListItem = ({ order }: { order: Order; }) => {
  return (
    <Link href={`/orders/${order.id}`} asChild>
      <Pressable className="flex-1">
        <Card className="p-5 rounded-lg flex-1">
          <HStack>
            <Heading size="md">
              Order #{order.id}
            </Heading>
            <Button className="ml-auto">
              <ButtonText>{order.status}</ButtonText>
            </Button>
          </HStack>
          <Text className="text-sm font-normal mb-2 text-typography-700">
            {daysjs(order.createdAt).fromNow().charAt(0).toUpperCase() + daysjs(order.createdAt).fromNow().slice(1)}
          </Text>
        </Card>
      </Pressable>
    </Link>
  );
};
export default OrderListItem;
