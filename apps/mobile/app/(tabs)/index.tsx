import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import { Card, Badge, Heading2 } from '@libs/components';
import { tablesApi } from '@libs/api-client';
import type { Table, TableStatus } from '@libs/api-client';

function statusLabel(s: TableStatus) {
  if (s === 'FREE') return 'Frei';
  if (s === 'OCCUPIED') return 'Belegt';
  return 'Teilbez.';
}

function statusVariant(s: TableStatus): 'success' | 'danger' | 'warning' {
  if (s === 'FREE') return 'success';
  if (s === 'OCCUPIED') return 'danger';
  return 'warning';
}

function TableCard({ table, onPress }: { table: Table; onPress: () => void }) {
  return (
    <Card
      flex={1}
      margin="$2"
      pressStyle={{ opacity: 0.75 }}
      onPress={onPress}
      cursor="pointer"
    >
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
        <Text fontSize="$6" fontWeight="700" color="$textPrimary" flex={1} marginRight="$2">
          {table.name ?? `Tisch ${table.number}`}
        </Text>
        <Badge label={statusLabel(table.status)} variant={statusVariant(table.status)} />
      </XStack>
      <Text fontSize="$3" color="$textMuted">{table.capacity} Personen</Text>
    </Card>
  );
}

export default function TischübersichtScreen() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await tablesApi.getAll();
    setTables(data);
  }, []);

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

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingHorizontal="$4" paddingTop="$8" paddingBottom="$2">
        <Heading2>Tischübersicht</Heading2>
      </YStack>

      {loading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator color="#88172C" />
        </YStack>
      ) : (
        <FlatList
          data={tables}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          renderItem={({ item }) => (
            <TableCard
              table={item}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onPress={() => router.push({ pathname: '/tables/[id]' as any, params: { id: item.id } })}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#88172C" />
          }
          ListEmptyComponent={
            <YStack padding="$6" alignItems="center">
              <Text color="$textMuted">Keine Tische gefunden</Text>
            </YStack>
          }
        />
      )}
    </YStack>
  );
}
