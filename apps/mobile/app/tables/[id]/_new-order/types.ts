import type { MenuItem, OrderItemLineType } from '@libs/api-client';

export type ExtraItem = { menuItem: MenuItem; lineType: OrderItemLineType };
export type PersonEntry = { id: string; mainItem: MenuItem | null; extras: ExtraItem[] };
export type PickerConfig = { personId: string; type: 'main' | 'extra' };

let _counter = 0;
export const createPerson = (): PersonEntry => ({
  id: String(++_counter),
  mainItem: null,
  extras: [],
});
