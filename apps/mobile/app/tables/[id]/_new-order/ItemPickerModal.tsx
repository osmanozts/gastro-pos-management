import { useMemo } from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text } from 'tamagui';
import { Badge } from '@libs/components';
import type { MenuCategory, MenuItem } from '@libs/api-client';
import type { ExtraItem } from './types';

interface Props {
  visible: boolean;
  pickerType: 'main' | 'extra';
  categories: MenuCategory[];
  selectedExtras: ExtraItem[];
  onSelect: (item: MenuItem) => void;
  onClose: () => void;
}

export function ItemPickerModal({
  visible,
  pickerType,
  categories,
  selectedExtras,
  onSelect,
  onClose,
}: Props) {
  const filtered = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          items: c.items.filter((i) => {
            if (!i.available) return false;
            if (pickerType === 'extra') return i.type !== 'MAIN';
            return true;
          }),
        }))
        .filter((c) => c.items.length > 0),
    [categories, pickerType],
  );

  const countById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of selectedExtras) {
      map[e.menuItem.id] = (map[e.menuItem.id] ?? 0) + 1;
    }
    return map;
  }, [selectedExtras]);

  const totalSelected = selectedExtras.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <YStack flex={1}>
          <XStack
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="$5" fontWeight="700" color="$textPrimary">
              {pickerType === 'main' ? 'Gericht auswählen' : 'Extra hinzufügen'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text fontSize="$4" color="$brandColor" fontWeight="600">
                {pickerType === 'extra' && totalSelected > 0
                  ? `Fertig (${totalSelected})`
                  : 'Abbrechen'}
              </Text>
            </TouchableOpacity>
          </XStack>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {filtered.map((cat) => (
              <YStack key={cat.id} marginBottom="$4">
                <Badge variant="brand" label={cat.name} />
                {cat.items.map((item) => {
                  const count = countById[item.id] ?? 0;
                  return (
                    <TouchableOpacity key={item.id} onPress={() => onSelect(item)}>
                      <XStack
                        paddingVertical="$3"
                        paddingHorizontal="$2"
                        borderBottomWidth={1}
                        borderBottomColor="$borderColor"
                        justifyContent="space-between"
                        alignItems="center"
                        backgroundColor={count > 0 ? '$brandSubtle' : 'transparent'}
                      >
                        <YStack flex={1} marginRight="$3">
                          <Text fontSize="$4" fontWeight="500" color="$textPrimary">
                            {item.name}
                          </Text>
                          {item.description ? (
                            <Text fontSize="$2" color="$textMuted" marginTop="$1">
                              {item.description}
                            </Text>
                          ) : null}
                        </YStack>
                        <XStack alignItems="center" gap="$2">
                          <Text fontSize="$4" fontWeight="700" color="$brandColor">
                            {parseFloat(item.price).toFixed(2)} €
                          </Text>
                          {count > 0 && (
                            <XStack
                              backgroundColor="$brandColor"
                              borderRadius="$10"
                              width={22}
                              height={22}
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontSize="$1" fontWeight="700" color="white">
                                {count}
                              </Text>
                            </XStack>
                          )}
                        </XStack>
                      </XStack>
                    </TouchableOpacity>
                  );
                })}
              </YStack>
            ))}
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </Modal>
  );
}
