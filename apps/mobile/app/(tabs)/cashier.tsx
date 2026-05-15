import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import { Card, Badge, Heading2 } from '@libs/components';
import { ordersApi } from '@libs/api-client';
import type { Order, OrderStatus } from '@libs/api-client';

type Filter = 'open' | 'archive';

function orderStatusLabel(s: OrderStatus): string {
  if (s === 'READY') return 'Bereit';
  if (s === 'SERVED') return 'Serviert';
  if (s === 'PARTIALLY_PAID') return 'Teilbezahlt';
  if (s === 'PAID') return 'Bezahlt';
  if (s === 'CLOSED') return 'Abgeschlossen';
  return s;
}

function orderStatusVariant(s: OrderStatus): 'success' | 'warning' | 'brand' | 'default' {
  if (s === 'READY') return 'success';
  if (s === 'PARTIALLY_PAID') return 'warning';
  if (s === 'PAID' || s === 'CLOSED') return 'default';
  return 'brand';
}

function calcTotal(order: Order): number {
  return order.items.reduce((sum, item) => {
    const line = parseFloat(item.unitPrice) * item.quantity;
    const addons = item.children.reduce((s, c) => s + parseFloat(c.unitPrice) * c.quantity, 0);
    return sum + line + addons;
  }, 0);
}

function calcPaid(order: Order): number {
  return order.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

interface CashierOrderCardProps {
  order: Order;
  isArchive: boolean;
  onPress: () => void;
}

function CashierOrderCard({ order, isArchive, onPress }: CashierOrderCardProps) {
  const tableLabel = order.table.name ?? `Tisch ${order.table.number}`;
  const total = calcTotal(order);
  const paid = calcPaid(order);
  const remaining = total - paid;
  const itemCount = order.items.length;

  const paymentMethods = [...new Set(order.payments.map((p) => p.method))];
  const methodLabel = paymentMethods
    .map((m) => (m === 'CASH' ? 'Bargeld' : 'Karte'))
    .join(' & ');

  return (
    <Card
      marginBottom="$3"
      onPress={onPress}
      pressStyle={{ opacity: 0.75 }}
      cursor="pointer"
      opacity={isArchive ? 0.8 : 1}
    >
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
        <YStack flex={1} marginRight="$2">
          <Text fontSize="$5" fontWeight="700" color="$textPrimary">{tableLabel}</Text>
          <Text fontSize="$2" color="$textMuted" marginTop="$1">
            {itemCount} {itemCount === 1 ? 'Position' : 'Positionen'}
            {isArchive && methodLabel ? ` · ${methodLabel}` : ''}
          </Text>
          {isArchive && (
            <Text fontSize="$2" color="$textMuted" marginTop="$1">
              {formatDate(order.updatedAt)}
            </Text>
          )}
        </YStack>
        <Badge label={orderStatusLabel(order.status)} variant={orderStatusVariant(order.status)} />
      </XStack>

      <XStack justifyContent="space-between" alignItems="flex-end">
        {!isArchive && paid > 0 ? (
          <YStack>
            <Text fontSize="$2" color="$textMuted">Bezahlt: {paid.toFixed(2)} €</Text>
            <Text fontSize="$2" color="$textMuted">Gesamt: {total.toFixed(2)} €</Text>
          </YStack>
        ) : (
          <Text fontSize="$2" color="$textMuted">Gesamt: {total.toFixed(2)} €</Text>
        )}
        {isArchive ? (
          <YStack alignItems="flex-end">
            <Text fontSize="$2" color="$textMuted">Kassiert</Text>
            <Text fontSize="$5" fontWeight="700" color="#16a34a">{paid.toFixed(2)} €</Text>
          </YStack>
        ) : (
          <YStack alignItems="flex-end">
            <Text fontSize="$2" color="$textMuted">Offen</Text>
            <Text fontSize="$5" fontWeight="700" color="$brandColor">{remaining.toFixed(2)} €</Text>
          </YStack>
        )}
      </XStack>
    </Card>
  );
}

interface FilterTabProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterTab({ label, active, onPress }: FilterTabProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <YStack
        paddingVertical="$2"
        alignItems="center"
        borderBottomWidth={2}
        borderBottomColor={active ? '$brandColor' : 'transparent'}
      >
        <Text
          fontSize="$3"
          fontWeight={active ? '700' : '400'}
          color={active ? '$brandColor' : '$textMuted'}
        >
          {label}
        </Text>
      </YStack>
    </TouchableOpacity>
  );
}

