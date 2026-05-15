import type { MenuItem } from '@libs/api-client';

export function toMenuItem(
  m: { id: string; name: string; price: string; type: string },
  unitPrice: string,
): MenuItem {
  return {
    id: m.id,
    name: m.name,
    price: unitPrice,
    type: m.type as MenuItem['type'],
    categoryId: '',
    description: null,
    available: true,
    sortOrder: 0,
    createdAt: '',
    updatedAt: '',
  };
}
