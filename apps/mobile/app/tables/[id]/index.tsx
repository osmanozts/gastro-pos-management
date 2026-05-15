import { useCallback, useState } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import { Card, Badge, Button, Heading2, Heading3 } from '@libs/components';
import { tablesApi, ordersApi } from '@libs/api-client';
import type { Table, Order, OrderStatus } from '@libs/api-client';

const INACTIVE: OrderStatus[] = ['PAID', 'CLOSED'];

function orderStatusLabel(s: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    DRAFT: 'Entwurf',
    SENT_TO_KITCHEN: 'In der Küche',
    IN_PROGRESS: 'In Bearbeitung',
    READY: 'Bereit',
    SERVED: 'Serviert',
    PARTIALLY_PAID: 'Teilbezahlt',
    PAID: 'Bezahlt',
    CLOSED: 'Abgeschlossen',
  };
  return labels[s] ?? s;
}

function orderStatusVariant(s: OrderStatus): 'default' | 'warning' | 'success' | 'danger' | 'brand' {
  if (s === 'DRAFT') return 'default';
  if (s === 'READY' || s === 'SERVED') return 'success';
  if (s === 'SENT_TO_KITCHEN' || s === 'IN_PROGRESS') return 'brand';
  if (s === 'PARTIALLY_PAID') return 'warning';
  return 'default';
}

function calcOrderTotal(order: Order): string {
  const total = order.items.reduce((sum, item) => {
    const line = parseFloat(item.unitPrice) * item.quantity;
    const addons = item.children.reduce((s, c) => s + parseFloat(c.unitPrice) * c.quantity, 0);
    return sum + line + addons;
  }, 0);
  return total.toFixed(2);
}

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  return (
    <Card marginBottom="$3" onPress={onPress} pressStyle={{ opacity: 0.75 }} cursor="pointer">
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
        <Badge label={orderStatusLabel(order.status)} variant={orderStatusVariant(order.status)} />
        <Text fontSize="$5" fontWeight="700" color="$textPrimary">
          {calcOrderTotal(order)} €
        </Text>
      </XStack>
      <Text fontSize="$3" color="$textMuted">
        {itemCount} {itemCount === 1 ? 'Position' : 'Positionen'}
      </Text>
    </Card>
  );
}

export default function TischDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [table, setTable] = useState<Table | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [tableData, allOrders] = await Promise.all([
      tablesApi.getById(id),
      ordersApi.getAll({ tableId: id }),
    ]);
    setTable(tableData);
    setOrders(allOrders.filter((o) => !INACTIVE.includes(o.status)));
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Stack.Screen options={{ title: 'Tisch' }} />
        <ActivityIndicator color="#88172C" />
      </YStack>
    );
  }

  const tableName = table?.name ?? `Tisch ${table?.number}`;

  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen options={{ title: tableName, headerShown: true }} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#88172C" />
        }
      >
        <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
          <Heading2>{tableName}</Heading2>
          {table && (
            <Text fontSize="$3" color="$textMuted">{table.capacity} Personen</Text>
          )}
        </XStack>

        <Heading3 marginBottom="$3">Aktive Bestellungen</Heading3>

        {orders.length === 0 ? (
          <Card>
            <Text color="$textMuted" textAlign="center">Keine aktiven Bestellungen</Text>
          </Card>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onPress={() => router.push({ pathname: '/tables/[id]/new-order' as any, params: { id, orderId: order.id } })}
            />
          ))
        )}
      </ScrollView>

      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="$4"
        backgroundColor="$background"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        <Button
          intent="primary"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPress={() => router.push({ pathname: '/tables/[id]/new-order' as any, params: { id } })}
        >
          Neue Bestellung
        </Button>
      </YStack>
    </YStack>
  );
}
