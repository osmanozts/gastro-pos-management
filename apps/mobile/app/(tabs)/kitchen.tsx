import { useCallback, useState } from 'react';
import { ScrollView, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Card, Badge, Heading2 } from '@libs/components';
import { kitchenApi } from '@libs/api-client';
import type { KitchenOrder, KitchenOrderItem, OrderItemStatus, OrderStatus } from '@libs/api-client';

const CARD_WIDTH = 290;
const CARD_GAP = 12;

function orderStatusLabel(s: OrderStatus): string {
  if (s === 'SENT_TO_KITCHEN') return 'Neu';
  if (s === 'IN_PROGRESS') return 'In Arbeit';
  return 'Fertig';
}

function orderStatusVariant(s: OrderStatus): 'danger' | 'warning' | 'success' {
  if (s === 'SENT_TO_KITCHEN') return 'danger';
  if (s === 'IN_PROGRESS') return 'warning';
  return 'success';
}

function itemStatusDone(s: OrderItemStatus) {
  return s === 'READY' || s === 'SERVED' || s === 'PAID';
}

interface KitchenItemRowProps {
  item: KitchenOrderItem;
  orderId: string;
  onUpdated: (order: KitchenOrder) => void;
}

function KitchenItemRow({ item, orderId, onUpdated }: KitchenItemRowProps) {
  const [marking, setMarking] = useState(false);
  const done = itemStatusDone(item.status);

  const markReady = useCallback(async () => {
    if (marking || done) return;
    setMarking(true);
    try {
      const updated = await kitchenApi.markItemReady(orderId, item.id);
      if (updated) onUpdated(updated);
    } finally {
      setMarking(false);
    }
  }, [marking, done, item.id, orderId, onUpdated]);

  return (
    <YStack
      borderRadius="$3"
      padding="$3"
      marginBottom="$2"
      backgroundColor={done ? '$backgroundHover' : '$background'}
      borderWidth={1}
      borderColor={done ? '$borderColor' : '$brandColor'}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <YStack flex={1} marginRight="$3">
          <Text
            fontSize="$4"
            fontWeight="600"
            color={done ? '$textMuted' : '$textPrimary'}
            textDecorationLine={done ? 'line-through' : 'none'}
          >
            {item.menuItem.name}
          </Text>
          {item.children.length > 0 && (
            <YStack marginTop="$1" gap="$1">
              {item.children.map((child) => (
                <Text key={child.id} fontSize="$2" color="$textMuted">
                  + {child.menuItem.name}
                </Text>
              ))}
            </YStack>
          )}
        </YStack>

        <TouchableOpacity onPress={markReady} disabled={marking || done}>
          <XStack
            width={36}
            height={36}
            borderRadius="$3"
            justifyContent="center"
            alignItems="center"
            backgroundColor={done ? '$brandSubtle' : '$brandColor'}
            opacity={marking ? 0.5 : 1}
          >
            <FontAwesome
              name={marking ? 'circle-o' : 'check'}
              size={16}
              color={done ? '#88172C' : 'white'}
            />
          </XStack>
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
}

interface KitchenOrderCardProps {
  order: KitchenOrder;
  cardHeight: number;
  onUpdated: (order: KitchenOrder) => void;
}

function KitchenOrderCard({ order, cardHeight, onUpdated }: KitchenOrderCardProps) {
  const router = useRouter();
  const tableLabel = order.table.name ?? `Tisch ${order.table.number}`;
  const pendingCount = order.items.filter((i) => !itemStatusDone(i.status)).length;
  const readyCount = order.items.filter((i) => itemStatusDone(i.status)).length;

  const openEdit = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push({ pathname: '/tables/[id]/new-order' as any, params: { id: order.table.id, orderId: order.id } });
  }, [router, order.table.id, order.id]);

  return (
    <Card
      width={CARD_WIDTH}
      height={cardHeight}
      marginRight={CARD_GAP}
      padding="$4"
      flex={0}
    >
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
        <YStack flex={1} marginRight="$2">
          <Text fontSize="$5" fontWeight="700" color="$textPrimary">{tableLabel}</Text>
          <Text fontSize="$2" color="$textMuted" marginTop="$1">
            {pendingCount > 0
              ? `${pendingCount} ausstehend · ${readyCount} fertig`
              : `${readyCount} fertig`}
          </Text>
        </YStack>
        <XStack gap="$2" alignItems="center">
          <TouchableOpacity onPress={openEdit}>
            <XStack
              padding="$2"
              borderRadius="$3"
              backgroundColor="$backgroundHover"
            >
              <FontAwesome name="pencil" size={14} color="#88172C" />
            </XStack>
          </TouchableOpacity>
          <Badge
            label={orderStatusLabel(order.status)}
            variant={orderStatusVariant(order.status)}
          />
        </XStack>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {order.items.map((item) => (
          <KitchenItemRow
            key={item.id}
            item={item}
            orderId={order.id}
            onUpdated={onUpdated}
          />
        ))}
      </ScrollView>
    </Card>
  );
}

function SummaryPill({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <XStack
      borderRadius="$10"
      paddingHorizontal="$3"
      paddingVertical="$1"
      backgroundColor={color}
      alignItems="center"
      gap="$1"
    >
      <Text fontSize="$3" fontWeight="700" color="white">{count}</Text>
      <Text fontSize="$3" color="white">{label}</Text>
    </XStack>
  );
}

export default function KücheScreen() {
  const { height } = useWindowDimensions();
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await kitchenApi.getActiveOrders();
    setOrders(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [load]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleOrderUpdated = useCallback((updated: KitchenOrder) => {
    setOrders((prev) => {
      const kitchenStatuses: OrderStatus[] = ['SENT_TO_KITCHEN', 'IN_PROGRESS'];
      if (!kitchenStatuses.includes(updated.status)) {
        return prev.filter((o) => o.id !== updated.id);
      }
      return prev.map((o) => (o.id === updated.id ? updated : o));
    });
  }, []);

  const neuCount = orders.filter((o) => o.status === 'SENT_TO_KITCHEN').length;
  const inProgressCount = orders.filter((o) => o.status === 'IN_PROGRESS').length;

  // Header ~160px + tab bar ~83px + safe area ~44px
  const cardHeight = height - 287;

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingHorizontal="$4" paddingTop="$8" paddingBottom="$3">
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <Heading2>Küche</Heading2>
          <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
            <XStack
              padding="$2"
              borderRadius="$3"
              backgroundColor="$backgroundHover"
              opacity={refreshing ? 0.5 : 1}
            >
              <FontAwesome name="refresh" size={16} color="#88172C" />
            </XStack>
          </TouchableOpacity>
        </XStack>

        <XStack gap="$2" alignItems="center">
          <Text fontSize="$3" color="$textMuted" marginRight="$1">
            {orders.length} {orders.length === 1 ? 'Bestellung' : 'Bestellungen'}
          </Text>
          {neuCount > 0 && (
            <SummaryPill count={neuCount} label="Neu" color="#B91C1C" />
          )}
          {inProgressCount > 0 && (
            <SummaryPill count={inProgressCount} label="In Arbeit" color="#D97706" />
          )}
        </XStack>
      </YStack>

      {loading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator color="#88172C" />
        </YStack>
      ) : orders.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$2">
          <Text fontSize="$6">🍽️</Text>
          <Text color="$textMuted">Keine aktiven Bestellungen</Text>
        </YStack>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        >
          {orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              cardHeight={cardHeight}
              onUpdated={handleOrderUpdated}
            />
          ))}
        </ScrollView>
      )}
    </YStack>
  );
}
