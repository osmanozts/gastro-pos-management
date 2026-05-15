import { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import { Button, ConfirmDialog } from '@libs/components';
import { useOrderForm } from './_new-order/use-order-form';
import { ItemPickerModal } from './_new-order/ItemPickerModal';
import { OrderItemCard } from './_new-order/OrderItemCard';

export default function NeueBestellungScreen() {
  const { id: tableId, orderId } = useLocalSearchParams<{ id: string; orderId?: string }>();

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    categories,
    persons,
    picker,
    loading,
    submitting,
    isEditing,
    canSend,
    total,
    currentPersonExtras,
    setPicker,
    addPerson,
    removePerson,
    removeExtra,
    handlePickerSelect,
    confirmCancel,
    handleSubmit,
  } = useOrderForm(tableId, orderId);

  const title = isEditing ? 'Bestellung bearbeiten' : 'Neue Bestellung';

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

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        {persons.map((person, index) => (
          <OrderItemCard
            key={person.id}
            person={person}
            index={index}
            canRemove={persons.length > 1}
            onRemove={() => removePerson(person.id)}
            onSelectMain={() => setPicker({ personId: person.id, type: 'main' })}
            onAddExtra={() => setPicker({ personId: person.id, type: 'extra' })}
            onRemoveExtra={(idx) => removeExtra(person.id, idx)}
          />
        ))}

        <TouchableOpacity onPress={addPerson}>
          <XStack
            borderWidth={1}
            borderColor="$borderColor"
            borderStyle="dashed"
            borderRadius="$4"
            padding="$4"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="$4" color="$textMuted">+ Position hinzufügen</Text>
          </XStack>
        </TouchableOpacity>
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
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <Text fontSize="$3" color="$textMuted">
            {persons.filter((p) => p.mainItem).length} von {persons.length} Personen
          </Text>
          <Text fontSize="$5" fontWeight="700" color="$textPrimary">{total} €</Text>
        </XStack>
        <XStack gap="$3">
          <Button intent="ghost" onPress={() => setShowCancelDialog(true)} width="30%">
            Abbrechen
          </Button>
          <Button intent="primary" disabled={!canSend} onPress={handleSubmit} width="70%">
            {submitting
              ? isEditing ? 'Wird gespeichert…' : 'Wird gesendet…'
              : isEditing ? 'Speichern & senden' : 'An Küche senden'}
          </Button>
        </XStack>
      </YStack>

      <ItemPickerModal
        visible={!!picker}
        pickerType={picker?.type ?? 'main'}
        categories={categories}
        selectedExtras={currentPersonExtras}
        onSelect={handlePickerSelect}
        onClose={() => setPicker(null)}
      />

      <ConfirmDialog
        open={showCancelDialog}
        title="Bestellung abbrechen"
        message={
          isEditing
            ? 'Möchten Sie die Bearbeitung abbrechen? Alle Änderungen gehen verloren.'
            : 'Möchten Sie die Bestellungsaufnahme abbrechen? Alle Eingaben gehen verloren.'
        }
        confirmLabel="Ja, abbrechen"
        cancelLabel="Weiter bearbeiten"
        confirmIntent="danger"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelDialog(false)}
      />
    </YStack>
  );
}
