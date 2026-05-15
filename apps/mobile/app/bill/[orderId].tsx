import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Card, Button } from '@libs/components';
import { ordersApi, paymentsApi } from '@libs/api-client';
import type { Bill, BillItem, PaymentMethod } from '@libs/api-client';

function positionRemaining(item: BillItem): number {
  return (
    parseFloat(item.remaining) +
    item.addons.reduce((s, a) => s + parseFloat(a.remaining), 0)
  );
}

function positionTotal(item: BillItem): number {
  return (
    parseFloat(item.lineTotal) +
    item.addons.reduce((s, a) => s + parseFloat(a.lineTotal), 0)
  );
}

interface BillPositionCardProps {
  item: BillItem;
  selected: boolean;
  onToggle: () => void;
}

function BillPositionCard({ item, selected, onToggle }: BillPositionCardProps) {
  const remaining = positionRemaining(item);
  const isPaid = remaining <= 0;

  return (
    <TouchableOpacity onPress={onToggle} disabled={isPaid} activeOpacity={0.7}>
      <Card marginBottom="$3" opacity={isPaid ? 0.55 : 1}>
        <XStack alignItems="flex-start" gap="$3">
          <YStack paddingTop="$1">
            <FontAwesome
              name={isPaid ? 'check-circle' : selected ? 'check-square' : 'square-o'}
              size={22}
              color={isPaid ? '#16a34a' : selected ? '#88172C' : '#9ca3af'}
            />
          </YStack>

          <YStack flex={1}>
            <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$1">
              <Text
                fontSize="$4"
                fontWeight="600"
                color={isPaid ? '$textMuted' : '$textPrimary'}
                textDecorationLine={isPaid ? 'line-through' : 'none'}
                flex={1}
                marginRight="$2"
              >
                {item.menuItem.name}
              </Text>
              <Text fontSize="$4" fontWeight="600" color={isPaid ? '$textMuted' : '$textPrimary'}>
                {parseFloat(item.lineTotal).toFixed(2)} €
              </Text>
            </XStack>

            {item.addons.map((addon) => (
              <XStack key={addon.id} justifyContent="space-between" marginBottom="$1">
                <Text fontSize="$2" color="$textMuted" flex={1} marginRight="$2">
                  + {addon.menuItem.name}
                </Text>
                {parseFloat(addon.lineTotal) > 0 && (
                  <Text fontSize="$2" color="$textMuted">
                    {parseFloat(addon.lineTotal).toFixed(2)} €
                  </Text>
                )}
              </XStack>
            ))}

            <XStack
              marginTop="$2"
              paddingTop="$2"
              borderTopWidth={1}
              borderTopColor="$borderColor"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="$2" color="$textMuted">
                Gesamt: {positionTotal(item).toFixed(2)} €
              </Text>
              {isPaid ? (
                <Text fontSize="$2" color="#16a34a" fontWeight="600">Bezahlt</Text>
              ) : (
                <Text fontSize="$3" color="$brandColor" fontWeight="700">
                  Offen: {remaining.toFixed(2)} €
                </Text>
              )}
            </XStack>
          </YStack>
        </XStack>
      </Card>
    </TouchableOpacity>
  );
}

