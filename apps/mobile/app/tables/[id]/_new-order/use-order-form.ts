import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { menuApi, ordersApi } from '@libs/api-client';
import type { MenuCategory, MenuItem, OrderItemLineType } from '@libs/api-client';
import { createPerson, type ExtraItem, type PersonEntry, type PickerConfig } from './types';
import { toMenuItem } from './utils';

export function useOrderForm(tableId: string, orderId?: string) {
  const router = useRouter();
  const isEditing = !!orderId;

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [persons, setPersons] = useState<PersonEntry[]>([createPerson()]);
  const [picker, setPicker] = useState<PickerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [cats] = await Promise.all([
        menuApi.getCategories(),
        isEditing
          ? ordersApi.getById(orderId!).then((order) => {
              if (order.items.length > 0) {
                setPersons(
                  order.items.map((item) => ({
                    id: String(Date.now() + Math.random()),
                    mainItem: toMenuItem(item.menuItem, item.unitPrice),
                    extras: item.children.map((child) => ({
                      menuItem: toMenuItem(child.menuItem, child.unitPrice),
                      lineType: child.lineType,
                    })),
                  })),
                );
              }
            })
          : Promise.resolve(),
      ]);
      setCategories(cats);
      setLoading(false);
    };
    init();
  }, [isEditing, orderId]);

  const addPerson = useCallback(
    () => setPersons((prev) => [...prev, createPerson()]),
    [],
  );

  const removePerson = useCallback(
    (id: string) => setPersons((prev) => prev.filter((p) => p.id !== id)),
    [],
  );

  const handlePickerSelect = useCallback(
    (item: MenuItem) => {
      if (!picker) return;
      if (picker.type === 'main') {
        setPersons((prev) =>
          prev.map((p) => (p.id === picker.personId ? { ...p, mainItem: item } : p)),
        );
        setPicker(null);
      } else {
        setPersons((prev) =>
          prev.map((p) =>
            p.id === picker.personId
              ? {
                  ...p,
                  extras: [
                    ...p.extras,
                    { menuItem: item, lineType: item.type as OrderItemLineType },
                  ],
                }
              : p,
          ),
        );
      }
    },
    [picker],
  );

  const removeExtra = useCallback((personId: string, idx: number) => {
    setPersons((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, extras: p.extras.filter((_, i) => i !== idx) } : p,
      ),
    );
  }, []);

  const currentPersonExtras = useMemo((): ExtraItem[] => {
    if (!picker || picker.type !== 'extra') return [];
    return persons.find((p) => p.id === picker.personId)?.extras ?? [];
  }, [picker, persons]);

  const total = useMemo(
    () =>
      persons
        .reduce((sum, p) => {
          const main = p.mainItem ? parseFloat(p.mainItem.price) : 0;
          const extras = p.extras.reduce((s, e) => s + parseFloat(e.menuItem.price), 0);
          return sum + main + extras;
        }, 0)
        .toFixed(2),
    [persons],
  );

  const canSend = !submitting && persons.some((p) => p.mainItem !== null);

  const confirmCancel = useCallback(() => router.back(), [router]);

  const handleSubmit = useCallback(async () => {
    if (!canSend) return;
    setSubmitting(true);
    try {
      if (isEditing && orderId) {
        await ordersApi.delete(orderId);
      }

      const order = await ordersApi.create({ tableId });

      for (const person of persons) {
        if (!person.mainItem) continue;

        const afterMain = await ordersApi.addItems(order.id, [
          {
            menuItemId: person.mainItem.id,
            lineType: person.mainItem.type as OrderItemLineType,
            quantity: 1,
          },
        ]);

        const parentItem = afterMain.items[afterMain.items.length - 1];

        if (person.extras.length > 0) {
          await ordersApi.addItems(
            order.id,
            person.extras.map((e) => ({
              menuItemId: e.menuItem.id,
              lineType: e.lineType,
              quantity: 1,
              parentId: parentItem.id,
            })),
          );
        }
      }

      await ordersApi.sendToKitchen(order.id);
      router.back();
    } catch {
      Alert.alert(
        'Fehler',
        'Bestellung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
      );
      setSubmitting(false);
    }
  }, [canSend, isEditing, orderId, persons, tableId, router]);

  return {
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
  };
}
