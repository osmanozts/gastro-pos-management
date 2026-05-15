import { get, patch } from './client';
import type { KitchenOrder } from './types';

export const kitchenApi = {
  getActiveOrders: () =>
    get<KitchenOrder[]>('/kitchen/orders'),

  markItemReady: (orderId: string, itemId: string) =>
    patch<KitchenOrder>(`/kitchen/orders/${orderId}/items/${itemId}/ready`, {}),
};