export default function BillScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();

  const [bill, setBill] = useState<Bill | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadBill = useCallback(async (autoSelect = false) => {
    const data = await ordersApi.getBill(orderId);
    setBill(data);
    if (autoSelect) {
      const unpaidIds = data.items
        .filter((item) => positionRemaining(item) > 0)
        .map((item) => item.id);
      setSelected(new Set(unpaidIds));
    }
  }, [orderId]);

  useEffect(() => {
    loadBill(true).finally(() => setLoading(false));
  }, [loadBill]);

  const unpaidItems = bill?.items.filter((item) => positionRemaining(item) > 0) ?? [];
  const allSelected = unpaidItems.length > 0 && unpaidItems.every((i) => selected.has(i.id));

  const selectedAmount = (bill?.items ?? [])
    .filter((item) => selected.has(item.id))
    .reduce((sum, item) => sum + positionRemaining(item), 0);

  const toggleItem = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(unpaidItems.map((i) => i.id)));
  }, [allSelected, unpaidItems]);

  const handleSubmit = useCallback(async () => {
    if (!bill || selectedAmount <= 0 || submitting) return;
    setSubmitting(true);
    try {
      const allocations: Array<{ orderItemId: string; amount: number }> = [];
      for (const item of bill.items) {
        if (!selected.has(item.id)) continue;
        const mainRemaining = parseFloat(item.remaining);
        if (mainRemaining > 0) {
          allocations.push({ orderItemId: item.id, amount: mainRemaining });
        }
        for (const addon of item.addons) {
          const addonRemaining = parseFloat(addon.remaining);
          if (addonRemaining > 0) {
            allocations.push({ orderItemId: addon.id, amount: addonRemaining });
          }
        }
      }

      await paymentsApi.create({ orderId, method, allocations });

      const updated = await ordersApi.getBill(orderId);
      if (parseFloat(updated.remaining) <= 0) {
        router.back();
        return;
      }

      setBill(updated);
      const stillUnpaid = updated.items
        .filter((item) => positionRemaining(item) > 0)
        .map((item) => item.id);
      setSelected(new Set(stillUnpaid));
    } catch {
      Alert.alert('Fehler', 'Zahlung konnte nicht verarbeitet werden. Bitte erneut versuchen.');
    } finally {
      setSubmitting(false);
    }
  }, [bill, selectedAmount, submitting, selected, orderId, method, router]);

  const title = bill
    ? (bill as { table?: { name?: string | null; number?: number } } & Bill).table
      ? `Kassieren`
      : 'Kassieren'
    : 'Kassieren';

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Stack.Screen options={{ title, headerShown: true }} />
        <ActivityIndicator color="#88172C" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen options={{ title, headerShown: true }} />

      {/* Summary bar */}
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        justifyContent="space-between"
      >
        <YStack alignItems="center">
          <Text fontSize="$2" color="$textMuted">Gesamt</Text>
          <Text fontSize="$4" fontWeight="700" color="$textPrimary">
            {parseFloat(bill?.grandTotal ?? '0').toFixed(2)} €
          </Text>
        </YStack>
        <YStack alignItems="center">
          <Text fontSize="$2" color="$textMuted">Bezahlt</Text>
          <Text fontSize="$4" fontWeight="700" color="#16a34a">
            {parseFloat(bill?.totalPaid ?? '0').toFixed(2)} €
          </Text>
        </YStack>
        <YStack alignItems="center">
          <Text fontSize="$2" color="$textMuted">Offen</Text>
          <Text fontSize="$4" fontWeight="700" color="$brandColor">
            {parseFloat(bill?.remaining ?? '0').toFixed(2)} €
          </Text>
        </YStack>
      </XStack>

      {/* Select-all row */}
      {unpaidItems.length > 0 && (
        <TouchableOpacity onPress={toggleAll} activeOpacity={0.7}>
          <XStack
            paddingHorizontal="$4"
            paddingVertical="$3"
            alignItems="center"
            gap="$3"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            backgroundColor="$backgroundHover"
          >
            <FontAwesome
              name={allSelected ? 'check-square' : 'square-o'}
              size={20}
              color="#88172C"
            />
            <Text fontSize="$3" color="$textPrimary" fontWeight="500">
              Alle ausstehenden Positionen
            </Text>
            <Text fontSize="$3" color="$textMuted" marginLeft="auto">
              ({unpaidItems.length})
            </Text>
          </XStack>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        {bill?.items.map((item) => (
          <BillPositionCard
            key={item.id}
            item={item}
            selected={selected.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </ScrollView>

      {/* Sticky bottom bar */}
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
        <XStack gap="$2" marginBottom="$3">
          <XStack flex={1}>
            <Button
              intent={method === 'CASH' ? 'primary' : 'ghost'}
              onPress={() => setMethod('CASH')}
              width="100%"
            >
              Bargeld
            </Button>
          </XStack>
          <XStack flex={1}>
            <Button
              intent={method === 'CARD' ? 'primary' : 'ghost'}
              onPress={() => setMethod('CARD')}
              width="100%"
            >
              Karte
            </Button>
          </XStack>
        </XStack>

        <Button
          intent="primary"
          disabled={selectedAmount <= 0 || submitting}
          onPress={handleSubmit}
          width="100%"
        >
          {submitting ? 'Wird verarbeitet…' : `${selectedAmount.toFixed(2)} € kassieren`}
        </Button>
      </YStack>
    </YStack>
  );
}