export default function KasseScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('open');
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [archiveOrders, setArchiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOpen = useCallback(async () => {
    const [ready, served, partial] = await Promise.all([
      ordersApi.getAll({ status: 'READY' }),
      ordersApi.getAll({ status: 'SERVED' }),
      ordersApi.getAll({ status: 'PARTIALLY_PAID' }),
    ]);
    return [...ready, ...served, ...partial].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, []);

  const loadArchive = useCallback(async () => {
    const [paid, closed] = await Promise.all([
      ordersApi.getAll({ status: 'PAID' }),
      ordersApi.getAll({ status: 'CLOSED' }),
    ]);
    return [...paid, ...closed].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, []);

  const load = useCallback(async () => {
    const [open, archive] = await Promise.all([loadOpen(), loadArchive()]);
    setOpenOrders(open);
    setArchiveOrders(archive);
  }, [loadOpen, loadArchive]);

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

  const orders = filter === 'open' ? openOrders : archiveOrders;
  const isArchive = filter === 'archive';

  const partialCount = openOrders.filter((o) => o.status === 'PARTIALLY_PAID').length;
  const readyCount = openOrders.filter((o) => o.status === 'READY' || o.status === 'SERVED').length;

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingHorizontal="$4" paddingTop="$8" paddingBottom="$2">
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <Heading2>Kasse</Heading2>
          {filter === 'open' && openOrders.length > 0 && (
            <XStack gap="$2" alignItems="center">
              {readyCount > 0 && (
                <XStack borderRadius="$10" paddingHorizontal="$3" paddingVertical="$1" backgroundColor="#15803d" gap="$1">
                  <Text fontSize="$3" fontWeight="700" color="white">{readyCount}</Text>
                  <Text fontSize="$3" color="white">Bereit</Text>
                </XStack>
              )}
              {partialCount > 0 && (
                <XStack borderRadius="$10" paddingHorizontal="$3" paddingVertical="$1" backgroundColor="#D97706" gap="$1">
                  <Text fontSize="$3" fontWeight="700" color="white">{partialCount}</Text>
                  <Text fontSize="$3" color="white">Teilbez.</Text>
                </XStack>
              )}
            </XStack>
          )}
          {filter === 'archive' && archiveOrders.length > 0 && (
            <Text fontSize="$3" color="$textMuted">{archiveOrders.length} Einträge</Text>
          )}
        </XStack>

        {/* Filter tabs */}
        <XStack
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <FilterTab
            label="Offen"
            active={filter === 'open'}
            onPress={() => setFilter('open')}
          />
          <FilterTab
            label="Archiv"
            active={filter === 'archive'}
            onPress={() => setFilter('archive')}
          />
        </XStack>
      </YStack>

      {loading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator color="#88172C" />
        </YStack>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <CashierOrderCard
              order={item}
              isArchive={isArchive}
              onPress={() =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                router.push({ pathname: '/bill/[orderId]' as any, params: { orderId: item.id } })
              }
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#88172C" />
          }
          ListEmptyComponent={
            <YStack padding="$6" alignItems="center" gap="$2">
              <Text fontSize="$6">{isArchive ? '📋' : '🧾'}</Text>
              <Text color="$textMuted">
                {isArchive ? 'Keine abgeschlossenen Bestellungen' : 'Keine offenen Zahlungen'}
              </Text>
            </YStack>
          }
        />
      )}
    </YStack>
  );
}
