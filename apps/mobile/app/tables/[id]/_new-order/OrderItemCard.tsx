import { TouchableOpacity } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Card } from '@libs/components';
import type { PersonEntry } from './types';

interface Props {
  person: PersonEntry;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onSelectMain: () => void;
  onAddExtra: () => void;
  onRemoveExtra: (idx: number) => void;
}

export function OrderItemCard({
  person,
  index,
  canRemove,
  onRemove,
  onSelectMain,
  onAddExtra,
  onRemoveExtra,
}: Props) {
  return (
    <Card marginBottom="$3" padding="$4">
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
        <Text fontSize="$4" fontWeight="700" color="$textPrimary">
          Position {index + 1}
        </Text>
        {canRemove && (
          <TouchableOpacity onPress={onRemove}>
            <Text fontSize="$3" color="$textMuted">Entfernen</Text>
          </TouchableOpacity>
        )}
      </XStack>

      {person.mainItem ? (
        <XStack
          backgroundColor="$brandSubtle"
          borderRadius="$3"
          padding="$3"
          marginBottom="$2"
          justifyContent="space-between"
          alignItems="center"
        >
          <YStack flex={1}>
            <Text fontSize="$3" fontWeight="600" color="$brandColor">
              {person.mainItem.name}
            </Text>
          </YStack>
          <XStack alignItems="center" gap="$3">
            <Text fontSize="$3" fontWeight="700" color="$brandColor">
              {parseFloat(person.mainItem.price).toFixed(2)} €
            </Text>
            <TouchableOpacity onPress={onSelectMain}>
              <Text fontSize="$3" color="$textMuted">Ändern</Text>
            </TouchableOpacity>
          </XStack>
        </XStack>
      ) : (
        <TouchableOpacity onPress={onSelectMain}>
          <XStack
            borderWidth={1}
            borderColor="$brandColor"
            borderStyle="dashed"
            borderRadius="$3"
            padding="$3"
            justifyContent="center"
            alignItems="center"
            marginBottom="$2"
          >
            <Text fontSize="$3" color="$brandColor" fontWeight="600">
              + Gericht auswählen
            </Text>
          </XStack>
        </TouchableOpacity>
      )}

      {person.extras.map((extra, idx) => (
        <XStack
          key={idx}
          paddingVertical="$2"
          paddingLeft="$4"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Text fontSize="$3" color="$textPrimary" flex={1}>
            {extra.menuItem.name}
          </Text>
          <XStack alignItems="center" gap="$3">
            <Text fontSize="$3" color="$textMuted">
              {parseFloat(extra.menuItem.price).toFixed(2)} €
            </Text>
            <TouchableOpacity onPress={() => onRemoveExtra(idx)}>
              <Text fontSize="$3" color="$red9">×</Text>
            </TouchableOpacity>
          </XStack>
        </XStack>
      ))}

      {person.mainItem && (
        <TouchableOpacity onPress={onAddExtra}>
          <XStack paddingTop="$2" alignItems="center">
            <Text fontSize="$3" color="$textMuted">+ Getränk / Addon hinzufügen</Text>
          </XStack>
        </TouchableOpacity>
      )}
    </Card>
  );
}
