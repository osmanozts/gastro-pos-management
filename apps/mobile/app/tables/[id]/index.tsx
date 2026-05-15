import { useCallback, useState } from 'react';
import { Alert, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Dialog, YStack, XStack, Text } from 'tamagui';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Card, Badge, Button, Heading2, Heading3 } from '@libs/components';
import { tablesApi, ordersApi } from '@libs/api-client';
import type { Table, Order, OrderStatus, TableStatus } from '@libs/api-client';

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

const TABLE_STATUSES: { value: TableStatus; label: string; variant: 'success' | 'danger' | 'warning' }[] = [
  { value: 'FREE',           label: 'Frei',        variant: 'success' },
  { value: 'OCCUPIED',       label: 'Belegt',       variant: 'danger'  },
  { value: 'PARTIALLY_PAID', label: 'Teilbezahlt',  variant: 'warning' },
];

function tableStatusVariant(s: TableStatus): 'success' | 'danger' | 'warning' {
  if (s === 'FREE') return 'success';
  if (s === 'OCCUPIED') return 'danger';
  return 'warning';
}

function tableStatusLabel(s: TableStatus): string {
  return TABLE_STATUSES.find((t) => t.value === s)?.label ?? s;
}

interface StatusPickerDialogProps {
  open: boolean;
  current: TableStatus;
  saving: boolean;
  onSelect: (status: TableStatus) => void;
  onClose: () => void;
}

function StatusPickerDialog({ open, current, saving, onSelect, onClose }: StatusPickerDialogProps) {
  return (
    <Dialog modal open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          backgroundColor="black"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          key="content"
          bordered
          elevate
          borderRadius="$5"
          padding="$5"
          width="85%"
          animation="quick"
          enterStyle={{ opacity: 0, scale: 0.95 }}
          exitStyle={{ opacity: 0, scale: 0.95 }}
        >
          <Dialog.Title marginBottom="$4">
            <Text fontSize="$5" fontWeight="700">Tischstatus ändern</Text>
          </Dialog.Title>
          <YStack gap="$2">
            {TABLE_STATUSES.map(({ value, label, variant }) => (
              <TouchableOpacity key={value} onPress={() => onSelect(value)} disabled={saving}>
                <XStack
                  borderWidth={2}
                  borderColor={current === value ? '$brandColor' : '$borderColor'}
                  borderRadius="$4"
                  padding="$3"
                  alignItems="center"
                  justifyContent="space-between"
                  backgroundColor={current === value ? '$brandSubtle' : '$background'}
                  opacity={saving ? 0.5 : 1}
                >
                  <Badge label={label} variant={variant} />
                  {current === value && (
                    <FontAwesome name="check" size={16} color="#88172C" />
                  )}
                </XStack>
              </TouchableOpacity>
            ))}
          </YStack>
          <Dialog.Close asChild>
            <Button intent="ghost" onPress={onClose} width="100%">
              Abbrechen
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
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
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

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

  const handleStatusChange = useCallback(async (status: TableStatus) => {
    if (status === table?.status) {
      setShowStatusDialog(false);
      return;
    }
    setSavingStatus(true);
    try {
      const updated = await tablesApi.updateStatus(id, status);
      setTable(updated);
      setShowStatusDialog(false);
    } catch {
      Alert.alert('Fehler', 'Status konnte nicht geändert werden.');
    } finally {
      setSavingStatus(false);
    }
  }, [id, table?.status]);

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
        <XStack alignItems="flex-start" justifyContent="space-between" marginBottom="$4">
          <YStack flex={1} marginRight="$3">
            <Heading2>{tableName}</Heading2>
            {table && (
              <Text fontSize="$3" color="$textMuted" marginTop="$1">{table.capacity} Personen</Text>
            )}
          </YStack>
          {table && (
            <TouchableOpacity onPress={() => setShowStatusDialog(true)}>
              <XStack alignItems="center" gap="$2">
                <Badge
                  label={tableStatusLabel(table.status)}
                  variant={tableStatusVariant(table.status)}
                />
                <FontAwesome name="pencil" size={13} color="#9ca3af" />
              </XStack>
            </TouchableOpacity>
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

      {table && (
        <StatusPickerDialog
          open={showStatusDialog}
          current={table.status}
          saving={savingStatus}
          onSelect={handleStatusChange}
          onClose={() => setShowStatusDialog(false)}
        />
      )}
    </YStack>
  );
}
